# Hulk Sports · landing estática

Sitio de 2 páginas en HTML, CSS y JS sin frameworks ni build. Se abre con doble clic en `index.html` y se publica tal cual.

```
index.html                Página 1: lo esencial (hero, hoy, precios, dirección, áreas, niños, torneos, fotos)
horarios-y-planes.html    Página 2: pizarra de horarios, precios publicados, gym, terapia, profesores, FAQ, ubicación
css/styles.css            Tokens (colores, tipografía) y estilos
js/main.js                Mejoras: WhatsApp, "hoy", abierto ahora, filtro, .ics, videos, mapa
assets/                   logo/, fotos/ (WebP + fuente/), videos/, fonts/, og-hulk-sports.jpg
content/inventario.md     Cada dato del sitio con su fuente
content/fuentes/          Flyer de horario 2026 y captura del perfil que envió el cliente
docs/design-brief.md      Concepto, paleta, tipografía, elementos firma, movimiento
```

## Estado

- [x] Fase 1. Extracción de Instagram: 224 captions leídos, 45 imágenes y 1 reel descargados, inventario con fuentes.
- [x] Fase 2. Design brief.
- [x] Media: 16 fotos (WebP 480 a 1440 px con srcset), 3 videos H.264 sin audio (hero 1,8 MB), logo, favicons, imagen OG.
- [x] Páginas, CSS y JS.
- [x] QA: capturas a 390, 768 y 1440 px en claro y oscuro, consola sin errores, enlaces y anclas revisados, contraste AA medido, Lighthouse móvil (abajo).
- [ ] Datos "por confirmar" que debe enviar el cliente (lista abajo).
- [ ] Dominio y publicación (no se subió nada a GitHub ni a ningún hosting, por pedido del cliente).

Lighthouse móvil (servidor local, 31 oct 2026):

| Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
|---|---|---|---|---|
| index.html | 99 | 100 | 100 | 92 → 100 al quitar el canonical relativo* |
| horarios-y-planes.html | 100 | 100 | 100 | 92 → 100 al quitar el canonical relativo* |

\* La única falla de SEO era `rel=canonical` relativo. Se quitó; vuelve a ponerlo con URL absoluta cuando haya dominio. Caché y compresión las resuelve el hosting (Netlify, Vercel y GitHub Pages ya comprimen).

## Ver el sitio en tu PC

Doble clic en `index.html`. Para probarlo como en internet (recomendado para videos y mapa):

```bash
cd ~/Desktop/HKS && python3 -m http.server 8080
```

Luego abre http://localhost:8080.

## Cambiar el número de WhatsApp

El número está en `js/main.js`, en `CONFIG.whatsapp` (formato `593` + número sin el 0, sin espacios). Ese valor reescribe todos los botones cuando hay JavaScript. Para que también quede bien sin JavaScript, reemplázalo en los HTML con este comando (cambia `593XXXXXXXXX` por el nuevo):

```bash
cd ~/Desktop/HKS && sed -i '' 's/593996770074/593XXXXXXXXX/g' index.html horarios-y-planes.html js/main.js
```

El teléfono visible (`099 677 0074`) y los enlaces `tel:` están en los dos HTML: busca `099 677 0074` y `+593996770074`.
Los mensajes prellenados por servicio están en `CONFIG.mensajes` (general, prueba, ninos, planes, fisio, gym).

## Editar contenido

- **Horario:** está escrito en `horarios-y-planes.html` (bloque `id="pizarra"`, un `<li class="clase">` por clase con `data-tipo` y `data-hora`) y repetido en `CONFIG.clases` de `js/main.js` (lo usa la franja "Hoy" de la página 1 y el archivo .ics). Cambia los dos. El resumen sin JS de la franja está en `index.html` (`id="hoy-lista"`).
- **Horario del gym** ("abierto ahora"): `CONFIG.gym` en `js/main.js`, en minutos desde medianoche (360 = 06:00).
- **Precios:** sección `id="precios"` de la página 2 y el bloque "Precios 2026" de la franja en la página 1. Al tener precios confirmados, reemplaza los `<span class="pendiente" data-pendiente="precios">`.
- **Datos pendientes:** todos llevan el atributo `data-pendiente="..."`. Para listarlos: `grep -n data-pendiente *.html`.
- **Fotos:** agrega la imagen en `assets/fotos/` en WebP con varios anchos y copia el patrón `srcset` de una foto existente. Siempre con `alt`, `width` y `height`.
- **Colores y tipografía:** tokens al inicio de `css/styles.css` (`--rojo`, `--franja`, etc.).

## Publicar (cuando decidas)

1. Reemplaza `TU-DOMINIO` en `sitemap.xml` y `robots.txt`. Opcional: pon URLs absolutas en `og:image` y agrega `<link rel="canonical" href="https://tu-dominio/...">` en cada página.
2. **Netlify:** arrastra la carpeta `HKS` a app.netlify.com/drop.
3. **Vercel:** `npx vercel` dentro de la carpeta (framework: Other, sin build).
4. **GitHub Pages:** sube la carpeta a un repo y activa Pages en la rama principal, carpeta raíz.

Las carpetas `content/`, `docs/` y `assets/fotos/fuente/` no son necesarias en producción; se pueden excluir.

## Datos por confirmar (para el cliente)

1. **Precios vigentes 2026** de jiu-jitsu, gym, niños, MMA y combos; matrícula y permanencia.
2. **Clase de prueba:** si sigue siendo gratis (se anunció así en feb 2025).
3. **Terapia física:** servicios, profesional a cargo, días y horas, valor por sesión, qué traer, cómo se agenda.
4. **Horarios extra 2026:** si siguen el BJJ ejecutivo de 11:00 (L-V) y el de 13:00 (L-M-V, 2x1).
5. **Horario del gimnasio:** confirmar L-V 06:00-21:00, sábado 08:00-14:00 y domingo cerrado (referencial según Google, 31 oct 2026).
6. **Open mat de sábado** (en 2023: 08:00, $5 invitados).
7. **Correo electrónico** de contacto.
8. **Grado de Fernando Cárdenas** y si el equipo de profesores sigue igual que en 2024; fotos de profesores sin texto encima.
9. **Normas del gimnasio** y qué ropa llevar a la primera clase (¿prestan kimono?).
10. **WhatsApp:** confirmar que +593 99 677 0074 sigue siendo el número (último publicado en nov 2024).
11. **Muay Thai:** el logo lo menciona pero el horario 2026 no; ¿se sigue dando?
12. **Logo en vector** (SVG o PNG grande). Se usó la versión de 192 px que enviaste.

## Decisiones tomadas sin preguntar

- **Navegador:** se usó Claude in Chrome con tu sesión de Instagram. Chrome bloqueó las descargas múltiples; las fotos y el reel se pasaron por el portapapeles en lugar de archivos.
- **Solo contenido de @hulk.sports:** se descartaron posts de colaboración de otras cuentas, imágenes marcadas como "Contenido de IA" y las destacadas (tienen unas 250 semanas y son de la sede anterior en Cipreses).
- **Horario base:** el flyer 2026 que enviaste manda. Los horarios de 11:00 y 13:00 anunciados después aparecen aparte como "confirmar".
- **Precios:** no hay lista vigente; se muestra "Por confirmar" y una tabla con lo último publicado, con fecha y estado (vencida / por confirmar).
- **Video:** un solo reel (`DUOCQl_kb0m`, el que enviaste) recortado en tramos sin textos superpuestos. Las capturas fijas del mismo reel sirven de fotos del gym y del tatami.
- **Duración de clases en el .ics:** 1 hora referencial (posts antiguos mostraban clases de 1 h). Se aclara en el archivo y en la página.
- **Tipografía:** Archivo (Google Fonts, licencia OFL) autoalojada, una sola familia con eje de ancho para las tres voces.
- **Skills:** `frontend-design` no está instalado en este equipo y la carpeta de referencias de `impeccable` viene vacía; se aplicaron `design-taste-frontend`, `emil-design-eng` y los principios de `impeccable` (pasada única de QA con correcciones en lote).
- **JSON-LD:** sin horarios de atención ni precios, porque no están confirmados.
