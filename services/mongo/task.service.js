const Task = require('../../models/task.model');

const taskService = {

    /**
     * Récupère toutes les tâches d'un utilisateur.
     */
    findByUser: async (userId) => {
        try {
            const tasks = await Task.find({ userId })
                .populate({ path: 'categoryId', select: 'id name priority icon color' })
                .sort({ createdAt: -1 });
            return tasks;
        } catch (err) {
            console.error(err);
            throw new Error(err);
        }
    },

    findById: async (id) => {
        try {
            const task = await Task.findById(id)
                .populate({ path: 'categoryId', select: 'id name priority icon color' });
            return task;
        } catch (err) {
            throw new Error(err);
        }
    },

    create: async (task) => {
        try {
            const taskToAdd = new Task(task);
            await taskToAdd.save();
            return taskToAdd;
        } catch (err) {
            throw new Error(err);
        }
    },

    update: async (id, data) => {
        try {
            const updated = await Task.findByIdAndUpdate(id, data, { new: true });
            return updated;
        } catch (err) {
            throw new Error(err);
        }
    },

    delete: async (id) => {
        try {
            const deleted = await Task.findByIdAndDelete(id);
            return !!deleted;
        } catch (err) {
            throw new Error(err);
        }
    },
};

module.exports = taskService;