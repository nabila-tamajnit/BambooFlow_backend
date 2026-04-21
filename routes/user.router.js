const userController = require('../controllers/user.controller');
const authenticationMiddleware = require('../middlewares/auth/authentication.middleware');
const userAuthorizationMiddleware = require('../middlewares/auth/userAuthorization.middleware');

const userRouter = require('express').Router();

userRouter.route('/')
    .get(authenticationMiddleware(), userController.getAll);

// Suppression de compte — authentification obligatoire
userRouter.route('/:id')
    .delete(authenticationMiddleware(), userAuthorizationMiddleware(), userController.deleteAccount);

module.exports = userRouter;