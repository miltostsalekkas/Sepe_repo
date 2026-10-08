<script>
  let { go } = $props();
</script>

<div class="cover">
  <div class="tag label">Case study</div>

  <h1 class="display">
    1,839 tries <br />for <em>one</em> <br />appointment
  </h1>

  <div class="foot">
    <p class="body-text">
      Getting a cita previa at SEPE has become a race against resellers’ bots. This is the story of how we
      raced back, with a bot of our own, and found a free appointment.
    </p>
    <button type="button" class="btn solid" onclick={() => go(1)}>
      Start
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
    </button>
  </div>

  <div class="swipe label" aria-hidden="true">Swipe →</div>
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
    font-size: clamp(64px, 12vw, 176px);
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
</style>
