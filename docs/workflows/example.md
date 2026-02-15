# First Scheduled Task

Tache planifiee qui s'execute toutes les heures et affiche le timestamp formate.

## Diagramme

```mermaid
graph TD
    A[Schedule: Toutes les heures] --> B(Calcul distance depuis dernier run)
    B --> C(Log payload et distance)
    C --> D((Wait: 5 secondes))
    D --> E(Formatage timestamp avec timezone)
    E --> F[[Log timestamp formate]]
```

## Notes

- Trigger : Cron `0 * * * *` (toutes les heures)
- Services utilises : aucun
- Duree max : 5 minutes de compute
