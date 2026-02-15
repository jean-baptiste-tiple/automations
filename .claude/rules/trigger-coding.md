---
paths:
  - "src/trigger/**/*.ts"
  - "src/services/**/*.ts"
---

# Regles de code Trigger.dev

## Imports

Toujours importer depuis `@trigger.dev/sdk/v3` :
```ts
import { schemaTask, logger, metadata, tags, retry, wait } from "@trigger.dev/sdk/v3";
import { z } from "zod";
```

## Validation des payloads

TOUJOURS utiliser `schemaTask` avec un schema Zod :
```ts
export const myWorkflow = schemaTask({
  id: "my-workflow",
  schema: z.object({ ... }),
  ...
});
```

Ne JAMAIS utiliser `task()` sans validation quand le workflow recoit des donnees externes.

## Logging

- TOUJOURS utiliser `logger` de `@trigger.dev/sdk/v3`
- JAMAIS `console.log` (invisible dans le dashboard en prod)
- Utiliser `logger.trace("nom-etape", async (span) => { ... })` pour chaque etape importante
- Les traces apparaissent comme des "nodes" dans le dashboard Trigger.dev

## Metadata et progression

Pour les workflows multi-etapes, utiliser `metadata` :
```ts
metadata.set("status", "fetching-data");
metadata.set("progress", 50);
```

## Tags

Ajouter des tags pour filtrer dans le dashboard :
```ts
await tags.add("client_123");
await tags.add("workflow:lead-scoring");
```

Convention : `prefixe_valeur` ou `prefixe:valeur`

## Retry

Toujours configurer le retry explicitement :
```ts
retry: {
  maxAttempts: 3,
  factor: 2,
  minTimeoutInMs: 1000,
  maxTimeoutInMs: 30_000,
}
```

## Appels API dans les services

Utiliser `retry.fetch()` ou `retry.onThrow()` pour les appels API externes dans les services.
