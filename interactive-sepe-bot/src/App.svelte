<script>
  import Slide from './lib/Slide.svelte';
  import LangSwitch from './lib/LangSwitch.svelte';
  import Cover from './slides/Cover.svelte';
  import Goal from './slides/Goal.svelte';
  import HowItWorks from './slides/HowItWorks.svelte';
  import Problem from './slides/Problem.svelte';
  import Night from './slides/Night.svelte';
  import Hit from './slides/Hit.svelte';
  import Code from './slides/Code.svelte';
  import { t } from './i18n/index.svelte.js';

  const slides = [
    { component: Cover, theme: 'sage' },
    { component: Problem, theme: 'vermilion' },
    { component: Goal, theme: 'paper' },
    { component: HowItWorks, theme: 'cobalt' },
    { component: Night, theme: 'paper' },
    { component: Hit, theme: 'night' },
    { component: Code, theme: 'sage' },
  ];

  // Phones get a plain vertical scroll instead of a swipe deck.
  const STACK_QUERY = '(max-width: 760px)';

  let ui = $derived(t().ui);
  let chapters = $derived(t().chapters);

  let current = $state(0);
  let stacked = $state(matchMedia(STACK_QUERY).matches);
  let theme = $derived(slides[current].theme);

  let track;

  $effect(() => {
    const mq = matchMedia(STACK_QUERY);
    const update = () => (stacked = mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  });

  function go(i) {
    const target = Math.max(0, Math.min(slides.length - 1, i));
    if (stacked) {
      track.children[target]?.scrollIntoView({ behavior: 'smooth' });
    } else {
      current = target;
    }
  }

  function onKey(e) {
    if (stacked || e.target.closest?.('input, textarea, select')) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') go(current + 1);
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(current - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(slides.length - 1);
  }

  // Stacked: the slide in the middle of the screen is the current one,
  // which starts its animations and colours the top bar.
  $effect(() => {
    if (!stacked) return;
    const els = [...track.children];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) current = els.indexOf(e.target);
        }
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });

  // Deck: horizontal swipe (touch, pen or mouse drag). The arrows,
  // dots and keyboard do the same for everyone else.
  $effect(() => {
    if (stacked) return;
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

<div class="deck" class:stacked aria-roledescription={stacked ? undefined : 'carousel'} aria-label={ui.deck}>
  <header class="topbar theme-{theme}">
    <span class="brand label">SEPE bot</span>
    <LangSwitch />
  </header>

  <div class="track" bind:this={track} style:transform={stacked ? null : `translateX(-${current * 100}%)`}>
    {#each slides as s, i}
      <Slide
        theme={s.theme}
        num={i + 1}
        total={slides.length}
        chapter={chapters[i]}
        active={i === current}
        {stacked}
      >
        <s.component {go} active={i === current} />
      </Slide>
    {/each}
  </div>

  {#if !stacked}
    <nav class="controls theme-{theme}" aria-label={ui.slides}>
      <button type="button" class="arrow" onclick={() => go(current - 1)} disabled={current === 0} aria-label={ui.prev}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
      </button>

      <div class="dots">
        {#each slides as s, i}
          <button
            type="button"
            class="dot"
            class:on={i === current}
            aria-label={ui.goTo(i + 1)}
            aria-current={i === current ? 'step' : undefined}
            onclick={() => go(i)}
          ></button>
        {/each}
      </div>

      <span class="counter label">{current + 1}/{slides.length}</span>

      <button type="button" class="arrow" onclick={() => go(current + 1)} disabled={current === slides.length - 1} aria-label={ui.next}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </button>
    </nav>
  {/if}
</div>

<style>
  .deck {
    position: fixed;
    inset: 0;
    overflow: hidden;
  }

  .deck.stacked {
    overflow-y: auto;
    overflow-x: hidden;
  }

  .track {
    display: flex;
    height: 100%;
    transition: transform 0.7s cubic-bezier(0.65, 0, 0.2, 1);
    touch-action: pan-y;
  }

  .stacked .track {
    display: block;
    height: auto;
    transition: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .track {
      transition: none;
    }
  }

  /* Deck: only the language switch, top right, over the slide.
     Stacked: a solid bar the slides scroll under. */
  .topbar {
    position: fixed;
    top: clamp(10px, 3vh, 26px);
    right: clamp(16px, 6vw, 80px);
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    color: var(--accent);
  }

  .brand {
    display: none;
  }

  .stacked .topbar {
    top: 0;
    left: 0;
    right: 0;
    padding: 6px 16px;
    justify-content: space-between;
    background: var(--bg);
    border-bottom: 1px solid var(--line);
    transition: background 0.4s, color 0.4s;
  }

  .stacked .brand {
    display: block;
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
</style>
