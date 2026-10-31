# Design brief · Hulk Sports

**Lectura:** landing de 2 páginas para gente que llega desde Instagram en el celular, con un lenguaje de cartel de academia (tatami blanco, zócalo negro, una marca roja), construida en CSS nativo con una sola familia tipográfica de ancho variable.
Diales: variación 7 · movimiento 4 · densidad 5 (la información manda).

## 1. Concepto
**"La pared del tatami."** En el local, todo es tatami blanco, paredes blancas y un zócalo negro corrido; encima, el logo pintado con su segmento rojo bajo la "H". El sitio se arma igual: fondo claro, una franja negra que sostiene los datos y un único rojo que marca lo que importa (hoy, la acción principal).

## 2. Paleta (tokens en `css/styles.css`)
| Token | Claro | Oscuro | Origen |
|---|---|---|---|
| `--tatami` (fondo) | `#F2F3F1` | `#121212` | tatami y paredes del reel |
| `--placa` (superficie) | `#FBFBFA` | `#1B1B1B` | |
| `--tinta` (texto) | `#121212` | `#EDEDEA` | negro del logo |
| `--gris` (texto 2º) | `#55585B` (6,3:1) | `#A6A8AA` (7,9:1) | |
| `--franja` | `#141414` | `#050505` | zócalo negro |
| `--rojo` | `#D90000` (4,8:1 sobre tatami; blanco sobre rojo 5,3:1) | `#FF4A3D` (5,4:1 sobre fondo) | logo `#E80000` medido, oscurecido para AA |
Un solo acento. Rojo nunca para texto pequeño sobre negro (en la franja se usa blanco y el rojo como barra).

## 3. Tipografía
**Archivo** (variable, ejes `wdth 62-125` y `wght 100-900`), autoalojada. Una familia, tres anchos = una marca, tres voces. Justificación: los flyers de la marca usan condensadas pesadas; Archivo da esa voz en `wdth 62` sin caer en Bebas/Anton, y en `wdth 100` es legible para párrafos y horarios (cifras tabulares).
Escala (clamp, razón ~1,33): 14 · 16 · 19 · 25 · 33 · 44 · 58 · 76.

## 4. Elementos firma
1. **La franja.** Banda negra a ancho completo con un "tick" rojo de 64×6 px a la izquierda (el segmento rojo del logo). Lleva los datos operativos (hoy, dirección, WhatsApp) bajo el hero, el pie de página y la barra móvil.
2. **La punta del cinturón.** Barra negra con tiras de cinta blanca: cada tira = una clase por semana (Gi adultos 6, No-Gi 4, niños 5, MMA 4). Es dato, no adorno; se lee como los grados de un cinturón.
3. **La pizarra.** Horario en placas por día, el día de hoy marcado con barra roja superior y "Hoy" en texto; filtro por disciplina; botón para bajar `.ics`.

## 5. Layout
Grilla de 12 columnas, máx. 1320 px, margen lateral 16 px en móvil. Hero asimétrico (texto 7 col / video vertical 5 col). Bordes rectos en todo (radio 0); botones y chips también. Secciones con ritmo distinto: franja densa → bloque partido → lista de resultados a dos columnas → tira de fotos con scroll lateral → CTA corto. Sin sombras difusas; separación por filos de 1 px y por la franja.

## 6. Movimiento
- Video del hero en bucle (motivo: mostrar el lugar real sin texto). Con `prefers-reduced-motion` se queda el póster fijo.
- Fotos y bloques entran con `clip-path: inset()` de abajo hacia arriba, 560 ms `cubic-bezier(0.23,1,0.32,1)`, una sola vez (IntersectionObserver). Reducido: aparecen sin movimiento.
- Botones: `scale(0.97)` al presionar, 140 ms. Chips del filtro: color 160 ms. Hover solo en `(hover:hover)`.
- Nada de scroll listeners, nada de animaciones en acciones de teclado.

## 7. Una marca, tres voces
| Área | Ancho / peso | Carácter |
|---|---|---|
| Jiu-jitsu | `wdth 62`, `wght 800`, mayúsculas, interlineado 0,92 | intensidad: fondo negro, video de rolling |
| Gym | `wdth 100`, `wght 650`, cifras grandes | ritmo: lista de zonas en compás, foto de entrenamiento |
| Terapia física | `wdth 118`, `wght 300`, aire amplio | calma y precisión: fondo claro, filos finos, sin rojo |

## Test de intercambiabilidad
Si cambias el logo, siguen siendo este zócalo negro, este tatami blanco y este segmento rojo, las fotos y el video del local de El Edén, y los conteos de clases sacados de su flyer. No funciona igual para otra academia.
