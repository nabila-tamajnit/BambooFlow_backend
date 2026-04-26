# 🎋 BambooFlow — Backend

> API REST sécurisée pour l'application de productivité BambooFlow.

[![Frontend App](https://img.shields.io/badge/-Voir%20l'app-000000?style=for-the-badge)](https://bambooflow-app.vercel.app/)
[![Frontend Repo](https://img.shields.io/badge/-Frontend%20Repo-3E3742?style=for-the-badge&logo=github&logoColor=white)](https://github.com/nabila-tamajnit/BambooFlow_frontend)

<br>

![Node.js](https://img.shields.io/badge/-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/-Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/-Mongoose-880000?style=for-the-badge)
![JWT](https://img.shields.io/badge/-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Argon2](https://img.shields.io/badge/-Argon2-4A4A4A?style=for-the-badge)
![Insomnia](https://img.shields.io/badge/-Insomnia-4000BF?style=for-the-badge&logo=insomnia&logoColor=white)

---

## ✨ Fonctionnalités

- **Authentification sécurisée** : Hash des mots de passe Argon2, génération et vérification de tokens JWT (HS512, expiration 3 jours).
- **CRUD complet** : Endpoints pour tâches, catégories et utilisateurs avec vérification d'ownership sur chaque ressource.
- **Middlewares d'autorisation** : Authentication, vérification de rôle (Admin/User) et vérification d'ownership découplés et réutilisables.
- **Sécurité production** : Helmet (headers HTTP), rate limiting sur les routes d'auth (10 req/15 min), CORS configuré par origine.
- **Cascade de suppression** : La suppression d'un compte entraîne la suppression de ses tâches et catégories associées.

---

## 💡 Compétences clés

- **Architecture REST** : Séparation controllers / services / models / middlewares / routes avec responsabilités clairement délimitées.
- **Mongoose** : Schémas typés avec validations, références entre collections, populate et requêtes conditionnelles.
- **Sécurité applicative** : Combinaison Helmet + rate limiter + CORS restrictif adaptée à un déploiement portfolio.

---

## 📡 Endpoints principaux

| Méthode | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/auth/register` | Créer un compte | — |
| POST | `/api/auth/login` | Connexion | — |
| GET | `/api/tasks` | Tâches de l'utilisateur connecté | ✓ |
| POST | `/api/tasks` | Créer une tâche | ✓ |
| PUT | `/api/tasks/:id` | Modifier une tâche | ✓ owner |
| DELETE | `/api/tasks/:id` | Supprimer une tâche | ✓ owner |
| GET | `/api/categories` | Catégories de l'utilisateur | ✓ |
| POST | `/api/categories` | Créer une catégorie | ✓ |
| GET | `/api/users/me` | Profil de l'utilisateur connecté | ✓ |
| DELETE | `/api/users/:id` | Supprimer son compte | ✓ owner |

---

## 🛠️ Installation

```bash
# Cloner le projet
git clone https://github.com/nabila-tamajnit/bambooflow-backend

# Installer les dépendances
npm install

# Créer le fichier d'environnement
cp .env.example .env
# → renseigner PORT, DB_CONNECTION, JWT_SECRET, JWT_ISSUER, JWT_AUDIENCE, FRONTEND_URL

# Lancer en développement
npm run dev
```

---

## 🔗 Repo lié

Le frontend (React + Tailwind) est disponible ici :
**[bambooflow-frontend →](https://github.com/nabila-tamajnit/BambooFlow_frontend)**

---

## 👤 Auteur

**Nabila Tamajnit** - Étudiante Full Stack @ Interface3
