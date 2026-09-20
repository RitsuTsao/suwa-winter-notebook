# Research and production collaboration

Version **0.3.1** · 2026-09-20. Creator and producer: **Ritsu**. See [CREDITS.md](CREDITS.md) for model names, reported configurations, and unrecorded versions.

Ritsu provides product direction and acceptance decisions. ChatGPT and Gemini contribute planning or research; Codex performs engineering, data-adoption review, documentation, and verification. Outputs from another AI are review inputs, not implementation authorization or historical evidence by themselves.

## Historical research handoff

Ritsu commissioned Gemini historical research, specifying Gemini 3.1 Pro with extended thinking. Successive handoffs were reviewed for completeness and evidence quality. The retained input is the 03.2 JSON / 04.2 report round, with an existing Codex review of source support.

The final retained research input contains 39 claims. It provides all 31 requested candidate years, but lacks verified upstream evidence for those years. Rather than asking for another copy of the same unsupported list, the integration adopted three supported retrospective annual outcomes and retained the 31 candidates as unknown. Recognition, ceremony, conflicting dates, and an unresolved date range remain separate.

This was enough to improve the representation of uncertainty, not enough to claim a complete 150-year archive. More text from the same unverified source would not increase evidence strength. Per-claim decisions are in `data/research-decisions.json`.

## RSS discovery: initial unsuccessful round

A separate task was sent to the Gemini desktop application using the UI's Pro / extended-thinking setting. The exact model version for this RSS session was not retained. The request asked for at most three existing public RSS, Atom, or API endpoints, prioritizing Suwa Taisha, Shinshu Citizen News, and Suwa City, with actual URLs, parsed items, dates, links, and coverage. No paid LLM API or private photograph was sent.

The first response lacked an acceptable endpoint and confused Shinshu Citizen News with Nagano Nippo. A follow-up corrected the institution and requested actual HTML feed links from these specific sites:

- Shinshu Citizen News: [shimin.co.jp](https://www.shimin.co.jp/)
- Suwa Taisha: [suwataisha.or.jp](https://suwataisha.or.jp/)
- Suwa City: [city.suwa.lg.jp](https://www.city.suwa.lg.jp/)

Gemini then reported that its environment could not verify the original HTML. Codex's bounded engineering check of those homepages did not find an HTML `link` declaration for RSS/Atom. This was not an exhaustive search of pages, visible links, documentation, or APIs and did not prove that feeds do not exist.

The second local edition therefore deferred news rather than adding an empty placeholder. This is a historical decision; the third edition later integrated a verified aggregator feed.

## RSS discovery: third-edition integration

Ritsu later requested a fourth knowledge category with only the latest three headlines. The same Gemini task was expanded to additional nearby media and municipalities and allowed a Google News RSS fallback. Search-only candidates could be handed off if explicitly labeled as awaiting engineering verification.

No direct institutional feed was verified. Gemini supplied this aggregator candidate:

[Google News RSS: 諏訪市 OR 諏訪地方](https://news.google.com/rss/search?q=%E8%AB%8F%E8%A8%AA%E5%B8%82+OR+%E8%AB%8F%E8%A8%AA%E5%9C%B0%E6%96%B9&hl=ja&gl=JP&ceid=JP:ja)

Codex downloaded and parsed the feed, initially obtaining 100 RSS items, then sorted and retained three with usable dates and links. The website identifies Google News as an aggregator, not an official local newspaper feed. The verification XML was temporary evidence, not a permanent news archive.

Python HTTPS verification encountered a local certificate-chain issue. Downloading was moved to the macOS system curl trust store without disabling TLS validation or installing packages. The service binds only to 127.0.0.1 and uses fixed configured sources; it is not an arbitrary-URL proxy.

The result demonstrates a successful Gemini endpoint handoff followed by engineering validation. It does not establish a general comparison of ChatGPT's and Gemini's research abilities; ChatGPT did not perform the RSS search in this workflow.

## ChatGPT planning and repository handoff

Ritsu supplied the GitHub planning package and subsequently confirmed that it used **GPT-5.6 Sol**. Its product direction, README, roadmap, and decisions documents were reviewed against the actual implementation. Ritsu explicitly deferred all new features.

Codex integrated the proposals into a future roadmap, corrected factual mismatches in startup instructions and source usage, and revised personal-address wording. Ritsu accepted those documents, then authorized a private repository with English documentation and full AI contribution disclosure. Repository preparation uses **Codex / GPT-6**; earlier Codex and image-model versions are not guessed.

## Lessons and ongoing boundaries

Test source access with one example before commissioning a large batch. Require a locatable passage, actual source access status, event/date meaning, and a complete year-by-year result, including failed searches. Separate candidate completeness from evidence sufficiency. Keep idea, recommendation, approved requirement, implementation, and verification distinct.

Ritsu validates product usefulness; this is not equivalent to independently validating every historical source. No tool's confident wording overrides a missing record. No new feature is automatically approved by appearing in an AI planning document.
