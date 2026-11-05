#!/usr/bin/env bash
# Prepare media in public/ for the web. Requires ffmpeg and cwebp (brew install ffmpeg webp).
#
#   scripts/optimize-media.sh public/videos/foo.mp4 public/images/bar.png ...
#
# .mp4  Rewritten in place without re-encoding: audio track dropped (videos always play muted)
#       and the moov index moved to the front (+faststart) so playback starts before the whole
#       file downloads. Writes a first-frame poster to public/videos/posters/<name>.webp;
#       reference it from projects.ts as `posterUrl`.
# image (.png/.jpg/.webp)  Width capped at 2560px and re-encoded as lossy WebP (q85, sharp_yuv
#       keeps UI text edges clean) to <name>.webp next to the source. A WebP source that is
#       already smaller (flat UI often compresses better losslessly) is left untouched. A
#       non-WebP source is kept; point projects.ts at the .webp and delete the original.
set -euo pipefail

MAX_IMAGE_WIDTH=2560
POSTER_WIDTH=960

tmpdir=$(mktemp -d)
trap 'rm -rf "$tmpdir"' EXIT

for src in "$@"; do
  dir=$(dirname "$src")
  file=$(basename "$src")
  name=${file%.*}
  ext=$(printf '%s' "${file##*.}" | tr '[:upper:]' '[:lower:]')

  case "$ext" in
    mp4)
      ffmpeg -v error -y -i "$src" -map 0:v:0 -c:v copy -an -movflags +faststart "$tmpdir/$file"
      mv "$tmpdir/$file" "$src"
      mkdir -p "$dir/posters"
      ffmpeg -v error -y -i "$src" -frames:v 1 -vf "scale='min($POSTER_WIDTH,iw)':-2" "$tmpdir/$name.png"
      cwebp -quiet -q 70 -sharp_yuv "$tmpdir/$name.png" -o "$dir/posters/$name.webp"
      echo "$src: faststart, audio stripped; poster $dir/posters/$name.webp"
      ;;
    png | jpg | jpeg | webp)
      width=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$src")
      target=$((width > MAX_IMAGE_WIDTH ? MAX_IMAGE_WIDTH : width))
      cwebp -quiet -q 85 -sharp_yuv -m 6 -resize "$target" 0 "$src" -o "$tmpdir/$name.webp"
      if [ "$ext" = webp ] && [ "$(wc -c <"$tmpdir/$name.webp")" -ge "$(wc -c <"$src")" ]; then
        echo "$src: already smaller than a re-encode; unchanged"
        continue
      fi
      mv "$tmpdir/$name.webp" "$dir/$name.webp"
      echo "$src: ${width}px -> ${target}px WebP $dir/$name.webp"
      ;;
    *)
      echo "skipping $src: unsupported extension" >&2
      ;;
  esac
done
