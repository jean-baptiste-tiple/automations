---
name: add-service
description: Cree un nouveau service reutilisable (equivalent d'un node N8N) pour encapsuler une API externe. Utilise cette skill quand l'utilisateur veut integrer un nouvel outil/API.
argument-hint: "<nom-du-service>"
allowed-tools: Read, Write, Glob, WebSearch
---

# Creer un nouveau service

Cree un service reutilisable dans `src/services/` pour encapsuler une API externe.

## Etapes

1. **Verifier** que le service n'existe pas deja dans `src/services/$ARGUMENTS.ts`

2. **Rechercher** les best practices de l'API si c'est un service connu (Slack, OpenAI, HubSpot, etc.)

3. **Creer le fichier service** `src/services/$ARGUMENTS.ts` avec ce scaffold :

```ts
import { retry } from "@trigger.dev/sdk/v3";

// ============================================================
// Types
// ============================================================

export interface ServiceNameConfig {
  // Configuration du service (optionnel, ex: baseUrl override)
}

// Definir les types d'input/output pour chaque operation
export interface OperationInput {
  // TODO: definir
}

export interface OperationResult {
  // TODO: definir
}

// ============================================================
// Operations
// ============================================================

/**
 * Description de l'operation
 */
export async function operationName(input: OperationInput): Promise<OperationResult> {
  const apiKey = process.env.SERVICE_API_KEY;
  if (!apiKey) throw new Error("SERVICE_API_KEY is required");

  const response = await retry.fetch("https://api.service.com/endpoint", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
    retry: {
      maxAttempts: 3,
      condition: (response, error) => {
        return response?.status === 429 || (response?.status ?? 0) >= 500;
      },
    },
  });

  if (!response.ok) {
    throw new Error(`Service API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<OperationResult>;
}
```

- Remplacer `ServiceName` par le nom du service en PascalCase
- Remplacer `SERVICE_API_KEY` par la variable d'env appropriee
- Adapter les URLs et headers a l'API reelle

4. **Mettre a jour `.env.example`** pour ajouter les variables d'env requises par le nouveau service

5. **Afficher** un resume du service cree et un exemple d'utilisation dans un workflow
