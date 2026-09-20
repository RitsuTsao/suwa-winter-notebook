"""Explicit, offline adoption decisions for the reviewed Gemini v3 handoff.

The input is retained as evidence. This module never applies its recommendations
automatically and never upgrades candidate annual outcomes.
"""
import json


def apply(root, winters, events, sources, event, status):
    raw = json.loads((root / 'data/research-input-gemini-v3.json').read_text())
    assert raw['baseline_id'] == 'suwa-baseline-20260916-v1'
    known = {s['id'] for s in sources}
    for s in raw['sources']:
        if s['source_id'] in known:
            continue
        sources.append(dict(id=s['source_id'], title=s['title'], organization=s['author_or_organization'],
                            url=s['url'], published_date=s['published_date'], pages=s['locator'],
                            accessed_date='2026-09-20', notes={
                                'gemini_s_nagano': '維基所列上游書目；尚未取得版面，不能當已讀原始證據。',
                                'gemini_s006': '二手年度列舉；31 年只保留待核線索，未列出不等於已證明未出現。',
                                'gemini_s004': '補強2026曾全面結冰；原文表示寒氣未持續，不推論連續三日低溫。',
                                'gemini_s001': '2018年新聞：2/1觀察確認、2/5神事與認定；沒有解決2/1與2/2歧異。',
                                'gemini_s002': '2012年回顧：2/3兆候、2/4確認御神渡、2/6神事與認定，分開呈現。',
                                'gemini_s007': '私人觀光彙整表；2004年1/28只列候選，與信州1/29記述並存。',
                                'gemini_s005': '回顧報導明記1987起連續四年未出現；本次採納1987–1989，保留回顧證據層級。'
                            }[s['source_id']]))
    decisions = []
    for y in (1987, 1988, 1989):
        status(y, 'not_observed', ['gemini_s005'], '地方回顧報導明記1987–1990連續四年未出現御神渡，本年為其中之一。',
               '2024年回顧報導的四年完整列舉；非逐日觀察。', ['retrospective_summary'])
        e = event(y, 'season_report', precision='season', title='回顧記載未出現', sources_=['gemini_s005'],
                  note='Gemini找到的回顧報導，經原文審查後採納年度結果；不推定每天湖面冰況。')
        decisions.append(dict(claim_id=f'gemini_c_out_{y}', decision='accepted_annual_outcome', event_id=e['id']))
    candidates = []
    for c in raw['event_claims']:
        if c['claim_id'].startswith('gemini_c_cand_'):
            y = c['winter_year']
            assert winters[y]['omiwatari_status'] == 'unknown'
            candidates.append(dict(claim_id=c['claim_id'], winter_year=y, proposed_outcome=c['outcome'],
                                   review_status='unresolved', source_ids=c['source_ids'], interpretation=c['interpretation']))
            winters[y]['quality_flags'].append('unverified_secondary_candidate')
            winters[y]['research_status'] = 'candidate_unverified'
            winters[y]['notes'].append('找到二手年表線索，但上游原文尚未核實；不納入年度比例或首次日期統計。')
            decisions.append(dict(claim_id=c['claim_id'], decision='candidate_only'))
    assert len(candidates) == 31
    # Reinforce an existing claim, not a second independent observation.
    old = next(e for e in events if e['id'] == '2018-first_observed-6')
    old['source_ids'].append('gemini_s001')
    old['notes'] += ' 2018年市民新聞亦提及2/1觀察確認，2/5才正式認定；歧異仍保留。'
    winters[2018]['source_ids'].append('gemini_s001')
    decisions.append(dict(claim_id='gemini_c003', decision='reinforce_existing_candidate', event_id=old['id']))
    for date, src in [('2004-01-28', 'gemini_s007'), ('2004-01-29', 'shinshu')]:
        e = event(2004, 'first_observed', date, title=f'出現日期記載：{int(date[5:7])}/{int(date[8:])}（待核）',
                  sources_=[src], note='二手回顧的出現日期與另一來源不同；保留候選，不當作已定案首次日期。', exclude=True)
        if src == 'gemini_s007':
            decisions.append(dict(claim_id='gemini_c007', decision='candidate_date_only', event_id=e['id']))
    winters[2004]['source_ids'].append('gemini_s007')
    winters[2004]['quality_flags'].append('first_date_disputed')
    winters[2004]['notes'].append('出現日期有1/28與1/29記載；不以兩點拼成連續區間。')
    for date, kind, title in [('2012-02-04', 'observation_confirmation', '神社確認御神渡冰脊'),
                               ('2012-02-06', 'ceremony', '拝觀神事與認定')]:
        e = event(2012, kind, date, title=title, sources_=['gemini_s002'],
                  note='新聞年表區分2/3兆候、2/4確認及2/6神事；不自動視為首次物理出現日。', exclude=True)
        if kind == 'observation_confirmation':
            decisions.append(dict(claim_id='gemini_c006', decision='accepted_observation_not_first_date', event_id=e['id']))
    winters[2012]['source_ids'].append('gemini_s002')
    e = event(2013, 'sighting', precision='unknown', title='回顧中的日期段（意義待核）', original='2013年1/22～1/28',
              sources_=['shinshu'], note='來源未明示日期段是可見期間或首次日期範圍；不畫區間，不參與住宿日期計算。', exclude=True)
    e['quality_flags'] = ['range_semantics_unresolved']
    decisions.append(dict(claim_id='gemini_c004', decision='retain_text_only', event_id=e['id']))
    old = next(e for e in events if e['id'] == '2026-ice_cover-2')
    old['source_ids'].append('gemini_s004')
    old['notes'] += ' NBS後續報導補強曾全面結冰、寒氣未持續；不用研究回傳中的改寫句冒充原文。'
    winters[2026]['source_ids'].append('gemini_s004')
    decisions.append(dict(claim_id='gemini_c001', decision='reinforce_existing_no_raw_quote', event_id=old['id']))
    assert len(decisions) == len(raw['event_claims'])
    (root / 'data/research-decisions.json').write_text(json.dumps(dict(reviewed_on='2026-09-20',
        input='research-input-gemini-v3.json', decisions=decisions,
        policy='No raw recommendation is automatically applied. Candidate annual results remain unknown.'), ensure_ascii=False, indent=2)+'\n')
    return candidates
