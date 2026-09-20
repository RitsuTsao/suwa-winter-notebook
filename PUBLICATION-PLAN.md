# Beta publication decisions

Version **0.4.0-beta.1** · 2026-09-20. Creator/producer: **Ritsu**; implementation: **Codex / GPT-6**. See [CREDITS.md](CREDITS.md).

Ritsu reviewed the private repository and requested public beta hosting plus automatic updates. GitHub's settings required an account upgrade or public repository for Pages; Ritsu explicitly selected **make the existing repository public**, including its code, research, and documentation.

The approved beta scope is Pages hosting and scheduled RSS snapshots. It does not authorize automatic historical adoption, forecasting, new illustrations, live AI APIs, or a new reuse license. Only `dist/` is uploaded as the website artifact; repository files remain visible as explicitly approved. Private photos, credentials, and workstation backups remain excluded.

A daily 22:17 UTC workflow tests the data, recovers the previous deployed snapshot, fetches the fixed RSS source, and publishes the site. No external deployment credential is added: GitHub's job-scoped token has read-only repository access and Pages/OIDC permissions only in the deployment job. The workflow does not write commits. See [OPERATIONS.md](OPERATIONS.md).

Deployment, local tests, and future scheduled execution are separately recorded in [VERIFICATION.md](VERIFICATION.md). Reuse licensing remains undecided; no MIT/CC license was silently applied.

## Prior private-backup milestone and planning corrections


Version **0.3.1** · 2026-09-20. Project creator: **Ritsu**. AI attribution: [CREDITS.md](CREDITS.md).

## Historical decision: repository 0.3.1

- Repository: `RitsuTsao/suwa-winter-notebook` under Ritsu's verified GitHub account.
- Visibility: **Private**, explicitly chosen by Ritsu.
- Purpose: source backup, provenance, and future development; not a public website launch.
- Documentation: English, with relevant Japanese names and original source titles. Website interface and research records retain their existing languages.
- First repository baseline: **0.3.1**. Prior local editions are described in CHANGELOG, not fabricated as old commits or tags.
- No public Pages deployment, GitHub Actions schedule, API integration, or new product features in this milestone.
- No reuse license selected. Do not silently apply MIT or Creative Commons.

Source files, generated offline data, reviewed research input and decisions, artwork, tests, and documentation belong in the backup. Credentials, private photos, local caches, test reports, and work-directory backups do not. Research input required for reproducibility must not be removed merely because it contains rejected claims; its status must remain explicit.

## Planning-package integration

The four supplied ChatGPT documents (PRODUCT-DIRECTION, ROADMAP, README, DECISIONS) were proposals. Ritsu approved content corrections and a future roadmap, then authorized private repository creation. The planning package itself was not treated as permission to add features.

| Planning content | Resolution |
| --- | --- |
| Placeholder startup, dependency, and test instructions | Replaced with actual local commands and documented test boundaries |
| Links to nonexistent documentation or deployed site | Replaced with existing files; no invented website URL |
| Source discovery entries that might look like imported data | Clarified that Figshare observations were not obtained or imported |
| Fixed A–E evidence ranking | Not adopted as an automatic override; evaluate event meaning, precision, scope, independence, and conflicting evidence |
| Retain old RSS items for both errors and empty feeds | Corrected to implemented behavior: retain on failure, clear on a valid empty result |
| Schemas, future seasons, source cards, statistical interactions, and AI APIs | Deferred to ROADMAP, including ideas described as “ready now” |
| Model availability, pricing, licenses, and maintenance frequency | No unsupported current claims or implied commitments; revisit when a relevant feature is authorized |

The supplied planning originals remain in the local pre-repository work archive. This repository contains the integrated English documentation, not an unreviewed copy of those recommendations.

## Original publication checklist (superseded by the beta decisions above)

Confirm public visibility and separate rights treatment for code, documentation, curated data, artwork, and third-party material. Review the source/asset inventory and quotations before distributing publicly. Community policies, issue templates, API budgets, and a maintenance schedule are not automatically activated by creating this private backup.

A future Pages deployment must test the real repository subpath, assets, navigation, year/stay controls, CSV downloads, source links, and mobile layout. Local tests do not prove a hosted deployment.

The optional Python RSS service will not execute on Pages. Choose either an explicitly dated static snapshot or a separately authorized R5 snapshot-update workflow. Before publication, revise the remote snapshot message if it misleadingly implies that the visitor's own network is offline. Until such a workflow is implemented, do not promise daily automatic news updates.

## Local preservation

The pre-repository project was archived outside this repository before documentation changes. The repository remains in the existing local project directory, preserving the original launcher and runtime paths. The first remote push must be checked against the local commit, and Private visibility must be verified on GitHub.
