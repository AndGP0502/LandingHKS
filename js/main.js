/* Hulk Sports · mejoras progresivas. Todo el contenido funciona sin este archivo. */
(function () {
  'use strict';

  // ---- Datos editables (un solo lugar) ----------------------------------
  var CONFIG = {
    whatsapp: '593996770074', // sin + ni espacios. Ver README para cambiarlo también en el HTML.
    zona: 'America/Guayaquil',
    mensajes: {
      general: 'Hola Hulk Sports, tengo una pregunta.',
      prueba: 'Hola Hulk Sports, quiero consultar si tienen clases de prueba disponibles y qué horarios ofrecen.',
      ninos: 'Hola Hulk Sports, quiero información de jiu-jitsu para niños. Edad de mi hijo/a: ',
      planes: 'Hola Hulk Sports, ¿cuáles son los precios y planes vigentes?',
      fisio: 'Hola Hulk Sports, quiero consultar por el servicio de terapia física y deportiva.',
      gym: 'Hola Hulk Sports, quiero información del gimnasio: horario y precio.'
    },
    // Horario 2026 (flyer oficial). Día: 1 = lunes ... 5 = viernes. h = inicio, f = fin.
    clases: [
      { d: 1, h: '06:00', f: '07:30', n: 'BJJ Gi', t: 'gi' }, { d: 1, h: '17:00', f: '18:00', n: 'BJJ Gi Kids', t: 'ninos' }, { d: 1, h: '18:30', f: '20:00', n: 'BJJ Gi', t: 'gi' }, { d: 1, h: '20:00', f: '21:00', n: 'MMA', t: 'mma' },
      { d: 2, h: '06:00', f: '07:30', n: 'BJJ No-Gi', t: 'nogi' }, { d: 2, h: '17:00', f: '18:00', n: 'BJJ No-Gi Kids', t: 'ninos' }, { d: 2, h: '18:30', f: '20:00', n: 'BJJ No-Gi', t: 'nogi' }, { d: 2, h: '20:00', f: '21:00', n: 'MMA', t: 'mma' },
      { d: 3, h: '06:00', f: '07:30', n: 'BJJ Gi', t: 'gi' }, { d: 3, h: '17:00', f: '18:00', n: 'BJJ Gi Kids', t: 'ninos' }, { d: 3, h: '18:30', f: '20:00', n: 'BJJ Gi', t: 'gi' }, { d: 3, h: '20:00', f: '21:00', n: 'MMA', t: 'mma' },
      { d: 4, h: '06:00', f: '07:30', n: 'BJJ No-Gi', t: 'nogi' }, { d: 4, h: '17:00', f: '18:00', n: 'BJJ Gi Kids', t: 'ninos' }, { d: 4, h: '18:30', f: '20:00', n: 'BJJ Gi', t: 'gi' }, { d: 4, h: '20:00', f: '21:00', n: 'MMA', t: 'mma' },
      { d: 5, h: '06:00', f: '07:30', n: 'BJJ Gi', t: 'gi' }, { d: 5, h: '17:00', f: '18:00', n: 'BJJ Gi Kids', t: 'ninos' }, { d: 5, h: '18:30', f: '20:00', n: 'BJJ No-Gi', t: 'nogi' }, { d: 5, h: '20:00', f: '21:00', n: 'Sparring', t: 'sparring' }
    ],
    // Horario del gimnasio. [abre, cierra] en minutos. Domingo (0) cerrado: sin entrada.
    gym: { 1: [300, 1260], 2: [300, 1260], 3: [300, 1260], 4: [300, 1260], 5: [300, 1260], 6: [480, 840] },
    openMat: '08:00' // sábados
  };

  var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  var reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cx = navigator.connection || {};
  var ahorro = !!cx.saveData || /(^|-)2g$|^3g$/.test(cx.effectiveType || ''); // ahorro de datos o conexión lenta

  // ---- WhatsApp: todos los enlaces salen de CONFIG ------------------------
  document.querySelectorAll('a[data-wa]').forEach(function (a) {
    var msg = CONFIG.mensajes[a.getAttribute('data-wa')] || CONFIG.mensajes.general;
    a.href = 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(msg);
  });

  // ---- Cabecera en celular: la fila de enlaces se desliza; un degradado avisa que hay más ----
  var nav = document.querySelector('.nav');
  if (nav) {
    var marcarNav = function () {
      nav.classList.toggle('hay-mas', nav.scrollWidth - nav.clientWidth - nav.scrollLeft > 2);
    };
    nav.addEventListener('scroll', marcarNav, { passive: true });
    window.addEventListener('resize', marcarNav);
    marcarNav();
  }

  // ---- Tema claro / oscuro: sigue al sistema hasta que el visitante elige ----
  var raiz = document.documentElement;
  var temaSistema = window.matchMedia('(prefers-color-scheme: dark)');
  var botonesTema = document.querySelectorAll('[data-tema-boton]');
  function esOscuro() { return raiz.dataset.tema ? raiz.dataset.tema === 'oscuro' : temaSistema.matches; }
  function pintarTema() {
    var o = esOscuro();
    botonesTema.forEach(function (b) {
      b.setAttribute('aria-pressed', String(o));
      b.title = o ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
    });
  }
  botonesTema.forEach(function (b) {
    b.addEventListener('click', function () {
      var nuevo = esOscuro() ? 'claro' : 'oscuro';
      raiz.dataset.tema = nuevo;
      try { localStorage.setItem('tema', nuevo); } catch (e) {}
      pintarTema();
    });
  });
  if (temaSistema.addEventListener) temaSistema.addEventListener('change', pintarTema);
  pintarTema();

  // ---- Hora local de Quito -----------------------------------------------
  function ahora() {
    var partes = new Intl.DateTimeFormat('en-US', {
      timeZone: CONFIG.zona, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(new Date());
    var p = {};
    partes.forEach(function (x) { p[x.type] = x.value; });
    var dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday);
    return { dia: dia, min: parseInt(p.hour, 10) * 60 + parseInt(p.minute, 10) };
  }
  function aMin(h) { var s = h.split(':'); return +s[0] * 60 + +s[1]; }
  function aHora(m) { return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); }
  var hoy = ahora();

  // ---- Promociones con fecha de fin (data-vence="AAAA-MM-DD", último día válido): se ocultan solas al día siguiente ----
  var fechaHoy = new Intl.DateTimeFormat('en-CA', { timeZone: CONFIG.zona, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  document.querySelectorAll('[data-vence]').forEach(function (el) {
    if (fechaHoy > el.getAttribute('data-vence')) el.hidden = true;
  });

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
        if (aMin(c.f) <= hoy.min) cls = 'pasada';
        else if (!marcada) { cls = 'siguiente'; marcada = true; }
        var nota = cls === 'siguiente' ? (aMin(c.h) <= hoy.min ? '(en curso)' : '(próxima)') : '';
        html += '<li class="' + cls + '"><span class="horas"><time>' + c.h + '</time>-<time>' + c.f + '</time></span> ' + c.n + (nota ? ' <span class="sr-only">' + nota + '</span>' : '') + '</li>';
      });
      lista.innerHTML = html + '</ul>';
    } else {
      titulo.textContent = 'Hoy, ' + DIAS[hoy.dia];
      var g = estadoGym();
      var sinClases = hoy.dia === 6 ? 'Open mat a las ' + CONFIG.openMat + '. Clases regulares el lunes desde las 06:00.' : 'Sin clases hoy. Vuelven el lunes a las 06:00.';
      lista.innerHTML = '<span>' + sinClases + '</span><span class="mini">' + g.texto + '.</span>';
    }
  }

  // ---- Página 2: pizarra --------------------------------------------------
  var pizarra = document.getElementById('pizarra');
  if (pizarra) {
    var diaHoy = pizarra.querySelector('.dia[data-dia="' + hoy.dia + '"]');
    if (diaHoy) {
      diaHoy.classList.add('es-hoy');
      var fin = {};
      CONFIG.clases.forEach(function (c) { if (c.d === hoy.dia) fin[c.h] = aMin(c.f); });
      var sig = Array.prototype.find.call(diaHoy.querySelectorAll('.clase'), function (li) { return (fin[li.dataset.hora] || aMin(li.dataset.hora) + 60) > hoy.min; });
      if (sig) sig.classList.add('siguiente');
    }
    var estado = document.getElementById('estado');
    var g2 = estadoGym();
    estado.innerHTML = '<span class="chip-estado' + (g2.abierto ? ' abierto' : '') + '">' + (g2.abierto ? 'Abierto' : 'Cerrado') + '</span>' +
      '<span>Hoy es ' + DIAS[hoy.dia] + '. ' + g2.texto + '.</span>';

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

  }

  // ---- Videos: arrancan al verse y se pausan fuera de pantalla ----------
  // Con movimiento reducido, ahorro de datos o conexión lenta no arrancan ni se descargan: queda el póster
  // y el visitante los reproduce con el botón. Todos tienen botón de pausa y reproducción.
  // El del encabezado espera a que termine la carga de la página (o 2,5 s) y a un momento libre.
  function cargar(v) { if (!v.src && v.dataset.src) { v.src = v.dataset.src; } }
  function reproducir(v) {
    cargar(v);
    v.play().then(function () { var img = v.parentNode.querySelector('img'); if (img) img.style.visibility = 'hidden'; }).catch(function () { if (v._pintar) v._pintar(); });
  }
  // Botón de pausa y reproducción sobre el video. Refleja el estado real del video (no el que se pidió).
  function crearControl(v) {
    var nombre = v.id === 'video-hero' ? 'video del encabezado' : 'video de Jiu-jitsu';
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'video-control';
    b.innerHTML = '<svg class="i-pausa" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>' +
      '<svg class="i-play" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 4l13 8-13 8z"/></svg>';
    function pintar() {
      var texto = (v.paused ? 'Reproducir ' : 'Pausar ') + nombre;
      b.dataset.estado = v.paused ? 'pausado' : 'reproduciendo';
      b.setAttribute('aria-label', texto);
      b.title = texto;
    }
    b.addEventListener('click', function () {
      if (v.paused) { delete v.dataset.pausaUsuario; reproducir(v); }   // sigue desde donde quedó
      else { v.dataset.pausaUsuario = '1'; v.pause(); }                 // pausa manual: el observer no lo reanuda
    });
    ['play', 'pause', 'error'].forEach(function (t) { v.addEventListener(t, pintar); });
    v._pintar = pintar;
    v.parentNode.appendChild(b);
    pintar();
  }
  var videos = document.querySelectorAll('#video-hero, .video-seccion');
  if (videos.length) {
    var manual = reducir || ahorro; // sin arranque automático: solo con el botón
    videos.forEach(crearControl);
    var heroV = document.getElementById('video-hero');
    function cuandoLibre(fn) {
      var hecho = false;
      function ir() {
        if (hecho) return;
        hecho = true;
        if ('requestIdleCallback' in window) requestIdleCallback(fn, { timeout: 1000 }); else setTimeout(fn, 200);
      }
      if (document.readyState === 'complete') ir();
      else { window.addEventListener('load', ir, { once: true }); setTimeout(ir, 2500); }
    }
    function enPantalla(v) { var r = v.getBoundingClientRect(); return r.bottom > -200 && r.top < window.innerHeight + 200; }
    // Arranque automático del encabezado: una sola espera pendiente, y solo si sigue cerca de la pantalla
    function arrancarHero(v) {
      if (v._espera) return;
      v._espera = true;
      cuandoLibre(function () {
        v._espera = false;
        if (!manual && !v.dataset.pausaUsuario && v.paused && enPantalla(v)) reproducir(v);
      });
    }
    if ('IntersectionObserver' in window) {
      var ioV = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          var v = e.target;
          if (e.isIntersecting) {
            if (manual || v.dataset.pausaUsuario || !v.paused) return;
            if (v === heroV && !v.src) arrancarHero(v); else reproducir(v);
          }
          else if (!v.paused) v.pause();
        });
      }, { rootMargin: '200px 0px' });
      videos.forEach(function (v) { ioV.observe(v); });
    } else if (heroV && !manual) arrancarHero(heroV);
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

  // ---- Fotos con alternativa: los botones cambian la foto visible ---------
  document.querySelectorAll('[data-alterna]').forEach(function (fig) {
    var fotos = fig.querySelectorAll('.alterna-fotos img');
    var bts = fig.querySelectorAll('[data-foto]');
    bts.forEach(function (b) {
      b.addEventListener('click', function () {
        var i = +b.dataset.foto;
        fotos.forEach(function (f, j) { f.classList.toggle('activa', j === i); });
        bts.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      });
    });
  });

  // ---- Enlaces externos: avisa que abren otra pestaña ---------------------
  document.querySelectorAll('a[target="_blank"]').forEach(function (a) {
    a.insertAdjacentHTML('beforeend', '<span class="sr-only"> (abre en otra pestaña)</span>');
  });

  // ---- Mapa bajo demanda --------------------------------------------------
  var bMapa = document.querySelector('[data-mapa]');
  if (bMapa) bMapa.addEventListener('click', function () {
    var f = document.createElement('iframe');
    f.src = bMapa.dataset.mapa; f.title = 'Mapa de Hulk Sports en El Edén, Quito';
    f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade';
    var caja = document.getElementById('mapa');
    caja.appendChild(f);
    // La fachada sale del DOM para que el botón no quede enfocable debajo del mapa.
    caja.querySelectorAll('img, .mapa-capa').forEach(function (el) { el.remove(); });
    f.focus();
  }, { once: true });
})();
