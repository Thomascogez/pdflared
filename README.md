# pdflaredd

> This project is an open source HTML to PDF rendering service designed to run Cloudflare Workers.

The goal is to provide a simple, developer friendly way to:

- Author printable documents as HTML
- Preview templates and develop locally like Storybook
- Render PDFs on demand using Cloudflare Browser Rendering
- Deploy with minimal infrastructure

**This repository is currently work in progress. APIs, internals, and constraints are still evolving.**

## Why this exists

Most PDF generation solutions fall into one of two categories:

- SaaS services that are expensive and opaque
- Self hosted Chromium setups that are heavy and complex
