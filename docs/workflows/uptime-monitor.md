# Uptime Monitor

Verifie toutes les heures que le site tiple.io est en ligne et envoie une alerte Slack si le site est down.

## Diagramme

```mermaid
graph TD
    A[Schedule: Toutes les heures] --> B(Fetch https://www.tiple.io)
    B --> C{Site OK?}
    C -->|Oui - HTTP 2xx| D[[Log: Site UP + response time]]
    C -->|Non - Erreur/Timeout| E(Log: Site DOWN)
    E --> F{{Slack: Alerte Site DOWN}}
    F --> G[[Alerte envoyee]]
```

## Notes

- Trigger : Cron `0 * * * *` (toutes les heures)
- Services utilises : `slack.ts` (sendAlert)
- Duree max : 60 secondes de compute
- Env vars requises : `SLACK_BOT_TOKEN`, `SLACK_ALERTS_CHANNEL`
