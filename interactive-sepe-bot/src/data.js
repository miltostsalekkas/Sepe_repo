// Numbers, links and code shared by every language.
// Figures come from the bot's log (sepe_log.jsonl),
// 7 October 2026 21:37 to 8 October 2026 09:30.
// All wording lives in src/i18n/.

export const TRIES = 1839;

// SEPE's answer, word for word (always in Spanish).
export const NO_SLOTS = 'En estos momentos no podemos ofrecerle citas en la oficina seleccionada.';

export const REPO_URL = 'https://github.com/miltostsalekkas/Sepe_repo';

export const SOURCE_URLS = [
  'https://www.genbeta.com/laboral/para-no-perder-su-prestacion-cada-vez-desempleados-recurren-a-venta-ilegal-citas-sepe-les-sale-99-euros',
  'https://www.thelocal.es/20230515/spain-arrests-69-for-blocking-foreign-office-appointments',
];

// Checks per hour; the last hour is when the appointment appeared.
export const HOURS = [
  { label: '21h', total: 44 },
  { label: '22h', total: 127 },
  { label: '23h', total: 164 },
  { label: '00h', total: 165 },
  { label: '01h', total: 164 },
  { label: '02h', total: 165 },
  { label: '03h', total: 165 },
  { label: '04h', total: 165 },
  { label: '05h', total: 164 },
  { label: '06h', total: 165 },
  { label: '07h', total: 164 },
  { label: '08h', total: 145 },
  { label: '09h', total: 44, found: true },
];

// Commands for each setup step (same in every language).
export const SETUP_CODE = [
  'git clone https://github.com/miltostsalekkas/Sepe_repo.git\ncd Sepe_repo',
  'pip install -r requirements.txt\npython -m playwright install chromium',
  'copy .env.example .env    # macOS/Linux: cp .env.example .env\n\nSEPE_NIE=\nSEPE_POSTAL_CODE=\nTELEGRAM_BOT_TOKEN=\nTELEGRAM_CHAT_ID=',
  'python sepe_bot.py',
];

// The bot's Telegram messages, as it sends them (in English).
export const MESSAGES = [
  {
    key: 'start',
    title: 'SEPE bot started.',
    lines: ['Checking every 20 seconds.', 'You will be notified if an appointment or the Presencial channel becomes available.'],
    time: '08:06',
  },
  {
    key: 'hit',
    title: 'SEPE APPOINTMENT ALERT',
    lines: ['An appointment may now be available!', 'Please check the SEPE browser immediately.'],
    time: '09:15',
    loud: true,
    screenshot: true,
  },
  {
    key: 'channel',
    title: 'SEPE NEW CHANNEL AVAILABLE',
    lines: ['The channel dropdown now has more than just Telefónica:', '• Telefónica', '• Presencial'],
    time: '—',
    loud: true,
  },
];
