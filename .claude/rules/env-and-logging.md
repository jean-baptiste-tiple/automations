# Variables d'environnement et Logging

## Variables d'environnement

### Regles strictes
- JAMAIS de secrets en dur dans le code (API keys, tokens, mots de passe)
- En local : utiliser `.env` (gitignored)
- En prod : utiliser le dashboard Trigger.dev (Environment Variables)
- Pour les env vars dynamiques en prod : `syncEnvVars` dans `trigger.config.ts`

### Convention de nommage
- Format : `SCREAMING_SNAKE_CASE`
- Prefixer par le nom du service : `SLACK_BOT_TOKEN`, `OPENAI_API_KEY`, `HUBSPOT_API_KEY`
- Variables Trigger.dev : prefixees `TRIGGER_` (auto-configurees)

### Fichier .env.example
- TOUJOURS maintenir `.env.example` a jour quand on ajoute une variable
- Mettre des valeurs placeholder, jamais de vraies valeurs
- Commenter chaque variable avec son usage

### Acces dans le code
```ts
const apiKey = process.env.SLACK_BOT_TOKEN;
if (!apiKey) throw new Error("SLACK_BOT_TOKEN is required");
```

Toujours verifier que la variable existe avant utilisation.

### INTERDIT : fallback avec `??` ou `||`
Ne JAMAIS utiliser de valeur par defaut pour une env var :
```ts
// INTERDIT - masque une mauvaise configuration
const channel = process.env.SLACK_CHANNEL ?? "#alerts";

// CORRECT - echoue explicitement si non configuree
const channel = process.env.SLACK_CHANNEL;
if (!channel) throw new Error("SLACK_CHANNEL is required");
```

## Logging et Observabilite

### Niveaux de log
- `logger.debug()` : Details techniques, uniquement utile en dev
- `logger.info()` : Etapes cles du workflow (debut, fin, resultats)
- `logger.warn()` : Situations anormales mais non-bloquantes
- `logger.error()` : Erreurs (accompagne d'un objet erreur)

### Traces (spans)
Chaque etape significative d'un workflow = un `logger.trace()` :
```ts
const result = await logger.trace("fetch-customer-data", async (span) => {
  span.setAttribute("customer.id", customerId);
  const data = await fetchCustomer(customerId);
  span.setAttribute("customer.found", !!data);
  return data;
});
```

Les traces sont visibles comme des "nodes" dans le dashboard Trigger.dev.

### Metadata temps reel
Pour le suivi de progression visible dans le dashboard :
```ts
metadata.set("status", "processing");
metadata.set("progress", 75);
metadata.set("currentStep", "sending-email");
```

### Bonnes pratiques
- Loguer le payload d'entree (sans les secrets) au debut du workflow
- Loguer le resultat de sortie a la fin
- Loguer les appels API externes (URL, status code, duree)
- Ne pas loguer les donnees sensibles (tokens, mots de passe, PII)
