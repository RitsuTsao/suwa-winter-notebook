# Future roadmap

Version **0.3.1** · 2026-09-20. Creator/producer: **Ritsu**. Planning input: ChatGPT **GPT-5.6 Sol**, integrated by Codex **GPT-6**. See [CREDITS.md](CREDITS.md) for attribution limits.

**All additional product features below are proposals: not implemented, scheduled, or automatically authorized.** The first private repository milestone covers backup, English documentation, and attribution only. A recommendation labeled “ready now” in the original planning package does not expand that scope.

## Repository and eventual publication

| Original ID | Proposed work | Completion criteria and boundary |
| --- | --- | --- |
| R1 | Repository baseline and eventual Pages publication | Private source backup is the current milestone. Public hosting remains separate: confirm visibility, validate repository subpaths, assets, links, and offline use, then authorize deployment |
| R7 | Rights and asset inventory | Separate code, documents, curated data, AI images, and third-party content. Basic attribution is documented now; choosing licenses and clearing public distribution remain future decisions. MIT/CC are options, not applied licenses |
| R5 | Public RSS snapshots | Consider a scheduled GitHub Actions snapshot with at most three items, retrieval/failure/staleness indicators, and independence from historical data. Retain on fetch failure; clear on a valid empty feed. Scheduling requires separate approval |

R5 adapts the existing local news feature to public hosting. No workflow is included in this version. A remotely hosted copy of the current site can only show a saved snapshot and must not be described as automatically updated daily news.

## Data and maintainability

| Original ID | Proposal | Dependencies and acceptance |
| --- | --- | --- |
| R2 | Formal data schemas, data versions, and CI | Preserve existing IDs and adopted statuses; validate references, precision, denominators, and candidate exclusions. Assess migration before redesigning structures |
| R3 | Evidence drawers and source cards | Extend the existing annual notes with clearer source passages, locators, candidate status, and reasons for adoption. Existing notes already exist; the new card interface does not |
| R4 | Future-winter state model | Separate season progress from Omiwatari outcome. “Not started”, “observing”, and “ended” are not annual outcomes. Missing observations must not automatically become non-occurrence |
| R6 | Contribution templates and review process | Consider source leads, corrections, and interface issues. Human review precedes acceptance; no automatic publication of external or AI claims. Maintainer chooses Issues/PR policy |
| M1 | Verify 31 unresolved winters | Work in batches of 3–5 years; test source access first. Delegate research to ChatGPT/Gemini; require a result for every year, including inaccessible/not-found evidence. Never promote unsupported candidates automatically |
| M2 | Daily meteorological data | Add Suwa daily observations, quality flags, station history, and missingness. The planning target of 30 consecutive winters is a research goal, not proof of modeling sufficiency. Two months of monthly statistics cannot stand in for daily observations |

Source categories aid reading; they should not mechanically make an official page outrank every study or make every retrospective account inadmissible. Review the passage's actual support, event meaning, precision, scope, independence, and conflicts. Retain correction/withdrawal reasons. New review fields and version machinery remain proposals.

## Interaction and illustration

| Original ID | Proposal | Dependencies and acceptance |
| --- | --- | --- |
| Product direction | Historical winter scenario explorer | Filter similar historical winters or stay-date scenarios with visible sample sizes and gaps. Even if current data can support an initial version, it is a new feature, not a current-year probability |
| M3 | Interactive cold-condition workbench | Depends on M2. Explore threshold/period changes, accumulated cold, cold streaks, and thaws. Example: FDD = Σ max(0, threshold temperature − daily mean temperature). This is a cold index, not an Omiwatari forecast; missing days are not zero |
| M4 | The life of one record | Use a few traceable examples from original evidence through candidate, review, adoption, and correction. Requires locatable evidence and version history; do not invent the research process |
| M5 | Character layers and gentle animation | Consider page-peeking, legendary walking, tea drinking, unrolling paper, and ledger reading. Retain the three static states; validate narrow screens, performance, and reduced-motion preference |
| M6 | Annual winter letter/card | A shareable edited card with that season's observations and artwork. State precision, uncertainty, and rights. Annual publication and maintenance frequency are not promised |
| Product direction | Quiet lake-side observations | Add a small amount of edited landscape prose, clearly separated from historical facts and legend. Do not fill a missing record with imagined observations |

## Exploratory experiments

| Original ID | Direction | Preconditions and stop conditions |
| --- | --- | --- |
| E1 | Maintainer-operated Imagen artwork generation | Prefer reviewed static assets. Confirm need, character consistency, rights, budget, current official API documentation/pricing, and model availability before integration. Keep credentials out of frontend code. No integration or paid call in this milestone |
| E2 | Visitor-triggered image generation | Low priority. Would need a backend, access control, quotas, caching, abuse handling, and a spending cap. Do not build before the need is demonstrated |
| E3 | Current-season probability model | Begin offline. Define the target and information cutoff; season-end occurrence differs from occurrence in the next few days. Compare simple baselines, regularized models or survival analysis using time-ordered validation, Brier/log loss, calibration, and uncertainty. Do not publish probabilities if evidence is insufficient or baselines are not meaningfully improved |
| E4 | Local observation submissions | Start with small manually reviewed leads. Address date precision, location privacy, photographic consent, and rights. No automatic conversion of submissions into annual outcomes |

The statistical dependency order is historical exploration → cold indicators → validated prediction, not an approved three-stage implementation contract. Do not use LLM guesses as probabilities or treat model output as historical evidence.

## Starting a future iteration

Agree on one scope, required evidence, costs, and visitor-checkable acceptance criteria before work begins. Use relative complexity rather than treating the original AI estimates as delivery commitments. New source research follows the existing ChatGPT/Gemini handoff approach; Codex handles engineering and verification, and Ritsu decides adoption and publication.
