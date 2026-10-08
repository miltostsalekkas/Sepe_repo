<script>
  import { LANGS, lang, setLang, t } from '../i18n/index.svelte.js';
</script>

<div class="switch" role="group" aria-label={t().ui.language}>
  {#each LANGS as l}
    <button
      type="button"
      lang={l.code}
      aria-pressed={lang.code === l.code}
      aria-label={l.name}
      title={l.name}
      onclick={() => setLang(l.code)}
    >
      {l.label}
    </button>
  {/each}
</div>

<style>
  .switch {
    display: inline-flex;
    border: 1px solid currentColor;
    border-radius: 999px;
    padding: 2px;
    background: var(--bg);
  }

  button {
    min-width: 44px;
    min-height: 40px;
    padding: 0 10px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: inherit;
    cursor: pointer;
    font-family: var(--mono);
    font-size: 12px;
    letter-spacing: 0.06em;
  }

  button[aria-pressed='true'] {
    background: var(--accent);
    color: var(--on-accent);
  }
</style>
