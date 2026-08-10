#!/bin/bash
# GitHub'a push için bu scripti çalıştırın.
# Kullanım: ./scripts/push-github.sh GITHUB_KULLANICI_ADIN REPO_ADI
#
# Örnek: ./scripts/push-github.sh aslim portfolio

set -e

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Kullanım: ./scripts/push-github.sh GITHUB_KULLANICI_ADIN REPO_ADI"
  echo "Örnek:   ./scripts/push-github.sh aslim portfolio"
  exit 1
fi

GITHUB_USER="$1"
REPO_NAME="$2"
REMOTE_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

echo "→ Remote ekleniyor: $REMOTE_URL"
git remote remove origin 2>/dev/null || true
git remote add origin "$REMOTE_URL"

echo "→ GitHub'a push ediliyor..."
git push -u origin main

echo ""
echo "✓ GitHub push tamamlandı!"
echo "  Repo: https://github.com/${GITHUB_USER}/${REPO_NAME}"
echo ""
echo "Sonraki adım: https://vercel.com/new adresinden bu repoyu import edin."
