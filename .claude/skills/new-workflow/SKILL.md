---
name: new-workflow
description: Cree un nouveau workflow Trigger.dev avec son diagramme Mermaid. Utilise cette skill quand l'utilisateur veut creer un nouveau flow/workflow/automatisation.
argument-hint: "<nom-du-workflow>"
allowed-tools: Read, Write, Glob
---

# Creer un nouveau workflow

Cree un nouveau workflow Trigger.dev et son diagramme Mermaid associe.

## Etapes

1. **Verifier** que le workflow n'existe pas deja dans `src/trigger/$ARGUMENTS.ts`

2. **Creer le fichier workflow** `src/trigger/$ARGUMENTS.ts` avec ce scaffold :

```ts
import { schemaTask, logger, metadata } from "@trigger.dev/sdk/v3";
import { z } from "zod";

const payloadSchema = z.object({
  // TODO: definir le schema du payload
});

export const TASK_NAME = schemaTask({
  id: "TASK_ID",
  schema: payloadSchema,
  retry: {
    maxAttempts: 3,
    factor: 2,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 30_000,
  },
  run: async (payload, { ctx }) => {
    logger.info("Workflow started", { payload });
    metadata.set("status", "started");

    // TODO: implementer la logique du workflow
    // Utiliser logger.trace() pour chaque etape importante
    // Utiliser les services de src/services/ pour les appels API

    metadata.set("status", "completed");
    logger.info("Workflow completed");
    return { success: true };
  },
});
```

- Remplacer `TASK_NAME` par le nom en camelCase (ex: `leadScoring`)
- Remplacer `TASK_ID` par le nom en kebab-case (ex: `lead-scoring`)

3. **Creer le diagramme Mermaid** `docs/workflows/$ARGUMENTS.md` :

```markdown
# <Nom du Workflow>

<Description en une phrase>

## Diagramme

\`\`\`mermaid
graph TD
    A[Trigger: TODO] --> B(Etape 1: TODO)
    B --> C[[Resultat: TODO]]
\`\`\`

## Notes

- Trigger : TODO
- Services utilises : aucun pour l'instant
```

4. **Afficher** un resume des fichiers crees et les prochaines etapes suggerees
