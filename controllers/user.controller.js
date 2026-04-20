const userService = require("../services/mongo/user.service");
const authService = require("../services/mongo/auth.service");

const userController = {

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
            const requesterId = req.user.id;
            const requesterRole = req.user.role;

            // Vérification : seul le propriétaire ou un admin peut supprimer
            if (requesterRole !== 'Admin' && targetId !== requesterId) {
                return res.status(403).json({
                    statusCode: 403,
                    message: 'Vous ne pouvez supprimer que votre propre compte.'
                });
            }

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