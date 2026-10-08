<script>
  import { t } from '../i18n/index.svelte.js';

  let { theme, num, total, chapter, active, stacked, children } = $props();

  let ui = $derived(t().ui);
</script>

<!-- In the deck, slides off screen are inert; when stacked, all are live. -->
<article
  class="slide theme-{theme}"
  class:stacked
  inert={!stacked && !active}
  aria-hidden={!stacked && !active}
  aria-roledescription={stacked ? undefined : 'slide'}
  aria-label="{ui.slideOf(num, total)}: {chapter}"
>
  <div class="grid-lines" aria-hidden="true">
    <span></span><span></span><span></span>
  </div>

  <div class="meta label">
    <span class="brand">{ui.brand} <br />{ui.brandName}</span>
    <span class="chapter">{chapter} — {String(num).padStart(3, '0')}</span>
  </div>

  <div class="content">
    {@render children()}
  </div>
</article>

<style>
  .slide {
    position: relative;
    flex: 0 0 100%;
    height: 100%;
    background: var(--bg);
    color: var(--fg);
    overflow: hidden;
  }

  /* Thin vertical rules, like a layout grid left visible. */
  .grid-lines {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    pointer-events: none;
  }

  .grid-lines span {
    border-right: 1px solid var(--line);
  }

  .grid-lines span:first-child {
    border-left: 1px solid var(--line);
    margin-left: clamp(16px, 6vw, 80px);
  }

  .meta {
    position: absolute;
    top: clamp(16px, 4vh, 36px);
    left: clamp(16px, 6vw, 80px);
    /* Leaves room for the language switch on the right. */
    right: calc(clamp(16px, 6vw, 80px) + 190px);
    display: flex;
    justify-content: space-between;
    gap: 16px;
    color: var(--accent);
    z-index: 1;
  }

  .content {
    position: absolute;
    inset: 0;
    overflow-y: auto;
    padding: clamp(84px, 13vh, 120px) clamp(16px, 6vw, 80px) 120px;
  }

  /* Stacked (phones): each slide is a section of one long page,
     at least a screen tall, growing with its content. */
  .slide.stacked {
    height: auto;
    min-height: 100svh;
    overflow: visible;
    display: flex;
    flex-direction: column;
  }

  /* The top bar names the project and each slide has its own
     kicker, so the corner labels are dropped. */
  .stacked .meta {
    display: none;
  }

  .stacked .content {
    position: relative;
    inset: auto;
    flex: 1;
    overflow: visible;
    padding: 88px 16px 72px;
  }
</style>
