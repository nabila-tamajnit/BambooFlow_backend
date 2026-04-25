// ! 1) Importer express + Créer le serveur
const express = require('express'); //import de la lib express
const server = express(); //création du serveur express

// ? Récupération des variables d'environnement :
const { PORT, DB_CONNECTION } = process.env;

// ? Pour paramétrer le fait que notre API doit comprendre quand du json arrive
server.use(express.json());

// ---- Utilisation d'un app-middleware qu'on a fait ----
const logMiddleware = require('./middlewares/log.middleware');
server.use(logMiddleware());
// ------------------------------------------------------

// ---- Utilisation du middleware cors ------------------
const cors = require('cors');
//? -> Configuration "Tout est autorisé (parfait pour DEV)"
// server.use(cors());

//? -> Configuration pour la production "Autoriser uniquement notre app react"
const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',')
    : ['http://localhost:5173'];

server.use(cors({
    origin: (origin, callback) => {
        // Autoriser les requêtes sans origin (Insomnia, curl, etc.)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error('Non autorisé par CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
}));

// ------------------------------------------------------


// ! 2) Traiter les requêtes
// indiquer à notre app que le routing se trouve dans le dossier 📁 routes
const router = require('./routes'); //import de l'objet routeur présent dans index.js
server.use('/api', router); //indiquer à notre server qu'il doit utiliser le router



// ! 3) Connexion DB puis démarrage du serveur
const mongoose = require("mongoose");
mongoose.connect(DB_CONNECTION, { dbName: 'TaskManager' })
    .then(() => {
        console.log('💾 Successfully connected to the DB!');
        server.listen(PORT, () => {
            console.log(`🚀 Express Server started on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error(`❌ Connection Failed\n[Reason]\n ${err}`);
        process.exit(1);
    });