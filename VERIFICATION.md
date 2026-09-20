# Verification record

Version **0.4.0-beta.1** · 2026-09-20. Creator: **Ritsu**. Engineering checks were performed with Codex assistance; attribution and model-version limits are in [CREDITS.md](CREDITS.md).

“Verified” describes an actual check in the stated environment. “Reviewed” describes inspection. Neither means independent historical certification or a tested public deployment.

## Website baseline: third local edition

The following checks were recorded for the existing local website before repository preparation:

- **Verified:** 13 Node tests for cross-year stays, four nights/five dates, leap years and invalid dates, unknown/disputed denominators, consecutive rolling windows, first appearance versus ceremony, ice cover versus Omiwatari, photograph interval limits, references, research adoption, all-year chart modeling, and unresolved 2013 range semantics.
- **Verified:** 5 Python news tests for ordering, deduplication, a three-item maximum, safe links, future/missing date exclusion, Atom parsing, failure retention, successful replacement, caching, and empty results.
- **Verified:** Chrome/Playwright desktop 1440×1100 and 360×800 touch emulation covered date dragging, year/stay changes, notes, modal events, keyboard tabs, grid/chart navigation, CSV export of 150 years, two orange date-conflict corners, 150 date/coverage markers, recent-year filtering, candidate notes, and all three state images.
- **Verified:** legend and reading vignettes load; image click areas follow the missing-record image; reduced-motion preference disables the fade; mobile charts scroll inside their container without whole-page horizontal overflow.
- **Verified:** direct `file://` initialization made no HTTP/HTTPS resource requests. Historical assets and data are local, with no CDN, analytics, or runtime LLM API.
- **Verified:** the loopback service and `/api/news` worked at port 8767. Ten additional UI check groups covered six SVG symbols, four sticky jump links, disclosure opening and unobscured headings, news keyboard navigation, three actual RSS headlines, manual refresh, simulated 503 retention with a failure notice, offline behavior, and mobile layout.
- **Reviewed visually:** desktop/mobile layouts, alternative hero images, charts, legend dialog, and news layouts.
- **Verified:** macOS launcher shell syntax and the service entry point. Finder double-click itself was not tested.

Earlier QA fixed the unclickable center of dashed markers and a scroll-position highlighting issue. Image checks wait for disclosed/lazy-loaded images. These fixes predate the repository milestone.

## General-audience copy pass

Before English repository preparation, a rebuilt-data comparison found only eight changed text fields: source attribution/note, private sighting title/scope/note, the 2025 summary, and two story paragraphs. Annual outcomes, event dates, precision, references, candidates, and exclusions were unchanged; annual CSV bytes were identical.

The 13 Node and 5 Python tests passed again, as did the existing browser regression at desktop 1440×1100 and mobile 360×800. Its report had no JavaScript errors or unexpected failed responses. Chrome initially could not launch inside the sandbox; an approved run outside it passed. No fresh historical research, actual RSS refresh, or separate live-news UI run was performed during that copy pass.

## Repository preparation, version 0.3.1

Scope: translate and complete documentation; disclose creator, AI roles and model versions; add version/history metadata and Git exclusions; establish a private source backup. No runtime feature or historical record change is intended.

- **Verified in this milestone:** all 35 runtime/data/test source files match the approved pre-repository baseline byte for byte. An offline rebuild reproduced the same data and website payload.
- **Verified in this milestone:** the 13 Node tests and 5 Python news tests pass. Local Markdown links resolve. All ten Markdown documents use English explanatory prose, preserving Japanese source titles and the existing localized launcher filename where necessary.
- **Reviewed in this milestone:** creator and AI attribution, version evidence, roadmap/implementation separation, and the retained research-input boundary. A bounded scan found no private workstation paths, personal email address, or common credential patterns in the candidate upload. This scan is not a comprehensive security audit.
- **Not rerun in this milestone:** browser UI and live RSS integration. The runtime is byte-identical to the previously tested baseline; this documentation-only change did not justify a fresh live-feed request or full browser run.
- Pre-change files are backed up outside the repository. Git excludes local caches, dependencies, credentials, reports, and backup archives.

## Research review boundaries

The retained 03.2 / 04.2 input and earlier Codex review informed 39 explicit decisions. Three annual outcomes were adopted, 31 candidate years stayed unknown, 2004/2018 date candidates were excluded from precise-date statistics, and the 2013 range was not drawn as a continuous interval. Source-discovery failure does not prove source nonexistence.

The earlier RSS engineering check parsed an actual 100-item Google News response. It did not verify every article's content or demonstrate exhaustive local coverage.

## Untested and limitations

- No GitHub Pages deployment, public-hosting runtime, or scheduled news workflow is verified.
- No full Safari, Firefox, screen-reader, high-contrast, or physical-phone validation. Mobile evidence is Chrome touch emulation.
- No complete check of annual shrine originals or independent scholarly audit. Historical definitions and visual transcription remain limitations.
- No reliable continuous visibility intervals, independent character animation, multi-year daily weather comparison, or future prediction.
- News reads RSS metadata, not article bodies; service coverage and freshness are not guaranteed.
- Ritsu reported satisfaction with the website experience before repository preparation. That is product acceptance, not a claim of exhaustive technical or historical testing.

## Reproduction

From the repository root:

```sh
python3 tools/build-data.py
node --test tests/core.test.cjs
python3 -B tests/news.test.py
```

For historical browser regression, use an existing Playwright installation and Chrome:

```sh
node tests/browser.mjs
```

`PLAYWRIGHT_MODULE` can identify an existing module; `QA_OUTPUT` controls local report/screenshot output. `BASE_URL` overrides the default `file://` page. For live-news UI checks, first start `python3 -B tools/serve.py --port 8767`, then run `node tests/ui-news.mjs` with the same module configuration. No dependency installation is part of normal website use.

Screenshots, raw test reports, and pre-change ZIP backups are held in the local work archive outside this repository. They are intentionally not committed. The private repository is a reproducible source backup, not an archive of all desktop sessions.

## User-facing smoke check

1. Choose 2018: occurrence artwork, date-conflict notes, and the optional legend illustration.
2. Choose 2026: tea-on-shore artwork and notes that distinguish complete freezing from no Omiwatari.
3. Choose 1960: ledger artwork and an unresolved main outcome with candidate notes.
4. Open the overview: orange corners for 2004/2018, markers for all winters, and a horizontally scrollable chart on narrow screens.
5. Use navigation 01–04; inspect all six date-chart symbols. Open news through the local launcher for live retrieval or directly as HTML for a saved snapshot.

## Beta 0.4.0-beta.1 — pre-deployment checks

- Verified: 13 core tests, 5 news tests, and 5 new publication tests pass. Failure recovery preserves the previous successful retrieval time and persists the failed-attempt state; empty success clears items; invalid/future/older fallback snapshots are rejected or ignored.
- Verified: existing desktop/mobile historical and live-news browser suites pass, with no JavaScript errors. The new static-host suite passes ten checks for repository subpaths, same-origin JSON, manual refresh, failure retention, 36-hour stale notice, empty results, version display, and mobile width. Direct-file use still makes no HTTP requests.
- Verified: real local RSS refresh returns three dated items. Historical annual/event/source/coverage/climate/candidate/story datasets remain byte-identical to 0.3.1.
- Reviewed: Public repository visibility and GitHub Actions as the Pages source are confirmed in GitHub settings. Ritsu explicitly authorized making source, research, and documents public and completed GitHub identity verification.
- Deployment and a workflow run are not claimed by these local checks; live results will be recorded separately. The first future daily scheduled invocation remains unobserved until it actually occurs.

## Live beta deployment — 2026-09-20

- Verified: [initial workflow run 35503990540](https://github.com/RitsuTsao/suwa-winter-notebook/actions/runs/35503990540) completed build and deployment successfully for `97f0e9d6684c7d9f1862e8dab8ffd24cbfdebb26`. The actual runner performed the RSS refresh successfully.
- Verified: the public HTTPS website loads at https://ritsutsao.github.io/suwa-winter-notebook/ and displays Beta 0.4.0-beta.1 plus Ritsu/AI credits. Its news JSON returned `ready`, three items, and a successful retrieval timestamp of 2026-09-20T10:03:37Z.
- Verified: the historical browser suite passed against the real Pages URL at desktop 1440×1100 and mobile 360×800 touch emulation, with no JavaScript errors or unexpected failed HTTP responses. News displayed its published timestamp and static-site reload control in the browser.
- Verified: the workflow API reports `active`; the committed schedule is daily at 22:17 UTC. This verifies configuration, not a future scheduled execution. The first daily invocation has not yet been observed; no external watchdog is installed.
- Public hosting and the workflow do not change the historical evidence limits or the untested physical-device/Safari/accessibility boundaries above.
