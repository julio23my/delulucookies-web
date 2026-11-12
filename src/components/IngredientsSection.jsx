import React from 'react';
import { INGREDIENTS_LIST } from '../data/cookiesData';

const STROKE_COLOR = '#d32240';

function IngredientArtwork({ id }) {
  const baseProps = {
    viewBox: '0 0 100 100',
    fill: 'none',
    stroke: STROKE_COLOR,
    strokeWidth: '1.4',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className: 'ing-svg',
    'aria-hidden': 'true',
  };

  switch (id) {
    case 'beurre-noisette':
      // Brown butter: cazo de pastelería con mantequilla dorándose y espirales de aroma
      return (
        <svg {...baseProps}>
          <ellipse cx="44" cy="58" rx="24" ry="8" />
          <path d="M20 58 V70 C20 76 31 80 44 80 C57 80 68 76 68 70 V58" />
          <path d="M68 61 L90 50" />
          <path d="M68 65 L91 54" />
          <ellipse cx="44" cy="58" rx="14" ry="4" strokeDasharray="2 3" />
          <path d="M35 46 C33 41 38 37 36 32 C34 27 38 23 37 20" />
          <path d="M45 44 C43 39 48 35 46 30 C44 25 48 21 47 18" />
          <path d="M55 46 C53 41 58 37 56 32" />
        </svg>
      );

    case 'sal-marina':
      // Escama de sal: cristal piramidal hueco de sal marina con facetas finas
      return (
        <svg {...baseProps}>
          <polygon points="50,18 82,56 50,82 18,56" />
          <polygon points="50,30 70,55 50,71 30,55" />
          <polygon points="50,41 59,54 50,61 41,54" />
          <line x1="50" y1="18" x2="50" y2="41" />
          <line x1="82" y1="56" x2="59" y2="54" />
          <line x1="50" y1="82" x2="50" y2="61" />
          <line x1="18" y1="56" x2="41" y2="54" />
        </svg>
      );

    case 'vainilla':
      // Vainilla: flor de orquídea de vainilla con dos vainas finas curvadas
      return (
        <svg {...baseProps}>
          <path d="M24 80 C34 62 56 44 78 22" />
          <path d="M28 83 C40 65 60 47 81 25" />
          <path d="M20 72 C38 66 58 58 80 64" />
          {/* Flor botánica de vainilla */}
          <path d="M46 42 C40 30 48 20 52 32" />
          <path d="M52 32 C60 22 68 30 56 40" />
          <path d="M56 40 C68 44 62 56 52 46" />
          <path d="M52 46 C46 58 36 50 46 42" />
          <circle cx="51" cy="40" r="3" />
        </svg>
      );

    case 'caramelo-salado':
      // Gota de caramelo: gota suave y fluida con ondas concéntricas en la base
      return (
        <svg {...baseProps}>
          <path d="M50 18 C55 31 70 46 70 60 C70 71 61 79 50 79 C39 79 30 71 30 60 C30 46 45 31 50 18 Z" />
          <path d="M39 56 C38 64 42 70 49 72" />
          <path d="M24 82 C32 86 68 86 76 82" />
          <path d="M34 88 C42 90 58 90 66 88" />
        </svg>
      );

    case 'frangipane':
      // Crema: cuenco con crema batida en espiral suave
      return (
        <svg {...baseProps}>
          <path d="M26 56 C26 42 40 38 48 24 C56 32 74 38 74 56" />
          <path d="M35 49 C44 41 56 41 64 49" />
          <path d="M42 39 C48 34 55 35 59 40" />
          <path d="M20 56 H80 C78 74 65 84 50 84 C35 84 22 74 20 56 Z" />
          <line x1="36" y1="84" x2="64" y2="84" />
        </svg>
      );

    case 'almendras':
      // Almendras: dos almendras botánicas con vetas finas y hojas
      return (
        <svg {...baseProps}>
          <path d="M42 22 C24 38 22 64 38 80 C54 68 58 42 42 22 Z" />
          <path d="M41 30 C35 46 35 60 38 72" />
          <path d="M66 30 C52 44 50 68 64 82 C78 70 82 48 66 30 Z" />
          <path d="M65 38 C60 52 60 64 64 74" />
          <path d="M24 52 C14 46 14 34 26 36" />
        </svg>
      );

    case 'pistacho':
      // Pistachos: dos pistachos claramente reconocibles con su cáscara ovalada entreabierta y el fruto asomando
      return (
        <svg {...baseProps}>
          {/* Pistacho principal abierto */}
          <path d="M40 80 C22 72 20 42 36 22 C41 36 42 58 40 80 Z" />
          <path d="M40 80 C58 72 60 42 44 22 C39 36 38 58 40 80 Z" />
          {/* Fruto interno de pistacho asomando entre las dos valvas */}
          <path d="M36 24 C38 16 42 16 44 24 C47 36 46 54 40 66 C34 54 33 36 36 24 Z" />
          <path d="M38 30 C40 36 40 44 39 50" />
          {/* Segundo pistacho inclinado a la derecha */}
          <path d="M58 82 C52 68 58 46 74 36 C74 48 68 68 58 82 Z" />
          <path d="M58 82 C72 78 84 58 80 40 C73 50 66 68 58 82 Z" />
          <path d="M74 36 C77 32 80 34 80 40" />
        </svg>
      );

    case 'avellana':
      // Avellanas: avellana botánica con su cúpula estriada y hoja
      return (
        <svg {...baseProps}>
          <path d="M50 22 C28 34 24 58 35 76 C43 86 57 86 65 76 C76 58 72 34 50 22 Z" />
          <path d="M29 45 Q40 52 50 45 Q60 52 71 45" />
          <path d="M42 52 C40 62 42 72 45 78" />
          <path d="M58 52 C60 62 58 72 55 78" />
          <path d="M50 16 V22" />
          <path d="M50 20 C62 14 74 18 70 28 C62 28 54 24 50 20 Z" />
        </svg>
      );

    case 'chocolate':
      // Chispa de chocolate: gota clásica de chocolate con rizo superior
      return (
        <svg {...baseProps}>
          <path d="M52 20 C46 22 46 28 49 31 C36 42 26 54 26 67 C26 78 37 84 50 84 C63 84 74 78 74 67 C74 51 60 36 52 20 Z" />
          <path d="M36 58 C34 66 38 74 46 77" />
          <path d="M34 84 H66" />
        </svg>
      );

    case 'chocolate-blanco':
      // Chocolate blanco: tableta fina de chocolate dividida en onzas
      return (
        <svg {...baseProps}>
          <rect x="26" y="18" width="48" height="64" rx="4" />
          <rect x="32" y="24" width="15" height="15" rx="1.5" />
          <rect x="53" y="24" width="15" height="15" rx="1.5" />
          <rect x="32" y="43" width="15" height="15" rx="1.5" />
          <rect x="53" y="43" width="15" height="15" rx="1.5" />
          <rect x="32" y="62" width="15" height="14" rx="1.5" />
          <rect x="53" y="62" width="15" height="14" rx="1.5" />
        </svg>
      );

    case 'cacao-100':
      // Cacao 100%: mazorca de cacao acanalada en rama con hoja botánica y granos de cacao tostados
      return (
        <svg {...baseProps}>
          {/* Tallo y hoja botánica de cacao */}
          <path d="M22 24 C36 22 48 24 58 30" />
          <path d="M36 23 C44 12 64 12 72 24 C60 30 44 28 36 23 Z" />
          <path d="M38 23 C50 21 60 22 70 24" />
          {/* Mazorca de cacao acanalada (inclinada) */}
          <path d="M28 32 C18 44 22 68 42 80 C56 76 66 56 56 36 C48 28 36 28 28 32 Z" />
          {/* Surcos característicos de la mazorca de cacao */}
          <path d="M28 32 C34 48 38 64 42 80" />
          <path d="M36 30 C44 46 46 62 42 80" />
          <path d="M23 48 C34 46 46 48 59 52" strokeDasharray="2 3" />
          {/* Dos granos de cacao al costado con su hendidura central */}
          <ellipse cx="73" cy="62" rx="9" ry="6" transform="rotate(-25 73 62)" />
          <path d="M66 65 Q73 61 80 59" />
          <ellipse cx="70" cy="77" rx="8.5" ry="5.5" transform="rotate(15 70 77)" />
          <path d="M63 75 Q70 77 77 79" />
        </svg>
      );

    case 'azucar-morena':
      // Cubo de azúcar: cubo isométrico de azúcar morena con granos finos
      return (
        <svg {...baseProps}>
          <polygon points="50,22 76,36 50,50 24,36" />
          <polygon points="24,36 50,50 50,80 24,66" />
          <polygon points="50,50 76,36 76,66 50,80" />
          <circle cx="50" cy="36" r="1.2" fill={STROKE_COLOR} />
          <circle cx="42" cy="35" r="1" fill={STROKE_COLOR} />
          <circle cx="58" cy="37" r="1" fill={STROKE_COLOR} />
          <circle cx="38" cy="56" r="1.2" fill={STROKE_COLOR} />
          <circle cx="62" cy="58" r="1.2" fill={STROKE_COLOR} />
          <circle cx="20" cy="76" r="1.2" fill={STROKE_COLOR} />
          <circle cx="80" cy="74" r="1.2" fill={STROKE_COLOR} />
        </svg>
      );

    case 'canela':
      // Canela: atado de ramas de canela con sus clásicos extremos enrollados en doble espiral y lazo de cordel
      return (
        <svg {...baseProps}>
          {/* Rama superior de canela */}
          <path d="M24 38 L72 22" />
          <path d="M28 50 L76 34" />
          {/* Doble espiral característica de la corteza de canela (izquierda superior) */}
          <path d="M24 38 C19 40 19 46 24 45 C22 43 24 41 26 42" />
          <path d="M28 50 C23 52 21 47 24 45 C26 44 28 46 26 48" />
          <path d="M72 22 C76 23 78 30 76 34" />
          {/* Rama inferior de canela */}
          <path d="M22 58 L74 44" />
          <path d="M26 70 L78 56" />
          {/* Doble espiral de la corteza (izquierda inferior) */}
          <path d="M22 58 C17 60 17 66 22 65 C20 63 22 61 24 62" />
          <path d="M26 70 C21 72 19 67 22 65 C24 64 26 66 24 68" />
          <path d="M74 44 C78 45 80 52 78 56" />
          {/* Cordel atando las ramas al centro con lazo */}
          <path d="M45 30 L55 62" />
          <path d="M49 29 L59 61" />
          <path d="M54 62 C50 72 42 70 48 63" />
          <path d="M56 62 C62 72 68 68 60 61" />
        </svg>
      );

    case 'jengibre':
      // Raíz de jengibre: rizoma alargado con sus característicos dedos/brotes, anillos transversales y corte circular
      return (
        <svg {...baseProps}>
          {/* Cuerpo del rizoma de jengibre con dos dedos superiores y extremo cortado */}
          <path d="M18 62 C14 56 18 46 26 47 C27 34 33 24 41 26 C47 27 47 36 46 43 C51 33 58 26 65 29 C71 32 69 42 66 49 L78 52 C83 54 83 68 76 70 L52 70 C44 74 34 74 26 68 C21 67 19 65 18 62 Z" />
          {/* Corte transversal del extremo derecho */}
          <ellipse cx="77" cy="61" rx="4" ry="8.5" />
          {/* Anillos de crecimiento característicos de la raíz de jengibre */}
          <path d="M31 36 C36 35 41 36 45 39" />
          <path d="M54 38 C59 37 63 39 66 42" />
          <path d="M28 54 C31 60 31 65 29 69" />
          <path d="M44 52 C47 58 47 65 45 71" />
          <path d="M60 52 C62 58 62 64 60 70" />
          {/* Rodaja de jengibre cortada abajo a la derecha */}
          <ellipse cx="66" cy="82" rx="9" ry="5.5" />
          <ellipse cx="66" cy="82" rx="4.5" ry="2.5" strokeDasharray="2 2" />
        </svg>
      );

    case 'nuez-moscada':
      // Nuez moscada: semilla ovalada entera y mitad con su característico veteado interior
      return (
        <svg {...baseProps}>
          <ellipse cx="38" cy="50" rx="16" ry="24" transform="rotate(-15 38 50)" />
          <path d="M32 32 C28 44 30 58 36 68" />
          <ellipse cx="64" cy="54" rx="16" ry="22" transform="rotate(12 64 54)" />
          <path d="M64 36 C60 44 68 48 62 56 C58 62 66 66 63 72" />
          <path d="M54 48 C58 50 61 49 64 47" />
          <path d="M64 58 C68 59 71 58 74 56" />
        </svg>
      );

    case 'gingerbread':
      // Galleta de jengibre: silueta clásica minimalista con detalles de glaseado
      return (
        <svg {...baseProps}>
          <circle cx="50" cy="28" r="12" />
          <path d="M39 38 L22 44 C18 46 18 53 24 55 L37 53 L33 77 C32 83 40 85 44 79 L50 67 L56 79 C60 85 68 83 67 77 L63 53 L76 55 C82 53 82 46 78 44 L61 38" />
          <circle cx="46" cy="26" r="1" fill={STROKE_COLOR} />
          <circle cx="54" cy="26" r="1" fill={STROKE_COLOR} />
          <path d="M46 32 Q50 35 54 32" />
          <circle cx="50" cy="48" r="1.8" />
          <circle cx="50" cy="57" r="1.8" />
        </svg>
      );

    case 'amaretto':
      // Amaretto: botella clásica italiana cuadrada de hombro tallado y tapón geométrico
      return (
        <svg {...baseProps}>
          <rect x="41" y="16" width="18" height="10" rx="1.5" />
          <path d="M45 26 V34 L30 42 V82 C30 84 32 86 34 86 H66 C68 86 70 84 70 82 V42 L55 34 V26" />
          <rect x="36" y="52" width="28" height="20" rx="1.5" />
          <line x1="42" y1="59" x2="58" y2="59" />
          <line x1="45" y1="65" x2="55" y2="65" />
        </svg>
      );

    case 'mantequilla':
    default:
      // Mantequilla: bloque de mantequilla con dos rebanadas sobre plato fino
      return (
        <svg {...baseProps}>
          <path d="M22 52 L56 38 L78 48 L44 62 Z" />
          <path d="M22 52 V68 L44 78 V62" />
          <path d="M44 62 V78 L78 64 V48" />
          <line x1="33" y1="47.5" x2="55" y2="57.5" />
          <line x1="55" y1="57.5" x2="55" y2="73.5" />
          <path d="M14 70 L50 86 L86 70" />
        </svg>
      );
  }
}

export default function IngredientsSection() {
  return (
    <section id="ingredientes" aria-labelledby="ingredientes-heading">
      <h2 id="ingredientes-heading">Ingredientes favoritos</h2>
      <p className="ing-subtext">
        Sabores que habitan en el corazón de cada receta: unos piden técnica,
        otros curiosidad y otros búsqueda, siempre con el fin de que, cuando
        estén presentes, sean protagonistas en cada bocado.
      </p>
      <div className="ing-wrap">
        <div className="ing-grid" role="list">
          {INGREDIENTS_LIST.map((ing) => (
            <div key={ing.id} className="ing-card" role="listitem">
              <div className="ing-media">
                <IngredientArtwork id={ing.id} />
              </div>
              <span className="ing-name">{ing.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
