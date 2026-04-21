const argon2 = require('argon2');
const User = require('../../models/user.model');

const ADMIN_SECRET_CODE = process.env.ADMIN_SECRET_CODE;

const authService = {

    findByCredentials: async (credentials) => {
        try {
            const userFound = await User.findOne({ email: credentials.email });
            if (!userFound) return undefined;

            const checkPassword = await argon2.verify(userFound.password, credentials.password);
            if (!checkPassword) return undefined;

            return userFound;
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
    },

    emailAlreadyExists: async (email) => {
        try {
            const userFound = await User.findOne({ email });
            return !!userFound;
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
    },

    create: async (user) => {
        try {
            const hashedPassword = await argon2.hash(user.password);
            user.password = hashedPassword;

            // Si le code admin est fourni et correct → rôle Admin, sinon User
            if (user.adminCode && user.adminCode === ADMIN_SECRET_CODE) {
                user.role = 'Admin';
            } else {
                user.role = 'User';
            }

            // On ne stocke pas le adminCode en base
            delete user.adminCode;

            const userToCreate = User(user);
            await userToCreate.save();
            return userToCreate;
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
    },

    deleteById: async (userId) => {
        try {
            const deleted = await User.findByIdAndDelete(userId);
            return !!deleted;
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
    }
};

module.exports = authService;