"""Build a source-attributed offline dataset. No inferred daily visibility intervals."""
import json,csv,re,runpy
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
TODAY='2026-09-16'
sources=[]
def source(id,title,org,url,date=None,pages=None,note=''):
 sources.append(dict(id=id,title=title,organization=org,url=url,published_date=date,pages=pages,accessed_date=TODAY,notes=note))
source('arakawa1954','5世紀に亘る諏訪湖御神渡の研究・第2表','荒川秀俊／地學雜誌', 'https://www.jstage.jst.go.jp/article/jgeography1889/63/4/63_4_193/_article/-char/en','1954-12-30','196–197（PDF 第4–5頁）','逐格視覺轉錄第2表。欄首為冬季起始年；列0〜1對應翌年。星號是拝觀日；あり只有有無，明海／なし記未出現。原表使用西曆與羅馬月份，未自行換算舊曆。')
source('ishiguro2001','諏訪湖の御神渡り記録に関する気候復元資料としての均質性','石黒直子／地理學評論','https://www.jstage.jst.go.jp/article/grj1984a/74/7/74_7_415/_article','2001','415–423','不同觀測時期、團體與定義不能視為完全均質。')
source('ishiguro2004','2003年に起きた諏訪湖の御神渡りについて','石黒直子／お茶の水地理44','https://teapot.lib.ocha.ac.jp/record/35564/files/004404.pdf','2004','39、41–42','作者現場調查；1990–2003僅1991、1998、2003有公認御神渡。1/11非官方目擊、1/17公認、1/19拝觀分開。')
source('mikami2018','Omiwatari appeared in this winter!','三上岳彦／JCDP','https://jcdp.jp/omiwatari-appeared-in-this-winter/','2018-02-06',note='網頁另有2/10照片補記，補記日期未標。首次出現2/2；照片目擊2/4與2/10；神事2/5。')
source('jcdp2017','Omiwatari at Lake Suwa','三上岳彦／JCDP','https://jcdp.jp/omiwatari/','2017-12-27',note='文中照片為作者1998/1/31拍攝。')
source('tourism','御神渡り','諏訪觀光連盟（資料提供：八劔神社、諏訪市博物館）','https://www.suwa-tourism.jp/archives/000107.php',note='文化介紹及2018/2/5拝觀神事。')
source('suwa2026','諏訪湖 御神渡り観測 8季連続の“明けの海”を宣言','諏訪觀光協會','https://www.suwakanko.jp/news/2026/02/06-8季連続の明けの海を宣言/','2026-02-06',note='公告報導宣告發生在2/4；連續8季作為2019–2026回顧依據；明記2026曾全面結冰，並未給結冰日期。當季結論的觀察範圍截至2/4。')
source('nagano','諏訪湖の御神渡り','長野縣諏訪地域振興局','https://www.pref.nagano.lg.jp/suwachi/suwachi-shokan/kanko/omiwatari.html','2025-12-23',note='2018/2/7職員照片、2023/2/4明けの海宣告；岸邊安全及神事說明。照片未轉載。')
source('shinshu','御神渡り','とっておき信州（地方觀光資訊）','https://shinshu.net/event/omiwata',note='補充來源；列1990年後出現年1991、1998、2003、2004、2006、2008、2012、2013、2018。年度有無用於2004–2013；另保留2018年2/1出現異說，與JCDP的2/2並列排除日期統計；仍待逐年原帳核對。')
source('suwa-taisha','四つの神社','諏訪大社','https://suwataisha.or.jp/about/miyamori/',note='四社方位及祭神配置。')
source('hasegawa2024','諏訪湖の結氷・御神渡り記録の出典付データベース','長谷川直子、平野淳平、三上岳彦／日本地理學會','https://www.jstage.jst.go.jp/article/ajg/2024a/0/2024a_28/_article/-char/ja','2024-10-01',note='已讀公開摘要；提到1444–2024資料庫，但頁面無完整電子附錄，未取得逐年表。')
source('figshare2022','Long-term ice phenology records for 78 lakes in the Northern Hemisphere v4','Sharma 等／Figshare','https://doi.org/10.6084/m9.figshare.19146611.v4','2022',note='metadata已讀，CC BY 4.0；PhenologyData.csv多個官方下載入口本次回403或空檔，未匯入任何資料。不可當作御神渡出現資料。')
source('mikami-graph','気候変動による諏訪湖「御神渡」発生頻度の激減','三上岳彦、平野淳平／日本地理學會','https://www.jstage.jst.go.jp/article/ajg/2018s/0/2018s_000131/_pdf','2018',note='讀取並視覺查看全文，僅圖形年度記號，未將圖上估讀值填入缺漏年。')
source('jma2018','諏訪 2018年（月ごとの値）主な要素','日本氣象廳','https://www.data.jma.go.jp/stats/etrn/view/monthly_s1.php?prec_no=48&block_no=47620&year=2018&month=&day=&view=',note='僅轉錄1、2月月均溫與月內最低氣溫；實測站資料，非湖冰重建。')
source('user2025','2025年1月諏訪湖旅行照片與說明','專案發起者（私人目擊）',None,'2025-01',note='專案發起者提供的私人觀察：湖面結冰、沒有御神渡。只記部分湖面目擊，未指定日，也不能推出全面結冰；照片未打包或上傳。年度御神渡判定另據公開來源。')
winters={y:dict(winter_year=y,omiwatari_status='unknown',ice_cover_status='unknown',events=[],notes=[],source_ids=[],quality_flags=[],research_status='searched_gap',summary='已查找公開研究與紀錄，這一年的御神渡結果仍待逐年原始資料核對。',observation_scope='尚無足夠逐年資料',visibility_intervals=[]) for y in range(1877,2027)}
events=[]
def event(year,kind,start=None,end=None,precision='day',title='',sources_=None,note='',original='',scope='依所列來源的觀察或記載',exclude=False):
 id=f'{year}-{kind}-{len(winters[year]["events"])+1}'
 e=dict(id=id,winter_year=year,event_type=kind,date_start=start,date_end=end or start,date_precision=precision,title=title,original_date_text=original,source_ids=sources_ or [],observation_scope=scope,notes=note,exclude_from_statistics=exclude)
 events.append(e);winters[year]['events'].append(id);return e
def status(y,value,sources_,summary,scope='',flags=None):
 w=winters[y];w.update(omiwatari_status=value,source_ids=sources_,research_status='reviewed_with_limits',summary=summary,observation_scope=scope,quality_flags=flags or [])
# Visual transcription: table column 1870 entries 1870/71 ... 1879/80.
# Tokens preserve original distinction: A=あり, M=明海, N=なし, *=拝觀日.
columns={
1870:['1-25','1-26','A','A','A','A','A','A','A','M'],
1880:['A','A','A','A','A','A','A','A','A','M'],
1890:['A','A','1-21*','1-30*','1-28*','2-14*','1-27*','1-19*','1-28*','2-8*'],
1900:['1-30*','1-26*','2-16*','1-9*','1-12*','1-29*','1-27*','1-18*','1-24*','2-15*'],
1910:['1-23*','2-8*','1-30*','N','1-24*','M','1-23*','1-31*','1-9*','1-27*'],
1920:['2-5*','1-27*','1-24*','1-30','1-17','1-7','12-28','1-8','1-5','1-11'],
1930:['1-18','M','1-16','1-10','2-9','12-31','N','1-9','1-8','1-22'],
1940:['2-5','1-22','1-8','1-19','1-5','1-3','1-8','12-24','M','1-13']}
transcribed=[]
for decade,tokens in columns.items():
 for i,token in enumerate(tokens):
  y=decade+i+1
  if y not in winters:continue
  transcribed.append(dict(winter_year=y,source_column=decade,source_row=f'{i}〜{i+1 if i<9 else 0}',token=token))
for y,token in [(1951,'1-9'),(1952,'1-19'),(1953,'N'),(1954,'1-27')]:transcribed.append(dict(winter_year=y,source_column='explicit',source_row=f'{y-1}–{y}',token=token))
for row in transcribed:
 y=row['winter_year'];t=row['token'];w=winters[y]
 no=t in ['M','N'];star=t.endswith('*')
 status(y,'not_observed' if no else 'occurred',['arakawa1954'], '1954 年彙編的第 2 表，將這個冬季記為「'+('明海' if t=='M' else 'なし' if t=='N' else 'あり' if t=='A' else '有御神渡紀錄')+'」。','1954 年彙編的一の御神渡年度記錄；非現代統一認定。',['historical_compilation','definitions_vary']+(['early_definition_caution'] if y<=1896 else []))
 w['notes'].append('此年依歷史彙編記載呈現；當時的觀測者、方法與現代未必相同。')
 if no:
  event(y,'season_report',precision='season',title='文獻記為未出現',sources_=['arakawa1954'],original='明海' if t=='M' else 'なし',note='僅表示來源中的年度結果；不自行推定整季湖面從未結冰。')
 elif t=='A':
  event(y,'season_report',precision='season',title='有御神渡，日期未載',sources_=['arakawa1954'],original='あり',note='表例說明：あり表示有御神渡，但起日未傳。')
 else:
  month,day=map(int,t.rstrip('*').split('-'));date=f'{y-1 if month==12 else y}-{month:02}-{day:02}'
  orig=f'{day} '+{1:'I',2:'II',12:'XII'}[month]+('＊' if star else '')
  event(y,'ceremony' if star else 'first_observed',date,title='拝觀日（歷史記載）' if star else '一の御神渡日期（歷史記載）',sources_=['arakawa1954'],original=orig,note='原表星號明示為拝觀日；御神渡可能在此前出現，不能把此日當首次出現。' if star else '第2表的一の御神渡日期，屬文獻記載；未取得連續可見期間。')
  w['notes'].append('未取得冰脊連續可見的起訖；日期不是整段觀賞期間。')
# Modern published field study supports all season outcomes 1990–2003.
for y in range(1990,2004):
 yes=y in [1991,1998,2003]
 status(y,'occurred' if yes else 'not_observed',['ishiguro2004'],('研究回顧記載，這個冬季有公認御神渡。' if yes else '研究回顧列出 1990–2003 年只有三個出現年；本年不在其中。'),'石黑（2004）對1990–2003公認御神渡的完整列舉。')
 event(y,'season_report',precision='season',title='有公認御神渡紀錄' if yes else '回顧中未列為出現年',sources_=['ishiguro2004'])
for y in range(2004,2014):
 yes=y in [2004,2006,2008,2012,2013]
 status(y,'occurred' if yes else 'not_observed',['shinshu'], '地方觀光資訊的年度回顧記為'+('有御神渡。' if yes else '未出現御神渡。'),'とっておき信州完整列舉1990年後出現年；本段仍待逐年神社原帳補核。',['secondary_annual_summary'])
 event(y,'season_report',precision='season',title='年度回顧：'+('有出現' if yes else '未出現'),sources_=['shinshu'],note='此來源僅支援年度結果，未據此填入首次日期。')
for y in range(2014,2018):
 status(y,'not_observed',['mikami2018'],'2018 年的研究者報導指出，御神渡是相隔五年再次出現；本年屬其間未出現的冬季。','JCDP 2018年相隔五年再現的回顧。',['retrospective_summary'])
 event(y,'season_report',precision='season',title='回顧記載未出現',sources_=['mikami2018'])
status(2018,'occurred',['mikami2018','tourism','nagano'],'2 月 2 日，御神渡相隔五年再次出現。2 月 5 日舉行拝觀神事；另有幾天留下了照片目擊。','研究者報導、官方神事記載與指定日期照片。')
winters[2018]['ice_cover_status']='near_complete_observed'
event(2018,'first_observed','2018-02-02',title='御神渡出現',sources_=['mikami2018'],original='February 2, 2018',note='研究者報導的出現日期；與2/5神事日分開。')
event(2018,'sighting','2018-02-04',title='研究者的照片目擊',sources_=['mikami2018'],scope='赤砂崎、高木的照片目擊',note='只確認拍攝當日；不補齊到下一次目擊之間的日子。')
event(2018,'ceremony','2018-02-05',title='拝觀神事',sources_=['tourism','mikami2018'],note='神事日期不能代替首次出現日期。')
event(2018,'sighting','2018-02-07',title='縣方職員的照片目擊',sources_=['nagano'],note='官方頁面的照片日期；照片本身未轉載。')
event(2018,'sighting','2018-02-10',title='後續照片目擊',sources_=['mikami2018'],scope='赤砂崎照片',note='只確認此日目擊，不推定最後可見日。')
winters[2018]['notes']=['已知2/4、2/7、2/10有照片目擊；不能把分散目擊連成確定可見帶。','本版未取得連續觀測的消失日或可見期間。']
for y in range(2019,2027):
 status(y,'not_observed',['suwa2026'],'諏訪觀光協會的 2026 年公告記載連續八季「明けの海」，本年為其中之一。','2019–2025由連續八季公告回顧；2026為截至2/4的神社宣告。',['retrospective_summary'] if y<2026 else ['declaration_scope_not_full_season'])
 event(y,'season_report',precision='season',title='明けの海',sources_=['suwa2026'],note='御神渡未出現，不等於沒有結冰。')
winters[2026]['ice_cover_status']='complete_observed';winters[2026]['summary']='這一季曾全面結冰。八剱神社在 2 月 4 日宣告「明けの海」，觀光協會於 2 月 6 日報導。'
event(2026,'ice_cover',precision='season',title='曾全面結冰（日期未載）',sources_=['suwa2026'],note='公告明記全面結冰，未給確切日期。')
event(2026,'declaration','2026-02-04',title='宣告「明けの海」',sources_=['suwa2026'],note='2/6是公告刊登日，本文記載宣告發生在2/4。此為當時判斷，未把宣告日期外推成整季每日紀錄。')
event(2023,'declaration','2023-02-04',title='宣告「明けの海」',sources_=['nagano'])
winters[2023]['source_ids'].append('nagano')
winters[2025]['ice_cover_status']='partial_observed';winters[2025]['source_ids'].append('user2025');winters[2025]['summary']='御神渡未出現的冬季，湖面仍可能結冰。一份一月的私人旅行照片記錄，留下了局部湖面結冰的片刻。'
event(2025,'personal_sighting','2025-01-01','2025-01-31',precision='month',title='一月湖畔的私人目擊',sources_=['user2025'],note='私人旅行照片與說明：湖面有冰、無御神渡。日期未指定；只支援當時部分湖面，不代表全面結冰。',scope='照片取景範圍內的湖面，私人目擊',exclude=True)
event(1998,'sighting','1998-01-31',title='研究者拍攝御神渡',sources_=['jcdp2017'],note='照片日期可確認目擊，不代表首次出現。');winters[1998]['source_ids'].append('jcdp2017')
event(2003,'sighting','2003-01-11',title='研究者目擊冰脊（未公認）',sources_=['ishiguro2004'],note='作者在茶臼山方向確認冰脊；當時尚非神社公認。',scope='作者現場觀察',exclude=True)
event(2003,'recognition','2003-01-17',title='八剱神社公認',sources_=['ishiguro2004'],note='論文第41頁明記1/17公認，1/19拝觀。不是首次物理出現日。')
event(2003,'ceremony','2003-01-19',title='拝觀儀式',sources_=['ishiguro2004'])
winters[2003]['summary']='研究者在 1 月 11 日已見到冰脊；1 月 17 日神社公認，19 日舉行拝觀。自然現象、認定與神事各有自己的日期。'
winters[2003]['notes']=['論文開頭概述1/19正式承認，後文第41頁區分1/17公認與1/19拝觀；本版按詳細記述分列。','這次目擊不是完整的首次出現時間或連續可見期間。']
# Preserve conflicting appearance claims; neither becomes a precise statistical sample.
winters[2018]['source_ids'].append('shinshu')
winters[2018]['quality_flags'].append('first_date_disputed')
winters[2018]['summary']='這年有御神渡，2 月 5 日舉行拝觀神事。首次出現有 2 月 1 日與 2 日兩種記載；後續照片則留下了幾個可確認的片刻。'
winters[2018]['notes']=['JCDP 研究者報導記 2/2 出現；地方觀光回顧記 2/1。此差異尚未由逐日原帳釐清，兩筆保留，均不納入精確出現日期統計。','來源亦有廣泛可見期間敘述，但本版未取得逐日連續觀測，仍只呈現可確認的單次照片。']
for e in events:
 if e['winter_year']==2018 and e['event_type']=='first_observed':
  e['title']='出現日期記載：2/2（待核）'
  e['exclude_from_statistics']=True
  e['notes']='JCDP 研究者報導記為 2/2，另有地方觀光回顧記為 2/1；差異尚未釐清，不納入精確日期統計。2/5另為神事。'
event(2018,'first_observed','2018-02-01',title='出現日期記載：2/1（待核）',sources_=['shinshu'],note='地方觀光回顧記為 2/1，與 JCDP 報導的 2/2 不同；不是另一次獨立目擊，保留異說，不納入精確日期統計。',exclude=True)
# Explicit historical mention in the 2003 field report, not extrapolated graph markers.
status(1978,'occurred',['ishiguro2004'],'2003 年神事回顧中，1978 年被列為過去相似的御神渡案例。','論文第41頁對過去御神渡案例的明示。',['retrospective_mention'])
event(1978,'season_report',precision='season',title='神事回顧中的過往案例',sources_=['ishiguro2004'])
climate=dict(stations=[dict(id='47620',name='諏訪',organization='日本氣象廳',measurement='observed',units='°C',notes='站點實測月統計，非湖冰反演；本版未匯入站址沿革，不作跨世紀均質性比較。')],records=[])
for m,mean,minimum in [(1,-1.3,-11.3),(2,-1.1,-11.3)]:climate['records'].append(dict(winter_year=2018,period=f'2018-{m:02}',resolution='month',station_id='47620',mean_temperature=mean,absolute_min_temperature=minimum,unit='°C',measurement='observed',quality_flags=[],source_ids=['jma2018']))
stories=[
dict(id='legend',tab='兩位神明',title='冰上的路，傳說中的相會',kind='傳說',paragraphs=['地方傳說將湖面隆起的冰脊，看作建御名方神前往八坂刀売神處留下的路。望向湖面時，也可以把這段故事當作另一種閱讀風景的方式。','畫面中的兩位小人物是當代創作：衣著、道具、表情都不是傳統神像或史實復原。祂們在岸邊陪伴，並不操控當年的天氣。'],source_ids=['tourism']),
dict(id='shrines',tab='湖的南北',title='隔著湖的四座社',kind='地方資料',paragraphs=['諏訪大社的上社在湖南側，下社在湖北側。兩邊又各有兩座社；祭神配置比「一邊男神、一邊女神」更豐富。'],shrines=[['南側 · 上社前宮','八坂刀売神'],['南側 · 上社本宮','建御名方神'],['北側 · 下社春宮','建御名方神、八坂刀売神、八重事代主神'],['北側 · 下社秋宮','建御名方神、八坂刀売神、八重事代主神']],source_ids=['suwa-taisha']),
dict(id='observers',tab='記錄的人',title='天亮以前，走到湖邊',kind='觀測與神事',paragraphs=['御神渡的觀察、認定與神事，有八剱神社及當地記錄者的長期參與。湖水結冰、冰脊出現、獲得認定與舉行拝觀，是相連卻不同的事件。','有的古老記錄只留下神事日期，有的年份只記「あり」。這本觀測冊保留這些差別，讓每個日期所代表的事件更清楚。','「明けの海」在當代年度公告中指未出現御神渡；湖面仍可能曾結冰。2026 年的公告便同時記載全面結冰與未出現御神渡。'],source_ids=['nagano','ishiguro2004','suwa2026'])]
candidates=runpy.run_path(str(ROOT/'tools/reviewed-research.py'))['apply'](ROOT,winters,events,sources,event,status)
coverage=dict(as_of='2026-09-20',target_start=1877,target_end=2026,total_winters=150,known_outcomes=sum(w['omiwatari_status'] in ['occurred','not_observed'] for w in winters.values()),precise_appearance_years=sum(any(e['winter_year']==y and e['event_type']=='first_observed' and e['date_precision']=='day' and not e['exclude_from_statistics'] for e in events) for y in winters),visible_interval_years=0,climate_periods=['2018-01','2018-02'],unknown_years=[y for y,w in winters.items() if w['omiwatari_status']=='unknown'],gaps=['1955–1986除1978外的31年，已有二手年表候選，仍未核實上游資料；主表維持未知。1987–1989採納已核對的回顧報導。','早期資料依1954彙編；1877–1896尤需注意來源及定義，1893–1923多為拝觀日。','2004–2013年度有無採地方觀光回顧，已明示補充來源，逐年神社原帳仍待補核。','2004出現日有1/28、1/29候選，2018有2/1、2/2異說；皆保留但排除精確日期統計，年度有出現的結果沒有歧異。','未取得任何可靠的連續可見期間；分散照片只當單次目擊。','氣象僅匯入2018年1、2月，尚未做跨年氣候比較、逐日低溫累積或未出現年份的氣象分析。','Figshare metadata可讀，但實際CSV下載遭403或空檔；未將其當御神渡資料使用。'],method='歷史有無依逐年明示記錄；拝觀與首次出現分開。數字是來源所載結果，不保證150年定義均質。',search_log=[dict(source_id=s['id'],result=s['notes']) for s in sources if s['id'] in ['arakawa1954','ishiguro2001','hasegawa2024','figshare2022','mikami-graph']])
for w in winters.values():
 w['events'].sort(key=lambda id:next((e['date_start'] or '9999') for e in events if e['id']==id))
 if not w['notes']:w['notes']=['尚未取得精確首次出現日或連續可見期間。']
 if w['omiwatari_status']=='unknown':w['source_ids']=['ishiguro2001','hasegawa2024','mikami-graph','gemini_s006','gemini_s_nagano']
data=dict(winters=list(winters.values()),events=events,sources=sources,climate=climate,stories=stories,coverage=coverage,candidates=candidates)
for key,value in data.items():(ROOT/'data'/f'{key}.json').write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
(ROOT/'data'/'historical-transcription.json').write_text(json.dumps(transcribed,ensure_ascii=False,indent=2)+'\n')
(ROOT/'dist'/'data.js').write_text('window.SUWA_DATA = '+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n')
with open(ROOT/'data'/'winters.csv','w',newline='',encoding='utf-8-sig') as f:
 fields=['winter_year','omiwatari_status','ice_cover_status','first_appearance_date','event_ids','source_ids','quality_flags','research_status','notes']
 writer=csv.DictWriter(f,fieldnames=fields);writer.writeheader()
 for w in winters.values():
  first=next((e['date_start'] for e in events if e['winter_year']==w['winter_year'] and e['event_type']=='first_observed' and not e['exclude_from_statistics']),None)
  writer.writerow(dict(winter_year=w['winter_year'],omiwatari_status=w['omiwatari_status'],ice_cover_status=w['ice_cover_status'],first_appearance_date=first or '',event_ids=';'.join(w['events']),source_ids=';'.join(w['source_ids']),quality_flags=';'.join(w['quality_flags']),research_status=w['research_status'],notes='；'.join(w['notes'])))
print(json.dumps({k:coverage[k] for k in ['known_outcomes','precise_appearance_years','visible_interval_years','unknown_years']},ensure_ascii=False))
