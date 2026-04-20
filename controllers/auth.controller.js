const authService = require("../services/mongo/auth.service");
const jwtUtils = require('../utils/jwt.utils');

const authController = {

    register: async (req, res) => {
        try {
            const userToAdd = req.body;

            if (await authService.emailAlreadyExists(userToAdd.email)) {
                return res.status(409).json({ statusCode: 409, message: 'Cet email est déjà utilisé' });
            }

            // Le service gère lui-même la logique du code admin
            // userToAdd.adminCode est transmis tel quel au service
            const userCreated = await authService.create(userToAdd);

            res.location(`/api/user/${userCreated._id}`);
            res.status(201).json({
                id: userCreated._id,
                firstname: userCreated.firstname,
                lastname: userCreated.lastname,
                role: userCreated.role   // on retourne le rôle pour que le front sache
            });
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    },

    login: async (req, res) => {
        try {
            const credentials = req.body;
            const userFound = await authService.findByCredentials(credentials);

            if (!userFound) {
                return res.status(401).json({ statusCode: 401, message: 'Les informations de connexion ne sont pas bonnes' });
            }

            const token = await jwtUtils.generate(userFound);
            res.status(200).json({
                id: userFound._id,
                firstname: userFound.firstname,
                lastname: userFound.lastname,
                token
            });
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
};

module.exports = authController;