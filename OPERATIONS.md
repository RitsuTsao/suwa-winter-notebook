# Beta operations

Version **0.4.0-beta.1** · Creator/producer: **Ritsu** · Implementation: **Codex / GPT-6**.

Website: https://ritsutsao.github.io/suwa-winter-notebook/

## What updates automatically

The workflow `.github/workflows/pages.yml` runs on `main` pushes, manual dispatch, and daily at 22:17 UTC (06:17 Taipei / 07:17 Tokyo the next day). It tests and rebuilds the existing historical dataset without changing its accepted records, refreshes the fixed Google News RSS feed, and deploys only `dist/` through GitHub Pages. No LLM/API key, server hosting account, paid integration, or personal deployment credential is required.

Only RSS headlines update automatically. Research, annual outcomes, event dates, artwork, and product features still require a reviewed source change. GitHub can delay/drop scheduled runs and can disable public-repository schedules after prolonged inactivity; check Actions if the site's timestamp is stale. No separate monitoring service was configured. [Official schedule limits](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule).

## Persistence and failure

Before fetching RSS, `tools/publish-news.py` attempts to recover `news.json` from the deployed site and uses it only when valid and at least as recent as the repository fallback. Feed errors preserve the last available items and successful retrieval time, with a new failed-attempt timestamp. A valid empty feed clears old items. The website labels failed retrievals and snapshots older than 36 hours.

If both previous-site recovery and RSS fail, the dated repository snapshot is used, not an invented recent result. Partial/failing RSS retrieval leaves the run marked failed after deploying the explicitly labeled fallback. Build/test or deployment errors leave the previously deployed site in place; its timestamp continues to reveal age.

There are no daily news commits or permanent news archive. GitHub retains deployment artifacts temporarily (one-day artifact setting); a committed baseline snapshot supports offline use. Visitor “reload snapshot” only reloads same-origin JSON, not the RSS source.

## Retry and inspect

1. Open the repository's **Actions** tab and **Publish beta and refresh news**.
2. Inspect the failed build/deploy step. An RSS warning differs from a Pages deployment failure.
3. Select **Run workflow** on `main` to fetch current data and deploy the current approved source. The workflow checks out current `main`, even for a rerun.
4. Verify the workflow result, public page version, and news retrieval time. A green run alone is not evidence that a future schedule will execute.

Workflow concurrency is serialized, without cancelling in-progress deployments. GitHub job permissions are limited to repository read access for the build and Pages/OIDC write permission for deployment. No token is placed in website files.

## Update or roll back

Make changes on a branch, run relevant tests, review, then merge/push approved changes to `main`; this triggers deployment. To roll back a faulty code change, create a reviewed revert commit on `main` and deploy it. Do not rewrite repository history. To stop automatic updates, disable this workflow in Actions; the last deployed site remains available and its timestamp ages. Unpublishing Pages is a separate action.

For local use, `python3 -B tools/serve.py --open` still enables live RSS. Direct `file://` remains offline and makes no HTTP requests. Browser tests require an existing Playwright module and Chrome; `tests/static-news.mjs` tests the public-host mode using a simulated repository subpath without external network access.

## Release boundary

This is a beta with incomplete historical records, not a forecast or continuously monitored information service. Licensing remains undecided. AI roles and model versions are disclosed in CREDITS; the website links there. See VERIFICATION for actual deployment and test evidence.

`SHA256SUMS.txt` covers the committed repository snapshot. Scheduled deployment changes news files in an ephemeral runner without rewriting that repository manifest; it is not a checksum of future live news.
