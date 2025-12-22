const express = require('express');
const Bug = require('../models/Bug');
const Project = require('../models/Project');
const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(auth);

// GET /api/bugs - returnare bug-uri pentru utilizatorul autentificat
router.get('/', async (req, res) => {
    try {
        const { projectId } = req.query;
        const userId = req.user.id;
        const userRole = req.user.role;

        let query = {};

        if (userRole === 'TST') {
            // TST vede bug-urile raportate de el
            query.reportedBy = userId;
        } else if (userRole === 'MP') {
            // MP vede bug-urile din proiectele sale
            const userProjects = await Project.find({
                $or: [
                    { members: userId },
                    { testers: userId }
                ]
            }).select('_id');

            const projectIds = userProjects.map(p => p._id);
            query.project = { $in: projectIds };
        }

        // filtrare optionala dupa proiect
        if (projectId) {
            query.project = projectId;
        }

        const bugs = await Bug.find(query)
            .populate('reportedBy', 'name email role')
            .populate('assignedTo', 'name email role')
            .populate('project', 'name repoUrl')
            .sort({ createdAt: -1 });

        res.json(bugs);
    } catch (err) {
        console.error('Error fetching bugs:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/bugs/project/:projectId - returnare bug-uri pentru un proiect specific
router.get('/project/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user.id;

        // verificare existenta proiect
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // verificare daca utilizatorul face parte din proiect
        const isMember = project.members.some(memberId => memberId.toString() === userId);
        const isTester = project.testers.some(testerId => testerId.toString() === userId);

        if (!isMember && !isTester) {
            return res.status(403).json({ message: 'Access denied: You are not a member of this project' });
        }

        const bugs = await Bug.find({ project: projectId })
            .populate('reportedBy', 'name email role')
            .populate('assignedTo', 'name email role')
            .populate('project', 'name repoUrl')
            .sort({ createdAt: -1 });

        res.json(bugs);
    } catch (err) {
        console.error('Error fetching project bugs:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/bugs/user/:userId - returnare bug-uri pentru un utilizator specific
router.get('/user/:userId', requireRole('MP'), async (req, res) => {
    try {
        const { userId } = req.params;
        const { projectId } = req.query;
        const requesterId = req.user.id;

        let query = {
            $or: [
                { reportedBy: userId },
                { assignedTo: userId }
            ]
        };

        // filtrare optionala dupa proiect
        if (projectId) {
            query.project = projectId;

            // verificare ca MP-ul face parte din proiect
            const project = await Project.findById(projectId);
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            const isMember = project.members.some(memberId => memberId.toString() === requesterId);
            if (!isMember) {
                return res.status(403).json({ message: 'Access denied: You are not a member of this project' });
            }
        }

        const bugs = await Bug.find(query)
            .populate('reportedBy', 'name email role')
            .populate('assignedTo', 'name email role')
            .populate('project', 'name repoUrl')
            .sort({ createdAt: -1 });

        res.json(bugs);
    } catch (err) {
        console.error('Error fetching user bugs:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/bugs - inregistrare bug nou
router.post('/', requireRole('TST'), async (req, res) => {
    try {
        const { title, description, severity, priority, commitUrl, project } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }
        if (!severity) {
            return res.status(400).json({ message: 'Severity is required' });
        }
        if (!priority) {
            return res.status(400).json({ message: 'Priority is required' });
        }
        if (!project) {
            return res.status(400).json({ message: 'Project is required' });
        }

        // validare enum pentru severity
        const validSeverities = ['Low', 'Medium', 'High', 'Critical'];
        if (!validSeverities.includes(severity)) {
            return res.status(400).json({
                message: `Invalid severity. Must be one of: ${validSeverities.join(', ')}`
            });
        }

        // validare enum pentru priority
        const validPriorities = ['Low', 'Medium', 'High'];
        if (!validPriorities.includes(priority)) {
            return res.status(400).json({
                message: `Invalid priority. Must be one of: ${validPriorities.join(', ')}`
            });
        }

        // verificare existenta proiect
        const projectExists = await Project.findById(project);
        if (!projectExists) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // creare bug cu reportedBy setat automat din user autentificat
        const bug = await Bug.create({
            title,
            description,
            severity,
            priority,
            commitUrl,
            project,
            reportedBy: req.user.id
        });

        await bug.populate('reportedBy', 'name email role');
        await bug.populate('project', 'name repoUrl');

        res.status(201).json(bug);
    }
    catch (err) {
        console.error('Error creating bug:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
