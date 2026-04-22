const userService = require("../services/mongo/user.service");
const authService = require("../services/mongo/auth.service");

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
            const query = req.query;
            const users = await userService.find(query);
            res.status(200).json(users);
        } catch (err) {
            console.log(err);
            res.status(500).json({ statusCode: 500, message: 'Une erreur est survenue dans la db' });
        }
    },

    /**
     * Suppression de compte.
     * Un user ne peut supprimer que son propre compte.
     * Un admin peut supprimer n'importe quel compte.
     */
    deleteAccount: async (req, res) => {
        try {
            const targetId = req.params.id;
           
            const deleted = await authService.deleteById(targetId);
            if (!deleted) {
                return res.status(404).json({ statusCode: 404, message: 'Utilisateur introuvable.' });
            }

            res.sendStatus(204);
        } catch (err) {
            console.log(err);
            res.status(500).json({ statusCode: 500, message: 'Erreur lors de la suppression.' });
        }
    }
};

module.exports = userController;