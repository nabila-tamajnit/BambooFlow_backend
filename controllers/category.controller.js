

const categoryService = require("../services/mongo/category.service");


const categoryController = {

    getAll: async (req, res) => {
        try {
            //on appelle notre service qui va chercher dans la DB
            const categories = await categoryService.find();
            //Si ça marche, on renvoie les catégories
            res.status(200).json(categories);

        } catch (err) {
            // si erreur de récupération dans le service, on envoie une 500
            console.log(err);
            res.status(500).json({ statusCode: 500, message: 'Erreur avec la DB' });

        }
    },

    getById: async (req, res) => {

        const id = req.params.id;

        try {
            const category = await categoryService.findById(id);

            //Si category est undefined ou null
            if (!category) {
                res.status(404).json({ statusCode: 404, message: `La catégorie ${id} n\'existe pas` })
            }

            res.status(200).json(category);

        }
        catch (err) {
            res.status(500).json({ statusCode: 500, message: 'Erreur de la DB' });
        }

    },

    insert: async (req, res) => {
        const categoryToAdd = req.body;

        try {
            // Si le nom existe déjà en base de données, erreur
            const exists = await categoryService.nameAlreadyExists(categoryToAdd.name)

            if (exists) {
                res.status(409).json({ statusCode: 409, message: `La catégorie ${categoryToAdd.name} existe déjà !` });
            }
            else {
                //Si elle n'existe pas, on peut la créer
                const insertedCategory = await categoryService.create(categoryToAdd);

                res.location(`/api/categories/${insertedCategory.id}`)
                res.status(201).json(insertedCategory);
            }

        } catch (err) {
            res.sendStatus(500);
        }


    },

    update: (req, res) => {
        //TODO : Vérifier si l'id existe sinon 404

        //TODO : Vérifier que le nouveau nom n'est pas déjà présent dans la db sinon 409

        //TODO : Faire la modification
        res.sendStatus(501);
    },

    delete: async (req, res) => {
        try {

            const categoryId = req.params.id;

            //Si la catégorie est utilisée dans une tâche
            if(await categoryService.isUsed(categoryId)){

                res.status(409).json( {statusCode : 409, message : 'Suppression impossible, la catégorie est reliée à au moins une tâche'});

            }else {
                
                // sinon, c'est bon, on tente la suppression
                if(await categoryService.delete(categoryId)){
                    //si suppression renvoie vrai, c'est bon c'est fait
                    res.sendStatus(204);
                }
                else {
                    //si suppression renvoie faux, l'id n'existait pas
                    res.status(404).json({ statusCode : 404, message : 'La catégorie n\'existe pas'});
                }

            }

        }catch(err){
            console.log(err);
            res.status(500).json({ statusCode : 500, message : 'Une erreur est survenue dans la DB' });
        }

    },
}

module.exports = categoryController;