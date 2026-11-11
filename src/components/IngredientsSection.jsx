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
      // Pistachos: pistacho entreabierto en su cáscara mostrando la semilla
      return (
        <svg {...baseProps}>
          <path d="M47 22 C24 30 22 62 42 84 C47 68 40 44 47 22 Z" />
          <path d="M53 22 C76 30 78 62 58 84 C53 68 60 44 53 22 Z" />
          <path d="M43 34 C46 26 54 26 57 34" />
          <ellipse cx="50" cy="52" rx="9" ry="18" />
          <line x1="50" y1="34" x2="50" y2="48" />
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
      // Cacao 100%: mazorca de cacao venezolano con surcos y granos internos
      return (
        <svg {...baseProps}>
          <path d="M50 14 C28 28 24 56 38 82 C45 90 55 90 62 82 C76 56 72 28 50 14 Z" />
          <path d="M50 14 V88" />
          <path d="M39 22 C31 46 31 62 41 82" />
          <path d="M61 22 C69 46 69 62 59 82" />
          <ellipse cx="45" cy="46" rx="3.5" ry="5.5" />
          <ellipse cx="55" cy="46" rx="3.5" ry="5.5" />
          <ellipse cx="45" cy="60" rx="3.5" ry="5.5" />
          <ellipse cx="55" cy="60" rx="3.5" ry="5.5" />
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
      // Canela: dos ramas de canela enrolladas con espirales en los extremos
      return (
        <svg {...baseProps}>
          <path d="M24 72 L68 22 L78 30 L34 80 Z" />
          <ellipse cx="29" cy="76" rx="6.5" ry="4" transform="rotate(-48 29 76)" />
          <path d="M22 38 L78 64 L72 75 L16 49 Z" />
          <ellipse cx="19" cy="43.5" rx="6" ry="3.5" transform="rotate(25 19 43.5)" />
          <path d="M44 46 C48 52 52 56 56 58" />
        </svg>
      );

    case 'jengibre':
      // Raíz de jengibre: rizoma botánico ramificado con anillos naturales
      return (
        <svg {...baseProps}>
          <path d="M24 64 C18 58 20 46 30 46 C32 34 44 30 50 38 C56 26 72 28 72 40 C82 42 84 56 74 62 C76 74 62 80 52 72 C42 80 28 74 24 64 Z" />
          <path d="M34 52 C38 50 42 52 45 55" />
          <path d="M54 44 C58 43 62 45 64 48" />
          <path d="M46 64 C50 62 55 63 58 66" />
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
      <h2 id="ingredientes-heading">Ingredientes queridos</h2>
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
