const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    repoUrl:{
        type: String,
        required: true
    },
    description: String,
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    testers: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }]
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);