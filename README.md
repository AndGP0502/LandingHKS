# Hulk Sports · landing estática

Sitio de 2 páginas en HTML, CSS y JS sin frameworks ni build. Se abre con doble clic en `index.html`. Se publica en Cloudflare (ver "Publicar").

```
index.html                Página 1: lo esencial (hero, hoy, precios, dirección, áreas, niños, campeones, torneos, fotos)
horarios-y-planes.html    Página 2: pizarra de horarios, precios (membresías de jiu-jitsu, promo del gym, mensualidades de niños y gimnasio, y botón a WhatsApp), gym, terapia, profesores, FAQ, ubicación
css/styles.css            Tokens (colores, tipografía) y estilos
js/main.js                Mejoras: WhatsApp, "hoy", abierto ahora, filtro, videos, mapa
assets/                   logo/ (logo oficial horizontal, monograma HS e iconos; fuente/), fotos/ (WebP + fuente/), videos/, fonts/, og-hulk-sports-nuevo.jpg
content/inventario.md     Cada dato del sitio con su fuente
404.html                  Página "no encontrada" (rutas desde la raíz, porque se muestra en cualquier dirección)
wrangler.jsonc            Cloudflare: nombre del Worker, carpeta publicada y manejo de 404 y de .html
.assetsignore             Lo que Cloudflare NO publica (notas, documentación, fotos originales, configuración)
netlify.toml              Configuración del hosting anterior (Netlify); se puede borrar al terminar la mudanza
content/fuentes/          Flyer de horario 2026, flyers de precios (01/11/2026) y captura del perfil que envió el cliente
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
- [x] Dominio: `hulksportsec.com` conectado a Netlify (01/11/2026). Falta que Netlify emita el certificado HTTPS.
- [ ] SEO fuera del código: Google Search Console (verificar el dominio y enviar `sitemap.xml`) y reclamar la ficha de Google Maps del negocio.

Lighthouse móvil (servidor local, 31 oct 2026):

| Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
|---|---|---|---|---|
| index.html | 99 | 100 | 100 | 92 → 100 al quitar el canonical relativo* |
| horarios-y-planes.html | 100 | 100 | 100 | 92 → 100 al quitar el canonical relativo* |

\* La única falla de SEO era `rel=canonical` relativo. Se quitó y volvió con URL absoluta al conectar el dominio (01/11/2026). Caché y compresión las resuelve el hosting (Netlify, Vercel y GitHub Pages ya comprimen).

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
- **Horario del gym** ("abierto ahora"): `CONFIG.gym` en `js/main.js`, en minutos desde medianoche (300 = 05:00). Hoy: lunes a viernes 05:00 a 21:00 (`[300, 1260]`), sábado 08:00 a 14:00 (`[480, 840]`) y domingo sin entrada, que se interpreta como cerrado. Es un horario **referencial según la ficha de Google (31 oct 2026), por confirmar con el cliente**; el de nov 2024 se conserva como histórico en el inventario. No hay lógica de feriados. El texto visible del horario está en `index.html` (tarjeta Gimnasio).
- **Precios:** lista `tarifas-lista` en la sección `id="precios"` de la página 2 y la celda "Valores 2026" de la franja en la página 1. La promo del gym lleva `data-vence="2026-11-15"` (último día válido): `js/main.js` la oculta sola desde el día siguiente. Para una promo nueva, cambia el texto, el precio y esa fecha.
- **Datos pendientes:** todos llevan el atributo `data-pendiente="..."`. Para listarlos: en macOS/Linux, `grep -n data-pendiente *.html`; en Windows (PowerShell), `Select-String -Path *.html -Pattern 'data-pendiente'`.
- **Fotos:** agrega la imagen en `assets/fotos/` en WebP con varios anchos y copia el patrón `srcset` de una foto existente. Siempre con `alt`, `width` y `height`.
- **Colores y tipografía:** tokens al inicio de `css/styles.css` (`--rojo`, `--franja`, etc.).

## Publicar

1. **Dominio:** `https://hulksportsec.com`, sin www, comprado en Namecheap. Está en `sitemap.xml`, `robots.txt`, `og:url`, `og:image`, el canonical de cada página y el JSON-LD; si cambia, búscalo y reemplázalo en esos archivos. La página 2 figura como `/horarios-y-planes`, sin `.html`, porque Cloudflare redirige `/horarios-y-planes.html` a esa dirección. Los enlaces internos siguen con `.html` para que el sitio funcione abierto con doble clic.
2. **Cloudflare Workers (desde el 03/11/2026):** proyecto `landinghks` de la cuenta byctherapys, conectado a la rama `main` de GitHub; cada push publica. En el panel, el build queda vacío y el deploy es `npx wrangler deploy`, que lee `wrangler.jsonc`:
   - Publica la raíz del repositorio, salvo lo que lista `.assetsignore`: `content/`, `docs/`, el README, la configuración, las carpetas `fuente/` y `fotos.json`. **Si agregas al repositorio una carpeta o un archivo interno, súmalo a `.assetsignore`**; si no, quedará público.
   - Una dirección que no existe muestra `404.html` con estado 404 (`not_found_handling: "404-page"`).
   - `/pagina.html` redirige a `/pagina` (`html_handling`).
   - El nombre del Worker en `wrangler.jsonc` (`landinghks`) debe coincidir con el del panel; si no, el build falla.
   - Plan gratis de Workers: sin límite de publicaciones al mes como el de Netlify.
3. **Para ver el sitio localmente:** doble clic en `index.html`, o `python3 -m http.server 8080` en esta carpeta.
4. **Netlify (hosting anterior):** el plan gratis se quedó sin créditos el 02/11/2026 (cada publicación gasta 15 de los 300 del mes) y dejó de publicar. `netlify.toml` queda solo como referencia; cuando el dominio ya cargue desde Cloudflare, se pueden borrar el proyecto de Netlify y ese archivo.

## Datos por confirmar (para el cliente)

Lista consolidada de la Etapa 1 (31 oct 2026). Es el único lugar donde se resumen los pendientes; el detalle y la fuente de cada dato están en `content/inventario.md`. En el sitio, los pendientes se marcan con `data-pendiente`.

### Confirmado (referencia: no requiere acción del cliente)

- Servicio de terapia física y deportiva (biografía de @hulk.sports, 31/10/2026).
- Servicios cardio y MMA (publicación fijada de @hulk.sports del 01/02/2026); existencia de parqueadero, sin detalles (biografía de @hulk.sports, 31/10/2026).
- Fernando Cárdenas Jr.: Head Coach de Hulk Sports (trabaja en Hulk Sports desde 2020) y cinturón negro 2.º Dan de jiu-jitsu brasileño (biografía facilitada por el equipo, octubre 2026; el año de obtención sigue por confirmar). Terapista físico, entrenador personal certificado IFBB y juez IFBB de fisicoculturismo (biografía de @hulkbjj, 31/10/2026). Que sea terapista físico **no confirma** quién atiende las sesiones de terapia.
- Existencia de un grupo femenino activo en jiu-jitsu.
- Fernando Cárdenas Jr.: tecnólogo en fisioterapia, entrenador y preparador físico profesional (indicación del usuario, 01/11/2026).
- Nombre del servicio de terapia: Rehabilitación Integral (confirmado por el usuario, 01/11/2026; sin "BIC", a pedido del usuario).
- Gimnasio de dos pisos con área de cardio; Fernando Cárdenas Jr. fue oficial de la comisión del evento durante la pelea de exhibición de jiu-jitsu de Marlon "Chito" Vera en Ecuador (acompañó a los peleadores en su salida al octágono y levantó la mano de los ganadores; corregido el 01/11/2026: el propietario aclaró que no fue su head coach) y graduó a cinturón azul a Mayton Perea, actual peleador de UFC (indicación del usuario, 01/11/2026).
- Horario de clases 2026 (flyer enviado por el cliente) y dirección.
- Precios publicados (flyers enviados por el usuario, 01/11/2026): membresías de jiu-jitsu para adultos, mensual $65, trimestral $165, semestral $300 y anual $550, sin matrícula y con pago con tarjeta; promo del gimnasio de 3 meses por $75, válida hasta el 15 de noviembre (año 2026 asumido: el flyer usa el logo nuevo). Open mat para visitantes, $7 por sesión (agregado por el equipo, commit de Dennys593, 01/11/2026).

### Histórico o vencido (se conserva, no se muestra como vigente)

- Horario del gimnasio de nov 2024 (L-V 05:00-21:00; sábados y feriados 08:00-14:00) y el de 2024 anterior.
- No publicados: $150 (3 meses Jiu-Jitsu + Gym, sep 2025) y seminarios a $10 (2026), registrados en `content/inventario.md`.
- Precios de $140 (Black Friday 2024) y $75 (gym, hasta el 15 oct 2025), ya vencidos; $50/mes de niños (2023) y gym a $35 (sede anterior).
- Referencias antiguas a Muay Thai (logo, instalaciones de 2023, vacacional infantil de 2026) y a spinning (instalaciones de 2023).

### Pendiente de verificación (por confirmar con el cliente)

1. **Precios y condiciones:** que el flyer de membresías de jiu-jitsu (sin fecha ni logo nuevo) siga vigente; precios de MMA y combos; si los $50 de niños son mensualidad (así se publicó) o una inscripción aparte; permanencia; si la clase de prueba sigue siendo gratis (se anunció así en feb 2025).
2. **Horarios:**
   - Horarios extra 2026: BJJ ejecutivo de 11:00 (L-V) y el de 13:00 (L-M-V, 2x1).
   - Horario del gimnasio: el sitio dice L-V 05:00-21:00, sábado 08:00-14:00, domingo cerrado (apertura a las 05:00 indicada por el equipo el 03/11/2026); falta saber qué pasa en feriados.
   - Open mat de sábado: el sitio dice 08:00 y $7 por sesión para visitantes (agregado por el equipo el 01/11/2026; en 2023 eran $5).
   - Si las clases son mixtas y si existe un horario exclusivo para el grupo femenino.
3. **Servicios e instalaciones:**
   - Muay Thai: no se encontró en la revisión del 31/10/2026 (esto no prueba que no exista); ¿se sigue dando?
   - Spinning: ¿sigue vigente?
   - Parqueadero: la capacidad (30 espacios) y la videovigilancia las 24 horas son indicación del propietario (03/11/2026), sin verificación independiente. Faltan costo y condiciones de acceso. «Privado» no está confirmado y no se usa.
   - Normas del gimnasio y qué ropa llevar a la primera clase (¿prestan kimono?).
   - Vigencia de las instalaciones listadas en 2023 (800 m², cancha de básquet y ecuavóley, área verde, "tren superior e inferior", "cross training y TRX") y fuente de "peso libre y máquinas".
4. **Terapia física:** servicios específicos de fisioterapia que ofrece actualmente Hulk Sports y quién los atiende (el equipo envió una propuesta de servicios que **no está confirmada** y no se publica); además, días y horas, valor por sesión, modalidad, disponibilidad y cupos, convenios con seguros, qué traer y cómo se agenda.
5. **Lcdo. Leonel Cuichán, Coordinador de Fisioterapia (Cambio 19, versión local sin publicar):** el cargo y el tratamiento "Lcdo." los confirmó el propietario (03/11/2026). Validar con el propietario el resto de la biografía (una década de experiencia, ámbito neuro-musculoesquelético, "coordina el área de fisioterapia" (antes "lidera"), evidencia científica, promesas de recuperación) y el permiso de Leonel para publicar su retrato. La foto es una **versión editada con IA** (se quitó una marca visible), no el original de cámara; si se consigue el original, reemplazar `assets/fotos/leonel-cuichan-480.webp` y `-800.webp` desde `assets/fotos/fuente/`.
6. **Equipo:**
   - Campeones: permiso de Britany Cárdenas (y de su representante si es menor), Mateo Cordero y Fabio para publicar sus fotos y nombres; apellido de Fabio; si Donovan Cárdenas es @donovan_cardenas.
   - Versiones más grandes de las dos imágenes nuevas de las preguntas frecuentes (grupo con kimono y conjunto calentador): llegaron como capturas de unos 350 px y en pantallas de alta resolución se ven algo suaves. Del conjunto calentador, confirmar que se puede usar (parece foto de catálogo).
   - Si el equipo de profesores sigue igual que en 2024; fotos de profesores sin texto encima (Diana no tiene foto; Donovan y Cristian tienen desde el 02/11/2026).
   - Año de obtención del cinturón negro 2.º Dan de Fernando Cárdenas Jr. (el grado consta en la biografía facilitada por el equipo, octubre 2026).
   - Rol de Fernando en el evento de Chito Vera: resuelto el 01/11/2026. El propietario aclaró que fue oficial de la comisión del evento, en línea con la credencial de la foto ("COMMISSION"); no fue su head coach. Falta confirmar si se puede nombrar el evento.
7. **Contacto y marca:** correo electrónico; confirmar que +593 99 677 0074 sigue siendo el número (último publicado en nov 2024); logo en vector (SVG o PNG grande; se usa el logo oficial horizontal de 1280×620 px entregado el 01/11/2026; un vector permitiría más nitidez y fondo transparente).
8. **Publicación:** mudanza de Netlify a Cloudflare en curso (03/11/2026). El Worker `landinghks` ya publica desde GitHub; falta pasar el dominio a los servidores de nombre (DNS) de Cloudflare y conectar hulksportsec.com y www al Worker. Si en el dominio hay correos de reenvío de Namecheap en uso, hay que recrearlos con Email Routing de Cloudflare.

## Decisiones tomadas sin preguntar

- **Navegador:** se usó Claude in Chrome con tu sesión de Instagram. Chrome bloqueó las descargas múltiples; las fotos y el reel se pasaron por el portapapeles en lugar de archivos.
- **Biografías de Cristian y Donovan (03/11/2026):** cada tarjeta muestra rol, cinturón, dos datos clave y el primer párrafo; el resto de la biografía se despliega con "Leer biografía completa". Diana queda en una tarjeta corta a lo ancho.
- **Crédito de T.O.Q (02/11/2026):** a pedido del usuario, los dos pies de página cierran con "Desarrollado por T.O.Q" y los contactos de T.O.Q (Instagram @toq.ecu, WhatsApp 098 376 0090 y toqdev.com). El logo es el de toqdev.com: el texto "T.O.Q" con los puntos en azul `#3B82F6`, el único azul del sitio.
- **Profesores (02/11/2026):** se quitó el párrafo de introducción a pedido del usuario. Fernando va en un bloque negro con foto, grado, credenciales, logros y trayectoria; Cristian, Donovan y Diana, en tarjetas iguales debajo. El cinturón dibujado junto al grado es dato: negro con punta roja, y una tira blanca por grado (Fernando 2.º Dan, dos tiras; Cristian, sin grado publicado, ninguna). "Fundador" no se publica porque ninguna fuente lo confirma. La foto principal de Fernando es `fernando` (retrato con dos medallas, sin atribuir torneo); `muro-cinturones-retrato` se conserva en `assets/fotos/` sin uso.
- **Fotos en las preguntas frecuentes (02/11/2026):** las respuestas muestran fotos del local, más dos imágenes enviadas por el usuario (grupo con kimono y conjunto calentador); "¿Necesito experiencia?" va sin foto, a pedido del usuario. Detalle en `content/inventario.md`. Las dos fotos de una respuesta quedan a la misma altura; una sola foto se ve entera.
- **Nuestros campeones (02/11/2026):** a pedido expreso del usuario se usaron fotos de @fabiodasilvajj (dos publicaciones que él indicó), @brit_bjj y @mateoc95. Es la única excepción a la regla de abajo; fuentes y datos en `content/inventario.md`. El permiso de imagen de los competidores es responsabilidad del cliente (Britany compite en juvenil). Desde el 02/11/2026 hay una cuarta ficha, la Dra. Amell, con el mismo formato de las otras: dos fotos (podio, recortada solo a ella porque aparecían otras dos deportistas, aparentemente menores; y ella sola con la medalla en un coliseo), «Cinturón azul de BJJ», su enlace y una línea de logro tomada de la entrada ya publicada del Showdown 2026 (sin categoría ni puesto). No figura en Profesores. La rejilla pasó a 2 columnas desde 600 px y 4 desde 1200 px.
- **Cabecera:** seis enlaces (Horarios, Instalaciones, Profesores, Nuestros campeones, Preguntas frecuentes y Ubicación). Hasta 1199 px van en una segunda fila bajo el logo; en celular esa fila se desliza y un degradado a la derecha avisa que hay más.
- **Solo contenido de @hulk.sports:** se descartaron posts de colaboración de otras cuentas, imágenes marcadas como "Contenido de IA" y las destacadas (tienen unas 250 semanas y son de la sede anterior en Cipreses).
- **Horario base:** el flyer 2026 que enviaste manda. Los horarios de 11:00 y 13:00 anunciados después aparecen aparte como "confirmar".
- **Precios:** se publican los de los flyers del 01/11/2026 (membresías de jiu-jitsu para adultos y promo del gym), las mensualidades de niños y gimnasio ($50 cada una, indicadas por el usuario el 03/11/2026) y el open mat; para lo demás, el botón "Preguntar precios" abre WhatsApp.
- **Video:** un solo reel (`DUOCQl_kb0m`, el que enviaste) recortado en tramos sin textos superpuestos. Las capturas fijas del mismo reel sirven de fotos del gym y del tatami.
- **Archivo .ics:** se quitó el botón "Agregar a mi calendario" de la página 2 (1 nov 2026) y con él su código.
- **Duración de clases:** la que muestra la pizarra (06:00-07:30, 17:00-18:00, 18:30-20:00, 20:00-21:00).
- **Tipografía:** Archivo (Google Fonts, licencia OFL) autoalojada, una sola familia con eje de ancho para las tres voces.
- **Skills:** `frontend-design` no está instalado en este equipo y la carpeta de referencias de `impeccable` viene vacía; se aplicaron `design-taste-frontend`, `emil-design-eng` y los principios de `impeccable` (pasada única de QA con correcciones en lote).
- **JSON-LD:** sin horarios de atención (por confirmar) ni precios (se ven en la página, pero la lista todavía está incompleta).

## Decisiones de contenido de la Etapa 1

- **Tarea 1.1, horario del gimnasio:** desde el 03/11/2026 el sitio muestra L-V 05:00-21:00, sábado 08:00-14:00 y domingo cerrado (apertura indicada por el equipo; antes se usaba el horario referencial de Google, con apertura a las 06:00). No hay lógica de feriados ni `openingHours` en el JSON-LD.
- **Tarea 1.2, Fernando Cárdenas Jr.:** su tarjeta muestra cinco datos tomados de la biografía de @hulkbjj (31 oct 2026). El enlace "Fuente" de la tarjeta sigue apuntando a una publicación de 2024 que solo respalda su rol de head coach. El nombre aparecía con y sin "Jr."; se unificó como "Fernando Cárdenas Jr." en octubre de 2026.
- **Tarea 1.3, Muay Thai y clases mixtas:** el sitio no presenta Muay Thai como servicio vigente ni como descontinuado (por confirmar). MMA se mantiene como servicio confirmado. La FAQ solo afirma que existe un grupo femenino; las clases mixtas y un horario exclusivo quedan por confirmar.
- **Tarea 1.4, cardio, parqueadero y spinning:** cardio se muestra como "Caminadoras". Spinning no se muestra (por confirmar) y no está en la pizarra, en `CONFIG.clases` ni en los filtros. El 03/11/2026 el propietario indicó «30 espacios de estacionamiento disponibles, con videovigilancia las 24 horas para mayor seguridad» (sin verificación independiente); se quitó «privado» del sitio y se agregó una foto en la pregunta frecuente «¿Hay parqueadero?».
- **Tarea 1.5, terapia física y deportiva:** se afirma el servicio y se invita a consultar por WhatsApp (botones "Consultar terapia", mensaje `fisio` de consulta). Se dice que Fernando es terapista físico, sin afirmar que atiende las sesiones. No se agregaron tratamientos, precios, horarios ni afirmaciones de salud.
- **Tarea 1.6, documentación:** se actualizaron este README, el inventario y el design brief para que describan lo que realmente hay en el sitio.
