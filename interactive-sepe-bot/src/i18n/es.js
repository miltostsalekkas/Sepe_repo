// Español. Las cadenas con marcado (<em>, <strong>, <br />, <code>) se
// muestran como HTML; son estáticas y están escritas aquí.

export default {
  locale: 'es-ES',

  ui: {
    deck: 'Caso de estudio del bot del SEPE',
    brand: 'Caso de estudio —',
    brandName: 'Bot de citas del SEPE',
    language: 'Idioma',
    slides: 'Diapositivas',
    prev: 'Diapositiva anterior',
    next: 'Diapositiva siguiente',
    goTo: (n) => `Ir a la diapositiva ${n}`,
    slideOf: (n, total) => `${n} de ${total}`,
    swipe: 'Desliza →',
  },

  chapters: ['Intro', '01 El problema', '02 La contraofensiva', '02 La contraofensiva', '03 La espera', '03 La espera', '04 El código'],

  cover: {
    tag: 'Caso de estudio',
    title: '1.839 <br />intentos <br />para <em>una</em> cita',
    body: 'Conseguir una cita previa en el SEPE se ha convertido en una carrera contra los bots de los revendedores. Esta es la historia de cómo competimos con un bot propio y encontramos una cita gratuita.',
    start: 'Empezar',
  },

  problem: {
    kicker: '01 — El problema',
    p1: 'Para tramitar un alta inicial de prestación contributiva, primero hay que pedir cita previa al SEPE. En Barcelona, la web de citas responde casi siempre con la misma frase.',
    p2: 'No es solo la demanda. Se ha denunciado que hay intermediarios con bots que consultan al SEPE sin parar, se quedan cada cita en cuanto se libera y <strong>la revenden</strong> a quien la necesita, aunque la cita es gratuita.',
    facts: [
      { value: '1.838', label: 'veces seguidas que el SEPE dijo que no' },
      { value: '99 €', label: 'lo que, según se ha publicado, cobran los revendedores por una cita gratuita' },
      { value: '14 min', label: 'lo que estuvo disponible la única cita' },
    ],
    tryLabel: 'Pruébalo tú',
    idle: 'Pulsa el botón para pedir una cita.',
    ask: 'Pedir cita al SEPE',
    attempt: (n) => `Intento ${n}`,
    reply: (n) => {
      if (n <= 1) return 'Vuelve a intentarlo en un minuto. Quizá.';
      if (n <= 3) return 'Nada todavía. En algún lugar, el bot de un revendedor también está preguntando, cada pocos segundos.';
      if (n <= 6) return 'Aquí es donde la mayoría se rinde, o paga a alguien para que lo haga por ella.';
      return `Has preguntado ${n} veces. Nuestro bot preguntó 1.839 veces, cada 20 segundos durante toda la noche, antes de que la respuesta cambiara.`;
    },
  },

  goal: {
    kicker: '02 — La contraofensiva',
    title: 'Contra los bots, <em>un bot.</em>',
    p1: 'Si los bots vacían el calendario, quien refresca a mano siempre pierde. Así que le dimos la vuelta a su herramienta: un pequeño bot que pide <strong>una cita, para una persona</strong>, y nunca vende nada.',
    p2: 'Rellena el formulario del SEPE cada 20 segundos, de día y de noche, y no dice nada hasta que la respuesta cambia. Entonces envía un mensaje de Telegram, estés donde estés. Toca los mensajes del móvil.',
    messageType: 'Tipo de mensaje',
    tabs: { start: 'Al arrancar', hit: 'Cita', channel: 'Presencial' },
    screenshot: '+ captura de la página',
  },

  how: {
    kicker: '02 — La contraofensiva · una consulta',
    title: 'Una consulta, <em>ocho</em> pasos',
    body: 'Cada 20 segundos el bot rellena el formulario del SEPE desde cero, igual que lo harías tú a mano. Pulsa play para ver una consulta, o elige un paso.',
    play: 'Ver una consulta',
    pause: 'Pausa',
    stepOf: (n, total) => `Paso ${n} de ${total}`,
    steps: [
      { label: 'Abrir la web', title: 'Abrir la web de cita previa', body: 'El bot abre la web de cita previa del SEPE en una ventana de navegador real, igual que harías tú.' },
      { label: 'Código postal', title: 'Escribir el código postal', body: 'Escribe 08014 en el buscador, carácter a carácter, hasta que el SEPE lo reconoce.' },
      { label: 'Trámite', title: 'Elegir el trámite', body: '«He finalizado un trabajo: acceso o reanudación de prestación o subsidio».' },
      { label: 'Subtrámite', title: 'Elegir el subtrámite', body: '«Alta inicial de prestación contributiva, que no necesiten aportar documentación adicional».' },
      { label: 'NIE', title: 'Introducir el NIE', body: 'El NIE de la persona va en el campo de identidad. Nunca aparece en ningún mensaje.' },
      { label: 'Continuar', title: 'Pulsar Continuar', body: 'Pulsa Continuar y espera a que el SEPE cargue la página siguiente, por lenta que sea.' },
      { label: 'Canal', title: 'Elegir el canal', body: 'Selecciona Telefónica y comprueba si ha aparecido otra opción, como Presencial.' },
      { label: 'Respuesta', title: 'Leer la respuesta', body: '«No podemos ofrecerle citas» significa que aún no hay nada, así que vuelve a probar en 20 segundos. Si esa frase desaparece, tu móvil vibra.' },
    ],
  },

  night: {
    kicker: '03 — La espera',
    title: 'Y preguntó <em>toda la noche</em>',
    body: 'Cada 20 segundos, unas 165 veces por hora, mientras todo el mundo dormía. La respuesta del SEPE: no, no, no… hasta las 09:15 de la mañana siguiente.',
    count: 'Respuestas del SEPE',
    replay: 'Repetir la noche',
    checks: (n) => `${n} consultas`,
    notes: [
      'Las primeras consultas de la noche, desde las 21:37.',
      'Arrancando. Desde las 22:37 funcionó sin parar.',
      ...Array(8).fill('Todas las respuestas: no hay citas.'),
      'Todavía nada, y ningún mensaje: no había nada que contar.',
      'Desde las 08:06 también guardaba el justificante del SEPE, la prueba del intento, cada 5 minutos.',
      '09:15:51: la frase de «no hay citas» desaparece.',
    ],
  },

  moment: {
    kicker: '03 — La espera · el momento',
    title: '<em>09:15:51.</em> <br />Hay una.',
    body: 'Después de 1.839 intentos, la respuesta cambió. Con los bots de los revendedores buscando las mismas citas, cada segundo cuenta. Esto es lo que pasa justo después.',
    replay: 'Repetir',
    events: [
      { time: '09:15:51', text: 'La frase de «no hay citas» desaparece de la página.' },
      { time: '+1 s', text: 'Tu móvil vibra: una alerta de Telegram, con una captura de la página.' },
      { time: '+2 s', text: 'El bot deja de consultar y mantiene la página abierta, con el navegador en primer plano.' },
      { time: 'Tú', text: 'Vas al ordenador y reservas la cita en la página abierta.' },
    ],
  },

  code: {
    kicker: '04 — El código',
    title: 'Cómo <em>funciona</em>',
    body: 'El bot es un único script de Python, <code>sepe_bot.py</code>, hecho con Playwright. El código es público en GitHub: puedes leerlo, usarlo para tu propia cita o adaptarlo a otro trámite.',
    whatTitle: 'Qué hace el script',
    runTitle: 'Úsalo tú',
    setupStep: 'Paso de instalación',
    copy: 'Copiar',
    copied: 'Copiado',
    copyLabel: 'Copiar comandos',
    privacy: 'Tu .env, el registro, las capturas y los justificantes contienen tu NIE. Se quedan en tu ordenador y están excluidos de git.',
    dataNote: 'Datos del propio registro del bot, del 7 de octubre a las 21:37 al 8 de octubre a las 09:30. Sobre la reventa:',
    sources: ['Genbeta — la venta ilegal de citas del SEPE, hasta 99 €', 'The Local — España detiene a 69 personas por bloquear citas con bots (en inglés)'],
    back: 'Volver al inicio',
    howItWorks: [
      { title: 'Rellenar el formulario', body: 'Playwright abre Chromium y rellena código postal, trámite, subtrámite y NIE, y luego elige el canal Telefónica.' },
      { title: 'Leer la respuesta', body: 'Si la página contiene «no podemos ofrecerle citas», no hay cita. Cualquier otra cosa cuenta como posible cita.' },
      { title: 'Repetir', body: 'Cada 20 segundos (CHECK_INTERVAL). Tras 3 consultas fallidas seguidas, reinicia el navegador.' },
      { title: 'Avisar y pausar', body: 'Si hay cita, o un canal distinto de Telefónica, envía un mensaje de Telegram con una captura y se detiene hasta que pulses Enter.' },
      { title: 'Guardar la prueba', body: 'Mientras no hay nada, guarda el PDF del justificante del SEPE cada 5 minutos en justificantes/.' },
      { title: 'Registrar', body: 'Cada evento es una línea JSON en sepe_log.jsonl; las capturas van a screenshots/.' },
    ],
    setup: [
      { label: 'Clonar', text: 'Descarga el código de GitHub.' },
      { label: 'Instalar', text: 'Python 3.9+ y el navegador que usa Playwright.' },
      { label: 'Configurar', text: 'Copia la plantilla y rellena tus datos. .env está excluido de git.' },
      { label: 'Ejecutar', text: 'Se abre una ventana del navegador y empiezan las consultas. Ctrl+C lo detiene.' },
    ],
  },
};
