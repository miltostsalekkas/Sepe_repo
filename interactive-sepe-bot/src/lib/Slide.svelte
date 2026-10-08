<script>
  let { theme, num, total, chapter, active, children } = $props();
</script>

<article
  class="slide theme-{theme}"
  inert={!active}
  aria-hidden={!active}
  aria-roledescription="slide"
  aria-label="{num} of {total}: {chapter}"
>
  <div class="grid-lines" aria-hidden="true">
    <span></span><span></span><span></span>
  </div>

  <div class="meta label">
    <span>Case study — <br />SEPE appointment bot</span>
    <span class="chapter">{chapter}</span>
    <span>— {String(num).padStart(3, '0')}</span>
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
    right: clamp(16px, 6vw, 80px);
    display: flex;
    justify-content: space-between;
    gap: 16px;
    color: var(--accent);
    z-index: 1;
  }

  .chapter {
    flex: 1;
    text-align: center;
  }

  .content {
    position: absolute;
    inset: 0;
    overflow-y: auto;
    padding: clamp(84px, 13vh, 120px) clamp(16px, 6vw, 80px) 120px;
  }

  /* On a phone the slide scrolls, so the labels become a solid
     header strip that the content passes under. */
  @media (max-width: 640px) {
    .chapter {
      display: none;
    }

    .meta {
      top: 0;
      left: 0;
      right: 0;
      padding: 14px 16px 10px;
      background: var(--bg);
      border-bottom: 1px solid var(--line);
    }

    .content {
      padding-top: 84px;
    }
  }
</style>
