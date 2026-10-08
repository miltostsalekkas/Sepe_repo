<script>
  import { result, sources } from '../data.js';

  let { go } = $props();
</script>

<div class="today">
  <div class="head">
    <div class="label kicker">04 — The result</div>
    <h2 class="display">It asks. <br /><em>You</em> just book.</h2>
    <p class="body-text">
      No reseller, no €99, no nights refreshing a page. Just a free appointment, found by the same kind of
      tool that was keeping it away.
    </p>
  </div>

  <ul class="list">
    {#each result as item, i}
      <li>
        <span class="n label">{String(i + 1).padStart(2, '0')}</span>
        <span class="t">{item.title}</span>
        <span class="b">{item.body}</span>
      </li>
    {/each}
  </ul>

  <div class="foot">
    <div class="notes">
      <p class="note">
        Figures from the bot’s own log, 7 October 21:37 to 8 October 09:30. It also ran on earlier days, so
        the real number of tries is higher.
      </p>
      <p class="note">On reselling:</p>
      <ul class="sources">
        {#each sources as s}
          <li><a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a></li>
        {/each}
      </ul>
    </div>
    <button type="button" class="btn" onclick={() => go(0)}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
      Back to start
    </button>
  </div>
</div>

<style>
  .today {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 24px;
  }

  .head {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .kicker {
    color: var(--accent);
  }

  h2 {
    font-size: clamp(52px, 7vw, 108px);
  }

  .list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    border-top: 1px solid var(--line);
  }

  li {
    padding: 16px 20px 16px 0;
    border-bottom: 1px solid var(--line);
    display: grid;
    grid-template-columns: 34px 1fr;
    gap: 4px 10px;
  }

  .n {
    grid-row: span 2;
    padding-top: 4px;
    color: var(--accent);
  }

  .t {
    font-size: 20px;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  .b {
    font-size: 15px;
    line-height: 1.45;
    opacity: 0.85;
  }

  .foot {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }

  .notes {
    max-width: 640px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .note {
    margin: 0;
    font-size: 14px;
    line-height: 1.55;
    opacity: 0.85;
  }

  .sources {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 14px;
    line-height: 1.5;
  }

  .sources li {
    display: block;
    padding: 0;
    border: 0;
  }

  .sources a {
    color: inherit;
    text-underline-offset: 3px;
    display: inline-block;
    padding: 4px 0;
  }

  @media (max-width: 860px) {
    .list {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 560px) {
    .list {
      grid-template-columns: 1fr;
    }

    li {
      padding-right: 0;
    }
  }
</style>
