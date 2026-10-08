<script>
  import { t } from '../i18n/index.svelte.js';

  let { go } = $props();

  let c = $derived(t().cover);
  let ui = $derived(t().ui);
</script>

<div class="cover">
  <div class="tag label">{c.tag}</div>

  <h1 class="display">{@html c.title}</h1>

  <div class="foot">
    <p class="body-text">{c.body}</p>
    <button type="button" class="btn solid" onclick={() => go(1)}>
      {c.start}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
    </button>
  </div>

  <div class="swipe label" aria-hidden="true">{ui.swipe}</div>
</div>

<style>
  .cover {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 28px;
    padding-bottom: 40px;
  }

  .tag {
    color: var(--accent);
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    padding: 8px 0;
    width: min(100%, 320px);
    font-size: 14px;
    font-weight: 500;
  }

  h1 {
    font-size: clamp(56px, 11vw, 168px);
  }

  .foot {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 24px 40px;
  }

  .swipe {
    position: absolute;
    right: clamp(16px, 6vw, 80px);
    bottom: 96px;
    color: var(--accent);
  }

  /* No swiping when the page scrolls. */
  @media (max-width: 760px) {
    .swipe {
      display: none;
    }
  }
</style>
