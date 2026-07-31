# Retone

Rewrites a piece of text in a chosen tone. Plain HTML, CSS, and JS on the front.
A small Node server holds the NVIDIA API key so it never reaches the browser.

## Run

```bash
npm install
cp .env.example .env      # then paste your real key into .env
npm start                 # http://localhost:3000
```

Requires Node 20.6+ (uses the built-in `--env-file` flag, so no `dotenv` dependency).

## Files

- `server.js` - static file serving + `POST /api/rewrite`
- `public/index.html` - markup
- `public/styles.css` - design tokens and every component style
- `public/app.js` - tone selection, fetch call, scroll reveals

## Design notes

Built to the Premium Utilitarian Minimalism protocol:

- Warm bone canvas `#FBFBFA`, white surfaces, every border exactly `1px solid #EAEAEA`.
- Editorial serif hero with `-0.03em` tracking; monospace for labels, meta, and `<kbd>`.
- Off-black `#111111` body text, `#787774` secondary. No pure black anywhere.
- Tone tags are pastel pills; the selected one inverts to solid `#111111`.
- Card hover lifts to `0 2px 8px rgba(0,0,0,0.04)` and nothing heavier.
- Scroll entry via `IntersectionObserver` with an 80ms stagger, animating only
  `transform` and `opacity`. Fully disabled under `prefers-reduced-motion`.
- Copy icon is a Phosphor fill-weight glyph inlined as SVG. No icon library, no emoji.

Fonts are declared as stacks (`SF Pro Display` / `Lyon Text` / `Geist Mono` and
fallbacks). Nothing is fetched from a font CDN, so the app works offline; systems
without the primary faces fall back to Helvetica, Georgia, and Menlo.

## Notes

- `reasoning_content` from `deepseek-v4-pro` is intentionally discarded; only the
  final rewritten text is returned.
- `Ctrl`/`Cmd` + `Enter` runs the rewrite.
