import en from './en.js';
import es from './es.js';
import ca from './ca.js';

const dicts = { en, es, ca };

export const LANGS = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'ca', label: 'CA', name: 'Català' },
];

// Saved choice first, then the browser's language, then English.
function initial() {
  try {
    const saved = localStorage.getItem('lang');
    if (dicts[saved]) return saved;
  } catch {
    // Storage blocked: fall through.
  }
  const browser = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return dicts[browser] ? browser : 'en';
}

export const lang = $state({ code: initial() });

document.documentElement.lang = lang.code;

export function setLang(code) {
  if (!dicts[code]) return;
  lang.code = code;
  document.documentElement.lang = code;
  try {
    localStorage.setItem('lang', code);
  } catch {
    // Not saved; the choice still applies for this visit.
  }
}

// The current language's texts. Reactive inside $derived / templates.
export function t() {
  return dicts[lang.code];
}
