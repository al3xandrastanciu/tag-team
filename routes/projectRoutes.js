const express = require('express');
const Project = require('../models/Project');
const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(auth);
router.use(requireRole('MP'));

//POST- creare proiect
router.post('/', async ( req, res)=>{
    try{
        const {name, repoUrl, description, members} = req.body;

        const membersArray = members && members.length ? members : [req.user.id];

        const project = await Project.create({
            name,
            repoUrl,
            description,
            members: membersArray
        });

        res.status(201).json(project);
    }
    catch(err){
        console.error('Error creating project:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET- proiecte in care userul e MP
router.get('/', async (req, res) => {
    try{
        const projects = await Project.find({
            members: req.user.id
        }).populate('members', 'name email role');

        res.json(projects);
    }
    catch(err){
        console.error('Error fetching projects:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


//GET
router.get('/:id', async (req, res) => {
    try{
        const project = await Project.findById(req.params.id).populate('members', 'name email role');
        if(!project){
            return res.status(404).json({ message: 'Project not found' });
        }
        if(!project.members.some(m => m._id.equals(req.user.id))){
            return res.status(403).json({ message: 'Access denied' });
        }
        res.json(project);
    }catch(err){
        console.error('Error fetching project:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


//PUT- update nume, repo, descriere
router.put('/:id', async (req, res) => {
    try{
        const { name, repoUrl, description, members } = req.body;

        let project = await Project.findById(req.params.id);
        if(!project){
            return res.status(404).json({ message: 'Project not found' });
        }
        if(!project.members.some(m => m.equals(req.user.id))){
            return res.status(403).json({ message: 'Access denied' });
        }

        if(name !== undefined) project.name = name;
        if(repoUrl !== undefined) project.repoUrl = repoUrl;
        if(description !== undefined) project.description = description;
        if(members !== undefined) project.members = members;

        await project.save();
        res.json(project);
    }
    catch(err){
        console.error('Error updating project:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


//DELETE -stergere proiect
router.delete('/:id', async (req, res) => {
    try{
        const project = await Project.findById(req.params.id);

        if(!project){
            return res.status(404).json({ message: 'Project not found' });
        }

        if(!project.members.some(m => m.equals(req.user.id))){
            return res.status(403).json({ message: 'Access denied' });
        }

        await project.deleteOne();
        res.json({ message: 'Project deleted' });
    }
    catch(err){
        console.error('Error deleting project:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;