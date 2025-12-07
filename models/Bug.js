const mongoose = require('mongoose');
const { Schema } = mongoose;

const bugSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    severity: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        required: true
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        required: true
    },
    commitUrl: String,
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    reportedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Resolved'],
        default: 'Open'
    },
    resolveCommitUrl: String
}, { timestamps: true });

module.exports = mongoose.model('Bug', bugSchema);