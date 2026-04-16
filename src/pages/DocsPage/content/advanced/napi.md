---
title: New API
description: The public 2anki.net HTTP API
---

The HTTP API is documented via Swagger UI at [`/api/docs`](/api/docs). The OpenAPI JSON is available at `/api/docs/swagger.json` if you need it for code generation.

## Endpoint groups

| Prefix | Purpose |
|--------|---------|
| `/api/upload` | Submitting files and running conversions |
| `/api/download` | Fetching finished APKG decks |
| `/api/users` | Authentication and profile |
| `/api/notion` | Notion OAuth connect and sync |
| `/api/settings` | Per-user card and parser settings |
| `/api/favorites` | Saving and listing favourites |
| `/api/rules` | Parser rule management |
| `/api/templates` | Card templates |
| `/api/version` | Build version info |
| `/api/checks` | Health checks |

## Authentication

Authenticated endpoints use a session cookie set by the `/api/users` login flow. Self-hosted deployments can issue long-lived tokens if you need machine-to-machine access — see [self-hosting](/documentation/advanced/self-hosting).
