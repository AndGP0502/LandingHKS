# Hulk Sports · landing estática

Sitio de 2 páginas en HTML, CSS y JS sin frameworks ni build. Se abre con doble clic en `index.html` y se publica tal cual.

```
index.html                Página 1: lo esencial (hero, hoy, precios, dirección, áreas, niños, torneos, fotos)
horarios-y-planes.html    Página 2: pizarra de horarios, precios (botón a WhatsApp), gym, terapia, profesores, FAQ, ubicación
css/styles.css            Tokens (colores, tipografía) y estilos
js/main.js                Mejoras: WhatsApp, "hoy", abierto ahora, filtro, videos, mapa
assets/                   logo/, fotos/ (WebP + fuente/), videos/, fonts/, og-hulk-sports.jpg
content/inventario.md     Cada dato del sitio con su fuente
netlify.toml              Netlify: sin build; responde 404 en los archivos internos (ver "Publicar")
content/fuentes/          Flyer de horario 2026 y captura del perfil que envió el cliente
docs/design-brief.md      Concepto, paleta, tipografía, elementos firma, movimiento
```

## Estado

- [x] Fase 1. Extracción de Instagram: 224 captions leídos, 45 imágenes y 1 reel descargados, inventario con fuentes.
- [x] Fase 2. Design brief.
- [x] Media: 16 fotos (WebP 480 a 1440 px con srcset), 3 videos H.264 sin audio (hero 1,8 MB), logo, favicons, imagen OG.
- [x] Páginas, CSS y JS.
- [x] QA: capturas a 390, 768 y 1440 px en claro y oscuro, consola sin errores, enlaces y anclas revisados, contraste AA medido, Lighthouse móvil (abajo).
- [x] Etapa 1 (contenido): tareas 1.1 a 1.5 implementadas (horario referencial del gimnasio, perfil de Fernando Cárdenas Jr., Muay Thai y clases mixtas, cardio, parqueadero y spinning, terapia física) y registradas en `content/inventario.md`. Tarea 1.6: revisión de esta documentación.
- [ ] Datos "por confirmar" que debe enviar el cliente (lista abajo).
- [ ] Dominio (el sitio ya está en GitHub y Netlify, proyecto `hulksportsec`; falta el dominio propio).

Lighthouse móvil (servidor local, 31 oct 2026):

| Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
|---|---|---|---|---|
| index.html | 99 | 100 | 100 | 92 → 100 al quitar el canonical relativo* |
| horarios-y-planes.html | 100 | 100 | 100 | 92 → 100 al quitar el canonical relativo* |

\* La única falla de SEO era `rel=canonical` relativo. Se quitó; vuelve a ponerlo con URL absoluta cuando haya dominio. Caché y compresión las resuelve el hosting (Netlify, Vercel y GitHub Pages ya comprimen).

**Nota:** estos resultados son anteriores a los cambios de contenido de la Etapa 1 (tareas 1.1 a 1.5) y **no se han medido de nuevo**. Los números se conservan tal como se registraron.

## Ver el sitio en tu PC

Doble clic en `index.html`. Para probarlo como en internet (recomendado para videos y mapa):

macOS / Linux (ajusta la ruta a donde esté la carpeta `LandingHKS`):

```bash
cd ~/Desktop/LandingHKS && python3 -m http.server 8080
```

Windows 11 (PowerShell):

```powershell
cd "$HOME\Desktop\LandingHKS"; python -m http.server 8080
```

Luego abre http://localhost:8080.

## Cambiar el número de WhatsApp

El número está en `js/main.js`, en `CONFIG.whatsapp` (formato `593` + número sin el 0, sin espacios). Ese valor reescribe todos los botones cuando hay JavaScript. Para que también quede bien sin JavaScript, reemplázalo en los HTML y en `js/main.js` (cambia `593XXXXXXXXX` por el nuevo). Los comandos siguientes son **solo ejemplos**: reemplazan el número en los tres archivos, así que revísalos antes de usarlos.

macOS (`sed -i ''` es sintaxis de macOS):

```bash
cd ~/Desktop/LandingHKS && sed -i '' 's/593996770074/593XXXXXXXXX/g' index.html horarios-y-planes.html js/main.js
```

Windows 11 (PowerShell):

```powershell
cd "$HOME\Desktop\LandingHKS"
foreach ($f in 'index.html','horarios-y-planes.html','js/main.js') {
  $p = Join-Path (Get-Location) $f
  $t = [IO.File]::ReadAllText($p)
  [IO.File]::WriteAllText($p, $t.Replace('593996770074','593XXXXXXXXX'), (New-Object Text.UTF8Encoding($false)))
}
```

El teléfono visible (`099 677 0074`) y los enlaces `tel:` están en los dos HTML: busca `099 677 0074` y `+593996770074`.
Los mensajes prellenados por servicio están en `CONFIG.mensajes` (general, prueba, ninos, planes, fisio, gym).
**Importante:** cada botón o enlace de WhatsApp también lleva su mensaje escrito (codificado) en el `href` de los HTML, que sirve de respaldo cuando no hay JavaScript. Si cambias un mensaje, actualízalo **tanto en `CONFIG.mensajes` como en los `href` de `index.html` y `horarios-y-planes.html`**, para que ambos coincidan.

## Editar contenido

- **Horario:** está escrito en `horarios-y-planes.html` (bloque `id="pizarra"`, un `<li class="clase">` por clase con `data-tipo`, `data-hora` y el rango en `<span class="horas">`) y repetido en `CONFIG.clases` de `js/main.js` (`h` = inicio, `f` = fin; lo usan la franja "Hoy" de la página 1 y la marca de "siguiente clase" de la pizarra). Cambia los dos. El open mat del sábado está en `CONFIG.openMat`. El resumen sin JS de la franja está en `index.html` (`id="hoy-lista"`).
- **Horario del gym** ("abierto ahora"): `CONFIG.gym` en `js/main.js`, en minutos desde medianoche (360 = 06:00). Hoy: lunes a viernes 06:00 a 21:00 (`[360, 1260]`), sábado 08:00 a 14:00 (`[480, 840]`) y domingo sin entrada, que se interpreta como cerrado. Es un horario **referencial según la ficha de Google (31 oct 2026), por confirmar con el cliente**; el de nov 2024 se conserva como histórico en el inventario. No hay lógica de feriados. El texto visible del horario está en `index.html` (tarjeta Gimnasio).
- **Precios:** sección `id="precios"` de la página 2 y el bloque "Precios 2026" de la franja en la página 1. Al tener precios confirmados, reemplaza los `<span class="pendiente" data-pendiente="precios">`.
- **Datos pendientes:** todos llevan el atributo `data-pendiente="..."`. Para listarlos: en macOS/Linux, `grep -n data-pendiente *.html`; en Windows (PowerShell), `Select-String -Path *.html -Pattern 'data-pendiente'`.
- **Fotos:** agrega la imagen en `assets/fotos/` en WebP con varios anchos y copia el patrón `srcset` de una foto existente. Siempre con `alt`, `width` y `height`.
- **Colores y tipografía:** tokens al inicio de `css/styles.css` (`--rojo`, `--franja`, etc.).

## Publicar (cuando decidas)

1. Reemplaza `TU-DOMINIO` en `sitemap.xml` y `robots.txt`. Opcional: pon URLs absolutas en `og:image` y agrega `<link rel="canonical" href="https://tu-dominio/...">` en cada página.
2. **Netlify:** el proyecto `hulksportsec` publica la rama `main` de GitHub en cada push. En Build settings, "Build command" debe quedar vacío (el sitio no tiene build). `netlify.toml` fija la carpeta publicada y bloquea con 404 los archivos internos.
3. **Vercel:** `npx vercel` dentro de la carpeta (framework: Other, sin build).
4. **GitHub Pages:** sube la carpeta a un repo y activa Pages en la rama principal, carpeta raíz.

Las carpetas `content/`, `docs/` y `assets/fotos/fuente/` no son necesarias en producción. En Netlify, `netlify.toml` responde 404 en esas carpetas y en `assets/fotos/fotos.json`, `README.md`, `netlify.toml` y `.gitignore`. En Vercel o GitHub Pages ese archivo no se aplica: habría que excluirlas a mano.

## Datos por confirmar (para el cliente)

Lista consolidada de la Etapa 1 (31 oct 2026). Es el único lugar donde se resumen los pendientes; el detalle y la fuente de cada dato están en `content/inventario.md`. En el sitio, los pendientes se marcan con `data-pendiente`.

### Confirmado (referencia: no requiere acción del cliente)

- Servicio de terapia física y deportiva (biografía de @hulk.sports, 31/10/2026).
- Servicios cardio y MMA (publicación fijada de @hulk.sports del 01/02/2026); existencia de parqueadero, sin detalles (biografía de @hulk.sports, 31/10/2026).
- Fernando Cárdenas Jr.: Head Coach de Hulk Sports (trabaja en Hulk Sports desde 2020) y cinturón negro 2.º Dan de jiu-jitsu brasileño (biografía facilitada por el equipo, octubre 2026; el año de obtención sigue por confirmar). Terapista físico, entrenador personal certificado IFBB y juez IFBB de fisicoculturismo (biografía de @hulkbjj, 31/10/2026). Que sea terapista físico **no confirma** quién atiende las sesiones de terapia.
- Existencia de un grupo femenino activo en jiu-jitsu.
- Fernando Cárdenas Jr.: tecnólogo en fisioterapia, entrenador y preparador físico profesional (indicación del usuario, 01/11/2026).
- Nombre del servicio de terapia: Rehabilitación Integral (confirmado por el usuario, 01/11/2026; sin "BIC", a pedido del usuario).
- Gimnasio de dos pisos con área de cardio; Fernando Cárdenas Jr. fue head coach de Marlon "Chito" Vera en su pelea de exhibición de jiu-jitsu en Ecuador y graduó a cinturón azul a Mayton Perea, actual peleador de UFC (indicación del usuario, 01/11/2026).
- Horario de clases 2026 (flyer enviado por el cliente) y dirección.

### Histórico o vencido (se conserva, no se muestra como vigente)

- Horario del gimnasio de nov 2024 (L-V 05:00-21:00; sábados y feriados 08:00-14:00) y el de 2024 anterior.
- Ningún precio se muestra en el sitio (a pedido del usuario, 01/11/2026): las dos páginas solo invitan a preguntarlos por WhatsApp. El de $150 (3 meses Jiu-Jitsu + Gym, sep 2025) y los seminarios a $10 (2026) quedan registrados en `content/inventario.md`.
- Precios de $140 (Black Friday 2024) y $75 (gym, hasta el 15 oct 2025), ya vencidos; $50/mes de niños (2023) y gym a $35 (sede anterior).
- Referencias antiguas a Muay Thai (logo, instalaciones de 2023, vacacional infantil de 2026) y a spinning (instalaciones de 2023).

### Pendiente de verificación (por confirmar con el cliente)

1. **Precios y condiciones:** precios vigentes 2026 de jiu-jitsu, gym, niños, MMA y combos; matrícula y permanencia; si la clase de prueba sigue siendo gratis (se anunció así en feb 2025).
2. **Horarios:**
   - Horarios extra 2026: BJJ ejecutivo de 11:00 (L-V) y el de 13:00 (L-M-V, 2x1).
   - Horario del gimnasio (referencial según Google, 31 oct 2026: L-V 06:00-21:00, sábado 08:00-14:00, domingo cerrado) y comportamiento en feriados.
   - Open mat de sábado (en 2023: 08:00, $5 invitados).
   - Si las clases son mixtas y si existe un horario exclusivo para el grupo femenino.
3. **Servicios e instalaciones:**
   - Muay Thai: no se encontró en la revisión del 31/10/2026 (esto no prueba que no exista); ¿se sigue dando?
   - Spinning: ¿sigue vigente?
   - Parqueadero: capacidad, costo y vigencia de los detalles "privado" y "videovigilancia" (publicaciones de 2025).
   - Normas del gimnasio y qué ropa llevar a la primera clase (¿prestan kimono?).
   - Vigencia de las instalaciones listadas en 2023 (800 m², cancha de básquet y ecuavóley, área verde, "tren superior e inferior", "cross training y TRX") y fuente de "peso libre y máquinas".
4. **Terapia física:** servicios específicos de fisioterapia que ofrece actualmente Hulk Sports y quién los atiende (el equipo envió una propuesta de servicios que **no está confirmada** y no se publica); además, días y horas, valor por sesión, modalidad, disponibilidad y cupos, convenios con seguros, qué traer y cómo se agenda.
5. **Equipo:**
   - Si el equipo de profesores sigue igual que en 2024; fotos de profesores sin texto encima.
   - Año de obtención del cinturón negro 2.º Dan de Fernando Cárdenas Jr. (el grado consta en la biografía facilitada por el equipo, octubre 2026).
   - Rol exacto de Fernando en el evento de Chito Vera: la credencial de la foto dice "VERA-ALDO" y "COMMISSION"; el sitio dice "head coach" según lo indicado.
6. **Contacto y marca:** correo electrónico; confirmar que +593 99 677 0074 sigue siendo el número (último publicado en nov 2024); logo en vector (SVG o PNG grande; se usó la versión de 192 px que enviaste).
7. **Publicación:** dominio (reemplazar `TU-DOMINIO` en `sitemap.xml` y `robots.txt`, y poner `canonical` y `og:image` absolutos).

## Decisiones tomadas sin preguntar

- **Navegador:** se usó Claude in Chrome con tu sesión de Instagram. Chrome bloqueó las descargas múltiples; las fotos y el reel se pasaron por el portapapeles en lugar de archivos.
- **Solo contenido de @hulk.sports:** se descartaron posts de colaboración de otras cuentas, imágenes marcadas como "Contenido de IA" y las destacadas (tienen unas 250 semanas y son de la sede anterior en Cipreses).
- **Horario base:** el flyer 2026 que enviaste manda. Los horarios de 11:00 y 13:00 anunciados después aparecen aparte como "confirmar".
- **Precios:** no hay lista vigente; se muestra "Por confirmar" y una tabla con lo último publicado, con fecha y estado (vencida / por confirmar).
- **Video:** un solo reel (`DUOCQl_kb0m`, el que enviaste) recortado en tramos sin textos superpuestos. Las capturas fijas del mismo reel sirven de fotos del gym y del tatami.
- **Archivo .ics:** se quitó el botón "Agregar a mi calendario" de la página 2 (1 nov 2026) y con él su código.
- **Duración de clases:** la que muestra la pizarra (06:00-07:30, 17:00-18:00, 18:30-20:00, 20:00-21:00).
- **Tipografía:** Archivo (Google Fonts, licencia OFL) autoalojada, una sola familia con eje de ancho para las tres voces.
- **Skills:** `frontend-design` no está instalado en este equipo y la carpeta de referencias de `impeccable` viene vacía; se aplicaron `design-taste-frontend`, `emil-design-eng` y los principios de `impeccable` (pasada única de QA con correcciones en lote).
- **JSON-LD:** sin horarios de atención ni precios, porque no están confirmados.

## Decisiones de contenido de la Etapa 1

- **Tarea 1.1, horario del gimnasio:** se muestra el horario referencial de la ficha de Google (31 oct 2026), marcado "por confirmar". El de nov 2024 queda como histórico. No hay lógica de feriados ni `openingHours` en el JSON-LD.
- **Tarea 1.2, Fernando Cárdenas Jr.:** su tarjeta muestra cinco datos tomados de la biografía de @hulkbjj (31 oct 2026). El enlace "Fuente" de la tarjeta sigue apuntando a una publicación de 2024 que solo respalda su rol de head coach. El nombre aparecía con y sin "Jr."; se unificó como "Fernando Cárdenas Jr." en octubre de 2026.
- **Tarea 1.3, Muay Thai y clases mixtas:** el sitio no presenta Muay Thai como servicio vigente ni como descontinuado (por confirmar). MMA se mantiene como servicio confirmado. La FAQ solo afirma que existe un grupo femenino; las clases mixtas y un horario exclusivo quedan por confirmar.
- **Tarea 1.4, cardio, parqueadero y spinning:** cardio se muestra como "Caminadoras". Spinning no se muestra (por confirmar) y no está en la pizarra, en `CONFIG.clases` ni en los filtros. El parqueadero mantiene el texto "privado con videovigilancia" (dato de 2025), con vigencia por confirmar.
- **Tarea 1.5, terapia física y deportiva:** se afirma el servicio y se invita a consultar por WhatsApp (botones "Consultar terapia", mensaje `fisio` de consulta). Se dice que Fernando es terapista físico, sin afirmar que atiende las sesiones. No se agregaron tratamientos, precios, horarios ni afirmaciones de salud.
- **Tarea 1.6, documentación:** se actualizaron este README, el inventario y el design brief para que describan lo que realmente hay en el sitio.
