# Tiple Automations

Plateforme d'automatisation Tiple, propulsee par Trigger.dev v4. Remplace N8N avec du code TypeScript versionne.

## Commandes

- Dev : `npx trigger.dev@latest dev`
- Deploy : `npx trigger.dev@latest deploy`
- Test : `npm test` (run unique) ou `npm run test:watch` (mode watch)
- Install : `npm install`

IMPORTANT : Quand l'utilisateur veut creer, modifier ou tester un workflow, rappelle-lui de lancer `npx trigger.dev@latest dev` s'il ne l'a pas deja fait. Le serveur local est indispensable pour que les workflows fonctionnent en dev.

IMPORTANT : A chaque modification d'un workflow dans `src/trigger/`, tu DOIS mettre a jour le diagramme Mermaid correspondant dans `docs/workflows/`. Ne jamais oublier cette etape.

## Architecture

- `src/trigger/` : Workflows (1 fichier = 1 workflow = 1 "flow" N8N)
- `src/services/` : Services reutilisables (1 fichier = 1 API externe = 1 "node" N8N)
- `src/services/*.test.ts` : Tests unitaires des services (colocalises)
- `docs/workflows/` : Diagrammes Mermaid (1 fichier par workflow, meme nom)
- `trigger.config.ts` : Configuration projet Trigger.dev
- `vitest.config.ts` : Configuration des tests

Les tasks importent les services, jamais l'inverse.

## Regles cles

- Voir @.claude/rules/ pour les regles detaillees (architecture, visualisation, coding, env/logging, testing)
- Voir @.env.example pour les variables d'environnement requises

## Conventions

- Langue des echanges : francais
- Langue du code : anglais (noms de variables, fonctions, commentaires)
- Validation des payloads : toujours utiliser `schemaTask` + Zod
- Logging : toujours utiliser `logger` de `@trigger.dev/sdk` (pas `console.log`)
- Secrets : `.env` en local, dashboard Trigger.dev en prod. JAMAIS en dur dans le code
- Env vars : toujours valider avec `if (!var) throw new Error(...)`. JAMAIS de fallback `??` pour les env vars
- Tests : chaque service dans `src/services/` DOIT avoir un fichier `.test.ts` colocalise

## Skills disponibles

- `/new-workflow <nom>` : Cree un nouveau workflow + diagramme Mermaid
- `/visualize <nom>` : Met a jour le diagramme Mermaid d'un workflow
- `/add-service <nom>` : Cree un nouveau service reutilisable
