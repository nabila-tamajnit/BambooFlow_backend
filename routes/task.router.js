const taskController = require('../controllers/task.controller');
const bodyValidatorMiddleware = require('../middlewares/bodyValidator.middleware');
const taskOwnerOrAdminMiddleware = require('../middlewares/auth/taskOwnerOrAdmin.middleware');
const authenticationMiddleware = require('../middlewares/auth/authentication.middleware');
const userAuthorizationMiddleware = require('../middlewares/auth/userAuthorization.middleware');

const taskRouter = require('express').Router();

// ── Routes générales ─────────────────────────────────────────────────────────
taskRouter.route('/')
    .get(taskController.getAll)
    .post(authenticationMiddleware(), bodyValidatorMiddleware(), taskController.insert)

taskRouter.route('/:id')
    .get(taskController.getById)
    .put(authenticationMiddleware(), taskOwnerOrAdminMiddleware(), taskController.update)
    .delete(authenticationMiddleware(), taskOwnerOrAdminMiddleware(), taskController.delete)
    .patch(authenticationMiddleware(), taskOwnerOrAdminMiddleware(), taskController.updateStatus)

// ── Tâches de l'utilisateur connecté (protégé : uniquement ses propres tâches)
// userAuthorizationMiddleware vérifie que req.user.id === req.params.id
taskRouter.get(
    '/user/:id',
    authenticationMiddleware(),
    userAuthorizationMiddleware(),
    taskController.getByUser
)

// ── Tâches publiques d'un membre (accessible à tout utilisateur connecté)
// Retourne uniquement les tâches "to do" du membre — sans données sensibles
// Utilisé pour afficher les tâches des autres membres en lecture seule
taskRouter.get(
    '/user/:id/tasks',
    authenticationMiddleware(),
    taskController.getPublicUserTasks
)

module.exports = taskRouter;