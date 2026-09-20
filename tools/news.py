"""Fixed-source RSS/Atom ingestion; retain only the latest three headlines, no LLM."""
from datetime import datetime, timezone, timedelta
from email.utils import parsedate_to_datetime
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit, parse_qsl, urlencode
import json
import subprocess
import shutil
import re
import threading
import time
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
MAX_BYTES = 2_000_000
CACHE_SECONDS = 900
ATOM = '{http://www.w3.org/2005/Atom}'


def safe_url(value):
    try:
        u = urlsplit(value.strip())
        if u.scheme not in ('https', 'http') or not u.hostname or u.username or u.password:
            return None
        return u.geturl()
    except (ValueError, AttributeError):
        return None


def parse_date(value):
    try:
        d = parsedate_to_datetime(value)
    except (TypeError, ValueError):
        try:
            d = datetime.fromisoformat(value.replace('Z', '+00:00'))
        except (ValueError, AttributeError):
            return None
    # Undated or ambiguous-time items cannot honestly rank as the latest.
    return d.astimezone(timezone.utc) if d.tzinfo else None


def canonical_url(value):
    u = urlsplit(value)
    pairs = [(k, v) for k, v in parse_qsl(u.query) if not k.lower().startswith('utm_') and k not in ('oc',)]
    return urlunsplit((u.scheme, u.netloc.lower(), u.path, urlencode(pairs), ''))


def parse_feed(raw, feed, now=None):
    if len(raw) > MAX_BYTES:
        raise ValueError('feed too large')
    root = ET.fromstring(raw)
    now = now or datetime.now(timezone.utc)
    if root.tag == 'rss':
        entries = root.findall('./channel/item')
        atom = False
    elif root.tag == ATOM + 'feed':
        entries = root.findall(ATOM + 'entry')
        atom = True
    else:
        raise ValueError('not RSS or Atom')
    items = []
    for e in entries:
        if atom:
            title = e.findtext(ATOM + 'title', '')
            links = [a.get('href', '') for a in e.findall(ATOM + 'link') if a.get('rel', 'alternate') == 'alternate']
            link = links[0] if links else ''
            date = e.findtext(ATOM + 'published') or e.findtext(ATOM + 'updated')
            publisher = feed['name']
        else:
            title, link = e.findtext('title', ''), e.findtext('link', '')
            date = e.findtext('pubDate') or e.findtext('{http://purl.org/dc/elements/1.1/}date')
            publisher = e.findtext('source') or feed['name']
        link, published = safe_url(link), parse_date(date)
        title = re.sub(r'\s+', ' ', title).strip()
        if not link or not title or not published or published > now + timedelta(minutes=5):
            continue
        suffix = ' - ' + publisher
        if title.endswith(suffix):
            title = title[:-len(suffix)]
        items.append(dict(title=title[:500], url=link, publisher=publisher[:150],
                          published_at=published.isoformat(), feed_id=feed['id']))
    return items


def latest_three(items):
    result, seen = [], set()
    for item in sorted(items, key=lambda x: parse_date(x['published_at']), reverse=True):
        key = canonical_url(item['url'])
        titlekey = (item['publisher'], item['title'])
        if key in seen or titlekey in seen:
            continue
        seen.update((key, titlekey))
        result.append(item)
        if len(result) == 3:
            break
    return result


def fetch_feed(feed):
    # macOS system curl uses the OS certificate trust store; never disable TLS validation.
    curl = '/usr/bin/curl' if Path('/usr/bin/curl').exists() else shutil.which('curl')
    if not curl:
        raise RuntimeError('curl unavailable')
    raw = subprocess.check_output([curl, '--fail', '--silent', '--show-error', '--location',
        '--proto', '=https', '--proto-redir', '=https', '--max-time', '12',
        '--max-filesize', str(MAX_BYTES), '--user-agent', 'SuwaWinterNotebook/3.0 (RSS reader)',
        feed['url']], timeout=15, stderr=subprocess.PIPE)
    return parse_feed(raw, feed)


def load_snapshot():
    try:
        return json.loads((ROOT / 'data/news.json').read_text())
    except (FileNotFoundError, ValueError):
        return dict(status='unavailable', fetched_at=None, items=[])


def save_snapshot(snapshot):
    text = json.dumps(snapshot, ensure_ascii=False, indent=2)
    for target, body in [(ROOT/'data/news.json', text+'\n'),
                         (ROOT/'dist/news-data.js', 'window.SUWA_NEWS='+text.replace('<', '\\u003c')+';\n')]:
        temp = target.with_suffix(target.suffix+'.tmp')
        temp.write_text(body)
        temp.replace(target)


class NewsService:
    def __init__(self, feeds=None, fetcher=fetch_feed, snapshot=None, persist=True):
        self.feeds = feeds if feeds is not None else json.loads((ROOT/'data/news-feeds.json').read_text())
        self.fetcher, self.persist = fetcher, persist
        self.snapshot = snapshot if snapshot is not None else load_snapshot()
        self.lock, self.checked = threading.Lock(), 0

    def refresh(self, force=False):
        with self.lock:
            if self.checked and time.monotonic()-self.checked < (30 if force else CACHE_SECONDS):
                return self.snapshot
            all_items, failures, success = [], [], 0
            attempted = datetime.now(timezone.utc).isoformat()
            for feed in self.feeds:
                try:
                    all_items.extend(self.fetcher(feed))
                    success += 1
                except Exception:
                    # Do not expose transport internals or present a failure as an empty feed.
                    failures.append(feed['name'])
            self.checked = time.monotonic()
            if success:
                self.snapshot = dict(status='partial' if failures else 'ready', fetched_at=attempted,
                                     attempted_at=attempted, items=latest_three(all_items),
                                     feeds=self.feeds, failed_sources=failures)
                if self.persist:
                    save_snapshot(self.snapshot)
            else:
                self.snapshot = {**self.snapshot, 'status':'unavailable', 'attempted_at':attempted,
                                 'failed_sources':failures, 'feeds':self.feeds}
            return self.snapshot


if __name__ == '__main__':
    result = NewsService().refresh()
    print(json.dumps(result, ensure_ascii=False, indent=2))
    raise SystemExit(0 if result['status'] != 'unavailable' else 1)
