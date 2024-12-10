# A24-5W5-ProgWeb3-NET_BackgroundService

## Description
Ce projet met en œuvre un jeu basé sur un `BackgroundService` en .NET, intégré avec une base de données et un Hub SignalR.  
L'objectif est d'ajouter deux fonctionnalités principales :  
1. **Suivi des victoires (NbWins)** : Enregistrer et afficher le nombre de victoires des joueurs.  
2. **Multiplicateur de score** : Permettre aux joueurs d'augmenter leur score par clic via un système de multiplicateurs dynamiques.

## Objectifs
- Comprendre le fonctionnement d'un `BackgroundService` et son intégration avec une base de données et un Hub.
- Étendre le projet pour ajouter des fonctionnalités tout en maintenant la synchronisation client-serveur.

---

## Fonctionnalités à implémenter

### 1. Suivi des victoires des joueurs (NbWins)
- À chaque fin de round, identifier les joueurs gagnants.
- Incrémenter leur nombre de victoires (`NbWins`) dans la base de données.
- Afficher cette information côté client.

### 2. Multiplicateur de score
- Ajouter un multiplicateur qui augmente le score par clic.
- Définir un coût croissant pour acheter des multiplicateurs (doublement à chaque achat).
- Réinitialiser le multiplicateur à 1 à la fin de chaque round pour garantir l’équité.
- Afficher le multiplicateur et son coût côté client.

---

## Étapes d’installation

### 1. **Cloner le projet :**
   git clone https://github.com/<votre-utilisateur>/<nom-du-repo>.git
   cd <nom-du-repo>

### 2. Configurer la base de données :
- Mettez à jour la chaîne de connexion dans appsettings.json.
- Appliquez les migrations pour ajouter les champs nécessaires :
    dotnet ef database update

### 3. Lancer le projet :
- dotnet run

### 4 . Documentation :
Consultez le dossier doc/ pour des instructions détaillées et des informations sur l'exercice.

### 5. Exécuter et comprendre le projet :
Familiarisez-vous avec le fonctionnement du BackgroundService, du Hub, et du client.

## Résultat attendu
- Un suivi précis des victoires des joueurs, affiché côté client.
- Un système de multiplicateurs fonctionnel, avec des coûts croissants et une réinitialisation équitable.