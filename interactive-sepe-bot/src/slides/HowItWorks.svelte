<script>
  import { t } from '../i18n/index.svelte.js';

  let { active } = $props();

  let c = $derived(t().how);
  let steps = $derived(c.steps);

  let selected = $state(0);
  let playing = $state(false);
  let timer;

  let step = $derived(steps[selected]);

  function stop() {
    clearInterval(timer);
    playing = false;
  }

  function play() {
    stop();
    selected = 0;
    playing = true;
    timer = setInterval(() => {
      if (selected >= steps.length - 1) {
        stop();
        return;
      }
      selected += 1;
    }, 1600);
  }

  function pick(i) {
    stop();
    selected = i;
  }

  // Stop the walkthrough when the slide is left.
  $effect(() => {
    if (!active) stop();
  });

  $effect(() => () => clearInterval(timer));
</script>

<div class="how">
  <div class="head">
    <div class="label kicker">{c.kicker}</div>
    <h2 class="display">{@html c.title}</h2>
    <p class="body-text">{c.body}</p>
    <button type="button" class="btn" onclick={() => (playing ? stop() : play())}>
      {#if playing}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" /><rect x="14" y="5" width="4" height="14" /></svg>
        {c.pause}
      {:else}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4l13 8-13 8z" /></svg>
        {c.play}
      {/if}
    </button>
  </div>

  <div class="cells">
    {#each steps as s, i}
      <button
        type="button"
        class="cell"
        class:on={i === selected}
        class:done={i < selected}
        aria-pressed={i === selected}
        onclick={() => pick(i)}
      >
        <span class="n">{String(i + 1).padStart(2, '0')}</span>
        <span class="t">{s.label}</span>
      </button>
    {/each}
  </div>

  {#key selected}
    <div class="detail">
      <span class="d-num label">{c.stepOf(selected + 1, steps.length)}</span>
      <h3>{step.title}</h3>
      <p>{step.body}</p>
    </div>
  {/key}
</div>

<style>
  .how {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 32px;
  }

  .head {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 18px;
  }

  .kicker {
    color: var(--accent);
  }

  h2 {
    font-size: clamp(48px, 7vw, 104px);
  }

  .cells {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    border-top: 1px solid var(--line);
    border-left: 1px solid var(--line);
  }

  .cell {
    min-height: 88px;
    padding: 14px 16px;
    border: 0;
    border-right: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    background: transparent;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
    text-align: left;
    transition: background 0.25s, color 0.25s;
  }

  .cell:hover {
    background: var(--soft);
  }

  .cell.done {
    background: rgba(200, 214, 195, 0.18);
  }

  .cell.on {
    background: var(--accent);
    color: var(--on-accent);
  }

  .n {
    font-family: var(--mono);
    font-size: 12px;
  }

  .t {
    font-size: clamp(16px, 1.8vw, 22px);
    font-weight: 500;
    letter-spacing: -0.01em;
  }

  .detail {
    min-height: 120px;
    max-width: 720px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    animation: rise 0.35s ease;
  }

  @keyframes rise {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
  }

  .d-num {
    color: var(--accent);
  }

  h3 {
    margin: 0;
    font-size: 28px;
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  .detail p {
    margin: 0;
    font-size: 17px;
    line-height: 1.55;
  }

  @media (max-width: 640px) {
    .how {
      gap: 24px;
    }

    .cells {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .cell {
      min-height: 60px;
      padding: 10px 12px;
      gap: 4px;
    }

    h3 {
      font-size: 22px;
    }
  }
</style>
