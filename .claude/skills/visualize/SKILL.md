---
name: visualize
description: Met a jour le diagramme Mermaid d'un workflow a partir de son code TypeScript. Utilise cette skill quand l'utilisateur veut voir ou mettre a jour le schema visuel d'un workflow.
argument-hint: "<nom-du-workflow>"
allowed-tools: Read, Write, Glob, Grep
---

# Mettre a jour le diagramme Mermaid d'un workflow

Analyse le code TypeScript d'un workflow et genere/met a jour son diagramme Mermaid.

## Etapes

1. **Lire le code** du workflow `src/trigger/$ARGUMENTS.ts`

2. **Analyser la structure** en identifiant :
   - Le type de trigger (schedule/cron, webhook, trigger manuel)
   - Les appels a des services (`src/services/`)
   - Les `logger.trace()` (chaque trace = un "node" dans le diagramme)
   - Les conditions (`if/else`, `switch`)
   - Les `wait.*` (pauses, attentes humaines)
   - Les appels a d'autres tasks (`triggerAndWait`, `trigger`)
   - Les `retry.fetch()` ou `retry.onThrow()`
   - Le resultat final (`return`)

3. **Generer le diagramme Mermaid** en respectant les conventions de `.claude/rules/visualization.md` :
   - Trigger : `[Rectangle]`
   - Task/Service : `(Arrondi)`
   - Condition : `{Losange}`
   - Wait : `((Cercle))`
   - Agent IA : `{{Hexagone}}`
   - Resultat : `[[Rectangle double]]`
   - Direction : `TD` (Top-Down)
   - Erreurs en pointille : `-.->`

4. **Ecrire le diagramme** dans `docs/workflows/$ARGUMENTS.md`

5. **Afficher** le diagramme Mermaid genere pour que l'utilisateur puisse le visualiser
