// controllers/category.controller.js
const categoryService = require("../services/mongo/category.service");

const categoryController = {

    // GET /api/categories — catégories de l'user connecté
    getAll: async (req, res) => {
        try {
            const categories = await categoryService.findByUser(req.user.id);
            res.status(200).json(categories);
        } catch (err) {
            console.error(err);
            res.status(500).json({ statusCode: 500, message: 'Erreur serveur' });
        }
    },

    // POST /api/categories
    insert: async (req, res) => {
        try {
            const { name, icon, color } = req.body;
            if (!name?.trim()) {
                return res.status(400).json({ statusCode: 400, message: 'Le nom est obligatoire.' });
            }

            const exists = await categoryService.nameExistsForUser(name.trim(), req.user.id);
            if (exists) {
                return res.status(409).json({ statusCode: 409, message: 'Tu as déjà une catégorie avec ce nom.' });
            }

            const created = await categoryService.create(
                { name: name.trim(), icon: icon || '📋', color: color || 'green' },
                req.user.id
            );
            res.status(201).json(created);
        } catch (err) {
            console.error(err);
            res.status(500).json({ statusCode: 500, message: 'Erreur serveur' });
        }
    },

    // PUT /api/categories/:id
    update: async (req, res) => {
        try {
            const category = await categoryService.findById(req.params.id);
            if (!category) {
                return res.status(404).json({ statusCode: 404, message: 'Catégorie introuvable.' });
            }
            if (category.isSystem) {
                return res.status(403).json({ statusCode: 403, message: 'Impossible de modifier une catégorie système.' });
            }
            if (category.userId.toString() !== req.user.id) {
                return res.status(403).json({ statusCode: 403, message: 'Accès refusé.' });
            }

            const { name, icon, color } = req.body;
            const updated = await categoryService.update(req.params.id, {
                name: name?.trim(),
                icon,
                color
            });
            res.status(200).json(updated);
        } catch (err) {
            console.error(err);
            res.status(500).json({ statusCode: 500, message: 'Erreur serveur' });
        }
    },

    // DELETE /api/categories/:id
    delete: async (req, res) => {
        try {
            const category = await categoryService.findById(req.params.id);
            if (!category) {
                return res.status(404).json({ statusCode: 404, message: 'Catégorie introuvable.' });
            }
            if (category.isSystem) {
                return res.status(403).json({ statusCode: 403, message: 'Impossible de supprimer une catégorie système.' });
            }
            if (category.userId.toString() !== req.user.id) {
                return res.status(403).json({ statusCode: 403, message: 'Accès refusé.' });
            }

            await categoryService.delete(req.params.id);
            res.sendStatus(204);
        } catch (err) {
            console.error(err);
            res.status(500).json({ statusCode: 500, message: 'Erreur serveur' });
        }
    },
};

module.exports = categoryController;