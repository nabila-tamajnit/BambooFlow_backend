const taskRouter = require('./task.router');
const categoryRouter = require('./category.router');
const authRouter = require('./auth.router');
const userRouter = require('./user.router');


// ! 1) Créer un objet "routeur" (router)
const router = require('express').Router();

// ! 2) Configurer les routes
router.get('/', (req, res) => {
    res.send("Bienvenue sur notre API de gestion de tâches", 200)
});

router.use('/tasks', taskRouter);

router.use('/categories', categoryRouter);

router.use('/auth', authRouter);

router.use('/users', userRouter);

// ! 3) Rendre exportable notre objet router
module.exports = router;