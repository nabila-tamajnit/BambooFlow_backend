// import du type Request et Response pour la JsDoc
const { Request, Response } = require('express')

// import du service des tâches
const fakeTaskService = require("../services/fake/fakeTask.service");
const taskService = require('../services/mongo/task.service');

//création de notre controller
const taskController = {

    /**
     * Récupérer toutes les tâches
     * @param { Request } req
     * @param { Response } res
     */
    getAll: async (req, res) => {
        // On va récupérer la potentielle query
        const query = req.query;
        //console.log(query);  //query, même si y'en a pas, sera toujours un objet vide

        try {

            const tasks = await taskService.find(query);
            const dataToSend = {
                count: tasks.length,
                tasks
            };
            res.status(200).json(dataToSend);

        } catch (err) {

            res.status(500).json({ statusCode: 500, message: 'Erreur lors de la récupération des tâches dans la DB' });
        }

        //#region autre version
        //version 1 - renvoyer le tableau tel quel
        // res.status(200).json(tasks);
        // pareil que res.send(tasks, 200);

        //version 2 - renvoyer un objet avec le total des tâches + le tableau
        //#endregion

    },

    /**
    * Récupérer une tâche
    * @param { Request } req
    * @param { Response } res
    */
    getById: async (req, res) => {
        try {

            const id = req.params.id;
            const task = await taskService.findById(id);

            // Si pas de tâche récupérée (donc si l'id n'existe pas) l'API renvoie une erreur 404
            if (!task) {
                res.status(404).json({
                    statusCode: 404,
                    message: 'Tâche non trouvée'
                })
            }

            // Si y'a une tâche
            res.status(200).json(task);


        }
        catch (err) {
            res.status(500).json({ statusCode: 500, message: 'Une erreur est survenue lors de la récupération de la tâche' })
        }

    },

    /**
    * Récupérer les tâches d'un user
    * @param { Request } req
    * @param { Response } res
    */
    getByUser: async (req, res) => {
        try {

            const userId = req.params.id;
            //TODO Idéalement il faudrait utiliser un userService pour vérifier si l'utilisateur existe vraiment en DB

            const tasksToDo = await taskService.findAssignedTo(userId);
            const tasksGiven = await taskService.findGivenBy(userId);

            const dataToSend = {
                tasksToDo,
                tasksGiven
            }

            res.status(200).json(dataToSend);
        }
        catch (err) {
            res.status(500).json({ statusCode: 500, message: 'Erreur de la db' });
        }

    },

    /**
    * Ajouter une tâche
    * @param { Request } req
    * @param { Response } res
    */
    insert: async (req, res) => {

        const taskToAdd = req.body;

        try {
            const addedTask = await taskService.create(taskToAdd);
            // Pour respecter les principes REST, on doit rajouter à la réponse, une url qui permet de consulter la valeur ajoutée
            res.location(`/api/tasks/${addedTask.id}`);
            res.status(201).json(addedTask);

        }
        catch (err) {
            res.status(500).json({ statusCode: 500, message: 'Erreur lors de l\'ajout dans la DB' })
        }

    },

    /**
    * Modifie les infos d'une tâche
    * @param { Request } req
    * @param { Response } res
    */
    update: (req, res) => {
        const id = +req.params.id;
        const newTaskInfos = req.body;

        //vérifier si la tâche existe
        const task = taskService.findById(id);
        if (!task) {
            res.status(404).json({ statusCode: 404, message: 'La tâche que vous essayez de modifier n\'existe pas' });
        }

        //si la tâche existe, on peut la modifier
        const updatedTask = taskService.update(id, newTaskInfos);
        res.status(200).json(updatedTask);
    },

    /**
    * Modifie le statut isDone d'une tâche
    * @param { Request } req
    * @param { Response } res
    */
    updateStatus: (req, res) => {
        const id = +req.params.id;
        const newStatus = req.body.isDone;

        //on va d'abord vérifier si la tâche existe
        const task = taskService.findById(id);
        if (!task) {
            res.status(404).json({ statusCode: 404, message: 'La tâche que vous essayez le modifier n\'existe pas' });
        }

        //si la tâche existe, on peut la modifier
        const uptatedTask = taskService.updateStatus(id, newStatus);
        res.status(200).json(uptatedTask);
    },

    /**
    * Supprime une tâche
    * @param { Request } req
    * @param { Response } res
    */
    delete: async (req, res) => {
        try {

            const id = req.params.id;

            if (await taskService.delete(id)) {
                res.sendStatus(204);
            }
            else {
                res.status(404).json({ statusCode: 404, message: 'Suppression impossible, la tâche n\'existe pas' })
            }
        } catch (err) {
            res.status(500).json({ statusCode: 500, message: 'Erreur db' });
        }




    }
}



//on le rend importable en l'exportant
module.exports = taskController;


// doc :
//res.send(donnée, statusCode) utilisé quand on veut envoyer une donné + statusCode
//res.sendStatus(statusCode) utilisé quand on veut renvoyer juste un statusCode
