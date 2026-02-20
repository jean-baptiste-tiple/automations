# Notify Lead

Recoit les donnees d'un nouveau lead (via webhook/API) et envoie une notification formatee sur Slack.

## Diagramme

```mermaid
graph TD
    A[Webhook: Reception Lead] --> B{Validation Zod}
    B -->|Valide| C(Construction du message)
    B -->|Invalide| D[[Erreur: Payload invalide]]
    C --> E(Slack: Envoi notification)
    E --> F[[Notification envoyee]]
    E -.-> G[[Erreur Slack]]
```

## Notes

- Trigger : Appel API / webhook (schemaTask)
- Services utilises : `slack.ts` (sendAlert)
- Validation : Zod (name, email, company?, source)
- Env vars requises : `SLACK_BOT_TOKEN`, `SLACK_ALERTS_CHANNEL`
