const { Schema, model, Types } = require('mongoose');
const Category = require('./category.model');
const User = require('./user.model');

// models/task.model.js
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
            default: ""
            // Pas required, c'est optionnel
        },
        isDone: {
            type: Boolean,
            required: true,
            default: false
        },
        before: {
            type: String
        },
        categoryId: {
            type: Types.ObjectId,
            ref: Category,
            required: true
        },
        fromUserId: {
            type: Types.ObjectId,
            ref: User,
            required: true
        },
        toUserId: {
            type: Types.ObjectId,
            ref: User,
            required: true,
        }
    },
    {
        collection: 'Task',
        timestamps: true
    }
);

const Task = model('Task', taskSchema);

module.exports = Task;