// routes/category.router.js
const categoryController = require("../controllers/category.controller");
const authenticationMiddleware = require('../middlewares/auth/authentication.middleware');

const categoryRouter = require("express").Router();

categoryRouter.route('/')
    .get(authenticationMiddleware(), categoryController.getAll)
    .post(authenticationMiddleware(), categoryController.insert);

categoryRouter.route('/:id')
    .put(authenticationMiddleware(), categoryController.update)
    .delete(authenticationMiddleware(), categoryController.delete);

module.exports = categoryRouter;