# Architecture : Task = Node, Service = Node reutilisable

## Structure des fichiers

- `src/trigger/<workflow>.ts` : Un fichier = un workflow complet (equivalent d'un "flow" N8N)
- `src/services/<service>.ts` : Un fichier = une API externe (equivalent d'un "node" N8N reutilisable)
- `src/services/<service>.test.ts` : Tests unitaires du service (colocalises)
- `docs/workflows/<workflow>.md` : Un fichier = un diagramme Mermaid du workflow

## Conventions de nommage

- Fichiers : `kebab-case` (ex: `lead-scoring.ts`, `sync-invoices.ts`)
- Task IDs : `kebab-case`, identique au nom du fichier (ex: `id: "lead-scoring"`)
- Services : `kebab-case`, nomme d'apres l'API (ex: `slack.ts`, `hubspot.ts`, `openai.ts`)

## Structure d'un workflow (`src/trigger/`)

Chaque workflow DOIT :
1. Exporter la task principale (pas de `default export`)
2. Utiliser `schemaTask` avec validation Zod du payload
3. Configurer `retry` explicitement
4. Utiliser `logger` pour tracer chaque etape
5. Utiliser `metadata` pour le suivi de progression
6. Utiliser `tags` pour l'organisation

## Structure d'un service (`src/services/`)

Chaque service DOIT :
1. Exporter les types TypeScript (input/output de chaque operation)
2. Exporter des fonctions async avec gestion d'erreur integree
3. Lire les credentials depuis `process.env`
4. Ne PAS dependre d'autres services (pas de couplage inter-services)

## Regles de dependance

- Les workflows (`src/trigger/`) importent les services (`src/services/`)
- Les services ne s'importent JAMAIS entre eux
- Les services ne dependent JAMAIS des workflows
