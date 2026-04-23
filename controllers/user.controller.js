const userService = require("../services/mongo/user.service");
const authService = require("../services/mongo/auth.service");
const User = require("../models/user.model"); // ← MANQUAIT

const userController = {

    getMe: async (req, res) => {
        try {
            const user = await User.findById(req.user.id)
                .select('_id firstname lastname email role createdAt');
            if (!user) {
                return res.status(404).json({ statusCode: 404, message: 'Utilisateur introuvable.' });
            }
            res.status(200).json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json({ statusCode: 500, message: 'Erreur serveur.' });
        }
    },

    getAll: async (req, res) => {
        try {
            const users = await userService.find(req.query);
            res.status(200).json(users);
        } catch (err) {
            console.error(err);
            res.status(500).json({ statusCode: 500, message: 'Erreur serveur' });
        }
    },

    deleteAccount: async (req, res) => {
        try {
            const deleted = await authService.deleteById(req.params.id);
            if (!deleted) {
                return res.status(404).json({ statusCode: 404, message: 'Utilisateur introuvable.' });
            }
            res.sendStatus(204);
        } catch (err) {
            console.error(err);
            res.status(500).json({ statusCode: 500, message: 'Erreur lors de la suppression.' });
        }
    }
};

module.exports = userController;