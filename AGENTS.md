# Allmighty — Shopify Theme Development Workflow (MANDATORY)

This project is the git-tracked source of the **live theme** on `ze15sf-t1.myshopify.com` (live theme id is resolved dynamically via `--live`). The store owner ALSO edits the theme directly in the Shopify admin panel. To keep the two in sync without losing work or breaking merges, follow this workflow **on every command** without exception.

## BEFORE working on ANY user command

Run these steps first, in order. Do not start the requested work until they are complete.

1. **Check for uncommitted local changes** (`git status --short`).
   - If `git status` shows modified/untracked files from prior work, commit them now before anything else:
     - `git add -A`
     - `git commit -m "chore: WIP prior work"`
     - `git push origin main`
2. **Pull the live theme from Shopify**:
   - `.\pull.ps1` (loads `.env`, runs `shopify theme pull --live`)
3. **Check for admin-panel updates** (`git status --short` again).
   - If the pull brought down changes (files modified by the admin panel since the last sync), save them:
     - `git add -A`
     - `git commit -m "sync: pull live theme changes from store"`
     - `git push origin main`
4. **Confirm baseline is clean**: `git status` shows no uncommitted changes.
5. Now begin the user's requested work.

## AFTER finishing the user's requested work

1. **Save to git**:
   - `git add -A`
   - `git commit -m "<concise message describing the change>"`
   - `git push origin main`
2. **Push to the LIVE Shopify theme**:
   - `.\push.ps1` (loads `.env`, runs `shopify theme push --live --allow-live`)
3. **Verify** the upload succeeded: `shopify theme list` (live theme shows the update).

## Hard rules

- **Never** skip the pull-before-work step, even if the last command ran seconds ago.
- **Never** push to Shopify without committing to git first.
- Do not use local preview / development themes. Work goes straight to the live theme.
- `.env` holds credentials (`SHOPIFY_CLI_THEME_TOKEN`, `SHOPIFY_FLAG_STORE`) and is gitignored. Never commit it or print tokens.
- If `git status` ever looks dirty while a task is in progress, stop and resolve it before continuing.
- If `.\pull.ps1` or `.\push.ps1` fails, stop and report — do not work around it.
