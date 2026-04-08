const { Schema, model } = require('mongoose');

// On créer un schema qui va décrire à quoi ressemble une categorie
// Schema( { description objet }, { options collection } )
const categorySchema = new Schema({
    name: {
        type: String,
        required: true, /* name est obligatoire */
        unique: true, /* name est unique, pas deux fois le même name de category */
        trim: true /* pour enlever les espaces inutiles s'il y en a */
    },
    priority: {
        type: String, // ex: "Haute", "Moyenne", "Basse"
        required: true,
        default: "Basse"
    },
    icon: {
        type: String,
        required: true,
        trim: true
    },
    color: {
        type: String, // ex: "red", "green", "yellow"
        required: true,
        default: "green"
    }

}, {
    collection: 'Category', /* Le nom de la collection avec laquelle on devra interagir en DB */
    timestamps: true
    /* Pour rajouter 2 champs automatiquement 
    - createdAt : date -> Pour savoir quand la category aura été créée
    - updatedAt : date -> Pour savoir quand la category a été modifiée pour la dernière fois */
});

// On va créer un model à partir de ce schema
// Le premier paramètre et le nom du model, le deuxième, le schéma de ce model
const Category = model('Category', categorySchema);

// On exporet le model créé
module.exports = Category;