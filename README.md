# Allmighty — Shopify Theme

Shopify theme source for the Allmighty store (`ze15sf-t1.myshopify.com`), tracked in git for collaborative development.

> **Development workflow is MANDATORY and lives in `AGENTS.md`** — read it first. It defines the pull-before-work and push-after-work ritual that keeps the git repo and the live Shopify theme in sync.

## Prerequisites

- [Shopify CLI](https://shopify.dev/docs/storefronts/themes/tools/cli) installed (`shopify version`)
- Node.js (for Shopify CLI)

## One-time setup: connect the store

The store is developed **directly on the live theme** — no local preview/dev themes.

1. **Get a theme access token** (one time, in the browser):
   - Install the free **Theme Access** app: https://apps.shopify.com/theme-access → **Add app** → **Install**
   - In the app → **Create theme password** → enter your email → **Create password**
   - Open the emailed link (expires in 7 days; the password shows **once**) — it's a `shptka_...`-style token
2. **Copy `.env.example` to `.env`** and fill in:
   - `SHOPIFY_CLI_THEME_TOKEN` → the theme password from step 1
   - `SHOPIFY_FLAG_STORE` → `ze15sf-t1.myshopify.com`
   - `SHOPIFY_FLAG_STORE_PASSWORD` → only if the storefront is password-protected
3. `.env` is **gitignored** — never commit it. Committed teammates create their own `.env`.

## Daily workflow

| Task | Command |
|---|---|
| Download the live theme from Shopify | `.\pull.ps1` (loads `.env`, runs `shopify theme pull --live`) |
| Upload local files to the live theme | `.\push.ps1` (runs `shopify theme push --live --allow-live`) |
| List remote themes + status | `shopify theme list` |
| Validate theme | `shopify theme check` |

The scripts read credentials from `.env` — no flags or secrets needed. You can append extra CLI flags, e.g. `.\pull.ps1 --only assets/theme.css`.

## Git / merge workflow

- **Before any task**: pull the live theme, commit + push any admin-panel changes that came down, and confirm a clean baseline. Full ritual is in `AGENTS.md`.
- **After any task**: commit + push to git, then push to the live theme, then verify with `shopify theme list`.
- `config/settings_data.json` holds live storefront setting values and is committed — when it conflicts, keep the value you intend to ship and re-run `.\push.ps1`.
- Never commit `.env` or any real token. `.env.example` is the committed template.

## Useful resources

- [Shopify CLI theme docs](https://shopify.dev/docs/storefronts/themes/tools/cli)
- [Theme Access app](https://apps.shopify.com/theme-access)
