// services/mongo/category.service.js
const Category = require("../../models/category.model");

const categoryService = {

    // Récupère les catégories de l'user + les catégories système
    findByUser: async (userId) => {
        try {
            const categories = await Category.find({
                $or: [{ userId }, { isSystem: true }]
            }).sort({ isSystem: -1, name: 1 });
            return categories;
        } catch (err) {
            throw new Error(err);
        }
    },

    findById: async (id) => {
        try {
            return await Category.findById(id);
        } catch (err) {
            throw new Error(err);
        }
    },

    create: async (categoryData, userId) => {
        try {
            const category = new Category({ ...categoryData, userId });
            await category.save();
            return category;
        } catch (err) {
            throw new Error(err);
        }
    },

    update: async (id, data) => {
        try {
            return await Category.findByIdAndUpdate(id, data, { new: true });
        } catch (err) {
            throw new Error(err);
        }
    },

    delete: async (id) => {
        try {
            const deleted = await Category.findByIdAndDelete(id);
            return !!deleted;
        } catch (err) {
            throw new Error(err);
        }
    },

    nameExistsForUser: async (name, userId, excludeId = null) => {
        try {
            const query = { name, userId };
            if (excludeId) query._id = { $ne: excludeId };
            const found = await Category.findOne(query);
            return !!found;
        } catch (err) {
            throw new Error(err);
        }
    },
};

module.exports = categoryService;