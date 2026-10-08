<script>
  import { messages } from '../data.js';

  let picked = $state('hit');
  let msg = $derived(messages.find((m) => m.key === picked));
</script>

<div class="goal">
  <div class="left">
    <div class="label kicker">02 — The counter-move</div>
    <h2>Fight the bots <em>with a bot.</em></h2>
    <p class="body-text">
      If bots empty the calendar, a person refreshing by hand will always lose. So we turned their tool
      around: a small bot that asks for <strong>one appointment, for one person</strong>, and never sells
      anything.
    </p>
    <p class="body-text">
      It fills in SEPE’s form every 20 seconds, day and night, and stays silent until the answer changes.
      Then it sends one Telegram message, wherever you are. Tap the messages on the phone.
    </p>
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
          <div class="bubble" class:loud={msg.loud}>
            <div class="b-title">{msg.title}</div>
            {#each msg.lines as line}
              <div class="b-line">{line}</div>
            {/each}
            <div class="b-time">{msg.time}</div>
          </div>
        {/key}
      </div>

      <div class="tabs" role="group" aria-label="Message type">
        {#each messages as m}
          <button type="button" aria-pressed={m.key === picked} onclick={() => (picked = m.key)}>{m.tab}</button>
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

  h2 em {
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
