import React from 'react';
import { INGREDIENTS_LIST } from '../data/cookiesData';

function IngredientArtwork({ id }) {
  switch (id) {
    case 'beurre-noisette':
      // Imagen que represente mantequilla (bloque de mantequilla avellanada con corte y gota fundida)
      return (
        <svg viewBox="0 0 120 120" aria-hidden="true" className="ing-svg">
          <ellipse cx="60" cy="84" rx="44" ry="14" fill="#f5e6d3" stroke="#da8a41" strokeWidth="2" />
          <path d="M30 62 L68 46 L90 58 L52 74 Z" fill="#f9dfb8" stroke="#da8a41" strokeWidth="2" strokeLinejoin="round" />
          <path d="M30 62 L30 78 L52 90 L52 74 Z" fill="#efc284" stroke="#da8a41" strokeWidth="2" strokeLinejoin="round" />
          <path d="M52 74 L52 90 L90 74 L90 58 Z" fill="#e5ae63" stroke="#da8a41" strokeWidth="2" strokeLinejoin="round" />
          {/* Rebanada de mantequilla */}
          <path d="M24 68 L36 62 L36 80 L24 86 Z" fill="#f7d49e" stroke="#da8a41" strokeWidth="1.8" strokeLinejoin="round" />
          {/* Gotas doradas de beurre noisette */}
          <path d="M60 30 C60 30 53 39 53 43 A7 7 0 0 0 67 43 C67 39 60 30 60 30 Z" fill="#da8a41" opacity="0.85" />
          <circle cx="44" cy="40" r="2.5" fill="#da8a41" />
          <circle cx="76" cy="36" r="2" fill="#da8a41" />
        </svg>
      );

    case 'sal-marina':
      // Imagen que represente sal marina (escamas piramidales y cristales de sal marina)
      return (
        <svg viewBox="0 0 120 120" aria-hidden="true" className="ing-svg">
          {/* Cristal piramidal central */}
          <polygon points="60,26 88,68 60,84 32,68" fill="#fdfbf9" stroke="#da8a41" strokeWidth="2.2" strokeLinejoin="round" />
          <line x1="60" y1="26" x2="60" y2="84" stroke="#da8a41" strokeWidth="1.8" />
          <line x1="32" y1="68" x2="88" y2="68" stroke="#da8a41" strokeWidth="1.4" strokeDasharray="3 3" />
          {/* Cristales secundarios */}
          <polygon points="30,44 44,54 36,68 22,58" fill="#f5e6d3" stroke="#da8a41" strokeWidth="1.8" strokeLinejoin="round" />
          <polygon points="88,40 100,52 90,64 78,52" fill="#f5e6d3" stroke="#da8a41" strokeWidth="1.8" strokeLinejoin="round" />
          {/* Escamas sueltas */}
          <rect x="40" y="88" width="8" height="8" transform="rotate(20 44 92)" fill="#e8c39e" stroke="#da8a41" strokeWidth="1.5" />
          <rect x="70" y="86" width="9" height="9" transform="rotate(-18 74 90)" fill="#f5e6d3" stroke="#da8a41" strokeWidth="1.5" />
          <circle cx="58" cy="95" r="2.5" fill="#da8a41" />
        </svg>
      );

    case 'caramelo':
      // Imagen que represente toffee (cubos de toffee artesanal con baño de caramelo fundido)
      return (
        <svg viewBox="0 0 120 120" aria-hidden="true" className="ing-svg">
          {/* Cubo principal de toffee */}
          <rect x="32" y="42" width="44" height="44" rx="8" fill="#e59a52" stroke="#da8a41" strokeWidth="2.2" />
          {/* Cubo secundario superpuesto */}
          <rect x="52" y="34" width="38" height="38" rx="7" fill="#f1b97a" stroke="#da8a41" strokeWidth="2" />
          {/* Glaseado de caramelo derritiéndose */}
          <path
            d="M32 52 Q42 64 46 54 Q52 46 58 62 Q64 74 70 56 Q76 48 86 58 L86 42 Q86 34 78 34 L40 34 Q32 34 32 42 Z"
            fill="#da8a41"
          />
          {/* Hilos de caramelo */}
          <path d="M26 92 Q60 84 94 92" fill="none" stroke="#da8a41" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="48" cy="76" r="2.2" fill="#fdfbf9" />
        </svg>
      );

    case 'frangipane':
      // Imagen que represente crema (cuenco con crema de almendras batida en espiral suave)
      return (
        <svg viewBox="0 0 120 120" aria-hidden="true" className="ing-svg">
          {/* Pico cremoso de frangipane */}
          <path
            d="M32 62 C32 44 48 38 56 26 C64 36 88 42 88 62 Z"
            fill="#f7e3c4"
            stroke="#da8a41"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path d="M44 54 Q60 44 74 54" fill="none" stroke="#da8a41" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M50 43 Q60 36 68 43" fill="none" stroke="#da8a41" strokeWidth="1.8" strokeLinecap="round" />
          {/* Cuenco de pastelería */}
          <path
            d="M24 62 L96 62 C94 84 78 94 60 94 C42 94 26 84 24 62 Z"
            fill="#efcaa1"
            stroke="#da8a41"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <line x1="42" y1="94" x2="78" y2="94" stroke="#da8a41" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'almendras':
      // Imagen que represente almendras (almendras enteras y fileteadas con vetas botánicas)
      return (
        <svg viewBox="0 0 120 120" aria-hidden="true" className="ing-svg">
          {/* Almendra izquierda */}
          <path
            d="M46 28 C28 46 26 72 42 88 C58 76 62 50 46 28 Z"
            fill="#e29d5c"
            stroke="#da8a41"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path d="M45 36 Q38 58 42 80" fill="none" stroke="#fdfbf9" strokeWidth="1.5" strokeLinecap="round" />
          {/* Almendra derecha / fileteada */}
          <path
            d="M76 34 C58 50 56 76 72 90 C88 78 92 54 76 34 Z"
            fill="#f7e3c4"
            stroke="#da8a41"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path d="M74 44 Q68 62 72 82" fill="none" stroke="#da8a41" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'pistacho':
      // Imagen de pistachos (pistacho entreabierto en su cáscara mostrando el fruto)
      return (
        <svg viewBox="0 0 120 120" aria-hidden="true" className="ing-svg">
          {/* Fruto central de pistacho */}
          <ellipse cx="60" cy="58" rx="18" ry="26" fill="#c7d39b" stroke="#da8a41" strokeWidth="2" />
          {/* Cáscara izquierda */}
          <path
            d="M56 26 C30 34 26 68 48 92 C54 76 46 50 56 26 Z"
            fill="#f5e6d3"
            stroke="#da8a41"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Cáscara derecha */}
          <path
            d="M64 26 C90 34 94 68 72 92 C66 76 74 50 64 26 Z"
            fill="#efcaa1"
            stroke="#da8a41"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path d="M60 36 L60 52" stroke="#da8a41" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );

    case 'avellana':
      // Imagen que represente avellanas (avellana redondeada con cúpula superior y hoja)
      return (
        <svg viewBox="0 0 120 120" aria-hidden="true" className="ing-svg">
          {/* Cuerpo de la avellana */}
          <path
            d="M60 28 C36 40 30 64 42 84 C50 94 70 94 78 84 C90 64 84 40 60 28 Z"
            fill="#e29d5c"
            stroke="#da8a41"
            strokeWidth="2.2"
          />
          {/* Cúpula texturizada superior */}
          <path
            d="M36 52 Q48 60 60 52 Q72 60 84 52 C80 38 70 30 60 28 C50 30 40 38 36 52 Z"
            fill="#f3cfa6"
            stroke="#da8a41"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Vetas de la avellana */}
          <path d="M52 60 Q50 74 54 86" fill="none" stroke="#fdfbf9" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M68 60 Q70 74 66 86" fill="none" stroke="#fdfbf9" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'chocolate':
      // Imagen que represente gota de chocolate (chip / gota de chocolate oscuro con rizo superior)
      return (
        <svg viewBox="0 0 120 120" aria-hidden="true" className="ing-svg">
          <path
            d="M60 24 C66 36 88 54 88 74 C88 89 75 96 60 96 C45 96 32 89 32 74 C32 54 54 36 60 24 Z"
            fill="#da8a41"
            stroke="#da8a41"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Brillo lateral de la gota de chocolate */}
          <path
            d="M46 62 C44 72 48 82 56 86"
            fill="none"
            stroke="#fdfbf9"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <circle cx="48" cy="52" r="2.2" fill="#fdfbf9" />
        </svg>
      );

    case 'cacao-100':
      // Imagen que represente cacao (mazorca de cacao venezolano con granos internos)
      return (
        <svg viewBox="0 0 120 120" aria-hidden="true" className="ing-svg">
          {/* Mazorca de cacao */}
          <path
            d="M60 20 C36 34 32 62 46 92 C54 100 66 100 74 92 C88 62 84 34 60 20 Z"
            fill="#f3cfa6"
            stroke="#da8a41"
            strokeWidth="2.2"
          />
          {/* Surcos longitudinales */}
          <path d="M60 20 L60 98" stroke="#da8a41" strokeWidth="1.8" />
          <path d="M48 28 Q38 60 50 92" fill="none" stroke="#da8a41" strokeWidth="1.6" />
          <path d="M72 28 Q82 60 70 92" fill="none" stroke="#da8a41" strokeWidth="1.6" />
          {/* Granos de cacao al centro */}
          <ellipse cx="53" cy="54" rx="5" ry="7" fill="#da8a41" />
          <ellipse cx="67" cy="54" rx="5" ry="7" fill="#da8a41" />
          <ellipse cx="53" cy="70" rx="5" ry="7" fill="#da8a41" />
          <ellipse cx="67" cy="70" rx="5" ry="7" fill="#da8a41" />
        </svg>
      );

    case 'azucar-morena':
      // Imagen que represente azúcar (terrones y cristales cálidos de azúcar morena de caña)
      return (
        <svg viewBox="0 0 120 120" aria-hidden="true" className="ing-svg">
          {/* Montículo de azúcar morena */}
          <path
            d="M24 84 Q42 42 60 42 Q78 42 96 84 Z"
            fill="#ecc194"
            stroke="#da8a41"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Terrones cristalinos */}
          <rect x="46" y="54" width="14" height="14" rx="2" fill="#da8a41" opacity="0.85" />
          <rect x="62" y="60" width="12" height="12" rx="2" fill="#fdfbf9" stroke="#da8a41" strokeWidth="1.6" />
          {/* Granos sueltos */}
          <circle cx="40" cy="74" r="2.2" fill="#da8a41" />
          <circle cx="56" cy="76" r="2.2" fill="#da8a41" />
          <circle cx="78" cy="76" r="2" fill="#da8a41" />
          <circle cx="60" cy="32" r="2.5" fill="#da8a41" />
          <circle cx="48" cy="36" r="2" fill="#da8a41" />
          <circle cx="72" cy="36" r="2" fill="#da8a41" />
        </svg>
      );

    case 'especias-aromaticas':
      // Imagen que represente rama de canela (ramas de canela enrolladas con estrella de anís)
      return (
        <svg viewBox="0 0 120 120" aria-hidden="true" className="ing-svg">
          {/* Rama de canela 1 */}
          <path
            d="M30 82 L76 28 L88 38 L42 92 Z"
            fill="#e59a52"
            stroke="#da8a41"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Espiral del rollo de canela */}
          <ellipse cx="36" cy="87" rx="8" ry="5" transform="rotate(-48 36 87)" fill="#fdfbf9" stroke="#da8a41" strokeWidth="2" />
          {/* Rama de canela 2 cruzada */}
          <path
            d="M28 44 L86 74 L80 86 L22 56 Z"
            fill="#f5dec3"
            stroke="#da8a41"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Anís estrellado decorativo */}
          <circle cx="78" cy="78" r="4" fill="#da8a41" />
        </svg>
      );

    case 'gingerbread':
      // Imagen que represente gingerbread (clásico muñeco/galleta de jengibre decorado)
      return (
        <svg viewBox="0 0 120 120" aria-hidden="true" className="ing-svg">
          {/* Cabeza y cuerpo de galleta gingerbread */}
          <circle cx="60" cy="34" r="14" fill="#e59a52" stroke="#da8a41" strokeWidth="2.2" />
          <path
            d="M46 46 L28 52 C24 54 24 62 30 64 L44 62 L40 88 C39 94 48 96 52 90 L60 76 L68 90 C72 96 81 94 80 88 L76 62 L90 64 C96 62 96 54 92 52 L74 46 Z"
            fill="#e59a52"
            stroke="#da8a41"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Detalles de glaseado blanco */}
          <circle cx="55" cy="32" r="1.8" fill="#fdfbf9" />
          <circle cx="65" cy="32" r="1.8" fill="#fdfbf9" />
          <path d="M55 39 Q60 43 65 39" fill="none" stroke="#fdfbf9" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="60" cy="56" r="2.5" fill="#fdfbf9" />
          <circle cx="60" cy="66" r="2.5" fill="#fdfbf9" />
        </svg>
      );

    case 'chocolate-blanco':
    default:
      // Imagen que represente chocolate blanco (tableta cremosa de chocolate blanco y gota marfil)
      return (
        <svg viewBox="0 0 120 120" aria-hidden="true" className="ing-svg">
          {/* Tableta de chocolate blanco */}
          <rect x="28" y="26" width="52" height="66" rx="6" fill="#fdfbf9" stroke="#da8a41" strokeWidth="2.2" />
          <rect x="35" y="33" width="16" height="16" rx="2" fill="#f7e6cf" stroke="#da8a41" strokeWidth="1.6" />
          <rect x="57" y="33" width="16" height="16" rx="2" fill="#f7e6cf" stroke="#da8a41" strokeWidth="1.6" />
          <rect x="35" y="55" width="16" height="16" rx="2" fill="#f7e6cf" stroke="#da8a41" strokeWidth="1.6" />
          <rect x="57" y="55" width="16" height="16" rx="2" fill="#f7e6cf" stroke="#da8a41" strokeWidth="1.6" />
          {/* Gota cremosa superpuesta */}
          <path
            d="M82 54 C86 62 96 72 96 82 C96 90 90 95 82 95 C74 95 68 90 68 82 C68 72 78 62 82 54 Z"
            fill="#f5dec3"
            stroke="#da8a41"
            strokeWidth="2"
          />
        </svg>
      );
  }
}

export default function IngredientsSection() {
  return (
    <section id="ingredientes" aria-labelledby="ingredientes-heading">
      <h2 id="ingredientes-heading">Nuestros ingredientes</h2>
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

