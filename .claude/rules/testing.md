# Tests

## Framework

- Vitest (`vitest`) — configure dans `vitest.config.ts`
- Commandes : `npm test` (run unique), `npm run test:watch` (mode watch)

## Structure des fichiers

- Les tests sont colocalises avec le code source : `src/services/slack.test.ts` a cote de `src/services/slack.ts`
- Pattern de nommage : `<nom-du-fichier>.test.ts`
- Pas de dossier `__tests__/` separe

## Quoi tester

### Services (`src/services/`) — OBLIGATOIRE
Chaque service DOIT avoir des tests unitaires couvrant :
1. Le cas nominal (appel API reussi, retour correct)
2. Les erreurs API (status 4xx/5xx, reponse invalide)
3. La validation des env vars manquantes (throw si absente)
4. Le formatage des requetes (headers, body)

### Workflows (`src/trigger/`) — OPTIONNEL
Les workflows Trigger.dev dependent du runtime Trigger.dev et sont testes via le dashboard en dev.
On ne les teste PAS en unitaire (le SDK mock est complexe et fragile).
Seule la logique pure extraite dans des helpers peut etre testee.

## Conventions de test

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("nomDuModule", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // IMPORTANT: utiliser clearAllMocks, pas restoreAllMocks
    // restoreAllMocks casse les references aux mocks module-level (vi.mock)
  });

  it("should do something specific", () => {
    // Arrange
    // Act
    // Assert
  });
});
```

### Mocks
- Mocker `retry.fetch` de `@trigger.dev/sdk/v3` avec `vi.mock()`
- Mocker `process.env` avec `vi.stubEnv()` ou assignation directe
- Ne JAMAIS faire de vrais appels reseau dans les tests

### Nommage des tests
- Decrire le comportement attendu en anglais : `"should throw if SLACK_BOT_TOKEN is missing"`
- Grouper par fonction/operation avec `describe()`
