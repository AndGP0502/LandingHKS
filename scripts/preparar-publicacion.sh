#!/bin/sh
# Arma dist/ con solo lo que se publica. Lo usa Cloudflare Pages como comando de build
# (carpeta de salida: dist). Quedan fuera las notas (content/, docs/), el README, la
# configuración y las fotos originales (fuente/). Si agregas una página o un archivo
# público en la raíz, súmalo a la lista de abajo.
set -eu
cd "$(dirname "$0")/.."

rm -rf dist
mkdir dist
cp index.html horarios-y-planes.html 404.html favicon.ico robots.txt sitemap.xml dist/
cp -R css js assets dist/
rm -rf dist/assets/fotos/fuente dist/assets/logo/fuente dist/assets/fotos/fotos.json
find dist -name '.DS_Store' -delete

echo "dist/ listo: $(find dist -type f | wc -l | tr -d ' ') archivos"
