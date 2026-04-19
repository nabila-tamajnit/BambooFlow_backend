const Task = require('../../models/task.model');

const taskOwnerOrAdminMiddleware = () => {
    return async (req, res, next) => {
        const userId = req.user.id;
        const role = req.user.role;

        if (role === 'Admin') return next();

        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Tâche introuvable' });

        if (task.toUserId.toString() !== userId) {
            return res.status(403).json({ message: 'Action non autorisée' });
        }
        next();
    };
};
module.exports = taskOwnerOrAdminMiddleware;
