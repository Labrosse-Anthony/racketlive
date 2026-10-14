# RacketLive 🎾

Site de tennis : calendrier des tournois, classements ATP et WTA, fiches joueurs et favoris. Il est conçu d'abord pour le mobile, avec une future application mobile en vue.

## Fonctionnalités

- Calendrier des tournois en liste ou en vue mensuelle, avec filtres (circuit, catégorie, surface, pays, mois)
- Page de détail d'un tournoi
- Classements ATP et WTA avec recherche et pagination
- Fiches joueurs avec leurs derniers résultats
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
  utils/        petites fonctions (dates, libellés, drapeaux)
  data/         données du site
scripts/        script de récupération des données de l'API
```

## Données

Pour l'instant, le site affiche des **données fictives** (fichiers JSON dans `src/data`).
Les pages ne lisent jamais ces fichiers directement : elles appellent les fonctions de `src/services/api`. Passer aux vraies données ne demande donc de modifier que ces services.

Les vraies données viennent de l'API « Tennis API – ATP WTA ITF » (RapidAPI). Un script les télécharge de temps en temps et les enregistre dans `src/data/api/` :

```bash
npm run donnees -- --liste   # voir les groupes de données disponibles
npm run donnees              # télécharger les données
```

Le script a besoin d'un fichier `.env` à la racine du projet (jamais envoyé sur GitHub) :

```
RAPIDAPI_KEY=ta_clé
RAPIDAPI_HOST=tennis-api-atp-wta-itf.p.rapidapi.com
```

Le forfait gratuit est limité à 50 requêtes par jour. Le script compte les appels et s'arrête tout seul.

## À venir

- Brancher les vraies données sur le site
- Identité visuelle (logo, couleurs)
- Page d'accueil « Cette semaine »
- Application mobile
