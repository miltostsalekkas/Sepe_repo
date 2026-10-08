<script>
  import { REPO_URL, SETUP_CODE, SOURCE_URLS } from '../data.js';
  import { t } from '../i18n/index.svelte.js';

  let { go } = $props();

  let c = $derived(t().code);

  let step = $state(0);
  let copied = $state(false);
  let code = $derived(SETUP_CODE[step]);
  let timer;

  // Only the command lines are copied, not the .env field names.
  function commandsOf(text) {
    return text.split('\n\n')[0];
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(commandsOf(code));
      copied = true;
      clearTimeout(timer);
      timer = setTimeout(() => (copied = false), 1600);
    } catch {
      copied = false;
    }
  }

  function pick(i) {
    step = i;
    copied = false;
  }

  $effect(() => () => clearTimeout(timer));
</script>

<div class="code-slide">
  <div class="head">
    <div class="label kicker">{c.kicker}</div>
    <h2 class="display">{@html c.title}</h2>
    <p class="body-text">{@html c.body}</p>
  </div>

  <div class="cols">
    <section class="col" aria-labelledby="how-title">
      <h3 id="how-title" class="label col-title">{c.whatTitle}</h3>
      <ol class="how">
        {#each c.howItWorks as item, i}
          <li>
            <span class="n label">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <div class="t">{item.title}</div>
              <p>{item.body}</p>
            </div>
          </li>
        {/each}
      </ol>
    </section>

    <section class="col" aria-labelledby="setup-title">
      <h3 id="setup-title" class="label col-title">{c.runTitle}</h3>

      <div class="tabs" role="group" aria-label={c.setupStep}>
        {#each c.setup as s, i}
          <button type="button" aria-pressed={i === step} onclick={() => pick(i)}>
            <span class="label">{i + 1}</span>
            {s.label}
          </button>
        {/each}
      </div>

      <p class="step-text">{c.setup[step].text}</p>

      <div class="terminal">
        <div class="term-bar">
          <span class="label">terminal</span>
          <button type="button" class="copy" onclick={copy} aria-label={c.copyLabel}>
            {copied ? c.copied : c.copy}
          </button>
        </div>
        <pre lang="en"><code>{code}</code></pre>
      </div>

      <a class="btn solid repo" href={REPO_URL} target="_blank" rel="noopener noreferrer">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.83 1.19 3.08 0 4.41-2.7 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" /></svg>
        miltostsalekkas/Sepe_repo
      </a>

      <p class="privacy">{c.privacy}</p>
    </section>
  </div>

  <div class="foot">
    <div class="notes">
      <p class="note">{c.dataNote}</p>
      <ul class="sources">
        {#each SOURCE_URLS as url, i}
          <li><a href={url} target="_blank" rel="noopener noreferrer">{c.sources[i]}</a></li>
        {/each}
      </ul>
    </div>
    <button type="button" class="btn" onclick={() => go(0)}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
      {c.back}
    </button>
  </div>
</div>

<style>
  .code-slide {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 28px;
  }

  .head {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .kicker {
    color: var(--accent);
  }

  h2 {
    font-size: clamp(48px, 5.6vw, 84px);
  }

  .head :global(code) {
    font-family: var(--mono);
    font-size: 0.9em;
  }

  .cols {
    display: flex;
    flex-wrap: wrap;
    gap: 28px 48px;
  }

  .col:first-child {
    flex-grow: 1.4;
  }

  .col {
    flex: 1 1 380px;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .col-title {
    margin: 0;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--line);
    color: var(--accent);
    font-weight: 500;
  }

  .how {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 14px 24px;
  }

  .how li {
    display: grid;
    grid-template-columns: 30px 1fr;
    gap: 10px;
  }

  .how .n {
    padding-top: 3px;
    color: var(--accent);
  }

  .t {
    font-size: 17px;
    font-weight: 600;
  }

  .how p {
    margin: 2px 0 0;
    font-size: 15px;
    line-height: 1.45;
    opacity: 0.85;
  }

  .tabs {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    border: 1px solid var(--line);
  }

  .tabs button {
    min-height: 44px;
    border: 0;
    background: transparent;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 15px;
    font-weight: 500;
  }

  .tabs button + button {
    border-left: 1px solid var(--line);
  }

  .tabs button .label {
    opacity: 0.7;
  }

  .tabs button[aria-pressed='true'] {
    background: var(--accent);
    color: var(--on-accent);
  }

  .step-text {
    margin: 0;
    font-size: 15px;
    line-height: 1.45;
  }

  .terminal {
    background: var(--sage-ink);
    color: #e9efe6;
    border-radius: 8px;
    overflow: hidden;
  }

  .term-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 8px 6px 16px;
    border-bottom: 1px solid rgba(233, 239, 230, 0.15);
  }

  .term-bar .label {
    font-size: 11px;
    opacity: 0.6;
  }

  pre {
    margin: 0;
    padding: 14px 16px;
    min-height: 76px;
    overflow-x: auto;
    font-family: var(--mono);
    font-size: 14px;
    line-height: 1.6;
  }

  .copy {
    min-height: 36px;
    min-width: 64px;
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid rgba(233, 239, 230, 0.35);
    background: transparent;
    color: #e9efe6;
    cursor: pointer;
    font-family: var(--mono);
    font-size: 12px;
  }

  .copy:hover {
    background: rgba(233, 239, 230, 0.12);
  }

  .repo {
    align-self: flex-start;
    text-decoration: none;
  }

  .privacy {
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
    opacity: 0.8;
  }

  .foot {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 16px 20px;
    border-top: 1px solid var(--line);
    padding-top: 14px;
  }

  .notes {
    max-width: 640px;
  }

  .note {
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
    opacity: 0.85;
  }

  .sources {
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 13px;
  }

  .sources a {
    color: inherit;
    text-underline-offset: 3px;
    display: inline-block;
    padding: 3px 0;
  }

  @media (max-width: 560px) {
    pre {
      font-size: 12.5px;
    }

    .tabs {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .tabs button:nth-child(3) {
      border-left: 0;
    }

    .tabs button:nth-child(n + 3) {
      border-top: 1px solid var(--line);
    }
  }
</style>
