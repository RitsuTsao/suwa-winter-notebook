"""Refresh deploy-only news; restore the last deployed snapshot before fetching RSS."""
import json
import subprocess
from datetime import datetime, timezone, timedelta
import news

SITE_NEWS = 'https://ritsutsao.github.io/suwa-winter-notebook/news.json'


def valid_snapshot(value):
    if not isinstance(value, dict) or value.get('status') not in ('ready', 'partial', 'unavailable'):
        return False
    fetched = news.parse_date(value.get('fetched_at'))
    if not fetched or fetched > datetime.now(timezone.utc) + timedelta(minutes=5):
        return False
    items = value.get('items')
    if not isinstance(items, list) or len(items) > 3:
        return False
    return all(isinstance(i, dict) and all(isinstance(i.get(k), str) for k in
               ('title', 'url', 'publisher', 'published_at', 'feed_id')) and
               news.safe_url(i['url']) and news.parse_date(i['published_at']) for i in items)


def deployed_snapshot():
    raw = subprocess.check_output(['/usr/bin/curl', '--fail', '--silent', '--show-error',
        '--location', '--proto', '=https', '--proto-redir', '=https', '--max-time', '15',
        '--max-filesize', str(news.MAX_BYTES), '--header', 'Cache-Control: no-cache',
        SITE_NEWS], timeout=20, stderr=subprocess.PIPE)
    value = json.loads(raw)
    if not valid_snapshot(value):
        raise ValueError('Invalid previous deployment snapshot')
    return value


def publish(previous_loader=deployed_snapshot, fetcher=news.fetch_feed):
    baseline = news.load_snapshot()
    recovered = False
    try:
        previous = previous_loader()
        if valid_snapshot(previous) and (not valid_snapshot(baseline) or
                news.parse_date(previous['fetched_at']) >= news.parse_date(baseline['fetched_at'])):
            baseline, recovered = previous, True
    except Exception:
        # First deployment or unavailable previous site: use the dated repository snapshot.
        pass
    result = news.NewsService(snapshot=baseline, fetcher=fetcher).refresh(force=True)
    print(json.dumps({'status': result['status'], 'items': len(result['items']),
                      'fetched_at': result.get('fetched_at'), 'previous_deployment_recovered': recovered}))
    return result


if __name__ == '__main__':
    raise SystemExit(0 if publish()['status'] == 'ready' else 1)
