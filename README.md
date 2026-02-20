# Tiple Automations

Plateforme d'automatisation Tiple. Remplace N8N par des workflows TypeScript versionnés, propulsés par [Trigger.dev](https://trigger.dev) v4.

## Prérequis

- [Node.js](https://nodejs.org/) (v18+)
- Un compte [Trigger.dev](https://cloud.trigger.dev)
- Un compte [Slack](https://api.slack.com/apps) (pour les notifications du 1er flow de test/exemple)

## Installation

```bash
git clone <repo-url>
cd automations
npm install
```

### 1. Créer un projet Trigger.dev

1. Crée un compte sur [cloud.trigger.dev](https://cloud.trigger.dev)
2. Crée un nouveau projet
3. Initialise le projet localement :

```bash
npx trigger.dev@latest init -p <ton-project-ref>
```

> Le `project ref` (ex: `proj_xxx`) se trouve dans le dashboard Trigger.dev > Settings.
> Si tu clones ce repo, le projet est déjà configuré dans `trigger.config.ts`.

### 2. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Puis remplis les valeurs dans `.env` :

| Variable | Description | Où la trouver |
|----------|-------------|---------------|
| `TRIGGER_SECRET_KEY` | Clé API Trigger.dev (dev local uniquement) | Dashboard > Settings > API Keys |
| `SLACK_BOT_TOKEN` | Token du bot Slack | [api.slack.com](https://api.slack.com/apps) > OAuth & Permissions > Bot User OAuth Token |
| `SLACK_ALERTS_CHANNEL` | Channel pour les alertes (ex: `#alerts`) | Slack |

**Pour le bot Slack** : crée une app sur [api.slack.com/apps](https://api.slack.com/apps), ajoute le scope `chat:write`, installe dans ton workspace, et invite le bot dans le channel (`/invite @NomDuBot`).

- **Dev** : fichier `.env` (gitignored, jamais commité)
- **Prod** : dashboard Trigger.dev > Environment Variables (mêmes clés, sans `TRIGGER_SECRET_KEY`)

## Utilisation

### Développement

```bash
npx trigger.dev@latest dev
```

Lance le serveur local. Les workflows s'exécutent sur ton PC et sont visibles dans le [dashboard Trigger.dev](https://cloud.trigger.dev).

### Déploiement

```bash
npx trigger.dev@latest deploy
```

Pousse les workflows sur le cloud Trigger.dev. Ils tournent 24/7 sans ton PC.

### Tests unitaires

```bash
npm test              # Run unique
npm run test:watch    # Mode watch
```

Les tests sont colocalisés avec les services : `src/services/slack.test.ts` à côté de `src/services/slack.ts`.

### Test manuel (dashboard)

Depuis le dashboard Trigger.dev : sélectionne une task → **Test** → lance.

## Architecture

```
src/
  trigger/              Workflows (1 fichier = 1 automatisation)
  services/             Services réutilisables (1 fichier = 1 API externe)
  services/*.test.ts    Tests unitaires (colocalisés)

docs/
  workflows/            Diagrammes Mermaid (1 par workflow, même nom)
```

### Workflows (`src/trigger/`)

Chaque fichier est un workflow autonome, l'équivalent d'un "flow" dans N8N. Exemple : `uptime-monitor.ts` vérifie le site toutes les heures et alerte sur Slack si le site est down.

### Services (`src/services/`)

Chaque fichier encapsule une API externe, l'équivalent d'un "node" réutilisable dans N8N. Exemple : `slack.ts` expose `sendMessage()` et `sendAlert()`.

Les workflows importent les services, jamais l'inverse.

### Diagrammes (`docs/workflows/`)

Chaque workflow a un diagramme Mermaid qui documente visuellement le flux. Installez l'extension VS Code **"Markdown Preview Mermaid Support"** pour les visualiser.

## Workflows actifs

| Workflow | Type | Description |
|----------|------|-------------|
| `uptime-monitor` | Cron (toutes les heures) | Vérifie que tiple.io est en ligne, alerte Slack si down |
| `notify-lead` | Webhook (schemaTask + Zod) | Reçoit un lead, valide le payload, notifie Slack |

## Créer un nouveau workflow

Avec Claude Code, utilise les skills intégrées :

```
/new-workflow <nom>          Crée un workflow + diagramme Mermaid
/add-service <nom>           Crée un service pour une API externe
```

Ou décris simplement ce que tu veux automatiser en français. Les diagrammes Mermaid sont mis à jour automatiquement à chaque modification de workflow.

## Stack technique

- **Runtime** : [Trigger.dev](https://trigger.dev) v4 (cloud serverless)
- **Langage** : TypeScript
- **Validation** : Zod
- **Tests** : Vitest
- **AI Assistant** : Claude Code (skills + rules intégrées)
