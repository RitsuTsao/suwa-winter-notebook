#!/bin/zsh
cd -- "${0:A:h}" || exit 1
if ! command -v python3 >/dev/null 2>&1; then
  print '需要 Python 3 才能即時更新新聞。也可直接開啟 dist/index.html 閱讀離線觀測冊。'
  read -k 1
  exit 1
fi
python3 tools/serve.py --open
