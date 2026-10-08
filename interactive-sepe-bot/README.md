# SEPE bot — interactive case study

A 7-slide Svelte story: why getting a SEPE cita previa is so hard, and how a bot of our own found a free appointment. Live at <https://sepe-bot-story.vercel.app>.

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # static site in dist/
```

- **Desktop:** a swipe deck. Use the arrows, the dots, the ← → keys, or drag.
- **Phones (≤ 760 px wide):** one page that scrolls vertically.
- **Languages:** English, Spanish and Catalan, switched in the top bar. The choice is remembered; the first visit follows the browser's language.
- **Analytics:** Vercel Web Analytics (cookieless page views), enabled in the Vercel project's Analytics tab.

Texts live in `src/i18n/` (one file per language); numbers, links and commands shared by all languages are in `src/data.js`. Each slide is a component in `src/slides/`.
