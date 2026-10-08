<script>
  import Slide from './lib/Slide.svelte';
  import Cover from './slides/Cover.svelte';
  import Goal from './slides/Goal.svelte';
  import HowItWorks from './slides/HowItWorks.svelte';
  import Problem from './slides/Problem.svelte';
  import Night from './slides/Night.svelte';
  import Hit from './slides/Hit.svelte';
  import Code from './slides/Code.svelte';

  const slides = [
    { component: Cover, theme: 'sage', chapter: 'Intro' },
    { component: Problem, theme: 'vermilion', chapter: '01 The problem' },
    { component: Goal, theme: 'paper', chapter: '02 The counter-move' },
    { component: HowItWorks, theme: 'cobalt', chapter: '02 The counter-move' },
    { component: Night, theme: 'paper', chapter: '03 The wait' },
    { component: Hit, theme: 'night', chapter: '03 The wait' },
    { component: Code, theme: 'sage', chapter: '04 The code' },
  ];

  let current = $state(0);
  let theme = $derived(slides[current].theme);

  function go(i) {
    current = Math.max(0, Math.min(slides.length - 1, i));
  }

  function onKey(e) {
    if (e.target.closest?.('input, textarea, select')) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') go(current + 1);
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(current - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(slides.length - 1);
  }

  // Horizontal swipe (touch, pen or mouse drag). The arrows,
  // dots and keyboard do the same for everyone else.
  let track;

  $effect(() => {
    let start = null;

    const down = (e) => {
      start = { x: e.clientX, y: e.clientY };
    };

    const up = (e) => {
      if (!start) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      start = null;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        go(current + (dx < 0 ? 1 : -1));
      }
    };

    const cancel = () => (start = null);

    track.addEventListener('pointerdown', down);
    track.addEventListener('pointerup', up);
    track.addEventListener('pointercancel', cancel);

    return () => {
      track.removeEventListener('pointerdown', down);
      track.removeEventListener('pointerup', up);
      track.removeEventListener('pointercancel', cancel);
    };
  });
</script>

<svelte:window onkeydown={onKey} />

<div class="deck" aria-roledescription="carousel" aria-label="SEPE bot case study">
  <div class="track" bind:this={track} style:transform="translateX(-{current * 100}%)">
    {#each slides as s, i}
      <Slide theme={s.theme} num={i + 1} total={slides.length} chapter={s.chapter} active={i === current}>
        <s.component {go} active={i === current} />
      </Slide>
    {/each}
  </div>

  <nav class="controls theme-{theme}" aria-label="Slides">
    <button type="button" class="arrow" onclick={() => go(current - 1)} disabled={current === 0} aria-label="Previous slide">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
    </button>

    <div class="dots">
      {#each slides as s, i}
        <button
          type="button"
          class="dot"
          class:on={i === current}
          aria-label="Go to slide {i + 1}"
          aria-current={i === current ? 'step' : undefined}
          onclick={() => go(i)}
        ></button>
      {/each}
    </div>

    <span class="counter label">{current + 1}/{slides.length}</span>

    <button type="button" class="arrow" onclick={() => go(current + 1)} disabled={current === slides.length - 1} aria-label="Next slide">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
    </button>
  </nav>
</div>

<style>
  .deck {
    position: fixed;
    inset: 0;
    overflow: hidden;
  }

  .track {
    display: flex;
    height: 100%;
    transition: transform 0.7s cubic-bezier(0.65, 0, 0.2, 1);
    touch-action: pan-y;
  }

  @media (prefers-reduced-motion: reduce) {
    .track {
      transition: none;
    }
  }

  .controls {
    position: absolute;
    left: 50%;
    bottom: clamp(14px, 3vh, 28px);
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 6px 8px;
    border-radius: 999px;
    background: var(--bg);
    color: var(--accent);
    border: 1px solid var(--line);
    transition: background 0.5s, color 0.5s;
    z-index: 10;
  }

  .arrow {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 0;
    background: var(--soft);
    cursor: pointer;
    display: grid;
    place-items: center;
  }

  .arrow:disabled {
    opacity: 0.3;
    cursor: default;
  }

  .dots {
    display: flex;
    gap: 2px;
  }

  /* Big hit area, small visible dot. */
  .dot {
    width: 24px;
    height: 44px;
    border: 0;
    background: none;
    cursor: pointer;
    display: grid;
    place-items: center;
    padding: 0;
  }

  .dot::after {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1.5px solid currentColor;
    transition: background 0.2s, transform 0.2s;
  }

  .dot.on::after {
    background: currentColor;
    transform: scale(1.25);
  }

  .counter {
    min-width: 34px;
    text-align: center;
  }

  @media (max-width: 480px) {
    .dots {
      display: none;
    }
  }
</style>
