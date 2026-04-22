const { $where } = require('../../models/category.model');
// services/mongo/task.service.js
const Task = require('../../models/task.model');

const taskService = {

    /**
     * Récupère toutes les tâches d'un utilisateur.
     */
    findByUser: async (userId) => {
        try {
            const tasks = await Task.find({ userId })
                .populate({ path: 'categoryId', select: 'id name priority icon color' })
                .sort({ createdAt: -1 });
            return tasks;
        } catch (err) {
            console.error(err);
            throw new Error(err);
        }
    },

    findById: async (id) => {
        try {
            const task = await Task.findById(id)
                .populate({ path: 'categoryId', select: 'id name priority icon color' });
            return task;
        } catch (err) {
            throw new Error(err);
        }
    },

    create: async (task) => {
        try {
            const taskToAdd = new Task(task);
            await taskToAdd.save();
            return taskToAdd;
        } catch (err) {
            throw new Error(err);
        }
    },

    update: async (id, data) => {
        try {
            const updated = await Task.findByIdAndUpdate(id, data, { new: true });
            return updated;
        } catch (err) {
            throw new Error(err);
        }
    },

    delete: async (id) => {
        try {
            const deleted = await Task.findByIdAndDelete(id);
            return !!deleted;
        } catch (err) {
            throw new Error(err);
        }
    },

    // ── ADMIN — conservées pour future évolution ──
    // find: async (query) => {
    //     try {
    //         //? Récupérer ce qu'on a reçu dans la query, pour rajouter des filtres de recherche
    //         const { isDone, categoryId } = query;
    //         // * Vérifier si isDone est bien présent dans la query pour créer un nouveau filtre
    //         let isDoneFilter;
    //         // Si pas reçu de isDone dans la query, filtre vide
    //         if(isDone === undefined) {
    //             isDoneFilter = {};
    //         } else {
    //             // filtre pour le find { nomChampsDeLaDB : nomVariableAvecValeurRecherchée }
    //             isDoneFilter = { isDone : isDone }
    //             // ou // isDoneFilter = { isDone }
    //         }
    //         // * Vérifier s'il y a des catégories dans la query
    //         let categoryFilter;
    //         // Si pas reçu de categoryId dans la query, filtre vide
    //         if(!categoryId){
    //             categoryFilter = {}
    //         } 
    //         // Sinon, comme on pourrait rechercher plusieurs catégories, on va regarder si c'est un tableau
    //         else if( Array.isArray(categoryId) ){
    //             // { nomChampsEnDb : { $in : [valeurs recherchées] } }
    //             // categoryFilter = { categoryId : { $in : categoryId } }
    //             categoryFilter = { categoryId : { $in : categoryId } }
    //         } 
    //         // Si pas tableau, on cherche une seule catégorie
    //         else {
    //             categoryFilter = { categoryId : categoryId };
    //             //ou // categoryFilter = { categoryId };
    //         }

    //         // Populate permet de rajouter les informations reliées à notre objet task grâce à la ref qu'on a établi dans le Schema
    //         const tasks = await Task.find( isDoneFilter )
    //             .and( categoryFilter )
    //             .populate({
    //                 path: 'categoryId',
    //                 select: { id: 1, name: 1, priority: 1, icon: 1, color :1 }
    //             })
    //             .populate({
    //                 path: 'fromUserId',
    //                 select: { id: 1, firstname: 1, lastname: 1 }
    //             })
    //             .populate({
    //                 path: 'toUserId',
    //                 select: { id: 1, firstname: 1, lastname: 1 }
    //             });
    //         return tasks;
    //     }
    //     catch (err) {
    //         console.log(err);
    //         throw new Error(err);
    //     }
    // },
    // findAssignedTo: async (userId) => {
    //     try {
    //         //Trouver toutes les tâches assignées au userId reçu en paramètre
    //         const tasks = await Task.find({ toUserId: userId })
    //             .populate({
    //                 path: 'categoryId',
    //                 select: { id: 1, name: 1, priority: 1, icon: 1, color :1 }
    //             })
    //             .populate({
    //                 path: 'fromUserId',
    //                 select: { id: 1, firstname: 1, lastname: 1 },
    //             })
    //             .populate({
    //                 path: 'toUserId',
    //                 select: { id: 1, firstname: 1, lastname: 1 }
    //             });
    //         return tasks;
    //     } catch (err) {
    //         console.log(err);
    //         throw new Error(err);
    //     }
    // },
    // findGivenBy: async (userId) => {
    //     try {
    //         //Trouver toutes les tâches données par le userId reçu en paramètre
    //         const tasks = await Task.find({ fromUserId: userId })
    //             .populate({
    //                 path: 'categoryId',
    //                 select: { id: 1, name: 1, priority: 1, icon: 1, color :1 }
    //             })
    //             .populate({
    //                 path: 'fromUserId',
    //                 select: { id: 1, firstname: 1, lastname: 1 },
    //             })
    //             .populate({
    //                 path: 'toUserId',
    //                 select: { id: 1, firstname: 1, lastname: 1 }
    //             });
    //         return tasks;
    //     } catch (err) {
    //         console.log(err);
    //         throw new Error(err);
    //     }
    // },
};

module.exports = taskService;