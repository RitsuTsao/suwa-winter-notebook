"""Optional loopback-only local news reader; never runs a background schedule."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlsplit, parse_qs
from urllib.request import urlopen
from pathlib import Path
import errno
import argparse
import json
import threading
import webbrowser
from news import NewsService

DIST = Path(__file__).resolve().parents[1]/'dist'
service = NewsService()


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIST), **kwargs)

    def do_GET(self):
        url = urlsplit(self.path)
        if url.path in ('/api/news', '/api/health'):
            data = {'app':'suwa-winter','news_api':1} if url.path.endswith('health') else service.refresh(parse_qs(url.query).get('refresh') == ['1'])
            body = json.dumps(data, ensure_ascii=False).encode()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.send_header('Cache-Control', 'no-store')
            self.send_header('X-Content-Type-Options', 'nosniff')
            self.end_headers()
            self.wfile.write(body)
        else:
            super().do_GET()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=8767)
    parser.add_argument('--open', action='store_true')
    args = parser.parse_args()
    address = f'http://127.0.0.1:{args.port}/'
    try:
        server = ThreadingHTTPServer(('127.0.0.1', args.port), Handler)
    except OSError as error:
        if error.errno != errno.EADDRINUSE:
            raise
        try:
            with urlopen(address+'api/health', timeout=2) as r:
                assert json.load(r).get('app') == 'suwa-winter'
        except Exception:
            raise SystemExit('這個本機連接埠已被其他程式使用；請改用 --port 指定其他埠。')
        if args.open:
            webbrowser.open(address)
        return
    if args.open:
        threading.Timer(.3, lambda: webbrowser.open(address)).start()
    print('觀測冊：'+address+'\n保留此視窗即可更新新聞；按 Control+C 結束。', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == '__main__':
    main()
