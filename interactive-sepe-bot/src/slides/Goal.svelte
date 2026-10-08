<script>
  import { MESSAGES } from '../data.js';
  import { t } from '../i18n/index.svelte.js';

  let c = $derived(t().goal);

  let picked = $state('hit');
  let msg = $derived(MESSAGES.find((m) => m.key === picked));
</script>

<div class="goal">
  <div class="left">
    <div class="label kicker">{c.kicker}</div>
    <h2>{@html c.title}</h2>
    <p class="body-text">{@html c.p1}</p>
    <p class="body-text">{c.p2}</p>
  </div>

  <div class="right">
    <div class="block" aria-hidden="true"></div>

    <div class="phone">
      <div class="phone-head">
        <span class="avatar" aria-hidden="true">S</span>
        <div>
          <div class="name">SEPE bot</div>
          <div class="sub">Telegram</div>
        </div>
      </div>

      <div class="chat">
        {#key picked}
          <div class="bubble" class:loud={msg.loud} lang="en">
            <div class="b-title">{msg.title}</div>
            {#each msg.lines as line}
              <div class="b-line">{line}</div>
            {/each}
            {#if msg.screenshot}
              <div class="b-line note" lang={null}>{c.screenshot}</div>
            {/if}
            <div class="b-time">{msg.time}</div>
          </div>
        {/key}
      </div>

      <div class="tabs" role="group" aria-label={c.messageType}>
        {#each MESSAGES as m}
          <button type="button" aria-pressed={m.key === picked} onclick={() => (picked = m.key)}>{c.tabs[m.key]}</button>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .goal {
    min-height: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 32px 48px;
  }

  @media (max-width: 640px) {
    .right {
      padding: 20px 0 0;
    }

    .chat {
      min-height: 150px;
    }
  }

  .left {
    flex: 999 1 420px;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .kicker {
    color: var(--accent);
  }

  h2 {
    margin: 0 0 8px;
    font-size: clamp(44px, 6.4vw, 92px);
    line-height: 0.95;
    letter-spacing: -0.04em;
    font-weight: 700;
  }

  h2 :global(em) {
    font-weight: 400;
    color: var(--accent);
  }

  .right {
    flex: 1 1 340px;
    min-width: 0;
    position: relative;
    display: flex;
    justify-content: center;
    padding: 40px 0;
  }

  /* The flat blue block from the grid-poster reference. */
  .block {
    position: absolute;
    inset: 0 18% 25% 0;
    background: var(--accent);
  }

  .phone {
    position: relative;
    width: min(100%, 340px);
    background: #fff;
    color: #141414;
    border-radius: 28px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    padding: 18px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    box-shadow: 0 30px 60px -30px rgba(0, 0, 0, 0.45);
  }

  .phone-head {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e6e4dc;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--accent);
    color: var(--cream);
    display: grid;
    place-items: center;
    font-weight: 600;
  }

  .name {
    font-weight: 600;
  }

  .sub {
    font-size: 13px;
    color: #5b5b55;
  }

  .chat {
    min-height: 190px;
    background: #ecebe4;
    border-radius: 16px;
    padding: 14px;
    display: flex;
    align-items: flex-end;
  }

  .bubble {
    background: #fff;
    border-radius: 14px 14px 14px 4px;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 14px;
    line-height: 1.4;
    animation: pop 0.35s cubic-bezier(0.2, 0.8, 0.2, 1.2);
  }

  .bubble.loud .b-title {
    color: var(--vermilion);
  }

  .b-title {
    font-weight: 700;
  }

  .note {
    color: #5b5b55;
    font-style: italic;
  }

  .b-time {
    align-self: flex-end;
    font-family: var(--mono);
    font-size: 11px;
    color: #6b6b64;
  }

  @keyframes pop {
    from {
      opacity: 0;
      transform: translateY(12px) scale(0.96);
    }
  }

  .tabs {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 6px;
  }

  .tabs button {
    min-height: 44px;
    border-radius: 12px;
    border: 1px solid #d6d4cb;
    background: #fff;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
  }

  .tabs button[aria-pressed='true'] {
    background: var(--accent);
    border-color: var(--accent);
    color: var(--cream);
  }
</style>
