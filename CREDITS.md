# Credits and AI provenance

Applies to version **0.4.0-beta.1**, prepared on **2026-09-20**.

## Human creator

**Ritsu** — project creator and producer; concept, product direction, requirements, visual preferences, prioritization, decisions about uncertainty, and user acceptance testing. Ritsu also supplied a January 2025 Lake Suwa travel photograph and account as a limited private observation and palette reference. That original photograph is not in this repository and was not uploaded to the image-generation tool in the recorded workflow.

“Created by Ritsu” identifies project ownership and direction. It does not claim that Ritsu independently wrote all code, authored all text, conducted all research, or drew the images.

## AI collaborators and model disclosure

| Tool/session | Model information | Evidence and limit | Work performed |
| --- | --- | --- | --- |
| ChatGPT, GitHub planning package | **GPT-5.6 Sol** | Explicitly confirmed by Ritsu on 2026-09-20; backend snapshot identifier not retained | Product direction, README and roadmap drafts, future feature proposals |
| ChatGPT, earlier concept conversations | Exact model version not recorded | Do not infer it from the later planning session | Initial project ideas and interaction concepts |
| Codex, repository preparation | **GPT-6** | Session-provided model identity; exact deployment/build identifier not exposed | English documentation, attribution records, repository setup, packaging and verification |
| Codex, earlier implementation and integration sessions | Exact model versions not recorded in retained project artifacts | Do not retroactively label all earlier work GPT-6 | Substantial HTML/CSS/JavaScript and Python implementation, source review, data integration, tests, documentation and image-tool orchestration |
| Gemini, historical research handoffs | **Gemini 3.1 Pro + extended thinking** | Ritsu specified this configuration; retained JSON is a research artifact, not independent model telemetry | Historical source research and successive research handoffs |
| Gemini, separate RSS discovery task | Pro / extended thinking; exact model version not recorded | The UI label was recorded during the task | Search for usable RSS endpoints and a Google News fallback |
| OpenAI image generation via Codex `imagegen` | Exact underlying image-model version not exposed in retained records | Tool name is known; model version is not inferred from the tool or image style | Lake artwork, state variants, story vignettes, and an ice-ridge correction |

The names above describe these particular sessions, not current service availability or a platform-wide capability comparison. Extended thinking is a mode label, not a model revision. Unknown version details are disclosed rather than guessed.

## Contribution and evidence boundaries

- Codex produced substantial implementation and documentation; these are not represented as Ritsu's unaided coding or writing.
- The illustrations are AI-generated using project direction and reference-guided editing. Ritsu reviewed the visual direction and accepted the website experience. No claim is made that the illustrations were hand-painted by Ritsu.
- Gemini outputs and ChatGPT proposals are inputs to review, not authoritative evidence or automatic instructions. Accepted facts must have source support; rejected and unresolved claims remain distinguishable.
- The historical review recorded in this project was AI-assisted and source-based. It is not an independent scholarly audit of every original record, and Ritsu's product acceptance is not a claim of full historical verification.
- The runtime website does not call an LLM or image-generation API. The optional news service reads RSS only. AI tools were used during production, not as an undisclosed live dependency.

## Version convention

`VERSION` records the first repository baseline as **0.3.1**: the third local edition plus general-audience copy and English repository documentation. Earlier “first”, “second”, and “third” editions were local deliveries, not existing Git tags or releases. No historical commits, signed authorship attestations, or model identifiers have been fabricated.

Future changes should record the actual AI tool/model when available, the task it performed, the human review performed, and any version information that was not retained. See [CHANGELOG.md](CHANGELOG.md), [COLLABORATION.md](COLLABORATION.md), and [ART-PROMPT.md](ART-PROMPT.md).

## Beta deployment contribution — 0.4.0-beta.1

Ritsu authorized public hosting and automatic news delivery. Codex (GPT-6; exact deployment identifier not exposed) implemented the Pages workflow, snapshot recovery, static-host news behavior, tests, English operations documentation, and release integration. No new image generation, historical research, or LLM runtime was introduced. Earlier model disclosures remain scoped to their recorded sessions.
