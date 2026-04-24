// Import de la librairie jsonwebtoken
const jwt = require('jsonwebtoken');

// Récupération des variables d'environnement dont on a besoin pour créer(et décoder) le token
const { JWT_ISSUER, JWT_AUDIENCE, JWT_SECRET } = process.env;

// On va créer un objet dans lequel il y aura 2 fonctions :
// - Une qui permet de créer un token à partir de certaines infos
// - Une qui permet de décoder un token et récupérer les infos contenues dedans
const jwtUtils = {

    generate : (user) => {
        // La création de notre token peut planter donc on va renvoyer une promesse pour savoir si ça a échoué ou pas
        return new Promise( (resolve, reject) => {

            // ? 1) On va créer un "payload" avec certaines données du user.
            const payload = { 
                id : user._id, /* id est un claims du payload */
                role : user.role
            }

            // ? 2) Paramétrer les options pour créer notre token
            const options = {
                // Choix de l'algo de hashage du token, par défaut HS256
                algorithm : 'HS512', 
                // Choix de la date d'expiration du token
                expiresIn : '3d',
                // Information sur "à qui" est destiné le token
                audience : JWT_AUDIENCE,
                // Information sur "qui" envoie le token (notre api)
                issuer : JWT_ISSUER
            }

            // ? 3) Création du token
            jwt.sign(payload, JWT_SECRET, options, (error, token) => {
                // Si il y a eu une erreur lors de la signature, le param error sera rempli et token sera vide
                if(error){
                    reject(error); /* Si erreur, on rejette la promesse */
                }

                // Si tout s'est bien passé, error est vide et token est rempli
                resolve(token); /* Si pas d'erreur, on résoud la promesse et on renvoie le token */
            } )
        } )
    },

    decode : (token) => {
        return new Promise((resolve, reject) => {

            //? 1) Si rien dans paramètre token, promesse non tenue
            if(!token) {
                reject(new Error('Pas de token reçu'));
            }

            //? 2) Si y'a bien un token, on peut s'occupe de le décoder
            const options = {
                audience : JWT_AUDIENCE,
                issuer : JWT_ISSUER
            }

            jwt.verify(token, JWT_SECRET, options, (error, payload) => {
                // Si une erreur est survenue pendant le décodage error est rempli mais pas payload
                if(error){
                    reject(error);
                }

                // Si pas d'erreur pendant le décodage, error est vide et payload est rempli avec les claims qu'on avait mis dans le token
                resolve(payload);
            })

        })
    }
}

module.exports = jwtUtils;