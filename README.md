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

React, Vite, React Router, CSS moderne (variables, mobile-first), ESLint, Vitest, GitHub Actions.

## Lancer le projet

```bash
npm install      # installer les dépendances (une seule fois)
npm run dev      # lancer le site en développement
npm run build    # construire la version de production
npm run preview  # tester la version de production
npm run lint     # vérifier la qualité du code
npm test         # lancer les tests automatiques (Vitest)
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

### Mise à jour automatique

Une action GitHub (`.github/workflows/mise-a-jour-donnees.yml`) télécharge chaque jour le calendrier, les classements et les résultats, les convertit et enregistre les changements. Elle utilise deux secrets du dépôt : `RAPIDAPI_KEY` et `RAPIDAPI_HOST`. Elle consomme environ 29 requêtes par jour : évite les gros téléchargements manuels le même jour.

Une seconde action (`.github/workflows/ci.yml`) lance le lint, les tests et le build à chaque envoi sur GitHub.

## À venir

- Matchs du jour sur l'accueil et plus de données joueurs
- Mentions légales
- Mise en ligne (Netlify ou Vercel)
- PWA : site installable sur le téléphone, avec une utilisation hors connexion
- Application mobile avec Capacitor (App Store et Google Play)
