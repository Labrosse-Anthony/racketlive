# RacketLive 🎾

Site de tennis : calendrier des tournois, classements ATP et WTA, fiches joueurs et favoris. Il est conçu d'abord pour le mobile, avec une future application mobile en vue.

## Fonctionnalités

- Page d'accueil : tournois en cours, top 5 ATP et WTA, prochains tournois, favoris
- Calendrier des tournois en liste ou en vue mensuelle, avec filtres (circuit, catégorie, pays, mois)
- Page de détail d'un tournoi
- Classements ATP et WTA avec recherche et pagination
- Fiches joueurs
- Favoris (joueurs et tournois) conservés dans le navigateur
- Thème clair et sombre
- Accessibilité : lien d'évitement, navigation au clavier, contrastes, réduction des animations

## Technologies

React, Vite, React Router, CSS moderne (variables, mobile-first), ESLint.

## Lancer le projet

```bash
npm install      # installer les dépendances (une seule fois)
npm run dev      # lancer le site en développement
npm run build    # construire la version de production
npm run preview  # tester la version de production
npm run lint     # vérifier la qualité du code
```

## Organisation du code

```
src/
  components/   composants réutilisables (tournois, joueurs, interface…)
  pages/        une page par adresse du site
  services/api/ accès aux données (les pages passent toujours par ici)
  hooks/        logique réutilisable (thème, favoris, titre de page)
  utils/        petites fonctions (dates, libellés)
  data/         données lues par le site
scripts/        récupération et conversion des données de l'API
```

## Données

Le site lit des fichiers JSON dans `src/data` (`rankings.json`, `tournaments.json`). Les pages ne les lisent jamais directement : elles appellent les fonctions de `src/services/api`. Changer de source de données ne demande donc de modifier que ces services.

Les classements et le calendrier sont de vraies données issues de l'API « Tennis API – ATP WTA ITF » (RapidAPI). Deux commandes les mettent à jour :

```bash
npm run donnees -- --liste   # voir les groupes de données disponibles
npm run donnees              # télécharger les données brutes (dans src/data/api, non versionné)
npm run convertir            # convertir les données brutes au format du site
```

Le script de téléchargement a besoin d'un fichier `.env` à la racine du projet (jamais envoyé sur GitHub) :

```
RAPIDAPI_KEY=ta_clé
RAPIDAPI_HOST=tennis-api-atp-wta-itf.p.rapidapi.com
```

Le forfait gratuit est limité à 50 requêtes par jour. Le script compte les appels et s'arrête tout seul.

Les fiches joueurs détaillées et les résultats de tournoi utilisent encore des données de démonstration : ils seront branchés sur l'API ensuite.

## À venir

- Résultats de tournoi et fiches joueurs avec les vraies données
- Matchs du jour sur l'accueil
- Mentions légales et source des données
- Gestion des erreurs, tests automatiques
- Mise en ligne, puis application mobile
