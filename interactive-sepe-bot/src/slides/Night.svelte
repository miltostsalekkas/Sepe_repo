<script>
  import { HOURS as hours, TRIES } from '../data.js';
  import { t } from '../i18n/index.svelte.js';

  let { active } = $props();

  let c = $derived(t().night);
  let locale = $derived(t().locale);

  // Tallest bar, as a share of the chart height (leaves room for the count).
  const BAR_MAX = 88;
  const max = Math.max(...hours.map((h) => h.total));
  const sum = hours.reduce((a, h) => a + h.total, 0);

  // Running total of checks before each hour, for the replay.
  const before = hours.map((_, i) => hours.slice(0, i).reduce((a, h) => a + h.total, 0));

  let progress = $state(1);
  let selected = $state(hours.length - 1);
  let raf;
  let played = false;

  let done = $derived(progress * sum);
  let counter = $derived(Math.round(progress * TRIES));
  let hour = $derived(hours[selected]);

  function fill(i) {
    return Math.max(0, Math.min(1, (done - before[i]) / hours[i].total));
  }

  function replay() {
    cancelAnimationFrame(raf);
    const start = performance.now();
    const duration = 4500;
    progress = 0;
    const tick = (now) => {
      // Ease out so the last hours land gently.
      const elapsed = Math.min(1, (now - start) / duration);
      progress = 1 - Math.pow(1 - elapsed, 2);
      // Follow the hour that is currently filling up.
      const filling = hours.findIndex((_, i) => fill(i) < 1);
      selected = filling === -1 ? hours.length - 1 : filling;
      if (elapsed < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }

  // Play the night once, the first time the slide is shown.
  $effect(() => {
    if (active && !played) {
      played = true;
      replay();
    }
  });

  $effect(() => () => cancelAnimationFrame(raf));
</script>

<div class="night">
  <div class="top">
    <div class="head">
      <div class="label kicker">{c.kicker}</div>
      <h2 class="display">{@html c.title}</h2>
      <p class="body-text">{c.body}</p>
    </div>

    <div class="count">
      <div class="num" aria-live="off">{counter.toLocaleString(locale, { useGrouping: 'always' })}</div>
      <div class="label">{c.count}</div>
      <button type="button" class="btn" onclick={replay}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
        {c.replay}
      </button>
    </div>
  </div>

  <div class="chart">
    <div class="bars">
      {#each hours as h, i}
        <button
          type="button"
          class="bar-btn"
          class:on={i === selected}
          class:found={h.found}
          aria-pressed={i === selected}
          aria-label="{h.label}: {c.checks(h.total)}"
          onclick={() => (selected = i)}
        >
          <span class="plot">
            <span class="value">{h.total}</span>
            <span class="bar" style:height="{Math.max(1.5, (h.total / max) * BAR_MAX * fill(i))}%"></span>
          </span>
          <span class="hour label">{h.label}</span>
        </button>
      {/each}
    </div>

    <div class="detail">
      <span class="d-hour">{hour.label}</span>
      <span class="label">{c.checks(hour.total)}</span>
      <span class="d-note">{c.notes[selected]}</span>
    </div>
  </div>
</div>

<style>
  .night {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 36px;
  }

  .top {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 32px;
  }

  .head {
    flex: 999 1 420px;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .kicker {
    color: var(--accent);
  }

  h2 {
    font-size: clamp(48px, 7vw, 104px);
  }

  .count {
    flex: 1 1 220px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .num {
    font-size: clamp(64px, 9vw, 132px);
    line-height: 0.9;
    letter-spacing: -0.05em;
    color: var(--accent);
    font-variant-numeric: tabular-nums;
  }

  .chart {
    border-top: 1px solid var(--line);
    padding-top: 18px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .bars {
    display: grid;
    grid-template-columns: repeat(13, minmax(0, 1fr));
    gap: 6px;
  }

  .bar-btn {
    border: 0;
    background: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .plot {
    height: 220px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 4px;
  }

  .value {
    font-family: var(--mono);
    font-size: 11px;
    text-align: center;
    opacity: 0.7;
  }

  .bar {
    display: block;
    background: rgba(31, 63, 191, 0.28);
  }

  .bar-btn:hover .bar {
    background: rgba(31, 63, 191, 0.55);
  }

  .bar-btn.on .bar {
    background: var(--accent);
  }

  .bar-btn.found .bar {
    background: rgba(204, 58, 14, 0.45);
  }

  .bar-btn.found.on .bar,
  .bar-btn.found:hover .bar {
    background: var(--vermilion);
  }

  .hour {
    text-align: center;
  }

  .bar-btn.on .hour {
    font-weight: 500;
    color: var(--accent);
  }

  .detail {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 8px 20px;
    min-height: 52px;
  }

  .d-hour {
    font-size: 28px;
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  .d-note {
    flex: 999 1 300px;
    font-size: 16px;
    line-height: 1.5;
  }

  /* On a phone the 13 bars share the width: no counts on top,
     smaller hour labels, a shorter chart. */
  @media (max-width: 640px) {
    .night {
      gap: 24px;
    }

    .bars {
      gap: 3px;
    }

    .plot {
      height: 150px;
    }

    .value {
      display: none;
    }

    .hour {
      font-size: 9px;
      letter-spacing: 0;
    }

    .bar-btn {
      min-height: 44px;
    }
  }
</style>
