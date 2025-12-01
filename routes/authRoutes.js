const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

//POST/ api/auth/registrer

router.post('/register', async (req, res) => {
    try{
        const { name, email, password, role } = req.body;

        if(!name || !email || !password || !role){
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existing = await User.findOne({ email });
        if (existing){
            return res.status(400).json({ message: 'User already exists' });    
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            name, email, passwordHash, role
        });

        const token = jwt.sign(
            {userID: user._id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN  || '7d'}
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    }
    catch(err){
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


//POST/ api/auth/login

router.post('/login', async (req, res) => {
    try{
        const { email, password } = req.body;

        const user = await User.findOne({ email});
        if(!User){
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const match = await bcrypt.compare(password, user.passwordHash);
        if(!match){
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userID: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.json({
            token,
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    }
    catch(err){
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;