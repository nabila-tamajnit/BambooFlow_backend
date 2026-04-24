const { Request } = require('express');
const jwtUtils = require('../../utils/jwt.utils');
// ? Ce middleware va permettre de vérifier si un token a bien été fourni


const authenticationMiddleware = () => {

    /**
     * @param { Request } req
     */
    return async (req, res, next) => {
        // ? Récupérer le headers qui s'appelle authorization
        const authorization = req.headers.authorization;

        // ? Si le token n'a pas été ajouté dans authorization, on aura undefined et dans ce cas, on met fin à la requête : la personne n'est pas connectée
        if (!authorization) {
            res.status(401).json({ statusCode: 401, message: 'Vous devez être connecté' });
        }
        else {

            // ? Si quelqu'un a envoyé quelque chose dans Authorization comme "Bearer " sans envoyer le token après Bearer : fin de la requête
            const token = authorization.split(' ')[1];
            if (!token) {
                res.status(401).json({ statusCode: 401, message: 'Vous devez être connecté' });
            }

            // ? Si y'a un token
            // On essaie de le décoder
            try {
                const payload = await jwtUtils.decode(token);

                req.user = payload;

                // On continue la requête
                next();
            }
            catch (err) {

                // Si erreur, le décodage a planté, le token n'est plus bon ou erroné, donc fin de la requête

                res.status(401).json({ statusCode: 401, message: 'Vous devez être connecté' });
            }
        }


    }
}

module.exports = authenticationMiddleware;