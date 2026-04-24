const taskController = require('../controllers/task.controller');
const authenticationMiddleware = require('../middlewares/auth/authentication.middleware');

const taskRouter = require('express').Router();

// ── Routes personnelles (chaque user gère SES tâches) ────────────────────────

// Toutes les tâches de l'utilisateur connecté
taskRouter.route('/')
    .get(authenticationMiddleware(), taskController.getMyTasks)
    .post(authenticationMiddleware(), taskController.insert)

// Une tâche par id (vérification ownership dans le controller)
taskRouter.route('/:id')
    .get(authenticationMiddleware(), taskController.getById)
    .patch(authenticationMiddleware(), taskController.updateStatus)
    .delete(authenticationMiddleware(), taskController.delete)
    .put(authenticationMiddleware(), taskController.update)

module.exports = taskRouter;