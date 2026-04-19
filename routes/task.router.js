const taskController = require('../controllers/task.controller');
const bodyValidatorMiddleware = require('../middlewares/bodyValidator.middleware');
const idValidatorMiddleware = require('../middlewares/idValidator.middleware');
const nameValidatorMiddleware = require('../middlewares/nameValidator.middleware');
const taskOwnerOrAdminMiddleware = require('../middlewares/auth/taskOwnerOrAdmin.middleware');

// Middlewares pour le token
const authenticationMiddleware = require('../middlewares/auth/authentication.middleware');
const userAuthorizationMiddleware = require('../middlewares/auth/userAuthorization.middleware');



const taskRouter = require('express').Router();

taskRouter.route('/')
    .get(taskController.getAll)
    .post(authenticationMiddleware(), bodyValidatorMiddleware(), taskController.insert)

taskRouter.route('/:id')
    .get(taskController.getById)
    .put(authenticationMiddleware(), taskOwnerOrAdminMiddleware(), taskController.update)
    .delete(authenticationMiddleware(), taskOwnerOrAdminMiddleware(), taskController.delete)
    .patch(authenticationMiddleware(), taskOwnerOrAdminMiddleware(), taskController.updateStatus)

taskRouter.get(
    '/user/:id',
    authenticationMiddleware(),
    userAuthorizationMiddleware(),
    taskController.getByUser)

//taskRouter.route('/user/:id')
//.get(authenticationMiddleware(),    userAuthorizationMiddleware(),   taskController.getByUser)



module.exports = taskRouter;