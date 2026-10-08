// Figures from the bot's log (sepe_log.jsonl),
// 7 October 2026 21:37 to 8 October 2026 09:30.

export const TRIES = 1839;

// SEPE's answer, word for word.
export const NO_SLOTS = 'En estos momentos no podemos ofrecerle citas en la oficina seleccionada.';

export const problemFacts = [
  { value: '1,838', label: 'times in a row SEPE said no' },
  { value: '€99', label: 'what resellers reportedly charge for a free appointment' },
  { value: '14 min', label: 'how long the one slot stayed open' },
];

// What the person sees after each press of "Ask SEPE".
export function tryReply(n) {
  if (n <= 1) return 'Try again in a minute. Maybe.';
  if (n <= 3) return 'Still nothing. Somewhere, a reseller’s bot is asking too, every few seconds.';
  if (n <= 6) return 'This is where most people give up, or pay someone to do it for them.';
  return `You have asked ${n} times. Our bot asked ${TRIES.toLocaleString('en-US')} times, every 20 seconds through the night, before the answer changed.`;
}

// Where the reselling claims come from.
export const sources = [
  {
    label: 'Genbeta — the illegal sale of SEPE appointments, up to €99',
    url: 'https://www.genbeta.com/laboral/para-no-perder-su-prestacion-cada-vez-desempleados-recurren-a-venta-ilegal-citas-sepe-les-sale-99-euros',
  },
  {
    label: 'The Local — Spain arrests 69 for blocking appointments with bots',
    url: 'https://www.thelocal.es/20230515/spain-arrests-69-for-blocking-foreign-office-appointments',
  },
];

// What the bot sends on Telegram (texts as the bot sends them).
export const messages = [
  {
    key: 'start',
    tab: 'Bot starts',
    title: 'SEPE bot started.',
    lines: ['Checking every 20 seconds.', 'You will be notified if an appointment or the Presencial channel becomes available.'],
    time: '08:06',
  },
  {
    key: 'hit',
    tab: 'Appointment',
    title: 'SEPE APPOINTMENT ALERT',
    lines: ['An appointment may now be available!', 'Please check the SEPE browser immediately.', '+ screenshot of the page'],
    time: '09:15',
    loud: true,
  },
  {
    key: 'channel',
    tab: 'Presencial',
    title: 'SEPE NEW CHANNEL AVAILABLE',
    lines: ['The channel dropdown now has more than just Telefónica:', '• Telefónica', '• Presencial'],
    time: '—',
    loud: true,
  },
];

export const steps = [
  { label: 'Open page', title: 'Open the cita previa page', body: 'The bot opens SEPE’s cita previa site in a real browser window, just like you would.' },
  { label: 'Postal code', title: 'Type the postal code', body: 'It types 08014 into the search box, one character at a time, until SEPE recognises it.' },
  { label: 'Trámite', title: 'Choose the trámite', body: '“He finalizado un trabajo: acceso o reanudación de prestación o subsidio.”' },
  { label: 'Subtrámite', title: 'Choose the subtrámite', body: '“Alta inicial de prestación contributiva, que no necesiten aportar documentación adicional.”' },
  { label: 'NIE', title: 'Fill in the NIE', body: 'The applicant’s NIE goes in the identity field. It never appears in any message.' },
  { label: 'Continuar', title: 'Press Continuar', body: 'It presses Continuar and waits for SEPE to load the next page, however slow it is.' },
  { label: 'Channel', title: 'Pick the channel', body: 'It selects Telefónica, and checks whether any other option, like Presencial, has appeared.' },
  { label: 'Answer', title: 'Read the answer', body: '“No podemos ofrecerle citas” means nothing yet, so it tries again in 20 seconds. If that sentence is gone, your phone buzzes.' },
];

const quiet = 'Every answer: no appointments.';

export const hours = [
  { label: '21h', total: 44, note: 'The first checks of the evening, from 21:37.' },
  { label: '22h', total: 127, note: 'Settling in. From 22:37 it ran without a break.' },
  { label: '23h', total: 164, note: quiet },
  { label: '00h', total: 165, note: quiet },
  { label: '01h', total: 164, note: quiet },
  { label: '02h', total: 165, note: quiet },
  { label: '03h', total: 165, note: quiet },
  { label: '04h', total: 165, note: quiet },
  { label: '05h', total: 164, note: quiet },
  { label: '06h', total: 165, note: quiet },
  { label: '07h', total: 164, note: 'Still nothing, and no messages: there was nothing to tell.' },
  { label: '08h', total: 145, note: 'From 08:06 it also saved SEPE’s justificante, proof of the attempt, every 5 minutes.' },
  { label: '09h', total: 44, note: '09:15:51: the “no appointments” sentence is gone.', found: true },
];

// What the bot does the moment it sees a slot.
export const moment = [
  { time: '09:15:51', text: 'SEPE’s “no appointments” sentence disappears from the page.', found: true },
  { time: '+1 s', text: 'Your phone buzzes: a Telegram alert, with a screenshot of the page.' },
  { time: '+2 s', text: 'The bot stops checking and keeps the page open, browser window in front.' },
  { time: 'You', text: 'Walk to the computer and book the appointment on the open page.' },
];

export const REPO_URL = 'https://github.com/miltostsalekkas/Sepe_repo';

// How sepe_bot.py works, in the order things happen.
export const howItWorks = [
  { title: 'Fill in the form', body: 'Playwright opens Chromium and fills in postal code, trámite, subtrámite and NIE, then picks the Telefónica channel.' },
  { title: 'Read the answer', body: 'If the page contains “no podemos ofrecerle citas”, there is no slot. Anything else counts as a possible appointment.' },
  { title: 'Repeat', body: 'Every 20 seconds (CHECK_INTERVAL). After 3 failed checks in a row it restarts the browser.' },
  { title: 'Alert and pause', body: 'On a slot, or a channel other than Telefónica, it sends a Telegram message with a screenshot and stops until you press Enter.' },
  { title: 'Keep proof', body: 'While nothing is available, it saves SEPE’s justificante PDF every 5 minutes in justificantes/.' },
  { title: 'Log', body: 'Every event is one JSON line in sepe_log.jsonl; screenshots go to screenshots/.' },
];

// Setup steps shown as tabs, each with commands to copy.
export const setup = [
  {
    label: 'Clone',
    text: 'Get the code from GitHub.',
    code: 'git clone https://github.com/miltostsalekkas/Sepe_repo.git\ncd Sepe_repo',
  },
  {
    label: 'Install',
    text: 'Python 3.9+ and the browser Playwright drives.',
    code: 'pip install -r requirements.txt\npython -m playwright install chromium',
  },
  {
    label: 'Configure',
    text: 'Copy the template and fill in your own values. .env is ignored by git.',
    code: 'copy .env.example .env    # macOS/Linux: cp .env.example .env\n\nSEPE_NIE=\nSEPE_POSTAL_CODE=\nTELEGRAM_BOT_TOKEN=\nTELEGRAM_CHAT_ID=',
  },
  {
    label: 'Run',
    text: 'A browser window opens and the checks start. Ctrl+C stops it.',
    code: 'python sepe_bot.py',
  },
];
