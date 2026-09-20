import importlib.util
import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0, str(Path(__file__).resolve().parents[1]/'tools'))
import news
spec = importlib.util.spec_from_file_location('publish_news', Path(news.__file__).with_name('publish-news.py'))
publisher = importlib.util.module_from_spec(spec)
spec.loader.exec_module(publisher)


def snapshot(date, items=None):
    return {'status':'ready', 'fetched_at':date, 'items':items or []}

class PublishTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory()
        self.root=Path(self.tmp.name)
        (self.root/'data').mkdir(); (self.root/'dist').mkdir()
        self.patch=patch.object(news,'ROOT',self.root); self.patch.start()
        (self.root/'data/news-feeds.json').write_text(json.dumps([{'id':'test','name':'Test','url':'https://example.org/rss'}]))
        news.save_snapshot(snapshot('2026-01-01T00:00:00+00:00'))
    def tearDown(self):
        self.patch.stop(); self.tmp.cleanup()
    def test_failed_refresh_preserves_latest_deployment_and_persists_failure(self):
        items=[dict(title='Preserved',url='https://example.org/item',publisher='Paper',published_at='2026-01-02T00:00:00Z',feed_id='test')]
        previous=snapshot('2026-01-03T00:00:00Z',items)
        def fail(_): raise OSError('network')
        result=publisher.publish(lambda:previous, fail)
        self.assertEqual(result['status'],'unavailable')
        self.assertEqual(result['items'],items)
        self.assertEqual(result['fetched_at'],previous['fetched_at'])
        self.assertIn('attempted_at',result)
        self.assertEqual(json.loads((self.root/'dist/news.json').read_text()),result)
        self.assertEqual(json.loads((self.root/'data/news.json').read_text()),result)
    def test_successful_empty_feed_clears_previous_items(self):
        result=publisher.publish(lambda:snapshot('2026-01-03T00:00:00Z'),lambda _:[])
        self.assertEqual(result['status'],'ready'); self.assertEqual(result['items'],[])
    def test_missing_previous_site_falls_back_to_repository(self):
        def fail(*args): raise OSError('unavailable')
        result=publisher.publish(fail,fail)
        self.assertEqual(result['fetched_at'],'2026-01-01T00:00:00+00:00')
    def test_rejects_invalid_and_future_snapshots(self):
        self.assertFalse(publisher.valid_snapshot(snapshot('2999-01-01T00:00:00Z')))
        self.assertFalse(publisher.valid_snapshot({'status':'ready','items':[]}))
        bad=dict(title='Bad',url='javascript:alert(1)',publisher='Paper',published_at='2026-01-02T00:00:00Z',feed_id='test')
        self.assertFalse(publisher.valid_snapshot(snapshot('2026-01-03T00:00:00Z',[bad])))
    def test_older_deployment_does_not_replace_repository(self):
        def fail(_):raise OSError('network')
        result=publisher.publish(lambda:snapshot('2025-01-01T00:00:00Z'),fail)
        self.assertEqual(result['fetched_at'],'2026-01-01T00:00:00+00:00')

if __name__=='__main__':unittest.main()
