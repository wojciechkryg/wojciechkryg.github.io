# AGENTS.md

Landing page for the **memolki** Android memory card game — hosted on GitHub Pages.

## Structure

```
index.html          — page structure, SEO meta, structured data (JSON-LD)
css/styles.css      — styling (BEM, CSS custom properties)
js/i18n.js          — 32 language translations, auto-detected from browser
js/main.js          — animations, floating card easter egg, mouse tracking
images/             — flavor logos, Google Play badge, favicon SVG
llms.txt            — plain-text site summary for AI agents
manifest.json       — web app manifest
robots.txt          — crawl rules
sitemap.xml         — sitemap
app-ads.txt         — DO NOT modify or delete (ad monetization)
```

## Do not modify

- **`app-ads.txt`** — required for ad monetization, must stay untouched
- **Play Store URLs** contain UTM tracking params — preserve them

## Gotchas

- **Animation → settled pattern**: app cards use `animation: slideIn forwards`, then JS swaps to `--settled` class on `animationend`. This is needed because `forwards` fill blocks hover transforms. Don't remove the class swap.
- **i18n has no picker** — language is auto-detected from `navigator.language`. Flavor names come from the Android app's `strings.xml`.
- **RTL**: Arabic (`ar`) and Hebrew (`iw`) — uses `dir="rtl"` and CSS logical properties.
- **Viewport fit**: spacing is tuned so the page fits without scrolling on a MacBook Pro. Larger sizes only apply on screens both wide (768px+) and tall (900px+).

## Easter egg

Clicking a floating background card flips it to reveal the flavor logo.
