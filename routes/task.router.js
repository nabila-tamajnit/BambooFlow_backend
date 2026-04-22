// routes/task.router.js
const taskController = require('../controllers/task.controller');
const authenticationMiddleware = require('../middlewares/auth/authentication.middleware');
// const taskOwnerOrAdminMiddleware = require('../middlewares/auth/taskOwnerOrAdmin.middleware'); // ADMIN — conservé pour future évolution équipe
// const roleAuthorizationMiddleware = require('../middlewares/auth/roleAuthorization.middleware'); // ADMIN — idem

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

// ── Routes ADMIN désactivées — conservées pour future évolution (gestion d'équipe) ──
// taskRouter.get('/', authenticationMiddleware(), roleAuthorizationMiddleware(['Admin']), taskController.getAll)
// taskRouter.get('/user/:id', authenticationMiddleware(), userAuthorizationMiddleware(), taskController.getByUser)
// taskRouter.get('/user/:id/tasks', authenticationMiddleware(), taskController.getPublicUserTasks)

module.exports = taskRouter;