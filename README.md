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
cp .env.example .env   # Puis remplir les valeurs
```

## Configuration

### Variables d'environnement

| Variable | Description | Où la trouver |
|----------|-------------|---------------|
| `TRIGGER_SECRET_KEY` | Clé API Trigger.dev (dev local uniquement) | Dashboard > Settings > API Keys |
| `SLACK_BOT_TOKEN` | Token du bot Slack | api.slack.com > OAuth & Permissions |
| `SLACK_ALERTS_CHANNEL` | Channel pour les alertes (ex: `#alerts`) | Slack |

- **Dev** : fichier `.env` (gitignored)
- **Prod** : dashboard Trigger.dev > Environment Variables

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

### Test manuel

Depuis le dashboard Trigger.dev : sélectionne une task → **Test** → lance.

## Architecture

```
src/
  trigger/          Workflows (1 fichier = 1 automatisation)
  services/         Services réutilisables (1 fichier = 1 API externe)

docs/
  workflows/        Diagrammes Mermaid (1 par workflow, même nom)
```

### Workflows (`src/trigger/`)

Chaque fichier est un workflow autonome, l'équivalent d'un "flow" dans N8N. Exemple : `uptime-monitor.ts` vérifie le site toutes les heures et alerte sur Slack si le site est down.

### Services (`src/services/`)

Chaque fichier encapsule une API externe, l'équivalent d'un "node" réutilisable dans N8N. Exemple : `slack.ts` expose `sendMessage()` et `sendAlert()`.

Les workflows importent les services, jamais l'inverse.

### Diagrammes (`docs/workflows/`)

Chaque workflow a un diagramme Mermaid qui documente visuellement le flux. Installez l'extension VS Code **"Markdown Preview Mermaid Support"** pour les visualiser.

## Workflows actifs

| Workflow | Description | Fréquence |
|----------|-------------|-----------|
| `uptime-monitor` | Vérifie que tiple.io est en ligne, alerte Slack si down | Toutes les heures |

## Créer un nouveau workflow

Avec Claude Code, utilise les skills intégrées :

```
/new-workflow <nom>          Crée un workflow + diagramme Mermaid
/add-service <nom>           Crée un service pour une API externe
/visualize <nom>             Met à jour le diagramme Mermaid d'un workflow
```

Ou décris simplement ce que tu veux automatiser en français.

## Stack technique

- **Runtime** : [Trigger.dev](https://trigger.dev) v4 (cloud serverless)
- **Langage** : TypeScript
- **Validation** : Zod
- **AI Assistant** : Claude Code (skills + rules intégrées)
