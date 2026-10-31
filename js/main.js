/* Hulk Sports · mejoras progresivas. Todo el contenido funciona sin este archivo. */
(function () {
  'use strict';

  // ---- Datos editables (un solo lugar) ----------------------------------
  var CONFIG = {
    whatsapp: '593996770074', // sin + ni espacios. Ver README para cambiarlo también en el HTML.
    zona: 'America/Guayaquil',
    mensajes: {
      general: 'Hola Hulk Sports, tengo una pregunta.',
      prueba: 'Hola Hulk Sports, quiero agendar una clase de prueba de jiu-jitsu.',
      ninos: 'Hola Hulk Sports, quiero información de jiu-jitsu para niños. Edad de mi hijo/a: ',
      planes: 'Hola Hulk Sports, ¿cuáles son los precios y planes vigentes?',
      fisio: 'Hola Hulk Sports, quiero consultar por el servicio de terapia física y deportiva.',
      gym: 'Hola Hulk Sports, quiero información del gimnasio: horario y precio.'
    },
    // Horario 2026 (flyer oficial). Día: 1 = lunes ... 5 = viernes.
    clases: [
      { d: 1, h: '06:00', n: 'BJJ Gi', t: 'gi' }, { d: 1, h: '17:00', n: 'BJJ Gi Kids', t: 'ninos' }, { d: 1, h: '18:30', n: 'BJJ Gi', t: 'gi' }, { d: 1, h: '20:00', n: 'MMA', t: 'mma' },
      { d: 2, h: '06:00', n: 'BJJ No-Gi', t: 'nogi' }, { d: 2, h: '17:00', n: 'BJJ No-Gi Kids', t: 'ninos' }, { d: 2, h: '18:30', n: 'BJJ No-Gi', t: 'nogi' }, { d: 2, h: '20:00', n: 'MMA', t: 'mma' },
      { d: 3, h: '06:00', n: 'BJJ Gi', t: 'gi' }, { d: 3, h: '17:00', n: 'BJJ Gi Kids', t: 'ninos' }, { d: 3, h: '18:30', n: 'BJJ Gi', t: 'gi' }, { d: 3, h: '20:00', n: 'MMA', t: 'mma' },
      { d: 4, h: '06:00', n: 'BJJ No-Gi', t: 'nogi' }, { d: 4, h: '17:00', n: 'BJJ Gi Kids', t: 'ninos' }, { d: 4, h: '18:30', n: 'BJJ Gi', t: 'gi' }, { d: 4, h: '20:00', n: 'MMA', t: 'mma' },
      { d: 5, h: '06:00', n: 'BJJ Gi', t: 'gi' }, { d: 5, h: '17:00', n: 'BJJ Gi Kids', t: 'ninos' }, { d: 5, h: '18:30', n: 'BJJ No-Gi', t: 'nogi' }, { d: 5, h: '20:00', n: 'Sparring', t: 'sparring' }
    ],
    // Horario referencial del gimnasio según Google (31 oct 2026), por confirmar. [abre, cierra] en minutos. Domingo (0) cerrado: sin entrada.
    gym: { 1: [360, 1260], 2: [360, 1260], 3: [360, 1260], 4: [360, 1260], 5: [360, 1260], 6: [480, 840] }
  };

  var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  var reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- WhatsApp: todos los enlaces salen de CONFIG ------------------------
  document.querySelectorAll('a[data-wa]').forEach(function (a) {
    var msg = CONFIG.mensajes[a.getAttribute('data-wa')] || CONFIG.mensajes.general;
    a.href = 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(msg);
  });

  // ---- Hora local de Quito -----------------------------------------------
  function ahora() {
    var partes = new Intl.DateTimeFormat('en-US', {
      timeZone: CONFIG.zona, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
      year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(new Date());
    var p = {};
    partes.forEach(function (x) { p[x.type] = x.value; });
    var dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday);
    return { dia: dia, min: parseInt(p.hour, 10) * 60 + parseInt(p.minute, 10), y: +p.year, m: +p.month, d: +p.day };
  }
  function aMin(h) { var s = h.split(':'); return +s[0] * 60 + +s[1]; }
  function aHora(m) { return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); }
  var hoy = ahora();

  function estadoGym() {
    var r = CONFIG.gym[hoy.dia];
    if (r && hoy.min >= r[0] && hoy.min < r[1]) return { abierto: true, texto: 'Gym abierto ahora, cierra a las ' + aHora(r[1]) };
    for (var i = 0; i < 8; i++) {
      var d = (hoy.dia + i) % 7, rr = CONFIG.gym[d];
      if (!rr) continue;
      if (i === 0 && hoy.min < rr[0]) return { abierto: false, texto: 'Gym cerrado, abre hoy a las ' + aHora(rr[0]) };
      if (i > 0) return { abierto: false, texto: 'Gym cerrado, abre el ' + DIAS[d] + ' a las ' + aHora(rr[0]) };
    }
    return { abierto: false, texto: 'Gym cerrado' };
  }

  // ---- Página 1: "hoy" en la franja --------------------------------------
  var lista = document.getElementById('hoy-lista');
  if (lista) {
    var titulo = document.getElementById('hoy-titulo');
    var deHoy = CONFIG.clases.filter(function (c) { return c.d === hoy.dia; });
    if (deHoy.length) {
      titulo.textContent = 'Hoy, ' + DIAS[hoy.dia];
      var marcada = false, html = '<ul>';
      deHoy.forEach(function (c) {
        var cls = '';
        if (aMin(c.h) + 60 <= hoy.min) cls = 'pasada';
        else if (!marcada) { cls = 'siguiente'; marcada = true; }
        html += '<li class="' + cls + '"><time>' + c.h + '</time> ' + c.n + (cls === 'siguiente' ? ' <span class="sr-only">(próxima)</span>' : '') + '</li>';
      });
      lista.innerHTML = html + '</ul>';
    } else {
      titulo.textContent = 'Hoy, ' + DIAS[hoy.dia];
      var g = estadoGym();
      lista.innerHTML = '<span>Sin clases hoy. Vuelven el lunes a las 06:00.</span><span class="mini">' + g.texto + ' (horario referencial según Google, oct 2026, <span class="pendiente" data-pendiente="horario-gym">por confirmar</span>).</span>';
    }
  }

  // ---- Página 2: pizarra --------------------------------------------------
  var pizarra = document.getElementById('pizarra');
  if (pizarra) {
    var diaHoy = pizarra.querySelector('.dia[data-dia="' + hoy.dia + '"]');
    if (diaHoy) {
      diaHoy.classList.add('es-hoy');
      var sig = Array.prototype.find.call(diaHoy.querySelectorAll('.clase'), function (li) { return aMin(li.dataset.hora) + 60 > hoy.min; });
      if (sig) sig.classList.add('siguiente');
    }
    var estado = document.getElementById('estado');
    var g2 = estadoGym();
    estado.innerHTML = '<span class="chip-estado' + (g2.abierto ? ' abierto' : '') + '">' + (g2.abierto ? 'Abierto' : 'Cerrado') + '</span>' +
      '<span>Hoy es ' + DIAS[hoy.dia] + '. ' + g2.texto + '.</span><span class="nota">Horario referencial según Google (oct 2026), <span class="pendiente" data-pendiente="horario-gym">por confirmar</span>.</span>';

    var botones = document.querySelectorAll('[data-filtro]');
    var resumen = document.getElementById('filtro-resumen');
    var nombres = { todo: 'clases de la semana', gi: 'clases de BJJ Gi', nogi: 'clases de BJJ No-Gi', ninos: 'clases de niños', mma: 'clases de MMA y sparring' };
    var filtro = 'todo';
    function coincide(tipo) { return filtro === 'todo' || tipo === filtro || (filtro === 'mma' && tipo === 'sparring'); }
    botones.forEach(function (b) {
      b.addEventListener('click', function () {
        filtro = b.dataset.filtro;
        botones.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        var n = 0;
        pizarra.querySelectorAll('.clase').forEach(function (li) {
          var ok = coincide(li.dataset.tipo);
          li.classList.toggle('apagada', !ok);
          if (ok) { li.removeAttribute('aria-hidden'); n++; } else li.setAttribute('aria-hidden', 'true');
        });
        resumen.textContent = 'Mostrando ' + n + ' ' + nombres[filtro] + '.';
      });
    });

    // .ics con las clases del filtro activo
    var ics = document.getElementById('bajar-ics');
    if (ics) ics.addEventListener('click', function () {
      var BY = ['', 'MO', 'TU', 'WE', 'TH', 'FR'];
      var base = Date.UTC(hoy.y, hoy.m - 1, hoy.d);
      var sello = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      var L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Hulk Sports//Horario 2026//ES', 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:Hulk Sports',
        'BEGIN:VTIMEZONE', 'TZID:America/Guayaquil', 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:-0500', 'TZOFFSETTO:-0500', 'TZNAME:-05', 'END:STANDARD', 'END:VTIMEZONE'];
      CONFIG.clases.filter(function (c) { return coincide(c.t); }).forEach(function (c, i) {
        var dif = (c.d - hoy.dia + 7) % 7;
        var f = new Date(base + dif * 86400000);
        var ymd = f.getUTCFullYear() + String(f.getUTCMonth() + 1).padStart(2, '0') + String(f.getUTCDate()).padStart(2, '0');
        var ini = aMin(c.h), fin = ini + 60;
        L.push('BEGIN:VEVENT', 'UID:hulk-' + c.d + '-' + c.h.replace(':', '') + '-' + i + '@hulksports', 'DTSTAMP:' + sello,
          'DTSTART;TZID=America/Guayaquil:' + ymd + 'T' + aHora(ini).replace(':', '') + '00',
          'DTEND;TZID=America/Guayaquil:' + ymd + 'T' + aHora(fin).replace(':', '') + '00',
          'RRULE:FREQ=WEEKLY;BYDAY=' + BY[c.d], 'SUMMARY:' + c.n + ' · Hulk Sports',
          'LOCATION:Pasaje Azahares E14-135 y De las Clavelinas\\, El Edén\\, Quito',
          'DESCRIPTION:Horario 2026. Duración referencial de 1 hora. Confirma cambios por WhatsApp.', 'END:VEVENT');
      });
      L.push('END:VCALENDAR');
      var url = URL.createObjectURL(new Blob([L.join('\r\n')], { type: 'text/calendar' }));
      var a = document.createElement('a');
      a.href = url; a.download = 'hulk-sports-horario-' + filtro + '.ics';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    });
  }

  // ---- Videos: el del hero arranca si no hay movimiento reducido ---------
  function cargar(v) { if (!v.src && v.dataset.src) { v.src = v.dataset.src; } }
  var heroV = document.getElementById('video-hero');
  if (heroV && !reducir) {
    cargar(heroV);
    heroV.addEventListener('playing', function () { var p = heroV.parentNode.querySelector('.poster'); if (p) p.style.visibility = 'hidden'; }, { once: true });
    heroV.play().catch(function () {});
  }
  var secV = document.querySelectorAll('.video-seccion');
  if (secV.length && !reducir && 'IntersectionObserver' in window) {
    var ioV = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          cargar(v);
          v.play().then(function () { var img = v.parentNode.querySelector('img'); if (img) img.style.visibility = 'hidden'; }).catch(function () {});
        } else if (!v.paused) v.pause();
      });
    }, { rootMargin: '200px 0px' });
    secV.forEach(function (v) { ioV.observe(v); });
  }

  // ---- Revelado de imágenes al entrar al viewport -----------------------
  var rev = document.querySelectorAll('[data-revelar]');
  if (rev.length) {
    if (reducir || !('IntersectionObserver' in window)) rev.forEach(function (el) { el.classList.add('visto'); });
    else {
      var ioR = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visto'); ioR.unobserve(e.target); } });
      }, { rootMargin: '0px 0px -10% 0px' });
      rev.forEach(function (el) { ioR.observe(el); });
    }
  }

  // ---- Mapa bajo demanda --------------------------------------------------
  var bMapa = document.querySelector('[data-mapa]');
  if (bMapa) bMapa.addEventListener('click', function () {
    var f = document.createElement('iframe');
    f.src = bMapa.dataset.mapa; f.title = 'Mapa de Hulk Sports en El Edén, Quito';
    f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade';
    document.getElementById('mapa').appendChild(f);
    f.focus();
  });
})();
