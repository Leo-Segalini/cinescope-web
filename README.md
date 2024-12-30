# TMDB App

Une application web moderne pour explorer les films, séries TV et animes, construite avec Next.js 13+, TypeScript et Tailwind CSS.

## 🌟 Fonctionnalités

- 🎬 Exploration des films, séries TV et animes
- 🔍 Recherche avancée
- 📱 Design responsive
- 🎨 Interface utilisateur moderne avec animations
- 🌐 Support multilingue (FR)
- 📺 Informations sur les plateformes de streaming
- ⚡ Performance optimisée avec Next.js

## 🚀 Technologies Utilisées

- [Next.js 13+](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [TMDB API](https://www.themoviedb.org/documentation/api)

## 📋 Prérequis

- Node.js 18.x ou supérieur
- npm ou yarn
- Une clé API TMDB

## ⚙️ Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/votre-username/tmdb-app.git
cd tmdb-app
```

2. Installez les dépendances :
```bash
npm install
# ou
yarn install
```

3. Créez un fichier `.env.local` à la racine du projet :
```env
NEXT_PUBLIC_TMDB_API_KEY=votre_clé_api_tmdb
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

4. Lancez le serveur de développement :
```bash
npm run dev
# ou
yarn dev
```

## 🔑 Configuration de l'API TMDB

1. Créez un compte sur [TMDB](https://www.themoviedb.org/)
2. Allez dans les paramètres de votre compte
3. Cliquez sur "API" dans le menu de gauche
4. Demandez une nouvelle clé API (type "Developer")
5. Remplissez le formulaire
6. Copiez la clé API (v3 auth) dans votre fichier `.env.local`

## 🚀 Déploiement

L'application est optimisée pour être déployée sur [Vercel](https://vercel.com). Pour déployer :

1. Créez un compte sur Vercel
2. Importez votre projet depuis GitHub
3. Configurez les variables d'environnement dans les paramètres du projet :
   - `NEXT_PUBLIC_TMDB_API_KEY` (créez un secret nommé `tmdb_api_key`)
   - Les autres variables sont configurées automatiquement
4. Le déploiement se fera automatiquement à chaque push sur la branche principale

### Résolution des problèmes de déploiement

Si vous rencontrez des erreurs lors du déploiement :

1. Assurez-vous que toutes les variables d'environnement sont correctement configurées
2. Vérifiez que le fichier `vercel.json` est présent à la racine du projet
3. Les dépendances de développement sont automatiquement omises en production
4. Husky est configuré pour ne s'installer que dans un environnement de développement

## 📁 Structure du Projet

```
src/
├── app/                 # Pages de l'application
├── components/          # Composants réutilisables
├── config/             # Configuration de l'application
├── services/           # Services (API, etc.)
├── styles/             # Styles globaux
├── types/              # Types TypeScript
└── utils/              # Utilitaires
```

## 🧪 Tests

Pour lancer les tests :
```bash
npm run test
# ou
yarn test
```

## 📝 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 🙏 Remerciements

- [TMDB](https://www.themoviedb.org/) pour leur excellente API
- La communauté open source pour les outils incroyables
