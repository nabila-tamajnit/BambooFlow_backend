const { Request, Response } = require('express')
const taskService = require('../services/mongo/task.service');

const taskController = {

    /**
     * Récupère TOUTES les tâches de l'utilisateur connecté.
     * Remplace la logique user/admin — seul l'owner voit ses tâches.
     */
    getMyTasks: async (req, res) => {
        try {
            const userId = req.user.id;
            const tasks = await taskService.findByUser(userId);
            res.status(200).json({ count: tasks.length, tasks });
        } catch (err) {
            console.error(err);
            res.status(500).json({ statusCode: 500, message: 'Erreur lors de la récupération des tâches' });
        }
    },

    /**
     * Récupère une tâche par id — vérifie que c'est bien la tâche de l'utilisateur.
     */
    getById: async (req, res) => {
        try {
            const task = await taskService.findById(req.params.id);
            if (!task) {
                return res.status(404).json({ statusCode: 404, message: 'Tâche non trouvée' });
            }
            // Vérification ownership
            if (task.userId.toString() !== req.user.id) {
                return res.status(403).json({ statusCode: 403, message: 'Accès refusé' });
            }
            res.status(200).json(task);
        } catch (err) {
            res.status(500).json({ statusCode: 500, message: 'Erreur lors de la récupération' });
        }
    },

    /**
     * Crée une tâche pour l'utilisateur connecté.
     * userId = toujours l'utilisateur connecté (plus d'assignation).
     */
    insert: async (req, res) => {
        try {
            const taskToAdd = {
                ...req.body,
                userId: req.user.id, // Forcé — toujours l'owner
            };
            const addedTask = await taskService.create(taskToAdd);
            res.location(`/api/tasks/${addedTask.id}`);
            res.status(201).json(addedTask);

            const VALID_PRIORITIES = ['high', 'medium', 'low'];
            const { name, description, before, priority, categoryId } = req.body;

            if (!name?.trim()) {
                return res.status(400).json({ statusCode: 400, message: 'Le nom est obligatoire.' });
            }
            if (priority && !VALID_PRIORITIES.includes(priority)) {
                return res.status(400).json({ statusCode: 400, message: 'Priorité invalide.' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ statusCode: 500, message: 'Erreur lors de la création' });
        }
    },

    /**
     * Modifie le statut isDone d'une tâche (ownership vérifié).
     */
    updateStatus: async (req, res) => {
        try {
            const task = await taskService.findById(req.params.id);
            if (!task) return res.status(404).json({ statusCode: 404, message: 'Tâche non trouvée' });
            if (task.userId.toString() !== req.user.id) {
                return res.status(403).json({ statusCode: 403, message: 'Accès refusé' });
            }
            task.isDone = req.body.isDone;
            await task.save();
            res.status(200).json(task);
        } catch (err) {
            res.status(500).json({ statusCode: 500, message: 'Erreur db' });
        }
    },

    /**
     * Modifie une tâche complète (ownership vérifié).
     */
    update: async (req, res) => {
        try {
            const task = await taskService.findById(req.params.id);
            if (!task) return res.status(404).json({ statusCode: 404, message: 'Tâche non trouvée' });
            if (task.userId.toString() !== req.user.id) {
                return res.status(403).json({ statusCode: 403, message: 'Accès refusé' });
            }
            const updated = await taskService.update(req.params.id, req.body);
            res.status(200).json(updated);
        } catch (err) {
            res.status(500).json({ statusCode: 500, message: 'Erreur db' });
        }
    },

    /**
     * Supprime une tâche (ownership vérifié).
     */
    delete: async (req, res) => {
        try {
            const task = await taskService.findById(req.params.id);
            if (!task) return res.status(404).json({ statusCode: 404, message: 'Tâche non trouvée' });
            if (task.userId.toString() !== req.user.id) {
                return res.status(403).json({ statusCode: 403, message: 'Accès refusé' });
            }
            await taskService.delete(req.params.id);
            res.sendStatus(204);
        } catch (err) {
            res.status(500).json({ statusCode: 500, message: 'Erreur db' });
        }
    },
};

module.exports = taskController;