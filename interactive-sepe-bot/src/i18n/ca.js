// Català. Les cadenes amb marcatge (<em>, <strong>, <br />, <code>) es
// mostren com a HTML; són estàtiques i estan escrites aquí.

export default {
  locale: 'ca-ES',

  ui: {
    deck: 'Cas d’estudi del bot del SEPE',
    brand: 'Cas d’estudi —',
    brandName: 'Bot de cites del SEPE',
    language: 'Idioma',
    slides: 'Diapositives',
    prev: 'Diapositiva anterior',
    next: 'Diapositiva següent',
    goTo: (n) => `Anar a la diapositiva ${n}`,
    slideOf: (n, total) => `${n} de ${total}`,
    swipe: 'Llisca →',
  },

  chapters: ['Intro', '01 El problema', '02 La contraofensiva', '02 La contraofensiva', '03 L’espera', '03 L’espera', '04 El codi'],

  cover: {
    tag: 'Cas d’estudi',
    title: '1.839 <br />intents <br />per a <em>una</em> cita',
    body: 'Aconseguir una cita prèvia al SEPE s’ha convertit en una cursa contra els bots dels revenedors. Aquesta és la història de com hi vam competir amb un bot propi i vam trobar una cita gratuïta.',
    start: 'Començar',
  },

  problem: {
    kicker: '01 — El problema',
    p1: 'Per tramitar una alta inicial de prestació contributiva, primer cal demanar cita prèvia al SEPE. A Barcelona, el web de cites respon gairebé sempre amb la mateixa frase.',
    p2: 'No és només la demanda. S’ha denunciat que hi ha intermediaris amb bots que consulten el SEPE sense parar, es queden cada cita tan bon punt s’allibera i <strong>la revenen</strong> a qui la necessita, tot i que la cita és gratuïta.',
    facts: [
      { value: '1.838', label: 'vegades seguides que el SEPE va dir que no' },
      { value: '99 €', label: 'el que, segons s’ha publicat, cobren els revenedors per una cita gratuïta' },
      { value: '14 min', label: 'el temps que va estar disponible l’única cita' },
    ],
    tryLabel: 'Prova-ho tu',
    idle: 'Prem el botó per demanar una cita.',
    ask: 'Demanar cita al SEPE',
    attempt: (n) => `Intent ${n}`,
    reply: (n) => {
      if (n <= 1) return 'Torna-ho a provar d’aquí a un minut. Potser.';
      if (n <= 3) return 'Encara res. En algun lloc, el bot d’un revenedor també pregunta, cada pocs segons.';
      if (n <= 6) return 'Aquí és on la majoria es rendeix, o paga algú perquè ho faci per ella.';
      return `Has preguntat ${n} vegades. El nostre bot va preguntar 1.839 vegades, cada 20 segons durant tota la nit, abans que la resposta canviés.`;
    },
  },

  goal: {
    kicker: '02 — La contraofensiva',
    title: 'Contra els bots, <em>un bot.</em>',
    p1: 'Si els bots buiden el calendari, qui refresca a mà sempre perd. Així que vam girar la seva eina: un petit bot que demana <strong>una cita, per a una persona</strong>, i no ven mai res.',
    p2: 'Omple el formulari del SEPE cada 20 segons, de dia i de nit, i no diu res fins que la resposta canvia. Llavors envia un missatge de Telegram, siguis on siguis. Toca els missatges del mòbil.',
    messageType: 'Tipus de missatge',
    tabs: { start: 'En arrencar', hit: 'Cita', channel: 'Presencial' },
    screenshot: '+ captura de la pàgina',
  },

  how: {
    kicker: '02 — La contraofensiva · una consulta',
    title: 'Una consulta, <em>vuit</em> passos',
    body: 'Cada 20 segons el bot omple el formulari del SEPE des de zero, tal com ho faries tu a mà. Prem play per veure una consulta, o tria un pas.',
    play: 'Veure una consulta',
    pause: 'Pausa',
    stepOf: (n, total) => `Pas ${n} de ${total}`,
    steps: [
      { label: 'Obrir el web', title: 'Obrir el web de cita prèvia', body: 'El bot obre el web de cita prèvia del SEPE en una finestra de navegador real, tal com ho faries tu.' },
      { label: 'Codi postal', title: 'Escriure el codi postal', body: 'Escriu 08014 al cercador, caràcter a caràcter, fins que el SEPE el reconeix.' },
      { label: 'Tràmit', title: 'Triar el tràmit', body: '«He finalizado un trabajo: acceso o reanudación de prestación o subsidio».' },
      { label: 'Subtràmit', title: 'Triar el subtràmit', body: '«Alta inicial de prestación contributiva, que no necesiten aportar documentación adicional».' },
      { label: 'NIE', title: 'Introduir el NIE', body: 'El NIE de la persona va al camp d’identitat. No apareix mai en cap missatge.' },
      { label: 'Continuar', title: 'Prémer Continuar', body: 'Prem Continuar i espera que el SEPE carregui la pàgina següent, per lenta que sigui.' },
      { label: 'Canal', title: 'Triar el canal', body: 'Selecciona Telefónica i comprova si ha aparegut una altra opció, com ara Presencial.' },
      { label: 'Resposta', title: 'Llegir la resposta', body: '«No podemos ofrecerle citas» vol dir que encara no hi ha res, així que ho torna a provar d’aquí a 20 segons. Si aquesta frase desapareix, el teu mòbil vibra.' },
    ],
  },

  night: {
    kicker: '03 — L’espera',
    title: 'I va preguntar <em>tota la nit</em>',
    body: 'Cada 20 segons, unes 165 vegades per hora, mentre tothom dormia. La resposta del SEPE: no, no, no… fins a les 09:15 de l’endemà al matí.',
    count: 'Respostes del SEPE',
    replay: 'Repetir la nit',
    checks: (n) => `${n} consultes`,
    notes: [
      'Les primeres consultes del vespre, des de les 21:37.',
      'Engegant. Des de les 22:37 va funcionar sense parar.',
      ...Array(8).fill('Totes les respostes: no hi ha cites.'),
      'Encara res, i cap missatge: no hi havia res a explicar.',
      'Des de les 08:06 també desava el justificant del SEPE, la prova de l’intent, cada 5 minuts.',
      '09:15:51: la frase de «no hi ha cites» desapareix.',
    ],
  },

  moment: {
    kicker: '03 — L’espera · el moment',
    title: '<em>09:15:51.</em> <br />N’hi ha una.',
    body: 'Després de 1.839 intents, la resposta va canviar. Amb els bots dels revenedors buscant les mateixes cites, cada segon compta. Això és el que passa just després.',
    replay: 'Repetir',
    events: [
      { time: '09:15:51', text: 'La frase de «no hi ha cites» desapareix de la pàgina.' },
      { time: '+1 s', text: 'El teu mòbil vibra: una alerta de Telegram, amb una captura de la pàgina.' },
      { time: '+2 s', text: 'El bot deixa de consultar i manté la pàgina oberta, amb el navegador al davant.' },
      { time: 'Tu', text: 'Vas a l’ordinador i reserves la cita a la pàgina oberta.' },
    ],
  },

  code: {
    kicker: '04 — El codi',
    title: 'Com <em>funciona</em>',
    body: 'El bot és un únic script de Python, <code>sepe_bot.py</code>, fet amb Playwright. El codi és públic a GitHub: el pots llegir, fer-lo servir per a la teva pròpia cita o adaptar-lo a un altre tràmit.',
    whatTitle: 'Què fa l’script',
    runTitle: 'Fes-lo servir tu',
    setupStep: 'Pas d’instal·lació',
    copy: 'Copiar',
    copied: 'Copiat',
    copyLabel: 'Copiar les ordres',
    privacy: 'El teu .env, el registre, les captures i els justificants contenen el teu NIE. Es queden al teu ordinador i estan exclosos de git.',
    dataNote: 'Dades del registre del mateix bot, del 7 d’octubre a les 21:37 al 8 d’octubre a les 09:30. Sobre la revenda:',
    sources: ['Genbeta — la venda il·legal de cites del SEPE, fins a 99 € (en castellà)', 'The Local — Espanya deté 69 persones per bloquejar cites amb bots (en anglès)'],
    back: 'Tornar a l’inici',
    howItWorks: [
      { title: 'Omplir el formulari', body: 'Playwright obre Chromium i omple codi postal, tràmit, subtràmit i NIE, i després tria el canal Telefónica.' },
      { title: 'Llegir la resposta', body: 'Si la pàgina conté «no podemos ofrecerle citas», no hi ha cita. Qualsevol altra cosa compta com a possible cita.' },
      { title: 'Repetir', body: 'Cada 20 segons (CHECK_INTERVAL). Després de 3 consultes fallides seguides, reinicia el navegador.' },
      { title: 'Avisar i aturar-se', body: 'Si hi ha cita, o un canal diferent de Telefónica, envia un missatge de Telegram amb una captura i s’atura fins que premis Enter.' },
      { title: 'Desar la prova', body: 'Mentre no hi ha res, desa el PDF del justificant del SEPE cada 5 minuts a justificantes/.' },
      { title: 'Registrar', body: 'Cada esdeveniment és una línia JSON a sepe_log.jsonl; les captures van a screenshots/.' },
    ],
    setup: [
      { label: 'Clonar', text: 'Descarrega el codi de GitHub.' },
      { label: 'Instal·lar', text: 'Python 3.9+ i el navegador que fa servir Playwright.' },
      { label: 'Configurar', text: 'Copia la plantilla i omple les teves dades. .env està exclòs de git.' },
      { label: 'Executar', text: 'S’obre una finestra del navegador i comencen les consultes. Ctrl+C l’atura.' },
    ],
  },
};
