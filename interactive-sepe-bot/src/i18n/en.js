// English. Strings with markup (<em>, <strong>, <br />, <code>) are
// rendered as HTML; they are static and written here, never user input.

export default {
  locale: 'en-US',

  ui: {
    deck: 'SEPE bot case study',
    brand: 'Case study —',
    brandName: 'SEPE appointment bot',
    language: 'Language',
    slides: 'Slides',
    prev: 'Previous slide',
    next: 'Next slide',
    goTo: (n) => `Go to slide ${n}`,
    slideOf: (n, total) => `${n} of ${total}`,
    swipe: 'Swipe →',
  },

  chapters: ['Intro', '01 The problem', '02 The counter-move', '02 The counter-move', '03 The wait', '03 The wait', '04 The code'],

  cover: {
    tag: 'Case study',
    title: '1,839 tries <br />for <em>one</em> <br />appointment',
    body: 'Getting a cita previa at SEPE has become a race against resellers’ bots. This is the story of how we raced back, with a bot of our own, and found a free appointment.',
    start: 'Start',
  },

  problem: {
    kicker: '01 — The problem',
    p1: 'To start an alta inicial de prestación contributiva, you first ask SEPE for a cita previa. In Barcelona, the booking page answers with the same sentence almost every time.',
    p2: 'It is not only demand. Intermediaries have been reported running bots that ask SEPE nonstop, grab each slot the moment it is released and <strong>sell it back</strong> to people who need it, for an appointment that is free.',
    facts: [
      { value: '1,838', label: 'times in a row SEPE said no' },
      { value: '€99', label: 'what resellers reportedly charge for a free appointment' },
      { value: '14 min', label: 'how long the one slot stayed open' },
    ],
    tryLabel: 'Try it yourself',
    idle: 'Press the button to ask for an appointment.',
    ask: 'Ask SEPE for an appointment',
    attempt: (n) => `Attempt ${n}`,
    reply: (n) => {
      if (n <= 1) return 'Try again in a minute. Maybe.';
      if (n <= 3) return 'Still nothing. Somewhere, a reseller’s bot is asking too, every few seconds.';
      if (n <= 6) return 'This is where most people give up, or pay someone to do it for them.';
      return `You have asked ${n} times. Our bot asked 1,839 times, every 20 seconds through the night, before the answer changed.`;
    },
  },

  goal: {
    kicker: '02 — The counter-move',
    title: 'Fight the bots <em>with a bot.</em>',
    p1: 'If bots empty the calendar, a person refreshing by hand will always lose. So we turned their tool around: a small bot that asks for <strong>one appointment, for one person</strong>, and never sells anything.',
    p2: 'It fills in SEPE’s form every 20 seconds, day and night, and stays silent until the answer changes. Then it sends one Telegram message, wherever you are. Tap the messages on the phone.',
    messageType: 'Message type',
    tabs: { start: 'Bot starts', hit: 'Appointment', channel: 'Presencial' },
    screenshot: '+ screenshot of the page',
  },

  how: {
    kicker: '02 — The counter-move · one check',
    title: 'One check, <em>eight</em> steps',
    body: 'Every 20 seconds the bot fills in SEPE’s form from scratch, the same way you would by hand. Press play to watch one check, or pick a step.',
    play: 'Play a check',
    pause: 'Pause',
    stepOf: (n, total) => `Step ${n} of ${total}`,
    steps: [
      { label: 'Open page', title: 'Open the cita previa page', body: 'The bot opens SEPE’s cita previa site in a real browser window, just like you would.' },
      { label: 'Postal code', title: 'Type the postal code', body: 'It types 08014 into the search box, one character at a time, until SEPE recognises it.' },
      { label: 'Trámite', title: 'Choose the trámite', body: '“He finalizado un trabajo: acceso o reanudación de prestación o subsidio.”' },
      { label: 'Subtrámite', title: 'Choose the subtrámite', body: '“Alta inicial de prestación contributiva, que no necesiten aportar documentación adicional.”' },
      { label: 'NIE', title: 'Fill in the NIE', body: 'The applicant’s NIE goes in the identity field. It never appears in any message.' },
      { label: 'Continuar', title: 'Press Continuar', body: 'It presses Continuar and waits for SEPE to load the next page, however slow it is.' },
      { label: 'Channel', title: 'Pick the channel', body: 'It selects Telefónica, and checks whether any other option, like Presencial, has appeared.' },
      { label: 'Answer', title: 'Read the answer', body: '“No podemos ofrecerle citas” means nothing yet, so it tries again in 20 seconds. If that sentence is gone, your phone buzzes.' },
    ],
  },

  night: {
    kicker: '03 — The wait',
    title: 'Then it asked <em>all night</em>',
    body: 'Every 20 seconds, about 165 times an hour, while everyone slept. SEPE’s answer: no, no, no… until 09:15 the next morning.',
    count: 'Answers from SEPE',
    replay: 'Replay the night',
    checks: (n) => `${n} checks`,
    notes: [
      'The first checks of the evening, from 21:37.',
      'Settling in. From 22:37 it ran without a break.',
      ...Array(8).fill('Every answer: no appointments.'),
      'Still nothing, and no messages: there was nothing to tell.',
      'From 08:06 it also saved SEPE’s justificante, proof of the attempt, every 5 minutes.',
      '09:15:51: the “no appointments” sentence is gone.',
    ],
  },

  moment: {
    kicker: '03 — The wait · the moment',
    title: '<em>09:15:51.</em> <br />Found one.',
    body: 'After 1,839 tries, the answer changed. With resellers’ bots hunting the same slots, seconds matter. This is what happens right after.',
    replay: 'Replay',
    events: [
      { time: '09:15:51', text: 'SEPE’s “no appointments” sentence disappears from the page.' },
      { time: '+1 s', text: 'Your phone buzzes: a Telegram alert, with a screenshot of the page.' },
      { time: '+2 s', text: 'The bot stops checking and keeps the page open, browser window in front.' },
      { time: 'You', text: 'Walk to the computer and book the appointment on the open page.' },
    ],
  },

  code: {
    kicker: '04 — The code',
    title: 'How it <em>works</em>',
    body: 'The bot is a single Python script, <code>sepe_bot.py</code>, built on Playwright. The code is public on GitHub: read it, run it for your own appointment, or adapt it to another trámite.',
    whatTitle: 'What the script does',
    runTitle: 'Run it yourself',
    setupStep: 'Setup step',
    copy: 'Copy',
    copied: 'Copied',
    copyLabel: 'Copy commands',
    privacy: 'Your .env, the log, screenshots and justificantes contain your NIE. They stay on your computer and are excluded from git.',
    dataNote: 'Figures from the bot’s own log, 7 October 21:37 to 8 October 09:30. On reselling:',
    sources: ['Genbeta — the illegal sale of SEPE appointments, up to €99 (in Spanish)', 'The Local — Spain arrests 69 for blocking appointments with bots'],
    back: 'Back to start',
    howItWorks: [
      { title: 'Fill in the form', body: 'Playwright opens Chromium and fills in postal code, trámite, subtrámite and NIE, then picks the Telefónica channel.' },
      { title: 'Read the answer', body: 'If the page contains “no podemos ofrecerle citas”, there is no slot. Anything else counts as a possible appointment.' },
      { title: 'Repeat', body: 'Every 20 seconds (CHECK_INTERVAL). After 3 failed checks in a row it restarts the browser.' },
      { title: 'Alert and pause', body: 'On a slot, or a channel other than Telefónica, it sends a Telegram message with a screenshot and stops until you press Enter.' },
      { title: 'Keep proof', body: 'While nothing is available, it saves SEPE’s justificante PDF every 5 minutes in justificantes/.' },
      { title: 'Log', body: 'Every event is one JSON line in sepe_log.jsonl; screenshots go to screenshots/.' },
    ],
    setup: [
      { label: 'Clone', text: 'Get the code from GitHub.' },
      { label: 'Install', text: 'Python 3.9+ and the browser Playwright drives.' },
      { label: 'Configure', text: 'Copy the template and fill in your own values. .env is ignored by git.' },
      { label: 'Run', text: 'A browser window opens and the checks start. Ctrl+C stops it.' },
    ],
  },
};
