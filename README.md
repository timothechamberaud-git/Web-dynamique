# Mercato Nova - Projet Étudiant 

Bienvenue sur le dépôt de **Mercato Nova**, un projet développé dans le cadre de notre cursus de 2ème année d'école d'ingénieur post-bac.

Il s'agit d'une plateforme hybride e-commerce et de transactions entre particuliers spécialisée dans les équipements sportifs. Ce projet a pour but de mettre en pratique nos connaissances en développement web Full-Stack, en conception de bases de données relationnelles et en gestion d'états asynchrones complexes.

Ce projet met en relation des vendeurs et des acheteurs autour de trois grands types de transactions :
1. **L'Achat Direct** : Comme sur un site e-commerce classique, avec mise au panier et paiement immédiat.
2. **Les Enchères Live** : Un système d'enchères en temps réel, avec décompte, où les acheteurs surenchérissent pour remporter le produit à la fin du chrono.
3. **La Négociation** : Une salle de marché privée entre un acheteur et un vendeur permettant de discuter d'un prix en direct via un tchat jusqu'à trouver un accord.

---

## 🛠️ Stack Technique

### Frontend
- **React.js** (v18+) avec `react-router-dom` pour la gestion des pages.
- **Vanilla CSS** pour l'interface graphique (thème sombre élégant avec accents verts).
- Aucune utilisation de librairie de composants externes (Bootstrap/Tailwind) pour une maîtrise complète du design sur mesure.

### Backend & API
- **PHP 8+** (Vanilla, architecture MVC simplifiée).
- **PDO** pour la communication sécurisée avec la base de données.
- Routeur frontal basique dans `public/index.php`.

### Base de données
- **MySQL 8** structuré autour de tables relationnelles : `UTILISATEUR`, `PRODUIT`, `CATEGORIE`, `ENCHERE`, `OFFRE`, `NEGOCIATION`, `MESSAGE_NEGO`, `COMMANDE`, `CONTIENT`, `NOTIFICATION`.

---

## 🚀 Fonctionnalités Clés

- **Système d'authentification** : Connexion, inscription, avec isolation parfaite des sessions par onglet (utilisation du `sessionStorage`).
- **Boutique & Catalogue dynamique** : Filtrage en temps réel des articles par sport et par type de vente.
- **Système de Panier et de Validation de Commande** : Conversion des produits mis au panier en commandes officielles validées en base de données.
- **Salle d'Enchères Dynamique** : 
  - Synchronisation du prix actuel (`polling`) sans problème de cache navigateur.
  - Le système détecte le gagnant automatiquement à la fin de l'enchère et fait apparaître un bouton de paiement officiel.
  - Modification immédiate du statut de l'objet dans le catalogue (les objets terminés ou payés disparaissent de la boutique pour ne pas créer de commandes fantômes).
- **Salles de Négociation Privées** :
  - Création de tchats 1-to-1 en base de données.
  - Proposition de montants par l'acheteur, acceptation par le vendeur.
  - Notification automatique et transformation de l'accord en commande payée.
- **Tableau de Bord & Notifications** : Historique des ventes, suivi des enchères et négociations en temps réel. Cloche de notification (pastille rouge) avertissant de chaque événement (message, surenchère, paiement).

---

## ⚙️ Guide d'Installation et de Lancement (Pour l'évaluation)

Pour tester ce projet dans des conditions optimales, merci de suivre rigoureusement les étapes ci-dessous. Le projet nécessite un serveur local (Apache/MySQL) et Node.js.

### 1. Prérequis
- **WAMP, XAMPP ou MAMP** (comprenant PHP 8+ et MySQL).
- **Node.js** (version 16+ recommandée) et **npm**.
- **Git** (optionnel, si vous clonez le dépôt).

### 2. Mise en place de la Base de Données
1. Lancez votre serveur MySQL (via WAMP/XAMPP).
2. Ouvrez **phpMyAdmin** (généralement accessible via `http://localhost/phpmyadmin`).
3. Créez une nouvelle base de données nommée exactement **`mercato_nova`**.
4. Importez le fichier SQL de dump (qui contient la structure des tables et les données de test) dans cette base.
5. *Note technique :* Les identifiants de connexion à la base sont configurés par défaut pour WAMP (`root` sans mot de passe). Si vous utilisez MAMP (mot de passe `root`), veuillez modifier le fichier `backend/config/Database.php`.

### 3. Lancement du Backend (API PHP)
1. Placez l'intégralité du dossier du projet dans le répertoire racine de votre serveur web :
   - Pour WAMP : `C:\wamp64\www\Web-dynamique`
   - Pour XAMPP : `C:\xampp\htdocs\Web-dynamique`
2. Démarrez le serveur Apache.
3. Le backend est désormais prêt à écouter les requêtes sur l'URL `http://localhost/Web-dynamique/backend/public`.

### 4. Lancement du Frontend (Application React)
1. Ouvrez un terminal (Invite de commandes ou PowerShell).
2. Naviguez dans le dossier `frontend` du projet :
   ```bash
   cd chemin/vers/Web-dynamique/frontend
   ```
3. Installez les dépendances du projet (le fameux dossier `node_modules` qui n'est pas versionné) :
   ```bash
   npm install
   ```
4. Démarrez le serveur de développement React :
   ```bash
   npm run dev
   ```
   *(Ou `npm start` selon votre configuration Vite/CRA).*
5. Le terminal vous affichera une URL locale (généralement `http://localhost:5173` ou `http://localhost:3000`). Cliquez dessus ou copiez-la dans votre navigateur web.

🎉 **Félicitations, l'application Mercato Nova est lancée et fonctionnelle !** Vous pouvez utiliser plusieurs onglets pour vous connecter avec des comptes différents et tester le temps réel.

---

## 🧹 Notes de version récentes
L'application a été entièrement revue et stabilisée sur plusieurs points critiques lors de la dernière mise à jour :
- **Refonte des sessions** : Le passage de `localStorage` à `sessionStorage` permet le multi-compte simultané dans différents onglets du même navigateur. Parfait pour tester les échanges Acheteur/Vendeur !
- **Fin du Cache Persistant** : L'intégration d'un horodatage (`timestamp`) sur les requêtes GET sensibles garantit la mise à jour des prix en temps réel sur l'écran.
- **Correction des Commandes** : Les paiements finaux d'Enchères ou de Négociations renseignent désormais rigoureusement toutes les tables requises (`COMMANDE` et `CONTIENT` avec `MontantTotal`, `PrixUnit` et `Quantite`).

*Développé avec passion pour le monde du sport.*
