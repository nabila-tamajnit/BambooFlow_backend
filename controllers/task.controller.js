const { Request, Response } = require('express')
const taskService = require('../services/mongo/task.service');

const taskController = {

    /**
     * Récupérer toutes les tâches (avec filtres optionnels)
     */
    getAll: async (req, res) => {
        const query = req.query;
        try {
            const tasks = await taskService.find(query);
            res.status(200).json({ count: tasks.length, tasks });
        } catch (err) {
            res.status(500).json({ statusCode: 500, message: 'Erreur lors de la récupération des tâches dans la DB' });
        }
    },

    /**
     * Récupérer une tâche par son id
     */
    getById: async (req, res) => {
        try {
            const id = req.params.id;
            const task = await taskService.findById(id);
            if (!task) {
                return res.status(404).json({ statusCode: 404, message: 'Tâche non trouvée' });
            }
            res.status(200).json(task);
        } catch (err) {
            res.status(500).json({ statusCode: 500, message: 'Erreur lors de la récupération de la tâche' });
        }
    },

    /**
     * Récupérer les tâches de l'utilisateur connecté (protégé par userAuthorizationMiddleware)
     * Retourne { tasksToDo, tasksGiven }
     */
    getByUser: async (req, res) => {
        try {
            const userId = req.params.id;
            // TODO :
            // Nice to have
            // Vérifier si admin ou user
            // Si role user, renvoyer que les tâches à faire (findAssignedTo)
            // Si role admin, renvoyer ses tâches à faire + tâches qu'il a donné (sans celles qu'il s'est donné lui même)
            const tasksToDo = await taskService.findAssignedTo(userId);
            const tasksGiven = await taskService.findGivenBy(userId);
            res.status(200).json({ tasksToDo, tasksGiven });
        } catch (err) {
            res.status(500).json({ statusCode: 500, message: 'Erreur de la db' });
        }
    },

    /**
     * Récupérer les tâches publiques d'un membre (accessible à tous les users connectés)
     * Retourne uniquement les tâches assignées à ce membre (tasksToDo)
     * Utilisé pour afficher les tâches des autres membres en lecture seule dans le MemberPanel
     */
    getPublicUserTasks: async (req, res) => {
        try {
            const userId = req.params.id;
            const tasksToDo = await taskService.findAssignedTo(userId);
            // On retourne seulement les tâches à faire — pas les tâches données
            res.status(200).json({ tasksToDo });
        } catch (err) {
            res.status(500).json({ statusCode: 500, message: 'Erreur de la db' });
        }
    },

    /**
     * Ajouter une tâche
     */
    insert: async (req, res) => {
        const taskToAdd = req.body;
        // Si pas d'admin, on force fromUserId = user connecté
        if (!taskToAdd.fromUserId) {
            taskToAdd.fromUserId = req.user.id;
        }
        try {
            const addedTask = await taskService.create(taskToAdd);
            res.location(`/api/tasks/${addedTask.id}`);
            res.status(201).json(addedTask);
        } catch (err) {
            console.error(err);
            res.status(500).json({ statusCode: 500, message: 'Erreur lors de l\'ajout dans la DB' });
        }
    },

    /**
     * Modifier une tâche
     */
    update: (req, res) => {
        res.sendStatus(501);
    },

    /**
     * Modifier le statut isDone d'une tâche
     */
    updateStatus: async (req, res) => {
        try {
            const id = req.params.id;
            const { isDone } = req.body;
            const task = await taskService.findById(id);
            if (!task) {
                return res.status(404).json({ statusCode: 404, message: 'Tâche non trouvée' });
            }
            task.isDone = isDone;
            await task.save();
            res.status(200).json(task);
        } catch (err) {
            res.status(500).json({ statusCode: 500, message: 'Erreur db' });
        }
    },

    /**
     * Supprimer une tâche
     */
    delete: async (req, res) => {
        try {
            const id = req.params.id;
            if (await taskService.delete(id)) {
                res.sendStatus(204);
            } else {
                res.status(404).json({ statusCode: 404, message: 'Suppression impossible, la tâche n\'existe pas' });
            }
        } catch (err) {
            res.status(500).json({ statusCode: 500, message: 'Erreur db' });
        }
    }
}

module.exports = taskController;