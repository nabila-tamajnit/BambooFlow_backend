// models/category.model.js
const { Schema, model, Types } = require('mongoose');

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    icon: {
        type: String,
        required: true,
        trim: true,
        default: '📋'
    },
    color: {
        type: String,
        default: 'green'
    },
    // Owner de la catégorie
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Catégorie système (partagée par tous, non supprimable par l'user)
    isSystem: {
        type: Boolean,
        default: false
    }
}, {
    collection: 'Category',
    timestamps: true
});

const Category = model('Category', categorySchema);
module.exports = Category;