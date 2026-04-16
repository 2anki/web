---
title: API access
description: Status of the 2anki.net HTTP API and how to request early access
---

The new 2anki.net HTTP API is under heavy development. **It is not open to the public yet.** Endpoints, payloads, and authentication are all subject to change without notice, so please treat the API as **private** for now.

We plan to open it up once the surface has stabilised and we're confident we can support external integrations without breaking them.

## Early access

If you have a concrete use case you'd like to build against, you can request early access by emailing [support@2anki.net](mailto:support@2anki.net) with:

- Who you are and what you're building
- The endpoints or capabilities you need
- Your expected request volume

Early access is granted **at our discretion** and may be revoked while we iterate on the design. Approved users will receive credentials directly and updates as the API evolves.

## In the meantime

If you're self-hosting, the internal Swagger UI at [`/api/docs`](/api/docs) describes the current (unstable) endpoints. Keep in mind that anything not formally documented here is considered internal and may change between releases.
