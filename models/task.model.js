const { Schema, model, Types } = require('mongoose');
const Category = require('./category.model');
const User = require('./user.model');

const taskSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true,
            default: ''
        },
        isDone: {
            type: Boolean,
            required: true,
            default: false
        },
        before: {
            type: String
        },
        priority: {
            type: String,
            enum: ['high', 'medium', 'low'],
            default: 'medium'
        },
        categoryId: {
            type: Types.ObjectId,
            ref: 'Category',
            required: false // optionnel maintenant
        },
        // Owner de la tâche — remplace fromUserId + toUserId
        userId: {
            type: Types.ObjectId,
            ref: 'User',
            required: true
        },
    },
    {
        collection: 'Task',
        timestamps: true
    }
);

const Task = model('Task', taskSchema);
module.exports = Task;