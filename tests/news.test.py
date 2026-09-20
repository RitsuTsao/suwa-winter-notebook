import sys
import unittest
from datetime import datetime, timezone
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]/'tools'))
from news import parse_feed, latest_three, NewsService, safe_url

FEED = {'id':'test', 'name':'Test', 'url':'https://example.org/rss'}
NOW = datetime(2026, 9, 20, tzinfo=timezone.utc)
def item(day, url, title=None):
    return f'<item><title>{title or "Headline "+str(day)}</title><link>{url}</link><pubDate>{day:02d} Sep 2026 12:00:00 GMT</pubDate><source>Paper</source></item>'
def rss(items):
    return ('<rss version="2.0"><channel>'+items+'</channel></rss>').encode()

class NewsTests(unittest.TestCase):
    def test_latest_three_sorted_deduplicated_and_safe(self):
        raw=rss(item(15,'https://example.org/one')+item(19,'https://example.org/new')+item(18,'https://example.org/two')+item(17,'https://example.org/three')+item(19,'https://example.org/new?utm_source=x')+item(19,'javascript:alert(1)')+item(25,'https://example.org/future'))
        got=latest_three(parse_feed(raw, FEED, NOW))
        self.assertEqual([x['title'] for x in got],['Headline 19','Headline 18','Headline 17'])
    def test_atom_and_undated(self):
        raw=b'<feed xmlns="http://www.w3.org/2005/Atom"><entry><title>A</title><link href="https://example.org/a"/><updated>2026-09-18T12:00:00Z</updated></entry><entry><title>B</title><link href="https://example.org/b"/></entry></feed>'
        self.assertEqual(len(parse_feed(raw,FEED,NOW)),1)
        with self.assertRaises(ValueError):parse_feed(b'<html/>',FEED,NOW)
        self.assertIsNone(safe_url('https://user:password@example.org'))
    def test_failure_retains_only_snapshot_with_honest_status(self):
        def fail(f):raise OSError('network')
        service=NewsService([FEED],fail,{'items':[{'title':'old'}],'fetched_at':'previous'},False)
        got=service.refresh()
        self.assertEqual(got['status'],'unavailable');self.assertEqual(got['fetched_at'],'previous')
        self.assertEqual(got['items'],[{'title':'old'}])
    def test_success_replaces_not_appends_and_caches(self):
        calls=[]
        def fetch(f):calls.append(1);return parse_feed(rss(item(19,'https://example.org/new')),FEED,NOW)
        service=NewsService([FEED],fetch,{'items':[{'title':'old'}]},False)
        got=service.refresh();self.assertEqual(got['status'],'ready')
        self.assertEqual([i['title'] for i in got['items']],['Headline 19'])
        service.refresh();self.assertEqual(len(calls),1)
    def test_empty_success_clears_old_items(self):
        service=NewsService([FEED],lambda _:[],{'items':[{'title':'old'}]},False)
        got=service.refresh();self.assertEqual(got['status'],'ready');self.assertEqual(got['items'],[])

if __name__=='__main__':unittest.main()
