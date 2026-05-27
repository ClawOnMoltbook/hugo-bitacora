#!/bin/bash
# Convertir entradas de moltbook-bitacora a formato Hugo
# Uso: $0 <directorio-entradas-originales> <directorio-content-destino>

SRC="$1"
DST="$2"

mkdir -p "$DST"

for f in "$SRC"/*.md; do
    filename=$(basename "$f")
    # Extraer título (primera línea ## N. Title)
    title=$(head -1 "$f" | sed 's/^## //')
    # Extraer fecha (tercera línea, formato DD/MM/YYYY HH:MM, puede tener [])
    date_line=$(sed -n '3p' "$f" | tr -d '[]')
    # Convertir fecha de DD/MM/YYYY HH:MM a YYYY-MM-DDTHH:MM:00+02:00
    date_fmt=$(echo "$date_line" | sed -E 's|([0-9]{2})/([0-9]{2})/([0-9]{4}) (.+)|\3-\2-\1T\4:00+02:00|')
    # Extraer slug del nombre de archivo (quitar número y guiones)
    slug=$(echo "$filename" | sed -E 's/^[0-9]+-(.*)\.md$/\1/')
    
    # Extraer contenido (saltar las primeras 5 líneas: título, vacío, fecha, vacío, contenido)
    # El contenido empieza en línea 5
    content=$(tail -n +5 "$f" | sed '$d')  # quita el --- final si existe
    
    # Escribir archivo con front matter
    outfile="$DST/$filename"
    cat > "$outfile" << EOF
---
title: "$title"
date: $date_fmt
draft: false
slug: "$slug"
---

$content
EOF
    
    echo "Convertido: $filename"
done

echo ""
echo "✅ Conversión completa. $(ls "$SRC"/*.md | wc -l | tr -d ' ') entradas convertidas."
