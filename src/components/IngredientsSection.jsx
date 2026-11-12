import React from 'react';
import { INGREDIENTS_LIST } from '../data/cookiesData';

const STROKE_COLOR = '#d32240';

function IngredientArtwork({ id }) {
  const baseProps = {
    viewBox: '0 0 100 100',
    fill: 'none',
    stroke: STROKE_COLOR,
    strokeWidth: '1.35',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className: 'ing-svg',
    'aria-hidden': 'true',
  };

  switch (id) {
    case 'beurre-noisette':
      // Brown butter: cazo de pastelería francesa con remaches, mantequilla dorándose, ondas y destellos aromáticos
      return (
        <svg {...baseProps}>
          {/* Destellos ornamentales superiores */}
          <path d="M24 24 L26 28 L30 30 L26 32 L24 36 L22 32 L18 30 L22 28 Z" />
          <circle cx="66" cy="22" r="1.2" fill={STROKE_COLOR} />
          {/* Espirales de aroma */}
          <path d="M35 46 C33 40 39 36 36 30 C34 25 38 20 37 16" />
          <path d="M45 44 C43 38 49 34 46 28 C44 23 48 18 47 14" />
          <path d="M55 46 C53 40 59 36 56 30 C55 26 57 22 57 19" />
          {/* Cazo de cobre con borde doble y ondas de beurre noisette */}
          <ellipse cx="44" cy="57" rx="25" ry="8.5" />
          <ellipse cx="44" cy="57" rx="19" ry="5" strokeDasharray="3 2.5" />
          <circle cx="38" cy="56" r="1.8" />
          <circle cx="49" cy="58" r="1.4" />
          <circle cx="44" cy="54" r="1" fill={STROKE_COLOR} />
          <path d="M19 57 V70 C19 77 30 82 44 82 C58 82 69 77 69 70 V57" />
          <path d="M23 64 C30 68 58 68 65 64" />
          {/* Mango con remaches y aro para colgar */}
          <path d="M68 60 L90 48 C93 47 95 50 92 52 L69 65" />
          <circle cx="72" cy="60.5" r="1" fill={STROKE_COLOR} />
          <circle cx="89" cy="50.5" r="1.3" />
          {/* Base ornamental */}
          <path d="M30 86 H58" />
        </svg>
      );

    case 'sal-marina':
      // Escama de sal: cristal piramidal hueco de sal Maldon con terrazas geométricas y destellos minerales
      return (
        <svg {...baseProps}>
          {/* Destellos minerales exteriores */}
          <path d="M22 24 V30 M19 27 H25" />
          <path d="M78 24 V30 M75 27 H81" />
          <polygon points="82,74 85,77 82,80 79,77" />
          <polygon points="18,74 21,77 18,80 15,77" />
          <circle cx="50" cy="11" r="1.1" fill={STROKE_COLOR} />
          {/* Cristal piramidal escalonado */}
          <polygon points="50,16 84,54 50,84 16,54" />
          <polygon points="50,25 75,53.5 50,75 25,53.5" />
          <polygon points="50,34 66,53 50,66 34,53" />
          <polygon points="50,43 58,52.5 50,58 42,52.5" />
          <circle cx="50" cy="51" r="1.5" />
          {/* Aristas diagonales de la pirámide */}
          <line x1="50" y1="16" x2="50" y2="43" />
          <line x1="84" y1="54" x2="58" y2="52.5" />
          <line x1="50" y1="84" x2="50" y2="58" />
          <line x1="16" y1="54" x2="42" y2="52.5" />
        </svg>
      );

    case 'vainilla':
      // Vainilla: orquídea botánica detallada con labelo rizado, hoja nervada, dos vainas curvadas y semillas
      return (
        <svg {...baseProps}>
          {/* Vainas de vainilla curvadas con cáliz */}
          <path d="M20 82 C32 62 56 42 80 18 C82 16 84 18 82 20 C60 44 38 64 24 85 Z" />
          <path d="M27 86 C40 68 62 48 85 25" />
          {/* Hoja botánica inferior con nervaduras */}
          <path d="M18 70 C36 62 60 58 84 66 C66 76 40 76 18 70 Z" />
          <path d="M22 70 C42 67 62 66 80 66" />
          <path d="M40 68 L46 64 M54 67 L60 63 M48 68 L54 72" />
          {/* Orquídea de vainilla de 5 pétalos y labelo central */}
          <path d="M45 41 C37 27 47 16 52 31" />
          <path d="M52 31 C61 18 71 28 57 39" />
          <path d="M57 39 C72 42 66 56 54 46" />
          <path d="M54 46 C50 60 38 56 44 45" />
          <path d="M44 45 C30 44 32 32 45 41" />
          {/* Labelo central y estambres */}
          <circle cx="50.5" cy="40.5" r="4" />
          <circle cx="50.5" cy="40.5" r="1.2" fill={STROKE_COLOR} />
          {/* Semillas aromáticas de vainilla */}
          <circle cx="28" cy="30" r="1" fill={STROKE_COLOR} />
          <circle cx="32" cy="25" r="0.9" fill={STROKE_COLOR} />
          <circle cx="72" cy="52" r="1" fill={STROKE_COLOR} />
        </svg>
      );

    case 'caramelo-salado':
      // Gota de caramelo salado: gota sedosa con reflejos, corona de impacto, ondas concéntricas y cristales de sal
      return (
        <svg {...baseProps}>
          {/* Cristales de sal flotantes y destello */}
          <polygon points="26,28 29,31 26,34 23,31" />
          <polygon points="75,34 77.5,36.5 75,39 72.5,36.5" />
          <path d="M72 20 V25 M69.5 22.5 H74.5" />
          {/* Gota principal de caramelo con doble línea de brillo */}
          <path d="M50 15 C55 29 70 45 70 59 C70 71 61 79 50 79 C39 79 30 71 30 59 C30 45 45 29 50 15 Z" />
          <path d="M37 53 C35 62 40 70 48 73" />
          <path d="M41 44 C39 48 38 51 38 54" />
          <circle cx="58" cy="62" r="2" />
          {/* Gotitas de salpicadura y ondas concéntricas en la base */}
          <path d="M22 72 C24 68 26 70 24 73" />
          <path d="M78 72 C76 68 74 70 76 73" />
          <path d="M20 82 C30 87 70 87 80 82" />
          <path d="M28 87.5 C38 91 62 91 72 87.5" />
          <path d="M40 92 C46 93.5 54 93.5 60 92" />
        </svg>
      );

    case 'frangipane':
      // Crema frangipane: copa de pastelería con pie labrado, espiral de crema de almendras, flor y almendra laminada
      return (
        <svg {...baseProps}>
          {/* Almendra fileteada y flor decorativa coronando la crema */}
          <path d="M52 25 C56 15 66 16 62 27 C58 29 54 28 52 25 Z" />
          <path d="M55 24 C57 20 60 20 60 24" />
          <circle cx="34" cy="24" r="1.1" fill={STROKE_COLOR} />
          <path d="M26 30 V34 M24 32 H28" />
          {/* Capas batidas de crema frangipane */}
          <path d="M24 55 C24 41 39 37 48 22 C56 31 76 37 76 55" />
          <path d="M32 49 C42 40 58 40 67 49" />
          <path d="M39 40 C46 34 55 35 60 41" />
          <path d="M28 55 C36 51 46 51 54 55" />
          {/* Cuenco de porcelana con cenefa y pie de copa */}
          <path d="M18 55 H82 C80 72 66 81 50 81 C34 81 20 72 18 55 Z" />
          <line x1="20" y1="60" x2="80" y2="60" />
          <path d="M44 81 L41 88 H59 L56 81" />
          <line x1="34" y1="88" x2="66" y2="88" />
        </svg>
      );

    case 'almendras':
      // Almendras: dos almendras con surcos leñosos, ramillete de hojas aserradas y flor de almendro
      return (
        <svg {...baseProps}>
          {/* Almendra principal con textura botánica */}
          <path d="M42 20 C23 36 21 63 38 80 C55 67 59 40 42 20 Z" />
          <path d="M41 27 C34 44 34 59 38 73" />
          <path d="M43 30 C47 45 46 58 41 71" />
          <circle cx="32" cy="52" r="0.9" fill={STROKE_COLOR} />
          <circle cx="34" cy="60" r="0.9" fill={STROKE_COLOR} />
          {/* Segunda almendra inclinada */}
          <path d="M67 28 C52 42 50 67 64 82 C79 70 83 47 67 28 Z" />
          <path d="M66 36 C60 50 60 63 64 75" />
          <path d="M68 40 C72 52 71 63 67 73" />
          {/* Hojas botánicas con nervadura central */}
          <path d="M26 52 C12 48 10 32 25 34 C30 35 30 44 26 52 Z" />
          <path d="M16 40 L26 46" />
          <path d="M28 66 C16 68 12 58 22 55" />
          {/* Pequeña flor de almendro superior */}
          <circle cx="55" cy="19" r="2" />
          <circle cx="55" cy="15" r="1.5" />
          <circle cx="59" cy="18" r="1.5" />
          <circle cx="57" cy="22" r="1.5" />
          <circle cx="53" cy="22" r="1.5" />
          <circle cx="51" cy="18" r="1.5" />
        </svg>
      );

    case 'pistacho':
      // Pistachos: dos pistachos abiertos con cáscara biselada, fruto veteado, ramita de hojas y destello
      return (
        <svg {...baseProps}>
          {/* Ramita superior con hojas de pistacho */}
          <path d="M24 28 C16 22 18 14 28 18 C32 20 30 26 24 28 Z" />
          <path d="M20 19 L27 25" />
          <path d="M74 20 V25 M71.5 22.5 H76.5" />
          {/* Pistacho principal abierto con valvas y fruto interno */}
          <path d="M40 82 C21 73 19 42 36 22 C41 36 42 58 40 82 Z" />
          <path d="M27 52 C27 63 32 72 38 77" />
          <path d="M40 82 C59 73 61 42 44 22 C39 36 38 58 40 82 Z" />
          <path d="M53 52 C53 63 48 72 42 77" />
          {/* Fruto de pistacho asomando con nervaduras */}
          <path d="M36 24 C38 15 42 15 44 24 C47 36 46 54 40 67 C34 54 33 36 36 24 Z" />
          <path d="M39 26 C41 34 41 44 39 52" />
          <path d="M37 34 L40 38 M43 36 L40 40" />
          {/* Segundo pistacho inclinado a la derecha */}
          <path d="M58 84 C52 69 58 46 74 35 C74 48 68 69 58 84 Z" />
          <path d="M58 84 C73 79 86 58 81 39 C73 50 66 69 58 84 Z" />
          <path d="M74 35 C78 30 82 33 81 39" />
          <path d="M73 44 C70 54 66 64 62 72" />
        </svg>
      );

    case 'avellana':
      // Avellana: avellana silvestre con cúpula foliácea festoneada, estrías finas, tallo y hoja de avellano
      return (
        <svg {...baseProps}>
          {/* Tallo y hoja botánica de avellano con nervaduras */}
          <path d="M50 14 V23" />
          <path d="M50 19 C64 10 82 16 76 30 C68 33 56 26 50 19 Z" />
          <path d="M52 20 L72 25" />
          <path d="M60 22 L64 18 M65 23.5 L69 20 M58 21.5 L61 26" />
          <path d="M50 19 C38 12 24 16 28 27 C34 29 44 24 50 19 Z" />
          <path d="M48 20 L32 24" />
          {/* Cuerpo de la avellana y cúpula superior festoneada */}
          <path d="M50 23 C27 35 23 59 35 77 C43 87 57 87 65 77 C77 59 73 35 50 23 Z" />
          <path d="M28 45 Q34 51 40 45 Q45 51 50 45 Q55 51 60 45 Q66 51 72 45" />
          <path d="M32 38 Q41 42 50 38 Q59 42 68 38" />
          {/* Estrías longitudinales de la cáscara y base umbonada */}
          <path d="M40 50 C37 61 39 72 44 80" />
          <path d="M50 48 V83" />
          <path d="M60 50 C63 61 61 72 56 80" />
          <path d="M41 79 C46 76 54 76 59 79" />
        </svg>
      );

    case 'chocolate':
      // Chocolate: gota clásica de chocolate con rizo artesanal, onza biselada detrás y polvo de cacao
      return (
        <svg {...baseProps}>
          {/* Onza de chocolate biselada en segundo plano */}
          <path d="M54 28 H80 C82 28 83 29 83 31 V57 C83 59 82 60 80 60 H68" />
          <path d="M58 34 H77 V53 H66" />
          <line x1="83" y1="28" x2="77" y2="34" />
          <line x1="83" y1="60" x2="77" y2="53" />
          {/* Gota / chip de chocolate principal con rizo y líneas de brillo */}
          <path d="M46 18 C39 20 39 27 43 30 C29 42 19 55 19 68 C19 80 31 86 45 86 C59 86 71 80 71 68 C71 51 55 35 46 18 Z" />
          <path d="M28 57 C26 66 31 76 41 79" />
          <path d="M33 47 C30 51 29 53 29 55" />
          <path d="M54 54 C59 62 58 72 50 77" />
          {/* Base y partículas de cacao */}
          <path d="M24 86 H66" />
          <circle cx="24" cy="30" r="1.1" fill={STROKE_COLOR} />
          <circle cx="18" cy="38" r="0.9" fill={STROKE_COLOR} />
          <circle cx="78" cy="74" r="1.1" fill={STROKE_COLOR} />
        </svg>
      );

    case 'chocolate-blanco':
      // Chocolate blanco: tableta fina de patisserie con onzas biseladas, grabado floral y esquina troceada
      return (
        <svg {...baseProps}>
          {/* Destellos suaves de manteca de cacao */}
          <path d="M16 26 V32 M13 29 H19" />
          <circle cx="85" cy="70" r="1.1" fill={STROKE_COLOR} />
          {/* Tableta principal con marco doble */}
          <rect x="24" y="16" width="52" height="68" rx="4" />
          <rect x="27" y="19" width="46" height="62" rx="2.5" />
          {/* 6 onzas biseladas con detalle central */}
          <rect x="31" y="23" width="16" height="16" rx="1.5" />
          <circle cx="39" cy="31" r="2" />
          <rect x="53" y="23" width="16" height="16" rx="1.5" />
          <circle cx="61" cy="31" r="2" />
          <rect x="31" y="42" width="16" height="16" rx="1.5" />
          <path d="M37 50 H41 M39 48 V52" />
          <rect x="53" y="42" width="16" height="16" rx="1.5" />
          <path d="M59 50 H63 M61 48 V52" />
          <rect x="31" y="61" width="16" height="16" rx="1.5" />
          <circle cx="39" cy="69" r="2" />
          <rect x="53" y="61" width="16" height="16" rx="1.5" />
          <circle cx="61" cy="69" r="2" />
        </svg>
      );

    case 'cacao-100':
      // Cacao 100%: mazorca de cacao acanalada en rama con hojas nervadas y granos de cacao detallados
      return (
        <svg {...baseProps}>
          {/* Rama leñosa y hojas de cacao con nervaduras */}
          <path d="M16 22 C32 19 48 22 60 29" />
          <path d="M34 21 C43 9 66 9 75 22 C62 29 44 27 34 21 Z" />
          <path d="M36 21 C50 19 62 20 73 22" />
          <path d="M46 20 L51 16 M56 20 L61 16 M50 20 L55 24" />
          {/* Mazorca de cacao acanalada con textura botánica */}
          <path d="M26 30 C15 43 19 69 41 82 C57 78 67 56 56 35 C48 26 35 26 26 30 Z" />
          <path d="M26 30 C32 47 36 65 41 82" />
          <path d="M35 28 C43 45 45 63 41 82" />
          <path d="M44 29 C51 45 52 62 41 82" />
          <path d="M21 47 C33 44 47 46 60 51" strokeDasharray="2 2.5" />
          <path d="M23 61 C34 59 46 61 57 64" strokeDasharray="2 2.5" />
          {/* Dos granos de cacao con pliegues internos */}
          <ellipse cx="74" cy="60" rx="10" ry="6.5" transform="rotate(-22 74 60)" />
          <path d="M66 63 Q74 59 82 57" />
          <path d="M70 58 L72 62 M76 56 L78 60" />
          <ellipse cx="71" cy="77" rx="9.5" ry="6" transform="rotate(14 71 77)" />
          <path d="M63 75 Q71 77 79 79" />
          <path d="M68 74 L67 78 M74 75 L73 79" />
        </svg>
      );

    case 'azucar-morena':
      // Azúcar morena: cubo isométrico facetado, segundo terrón pequeño y cristales de caña alrededor
      return (
        <svg {...baseProps}>
          {/* Destello cristalino */}
          <path d="M22 22 V28 M19 25 H25" />
          {/* Terrón principal isométrico con bisel interno */}
          <polygon points="48,20 74,34 48,48 22,34" />
          <polygon points="48,24 67,34 48,44 29,34" strokeDasharray="2.5 2" />
          <polygon points="22,34 48,48 48,78 22,64" />
          <polygon points="48,48 74,34 74,64 48,78" />
          {/* Textura cristalina en las caras */}
          <circle cx="48" cy="34" r="1.2" fill={STROKE_COLOR} />
          <circle cx="40" cy="33" r="1" fill={STROKE_COLOR} />
          <circle cx="56" cy="35" r="1" fill={STROKE_COLOR} />
          <circle cx="35" cy="54" r="1.2" fill={STROKE_COLOR} />
          <circle cx="39" cy="63" r="1" fill={STROKE_COLOR} />
          <circle cx="60" cy="56" r="1.2" fill={STROKE_COLOR} />
          <circle cx="56" cy="65" r="1" fill={STROKE_COLOR} />
          {/* Segundo terrón pequeño y cristales sueltos en la base */}
          <polygon points="75,66 86,72 75,78 64,72" />
          <polyline points="64,72 64,81 75,87 86,81 86,72" />
          <line x1="75" y1="78" x2="75" y2="87" />
          <polygon points="22,75 26,77 22,79 18,77" />
          <circle cx="32" cy="82" r="1.2" fill={STROKE_COLOR} />
          <circle cx="15" cy="70" r="1" fill={STROKE_COLOR} />
        </svg>
      );

    case 'canela':
      // Canela: atado de ramas de canela Ceilán con doble espiral, vetas de corteza, cordel con lazo y flor de anís
      return (
        <svg {...baseProps}>
          {/* Flor de especia / destello ornamental superior */}
          <path d="M26 22 L28 26 L32 28 L28 30 L26 34 L24 30 L20 28 L24 26 Z" />
          <circle cx="26" cy="28" r="1" fill={STROKE_COLOR} />
          {/* Rama superior de canela con vetas finas */}
          <path d="M24 39 L73 21" />
          <path d="M28 51 L77 33" />
          <path d="M36 40 L48 35 M56 32 L68 28" />
          {/* Doble espiral de corteza (izquierda superior) */}
          <path d="M24 39 C18 41 18 47 24 46 C22 44 24 42 26 43" />
          <path d="M28 51 C22 53 20 48 24 46 C26 45 28 47 26 49" />
          <path d="M73 21 C77 22 79 29 77 33" />
          {/* Rama inferior de canela con vetas finas */}
          <path d="M22 59 L75 43" />
          <path d="M26 71 L79 55" />
          <path d="M35 61 L46 58 M58 54 L70 50" />
          {/* Doble espiral de corteza (izquierda inferior) */}
          <path d="M22 59 C16 61 16 67 22 66 C20 64 22 62 24 63" />
          <path d="M26 71 C20 73 18 68 22 66 C24 65 26 67 24 69" />
          <path d="M75 43 C79 44 81 51 79 55" />
          {/* Cordel triple con lazo botánico */}
          <path d="M44 30 L54 63" />
          <path d="M47.5 29 L57.5 62" />
          <path d="M51 28 L61 61" />
          <path d="M55 62 C49 74 39 71 47 63" />
          <path d="M57 62 C64 74 72 69 62 61" />
          <path d="M54 64 L50 78 M58 64 L63 77" />
        </svg>
      );

    case 'jengibre':
      // Jengibre: rizoma ramificado con brotes, anillos de crecimiento, raicillas, corte transversal y dos rodajas
      return (
        <svg {...baseProps}>
          {/* Cuerpo del rizoma de jengibre con brotes nudosos */}
          <path d="M16 61 C12 55 16 45 25 46 C26 32 32 22 41 24 C47 25 47 35 46 42 C51 31 59 24 66 27 C72 30 70 41 67 48 L78 51 C84 53 84 68 77 70 L51 70 C43 75 33 75 24 68 C19 67 17 64 16 61 Z" />
          {/* Corte transversal con anillo interior fibroso */}
          <ellipse cx="77" cy="60.5" rx="4.2" ry="9" />
          <ellipse cx="77" cy="60.5" rx="2" ry="4.5" strokeDasharray="1.5 1.5" />
          {/* Anillos de crecimiento y nudos del rizoma */}
          <path d="M30 34 C35 32 41 34 45 37" />
          <path d="M32 28 C36 27 40 28 43 30" />
          <path d="M54 36 C59 35 64 37 67 40" />
          <path d="M57 31 C61 30 64 31 67 34" />
          <path d="M26 53 C30 59 30 65 27 69" />
          <path d="M43 51 C46 57 46 65 44 71" />
          <path d="M59 51 C62 57 62 64 59 70" />
          {/* Finas raicillas botánicas inferiores */}
          <path d="M32 72 C31 76 28 79 25 81" />
          <path d="M46 72 C45 76 43 79 40 81" />
          {/* Dos rodajas de jengibre cortadas con halo fibroso */}
          <ellipse cx="64" cy="82" rx="10" ry="6" />
          <ellipse cx="64" cy="82" rx="5.5" ry="3" strokeDasharray="2 2" />
          <path d="M73 79 C80 78 85 81 84 85 C83 88 76 89 70 87" />
        </svg>
      );

    case 'nuez-moscada':
      // Nuez moscada: semilla entera con arilo de macis, mitad cortada con veteado marmoleado, hoja y polvo de especia
      return (
        <svg {...baseProps}>
          {/* Hoja botánica superior */}
          <path d="M36 25 C34 15 46 12 50 22" />
          {/* Semilla entera con red de macis envolvente */}
          <ellipse cx="35" cy="50" rx="16" ry="23" transform="rotate(-14 35 50)" />
          <path d="M29 31 C25 43 27 57 33 69" />
          <path d="M36 29 C34 42 36 56 41 68" />
          <path d="M23 44 C30 47 38 45 45 40" />
          <path d="M24 56 C32 59 40 57 47 52" />
          {/* Semilla cortada a la mitad con veteado interior marmoleado */}
          <ellipse cx="65" cy="54" rx="16.5" ry="22.5" transform="rotate(12 65 54)" />
          <ellipse cx="65" cy="54" rx="13" ry="18.5" transform="rotate(12 65 54)" />
          <path d="M65 36 C61 44 69 48 63 56 C59 62 67 66 64 72" />
          <path d="M54 47 C58 50 61 49 65 46" />
          <path d="M53 56 C57 58 60 57 63 55" />
          <path d="M65 57 C69 59 73 58 76 55" />
          <path d="M66 47 C70 49 74 48 77 45" />
          {/* Ralladura de nuez moscada al pie */}
          <circle cx="44" cy="80" r="1.1" fill={STROKE_COLOR} />
          <circle cx="50" cy="83" r="1" fill={STROKE_COLOR} />
          <circle cx="55" cy="79" r="0.9" fill={STROKE_COLOR} />
        </svg>
      );

    case 'gingerbread':
      // Gingerbread: muñeco de jengibre artesanal con glaseado festoneado, pajarita, pespuntes y estrellas de especias
      return (
        <svg {...baseProps}>
          {/* Estrellas ornamentales a los lados */}
          <path d="M18 26 V32 M15 29 H21" />
          <path d="M82 26 V32 M79 29 H85" />
          <circle cx="20" cy="68" r="1.1" fill={STROKE_COLOR} />
          <circle cx="80" cy="68" r="1.1" fill={STROKE_COLOR} />
          {/* Silueta del muñeco de jengibre */}
          <circle cx="50" cy="26" r="12.5" />
          <path d="M39 36 L21 42 C16 44 16 52 23 54 L36 52 L31 77 C30 84 39 86 43 79 L50 67 L57 79 C61 86 70 84 69 77 L64 52 L77 54 C84 52 84 44 79 42 L61 36" />
          {/* Rostro y corona de glaseado */}
          <path d="M42 18 Q46 21 50 18 Q54 21 58 18" />
          <circle cx="45.5" cy="25" r="1.1" fill={STROKE_COLOR} />
          <circle cx="54.5" cy="25" r="1.1" fill={STROKE_COLOR} />
          <path d="M45.5 30.5 Q50 34 54.5 30.5" />
          {/* Pajarita en el cuello y botones */}
          <polygon points="50,38 44,35 44,41" />
          <polygon points="50,38 56,35 56,41" />
          <circle cx="50" cy="48" r="2" />
          <circle cx="50" cy="56" r="2" />
          {/* Ondas de glaseado real en muñecas y tobillos */}
          <path d="M23 42 Q26 48 23 53" />
          <path d="M77 42 Q74 48 77 53" />
          <path d="M32 73 Q37 76 42 74" />
          <path d="M58 74 Q63 76 68 73" />
        </svg>
      );

    case 'amaretto':
      // Amaretto: licorera cuadrada italiana con tapón tallado, sello en el cuello, etiqueta ornamental y ramita de almendra
      return (
        <svg {...baseProps}>
          {/* Tapón de cristal facetado con corona */}
          <polygon points="40,14 60,14 58,24 42,24" />
          <line x1="46" y1="14" x2="46" y2="24" />
          <line x1="54" y1="14" x2="54" y2="24" />
          <line x1="39" y1="24" x2="61" y2="24" />
          {/* Cuello con collarín y cuerpo cuadrado tallado */}
          <path d="M44 24 V33 L29 41 V82 C29 84.5 31 86 33.5 86 H66.5 C69 86 71 84.5 71 82 V41 L56 33 V24" />
          <line x1="44" y1="29" x2="56" y2="29" />
          <path d="M29 41 Q50 45 71 41" />
          <path d="M33 45 V81 M67 45 V81" strokeDasharray="2 3" />
          {/* Etiqueta clásica con doble marco y escudo */}
          <rect x="35" y="49" width="30" height="23" rx="1.5" />
          <rect x="37.5" y="51.5" width="25" height="18" rx="1" />
          <circle cx="50" cy="56.5" r="2" />
          <line x1="41" y1="61.5" x2="59" y2="61.5" />
          <line x1="44" y1="65" x2="56" y2="65" />
          {/* Nivel de licor y almendra decorativa al pie */}
          <path d="M31 78 H69" />
        </svg>
      );

    case 'mantequilla':
    default:
      // Mantequilla: bloque de mantequilla francesa con dos porciones cortadas sobre bandeja moldurada y espátula fina
      return (
        <svg {...baseProps}>
          {/* Destello superior */}
          <path d="M30 24 V30 M27 27 H33" />
          {/* Bloque de mantequilla isométrico con dos rebanadas ya cortadas */}
          <path d="M24 50 L58 36 L78 45 L44 59 Z" />
          <path d="M24 50 V66 L44 75 V59" />
          <path d="M44 59 V75 L78 61 V45" />
          {/* Cortes de porciones individuales y bisel interno */}
          <line x1="33" y1="46.3" x2="53" y2="55.3" />
          <line x1="53" y1="55.3" x2="53" y2="71.3" />
          <line x1="41" y1="43" x2="61" y2="52" />
          <line x1="61" y1="52" x2="61" y2="68" />
          <path d="M48 44 L69 35.5" strokeDasharray="2 2" />
          {/* Bandeja de porcelana con doble borde ornamental */}
          <path d="M12 67 L46 83 L88 65" />
          <path d="M16 71 L46 86 L84 69" />
          {/* Rizo de mantequilla decorativo */}
          <circle cx="46" cy="79" r="1" fill={STROKE_COLOR} />
        </svg>
      );
  }
}

export default function IngredientsSection() {
  return (
    <section id="ingredientes" aria-labelledby="ingredientes-heading">
      <h2 id="ingredientes-heading">Ingredientes</h2>
      <p className="ing-subtext">
        Los protagonistas más queridos…
      </p>
      <div className="ing-wrap">
        <div className="ing-grid" role="list">
          {INGREDIENTS_LIST.map((ing) => (
            <div key={ing.id} className="ing-card" role="listitem">
              <div className="ing-media">
                <IngredientArtwork id={ing.id} />
              </div>
              <span className="ing-name">{ing.name.toLowerCase()}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
