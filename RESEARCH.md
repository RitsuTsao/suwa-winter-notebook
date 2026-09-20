# Research, sources, and interpretation

Documentation version **0.4.0-beta.1** · Historical data snapshot **2026-09-20**. Initial source work began on 2026-09-16. Creator: **Ritsu**; AI research and implementation contributions are disclosed in [CREDITS.md](CREDITS.md).

This document reports the retained source-review record. Repository preparation did not conduct a new historical search or independently repeat every earlier source check.

## Sources reviewed and used

1. **Arakawa Hidetoshi (1954), “5世紀に亘る諏訪湖御神渡の研究”, Table 2**, printed pages 196–197 (PDF pages 4–5). The scanned table was visually transcribed for 1877–1954. Decade columns identify starting years; row 0–1 refers to the following winter. Asterisks mark ceremony dates. `あり` establishes annual occurrence only; `明海` and `なし` indicate the source's annual non-occurrence, not an ice-free season. No independent conversion from an old calendar was attempted. Cell references are retained in `data/historical-transcription.json`. [J-STAGE](https://www.jstage.jst.go.jp/article/jgeography1889/63/4/63_4_193/_article/-char/en).
2. **Ishiguro Naoko (2001), record homogeneity study.** Used to flag changes in observers, definitions, and periods; historical records were not assumed equivalent to modern recognition. [Article](https://www.jstage.jst.go.jp/article/grj1984a/74/7/74_7_415/_article).
3. **Ishiguro (2004), “2003年に起きた諏訪湖の御神渡りについて”.** Pages 39 and 41 were visually checked. It lists three recognized occurrence winters in 1990–2003 and explicitly mentions 1978 as a historical example. The 2003 January 11 sighting, January 17 recognition, and January 19 ceremony are separated. [Full text](https://teapot.lib.ocha.ac.jp/record/35564/files/004404.pdf).
4. **[JCDP 2018 field report](https://jcdp.jp/omiwatari-appeared-in-this-winter/).** Reports February 2 appearance, February 4 and 10 photographs, and February 5 ceremony. Nearly complete ice cover was not changed into an exact date of complete freezing.
5. **[とっておき信州](https://shinshu.net/event/omiwata).** The retrieved retrospective list supports annual outcomes for 2004–2013, with original annual-record checking still outstanding. Its February 1 appearance claim for 2018 is retained alongside JCDP's February 2; neither is silently chosen as certain. Broad visibility-period wording without complete daily observations is not converted into a reliable continuous interval.
6. **[JCDP 1998 photograph](https://jcdp.jp/omiwatari/), [Nagano Prefecture](https://www.pref.nagano.lg.jp/suwachi/suwachi-shokan/kanko/omiwatari.html), and [Suwa Tourism Federation](https://www.suwa-tourism.jp/archives/000107.php).** Used for dated sightings, ceremonies, and cultural context; original photographs were not republished.
7. **[Suwa Tourism Association, 2026 announcement](https://www.suwakanko.jp/news/2026/02/06-8季連続の明けの海を宣言/).** February 6 is the publication date; the declaration occurred February 4. Complete ice cover and no Omiwatari can coexist. Its eight-season retrospective supports 2019–2026 outcomes. The 2026 observation scope remains the declaration context, not a claim of daily observations through the entire season.
8. **[Suwa Taisha official shrine introduction](https://suwataisha.or.jp/about/miyamori/).** Used for locations and the deities associated with the four shrines.
9. **[Japan Meteorological Agency, Suwa monthly statistics for 2018](https://www.data.jma.go.jp/stats/etrn/view/monthly_s1.php?prec_no=48&block_no=47620&year=2018&month=&day=&view=).** Only January and February were transcribed. The monthly absolute minimum is not the average daily minimum. No cross-century station homogenization or lake-temperature reconstruction was performed.
10. **January 2025 private travel photograph and account supplied by the project creator.** A month-precision private sighting covering only the photographed area. Public sources separately support the annual outcome. The original photograph is not bundled.

The reviewed Gemini integration also adopted a retrospective account for 1987–1989; its exact source and decision are recorded in `data/sources.json` and `data/research-decisions.json`.

## Gaps and sources not imported

- The first edition left 1955–1989, except 1978, unknown. The second adopted reviewed retrospective evidence for 1987–1989; 31 winters remain unknown.
- The [2024 source-attributed database research abstract](https://www.jstage.jst.go.jp/article/ajg/2024a/0/2024a_28/_article/-char/ja) was readable, but its complete annual electronic table was not obtained.
- A [2018 research chart](https://www.jstage.jst.go.jp/article/ajg/2018s/0/2018s_000131/_pdf) was visually reviewed. Estimated points from the chart were not entered as formal annual records.
- [Figshare lake-ice dataset, version 4](https://doi.org/10.6084/m9.figshare.19146611.v4): metadata was readable, but attempted CSV downloads returned 403 or empty data in the recorded research session. The observations were not imported. Lake-ice phenology is not automatically an Omiwatari appearance date.
- Historical compilation and observer definitions may differ. Visual transcription is not an independent scholarly audit, especially for 1877–1896, where consistency concerns are already documented.
- Complete weather coverage, reliable continuous visibility intervals, and precise modern first dates remain incomplete. Annual shrine originals have not all been checked.

## Data interpretation rules

Annual unknown, disputed annual outcome, and disputed event date are distinct. For 2018, occurrence is accepted while the first date is disputed: it contributes to annual proportions but not accepted precise-date points or the unambiguous first-date CSV column.

Preserve full dates, precision, event type, observation scope, and exclusions. A month-precision sighting is not a month of continuous observation. Separated photographs do not establish an interval. Publication dates do not replace event dates.

Source type informs review but does not mechanically decide which claim wins. Compare the actual passage, event definition, scope, date precision, independence, and conflicting evidence. New material must be reviewed before changing adopted records.

`data/sources.json` stores institutions, titles, pages, publication dates (null when unknown), access dates, URLs, and notes. `data/coverage.json` records the actual coverage and research gaps. Edit the build inputs, rebuild, and run the existing data checks rather than patching generated output alone.

## Gemini research integration, 2026-09-20

The reviewed 03.2 / 04.2 handoff and prior Codex review supported this integration. The handoff's research artifact versions are not model-version identifiers.

- **1987–1989:** accepted a Sustainable Brands retrospective statement about consecutive winters, retaining a retrospective flag rather than treating it as daily observation.
- **1955–1986 except 1978:** retained 31 candidates. Twenty-two are explicit positive entries in a secondary list; nine infer absence from omission. All remain unknown. Absence from a secondary list is not proof of non-occurrence.
- **2004:** January 28 / 29 remain orange outlined date candidates, excluded from precise-date statistics.
- **2012:** February 4 observation/confirmation and February 6 ceremony are separate, without inferring the first physical appearance.
- **2013:** January 22–28 is retained as unresolved original range wording, not a continuous visibility band or stay-calculation interval.
- **2018:** the February 1 claim strengthens an existing candidate rather than adding a second independent observation; its conflict with February 2 remains.
- **2026:** the account of complete ice cover and nonpersistent cold was retained as supported paraphrase; an inaccurate quoted passage in the research input was not adopted.

All 39 research claims have explicit decisions in `data/research-decisions.json`. The raw input is retained for reproducibility and audit, not directly loaded as accepted frontend data. The resulting coverage is 119 known outcomes (80 occurrence, 39 not observed), 31 unknown, 27 accepted precise appearance dates, and zero reliable continuous visibility intervals.

## Artwork and rights boundaries

The lake and characters are AI-generated contemporary illustrations. They do not reconstruct traditional deity images, historical shorelines, or particular years. Three state panoramas and two vignettes were integrated in the second edition; the earlier lake image remains as a retained asset. Prompts and asset information are in [ART-PROMPT.md](ART-PROMPT.md).

The creator's private photo informed the palette but was not uploaded to the image-generation tool or bundled. No third-party news photograph, paper scan, full article, or external font is included. Source interpretation is primarily paraphrased; provenance remains recorded. Third-party materials retain their own rights. A license associated with one research source cannot be assumed to cover all sources or project assets.

Historical runtime resources are local, without tracking or CDN requests. The optional third-edition news service contacts a public RSS feed, not an LLM API. The project's own reuse licenses remain undecided.
