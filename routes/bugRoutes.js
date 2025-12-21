const express = require('express');
const Bug = require('../models/Bug');
const Project = require('../models/Project');
const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(auth);
router.use(requireRole('TST'));

// POST /api/bugs - inregistrare bug nou
router.post('/', async (req, res) => {
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
