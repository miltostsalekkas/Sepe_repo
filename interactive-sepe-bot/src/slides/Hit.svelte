<script>
  import { t } from '../i18n/index.svelte.js';

  let { active } = $props();

  let c = $derived(t().moment);
  let moment = $derived(c.events);

  // How many events are shown so far; they appear one by one.
  let shown = $state(4);
  let timer;
  let played = false;

  function play() {
    clearInterval(timer);
    shown = 0;
    timer = setInterval(() => {
      shown += 1;
      if (shown >= moment.length) clearInterval(timer);
    }, 1100);
  }

  $effect(() => {
    if (active && !played) {
      played = true;
      play();
    }
  });

  $effect(() => () => clearInterval(timer));
</script>

<div class="moment">
  <div class="head">
    <div class="label kicker">{c.kicker}</div>
    <h2 class="display">{@html c.title}</h2>
    <p class="body-text">{c.body}</p>
    <button type="button" class="btn" onclick={play}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
      {c.replay}
    </button>
  </div>

  <ol class="flow">
    {#each moment as e, i}
      <li class:found={i === 0} class:visible={i < shown}>
        <span class="time label">{e.time}</span>
        <span class="dot" aria-hidden="true"></span>
        <span class="text">{e.text}</span>
      </li>
    {/each}
  </ol>
</div>

<style>
  .moment {
    min-height: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 32px 56px;
  }

  .head {
    flex: 999 1 440px;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .kicker {
    color: var(--accent);
  }

  h2 {
    font-size: clamp(52px, 8vw, 120px);
    color: var(--fg);
  }

  h2 :global(em) {
    color: var(--accent);
  }

  .flow {
    flex: 1 1 340px;
    min-width: 0;
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  li {
    display: grid;
    grid-template-columns: 76px 16px 1fr;
    gap: 14px;
    align-items: start;
    padding: 16px 0;
    border-top: 1px solid var(--line);
    opacity: 0.12;
    transform: translateX(12px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }

  li.visible {
    opacity: 1;
    transform: none;
  }

  .time {
    padding-top: 3px;
    opacity: 0.75;
  }

  .dot {
    width: 12px;
    height: 12px;
    margin-top: 5px;
    border-radius: 50%;
    border: 1.5px solid var(--fg);
  }

  .text {
    font-size: 18px;
    line-height: 1.45;
  }

  li.found .dot {
    background: var(--accent);
    border-color: var(--accent);
  }

  li.found .time {
    color: var(--accent);
    opacity: 1;
  }

  li:last-child .dot {
    background: var(--sage);
    border-color: var(--sage);
  }

  li:last-child .text {
    color: var(--sage);
  }

  @media (prefers-reduced-motion: reduce) {
    li {
      transition: none;
    }
  }
</style>
