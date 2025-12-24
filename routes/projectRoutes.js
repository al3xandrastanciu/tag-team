const express = require('express');
const Project = require('../models/Project');
const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// GET - toate proiectele pentru TST (proiecte in care e tester) sau MP (proiecte in care e member)
// Aceasta ruta e accesibila pentru ambele roluri
router.get('/', async (req, res) => {
    try {
        let query = {};

        if (req.user.role === 'MP') {
            // MP vede proiectele in care e membru
            query = { members: req.user.id };
        } else if (req.user.role === 'TST') {
            // TST vede proiectele in care e tester
            query = { testers: req.user.id };
        }

        const projects = await Project.find(query)
            .populate('members', 'name email role')
            .populate('testers', 'name email role');

        res.json(projects);
    }
    catch (err) {
        console.error('Error fetching projects:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET - toate proiectele disponibile (pentru TST sa poata alege la raportare bug)
router.get('/available', async (req, res) => {
    try {
        // Returneaza toate proiectele pentru selectie
        const projects = await Project.find()
            .select('name repoUrl description')
            .limit(100);

        res.json(projects);
    }
    catch (err) {
        console.error('Error fetching available projects:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/joinable', requireRole('TST'), async (req, res) => {
    try {
        const userId = req.user.id;
        const projects = await Project.find({ testers: { $ne: userId } })
            .populate('members', 'name')
            .populate('testers', 'name')
            .select('name repoUrl description members testers');

        res.json(projects);
    }
    catch (err) {
        console.error('Error fetching joinable projects:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.patch('/:id/join', requireRole('TST'), async (req, res) => {
    try {
        const projectId = req.params.id;
        const userId = req.user.id;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const isAlreadyTester = project.testers.some(t => t.equals(userId));
        if (isAlreadyTester) {
            return res.status(400).json({ message: 'Ești deja tester în acest proiect' });
        }

        project.testers.push(userId);
        await project.save();

        await project.populate('members', 'name email role');
        await project.populate('testers', 'name email role');

        res.json({ message: 'Te-ai alăturat proiectului ca tester', project });
    }
    catch (err) {
        console.error('Error joining project:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Rutele urmatoare sunt doar pentru MP
//POST- creare proiect
router.post('/', requireRole('MP'), async (req, res) => {
    try {
        const { name, repoUrl, description, members, testers } = req.body;

        const membersArray = members && members.length ? members : [req.user.id];
        const testersArray = testers || [];

        const project = await Project.create({
            name,
            repoUrl,
            description,
            members: membersArray,
            testers: testersArray
        });

        res.status(201).json(project);
    }
    catch (err) {
        console.error('Error creating project:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

//GET by ID
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('members', 'name email role')
            .populate('testers', 'name email role');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is member or tester
        const isMember = project.members.some(m => m._id.equals(req.user.id));
        const isTester = project.testers.some(t => t._id.equals(req.user.id));

        if (!isMember && !isTester) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(project);
    } catch (err) {
        console.error('Error fetching project:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


//PUT- update nume, repo, descriere (doar MP)
router.put('/:id', requireRole('MP'), async (req, res) => {
    try {
        const { name, repoUrl, description, members, testers } = req.body;

        let project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (!project.members.some(m => m.equals(req.user.id))) {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (name !== undefined) project.name = name;
        if (repoUrl !== undefined) project.repoUrl = repoUrl;
        if (description !== undefined) project.description = description;
        if (members !== undefined) project.members = members;
        if (testers !== undefined) project.testers = testers;

        await project.save();
        res.json(project);
    }
    catch (err) {
        console.error('Error updating project:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


//DELETE -stergere proiect (doar MP)
router.delete('/:id', requireRole('MP'), async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (!project.members.some(m => m.equals(req.user.id))) {
            return res.status(403).json({ message: 'Access denied' });
        }

        await project.deleteOne();
        res.json({ message: 'Project deleted' });
    }
    catch (err) {
        console.error('Error deleting project:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;