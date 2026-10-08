<script>
  import { NO_SLOTS, problemFacts, tryReply } from '../data.js';

  let tries = $state(0);
  let busy = $state(false);

  function ask() {
    if (busy) return;
    busy = true;
    // A short pause, like the real page loading.
    setTimeout(() => {
      tries += 1;
      busy = false;
    }, 700);
  }
</script>

<div class="problem">
  <div class="text">
    <div class="label">01 — The problem</div>
    <h2 class="display">“No podemos <br />ofrecerle <em>citas</em>”</h2>
    <p class="body-text">
      To start an alta inicial de prestación contributiva, you first ask SEPE for a cita previa. In Barcelona,
      the booking page answers with the same sentence almost every time.
    </p>
    <p class="body-text">
      It is not only demand. Intermediaries have been reported running bots that ask SEPE nonstop, grab
      each slot the moment it is released and <strong>sell it back</strong> to people who need it, for an
      appointment that is free.
    </p>

    <div class="facts">
      {#each problemFacts as f}
        <div class="fact">
          <div class="f-value">{f.value}</div>
          <div class="label">{f.label}</div>
        </div>
      {/each}
    </div>
  </div>

  <div class="try">
    <div class="label">Try it yourself</div>

    <div class="screen">
      <div class="screen-head label">citaprevia-sede.sepe.gob.es</div>
      <div class="screen-body">
        {#if busy}
          <div class="loading" aria-hidden="true"><span></span><span></span><span></span></div>
        {:else if tries === 0}
          <p class="idle">Press the button to ask for an appointment.</p>
        {:else}
          {#key tries}
            <p class="answer">{NO_SLOTS}</p>
          {/key}
        {/if}
      </div>
    </div>

    <button type="button" class="btn ask" onclick={ask} disabled={busy}>
      Ask SEPE for an appointment
    </button>

    <div class="tally" aria-live="polite">
      {#if tries > 0}
        <span class="count">Attempt {tries}</span>
        <span>{tryReply(tries)}</span>
      {/if}
    </div>
  </div>
</div>

<style>
  .problem {
    min-height: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 40px 56px;
  }

  .text {
    flex: 999 1 440px;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  h2 {
    font-size: clamp(44px, 7vw, 108px);
    margin-bottom: 6px;
  }

  .facts {
    margin-top: 8px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    border-top: 1px solid var(--line);
  }

  .fact {
    padding: 14px 12px 0 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .fact + .fact {
    border-left: 1px solid var(--line);
    padding-left: 14px;
  }

  .f-value {
    font-size: clamp(30px, 4vw, 48px);
    line-height: 1;
    letter-spacing: -0.04em;
  }

  .fact .label {
    text-transform: none;
    letter-spacing: 0;
    font-size: 12px;
    line-height: 1.35;
  }

  .try {
    flex: 1 1 320px;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .screen {
    background: #fff4ec;
    color: #2b160c;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 30px 60px -30px rgba(0, 0, 0, 0.5);
  }

  .screen-head {
    padding: 10px 14px;
    background: rgba(0, 0, 0, 0.06);
    font-size: 11px;
    text-transform: none;
    letter-spacing: 0;
    color: #6b4a3a;
  }

  .screen-body {
    min-height: 140px;
    padding: 20px;
    display: grid;
    place-items: center;
    text-align: center;
  }

  .idle {
    margin: 0;
    color: #6b4a3a;
  }

  .answer {
    margin: 0;
    font-size: 18px;
    line-height: 1.45;
    font-weight: 500;
    color: #a3300b;
    animation: pop 0.3s ease;
  }

  @keyframes pop {
    from {
      opacity: 0;
      transform: scale(0.97);
    }
  }

  .loading {
    display: flex;
    gap: 6px;
  }

  .loading span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #a3300b;
    animation: blink 0.9s infinite;
  }

  .loading span:nth-child(2) {
    animation-delay: 0.15s;
  }

  .loading span:nth-child(3) {
    animation-delay: 0.3s;
  }

  @keyframes blink {
    50% {
      opacity: 0.2;
    }
  }

  .ask {
    justify-content: center;
    min-height: 52px;
    font-size: 16px;
  }

  .ask:disabled {
    opacity: 0.7;
    cursor: wait;
  }

  .tally {
    min-height: 72px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 16px;
    line-height: 1.45;
  }

  .count {
    font-family: var(--mono);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    opacity: 0.8;
  }

  /* Phone: one figure per row, number beside its label. */
  @media (max-width: 560px) {
    .facts {
      grid-template-columns: 1fr;
    }

    .fact,
    .fact + .fact {
      flex-direction: row;
      align-items: baseline;
      gap: 14px;
      padding: 12px 0;
      border-left: 0;
      border-bottom: 1px solid var(--line);
    }

    .f-value {
      flex: 0 0 96px;
      font-size: 30px;
    }

    .fact .label {
      font-size: 13px;
    }
  }
</style>
