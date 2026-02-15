# Uptime Monitor

Verifie toutes les 5 minutes que le site tiple.io est en ligne et mesure le temps de reponse.

## Diagramme

```mermaid
graph TD
    A[Schedule: Toutes les 5 min] --> B(Fetch https://www.tiple.io)
    B --> C{Site OK?}
    C -->|Oui - HTTP 2xx| D[[Log: Site UP + response time]]
    C -->|Non - Erreur/Timeout| E[[Log: Site DOWN + erreur]]
    E -.-> F((TODO: Notif Slack))
```

## Notes

- Trigger : Cron `*/5 * * * *` (toutes les 5 minutes)
- Services utilises : aucun (fetch natif avec retry)
- Duree max : 60 secondes de compute
- Evolution prevue : ajouter notification Slack quand le site est down
