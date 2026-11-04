import React, { useState } from 'react';
import {
  ShoppingBag,
  MessageCircle,
  Sparkles,
  Gift,
  Plus,
  Check,
  ArrowUpRight,
  Palette,
  RefreshCw,
} from 'lucide-react';
import {
  ENV_CONFIG,
  COOKIES_CATALOG,
  PACK_OPTIONS,
  PRESS_QUOTES,
  MASTER_COLOR_PRESETS,
  buildWhatsAppUrl,
  formatCookiePrice,
  formatDualPrice,
} from '../data/cookiesData';

const CATEGORIES = [
  { id: 'todas', label: 'Toda la Colección' },
  { id: 'chocolate', label: 'Cacao Venezolano' },
  { id: 'rellenas', label: 'Corazón Cremoso' },
  { id: 'especiales', label: 'Edición Glazed' },
  { id: 'cajas', label: 'Cajas de Regalo' },
];

const BOX_SIZES = [
  { count: 4, title: 'Cofre Petit (4 Galletas)', priceUsd: 14.5, subtitle: 'Ideal para degustación' },
  { count: 6, title: 'Cofre Clásico (6 Galletas)', priceUsd: 21.0, subtitle: 'Nuestro favorito · Delivery Gratis' },
  { count: 12, title: 'Gran Cofre Editorial (12 Galletas)', priceUsd: 39.0, subtitle: 'Para compartir · Listón de Seda' },
];

export default function MainEditorialSite({
  onAddToCart,
  activePresetId,
  onSelectColorPreset,
  currencyMode,
  onToggleCurrency,
  bcvRate,
}) {
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [selectedPacks, setSelectedPacks] = useState(() =>
    COOKIES_CATALOG.reduce((acc, item) => {
      acc[item.id] = PACK_OPTIONS[0];
      return acc;
    }, {})
  );

  // Estado del Armador de Caja Personalizada (Lavoratti Box Builder)
  const [boxSize, setBoxSize] = useState(BOX_SIZES[1]); // 6 galletas por defecto
  const [customBoxCookies, setCustomBoxCookies] = useState([
    COOKIES_CATALOG[0],
    COOKIES_CATALOG[1],
  ]);
  const [addedFeedbackId, setAddedFeedbackId] = useState(null);

  const filteredCookies =
    selectedCategory === 'todas'
      ? COOKIES_CATALOG
      : COOKIES_CATALOG.filter((c) => c.category === selectedCategory);

  const handlePackChange = (cookieId, packObj) => {
    setSelectedPacks((prev) => ({ ...prev, [cookieId]: packObj }));
  };

  const computeUsdPrice = (cookie, pack) => {
    if (cookie.isFixedBox) return Number(cookie.basePrice.toFixed(2));
    return Number((cookie.basePrice * pack.multiplier * pack.discount).toFixed(2));
  };

  const handleAddCookie = (cookie) => {
    const chosenPack = cookie.isFixedBox
      ? { id: 'fixed', label: 'Caja 6 Piezas', multiplier: 1, discount: 1 }
      : selectedPacks[cookie.id] || PACK_OPTIONS[0];

    const finalUsdPrice = computeUsdPrice(cookie, chosenPack);

    onAddToCart({
      cartKey: `${cookie.id}-${chosenPack.id}`,
      id: cookie.id,
      name: cookie.name,
      packLabel: chosenPack.label,
      unitPrice: finalUsdPrice,
      image: cookie.image,
    });

    setAddedFeedbackId(cookie.id);
    setTimeout(() => setAddedFeedbackId(null), 1200);
  };

  const handleInstantWhatsAppCookie = (cookie) => {
    const chosenPack = cookie.isFixedBox
      ? { label: 'Cofre de 6 Piezas' }
      : selectedPacks[cookie.id] || PACK_OPTIONS[0];
    const finalUsdPrice = computeUsdPrice(cookie, chosenPack);

    const text =
      `¡Hola ${ENV_CONFIG.brandName}! 🍪🇻🇪\n\n` +
      `Me gustaría pedir directamente:\n` +
      `• *${cookie.name}* (${chosenPack.label}) — ${formatDualPrice(finalUsdPrice, bcvRate)}\n\n` +
      `¿Tienen disponibilidad para entrega hoy?`;

    window.open(buildWhatsAppUrl(text), '_blank', 'noopener,noreferrer');
  };

  // Funciones para el armador de cajas personalizadas
  const singleCookiesList = COOKIES_CATALOG.filter((c) => !c.isFixedBox);

  const handleAddSlotCookie = (cookie) => {
    if (customBoxCookies.length < boxSize.count) {
      setCustomBoxCookies((prev) => [...prev, cookie]);
    }
  };

  const handleRemoveSlotCookie = (indexToRemove) => {
    setCustomBoxCookies((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleChangeBoxSize = (newSizeObj) => {
    setBoxSize(newSizeObj);
    if (customBoxCookies.length > newSizeObj.count) {
      setCustomBoxCookies((prev) => prev.slice(0, newSizeObj.count));
    }
  };

  const handleOrderCustomBoxWhatsApp = () => {
    const summaryMap = customBoxCookies.reduce((acc, item) => {
      acc[item.name] = (acc[item.name] || 0) + 1;
      return acc;
    }, {});

    const lines = Object.entries(summaryMap)
      .map(([name, qty]) => `  - ${qty}x ${name}`)
      .join('\n');

    const msg =
      `¡Hola ${ENV_CONFIG.brandName}! 🎁🍪\n\n` +
      `Acabo de armar mi *${boxSize.title}* — ${formatDualPrice(boxSize.priceUsd, bcvRate)} con la siguiente selección:\n` +
      `${lines || '  - Selección del Chef'}\n\n` +
      `¿Me indican los datos de Pago Móvil (BCV) o Zelle para confirmar?`;

    window.open(buildWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
  };

  const handleAddCustomBoxToBag = () => {
    const summaryNames = customBoxCookies.map((c) => c.name.split(' ')[0]).join(', ');
    onAddToCart({
      cartKey: `custom-box-${boxSize.count}-${Date.now()}`,
      id: `custom-box-${boxSize.count}`,
      name: boxSize.title,
      packLabel: `Sabores: ${summaryNames || 'Selección del Chef'}`,
      unitPrice: boxSize.priceUsd,
      image: '/images/cookie-box.jpg',
    });
  };

  return (
    <div>
      {/* 1. HERO EDITORIAL (LAVORATTI + RHODE SKIN + DEAR SUNDAY) */}
      <section className="hero-section" id="top">
        <div className="hero-editorial-copy">
          <span className="editorial-eyebrow">
            <Sparkles size={14} /> REPOSTERÍA DE AUTOR EN VENEZUELA · LOTES DIARIOS
          </span>
          <h1 className="hero-headline">
            El arte de la galleta tibia,{' '}
            <em>elevado a objeto de deseo.</em>
          </h1>
          <p className="hero-lead">
            {ENV_CONFIG.brandTagline} Inspirados en las chocolaterías históricas de
            Italia, el minimalismo táctil y la calma de un domingo por la mañana.
            Puedes ver todos nuestros precios en <strong>Dólares ($ USD)</strong> o en{' '}
            <strong>Bolívares (Bs.) a tasa oficial del BCV</strong>.
          </p>

          <div className="hero-cta-group">
            <a href="#catalogo" className="btn-editorial-primary">
              <ShoppingBag size={17} /> Explorar Menú ({currencyMode === 'USD' ? 'USD $' : 'Bs. BCV'})
            </a>
            <button
              type="button"
              className="btn-editorial-outline"
              onClick={() => onToggleCurrency(currencyMode === 'USD' ? 'VES' : 'USD')}
            >
              <RefreshCw size={16} /> Cambiar a {currencyMode === 'USD' ? 'Bolívares (Bs. BCV)' : 'Dólares ($ USD)'}
            </button>
          </div>

          <div className="hero-Specs-grid">
            <div className="spec-item">
              <span>Cacao Venezolano</span>
              <strong>Chuao 70%</strong>
            </div>
            <div className="spec-item">
              <span>Tasa Oficial Día</span>
              <strong>Bs. {bcvRate.toFixed(2)}</strong>
            </div>
            <div className="spec-item">
              <span>Desde Individual</span>
              <strong>{formatCookiePrice(3.5, currencyMode, bcvRate)}</strong>
            </div>
          </div>
        </div>

        <div className="hero-visual-frame">
          <img
            src="/images/hero-cookies.jpg"
            alt="Galletas artesanales partidas con centro fundente de chocolate y pistacho"
          />
          <div className="hero-floating-card">
            <div>
              <h4>Aceptamos Pago Móvil (BCV), Zelle y Efectivo</h4>
              <p>Toca el botón de moneda arriba para alternar entre $ USD y Bs.</p>
            </div>
            <button
              type="button"
              className="btn-direct-wa"
              onClick={() =>
                window.open(buildWhatsAppUrl(), '_blank', 'noopener,noreferrer')
              }
            >
              <MessageCircle size={16} /> WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* CINTA RITUAL (DEAR SUNDAY VIBE) */}
      <div className="editorial-ticker">
        <div className="editorial-ticker-inner">
          <span>✦ Cacao Venezolano Chuao 70%</span>
          <span>✦ Praliné de Pistacho Siciliano</span>
          <span>✦ Sal Marina de Araya</span>
          <span>✦ Precios en USD ($) y Bs. a Tasa BCV</span>
          <span>✦ Atención Directa por WhatsApp</span>
        </div>
      </div>

      {/* 2. CATÁLOGO INTERACTIVO DE GALLETAS CON MÚLTIPLES OPCIONES Y CONVERSOR BCV */}
      <section className="catalog-section" id="catalogo">
        <div className="section-header-row">
          <div>
            <span className="editorial-eyebrow">
              PRECIOS EN {currencyMode === 'USD' ? 'DÓLARES ($ USD)' : `BOLÍVARES (TASA BCV: Bs. ${bcvRate.toFixed(2)})`}
            </span>
            <h2 className="section-title">Nuestras Galletas de Autor</h2>
          </div>

          <div className="category-filter-pills" role="tablist">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`filter-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="cookies-grid">
          {filteredCookies.map((cookie) => {
            const currentPack = selectedPacks[cookie.id] || PACK_OPTIONS[0];
            const finalUsdPrice = computeUsdPrice(cookie, currentPack);
            const primaryPriceStr = formatCookiePrice(finalUsdPrice, currencyMode, bcvRate);
            const secondaryPriceStr = formatCookiePrice(
              finalUsdPrice,
              currencyMode === 'USD' ? 'VES' : 'USD',
              bcvRate
            );
            const isAdded = addedFeedbackId === cookie.id;

            return (
              <article key={cookie.id} className="cookie-card">
                <div className="cookie-image-box">
                  <img src={cookie.image} alt={cookie.name} loading="lazy" />
                  <span className="cookie-badge-top">{cookie.badge}</span>
                  <span className="cookie-weight-tag">{cookie.weight}</span>
                </div>

                <div className="cookie-body">
                  <span className="cookie-number">{cookie.number}</span>
                  <div className="cookie-title-row">
                    <h3 className="cookie-title">{cookie.name}</h3>
                    <div style={{ textAlign: 'right' }}>
                      <span className="cookie-price" style={{ display: 'block' }}>
                        {primaryPriceStr}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.68rem',
                          color: 'var(--color-secondary-muted)',
                        }}
                      >
                        ≈ {secondaryPriceStr}
                      </span>
                    </div>
                  </div>

                  <p className="cookie-desc">{cookie.description}</p>

                  <div className="cookie-notes-list">
                    {cookie.notes.map((note) => (
                      <span key={note} className="tasting-note-chip">
                        {note}
                      </span>
                    ))}
                  </div>

                  {/* Selector de Opciones (1 galleta, Caja x4, Caja x6) */}
                  {!cookie.isFixedBox ? (
                    <>
                      <span className="pack-selector-label">
                        Elige tu presentación ({currencyMode === 'USD' ? 'USD' : 'Bs. BCV'}):
                      </span>
                      <div className="pack-options-row">
                        {PACK_OPTIONS.map((pack) => {
                          const packUsd = computeUsdPrice(cookie, pack);
                          const isSelected = currentPack.id === pack.id;
                          return (
                            <button
                              key={pack.id}
                              type="button"
                              className={`pack-option-btn ${isSelected ? 'selected' : ''}`}
                              onClick={() => handlePackChange(cookie.id, pack)}
                            >
                              <span className="pack-option-name">{pack.label}</span>
                              <span className="pack-option-price">
                                {formatCookiePrice(packUsd, currencyMode, bcvRate)} ({pack.tag})
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div
                      style={{
                        padding: '0.6rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--color-primary)',
                        border: '1px solid var(--color-secondary-subtle)',
                        fontSize: '0.76rem',
                        marginBottom: '1.15rem',
                      }}
                    >
                      ✦ Incluye las 6 recetas de autor en cofre rígido con listón.
                    </div>
                  )}

                  <div className="cookie-actions-row">
                    <button
                      type="button"
                      className="btn-add-bag"
                      onClick={() => handleAddCookie(cookie)}
                    >
                      {isAdded ? (
                        <>
                          <Check size={16} /> Agregado a tu Bolsa
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={16} /> Agregar ({primaryPriceStr})
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      className="btn-direct-wa"
                      onClick={() => handleInstantWhatsAppCookie(cookie)}
                      title="Pedir esta opción directo por WhatsApp"
                    >
                      <MessageCircle size={16} /> Pedir Ya
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 3. ARMADOR DE CAJAS DE REGALO (INSPIRACIÓN LAVORATTI 1938 PACKAGING) */}
      <section className="box-builder-section" id="caja-regalo">
        <div className="box-builder-container">
          <div className="box-visual-showcase">
            <span className="editorial-eyebrow">EL ARTE DE REGALAR · LAVORATTI STYLE</span>
            <h2 className="section-title" style={{ marginBottom: '1rem' }}>
              Arma tu Cofre a Medida
            </h2>
            <p
              style={{
                fontSize: '0.92rem',
                color: 'var(--color-secondary-light)',
                marginBottom: '1.5rem',
              }}
            >
              Cada caja es envuelta a mano en papel algodón color crema, sellada en
              dorado y acompañada de una tarjeta de notas de cata y guía de
              calentamiento (3 minutos a 170°C para fundir el corazón).
            </p>
            <img
              src="/images/cookie-box.jpg"
              alt="Cofre de regalo Delulu Cookies con listón terracota"
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.82rem',
                color: 'var(--color-secondary-muted)',
              }}
            >
              <span>✦ Tarjeta de dedicatoria incluida</span>
              <span>✦ Pago Móvil BCV / Zelle / Efectivo</span>
            </div>
          </div>

          <div>
            <span className="pack-selector-label">1. Selecciona el tamaño del cofre:</span>
            <div className="box-size-selector">
              {BOX_SIZES.map((sz) => (
                <button
                  key={sz.count}
                  type="button"
                  className={`box-size-card ${boxSize.count === sz.count ? 'active' : ''}`}
                  onClick={() => handleChangeBoxSize(sz)}
                >
                  <strong>{sz.count} Galletas</strong>
                  <span>{formatCookiePrice(sz.priceUsd, currencyMode, bcvRate)}</span>
                </button>
              ))}
            </div>

            <span className="pack-selector-label">
              2. Toca tus sabores favoritos para llenar la caja ({customBoxCookies.length}/
              {boxSize.count}):
            </span>
            <div className="box-picker-list">
              {singleCookiesList.map((cookie) => (
                <button
                  key={cookie.id}
                  type="button"
                  className="box-picker-item"
                  disabled={customBoxCookies.length >= boxSize.count}
                  onClick={() => handleAddSlotCookie(cookie)}
                >
                  <div style={{ textAlign: 'left' }}>
                    <strong style={{ fontSize: '0.85rem', display: 'block' }}>
                      {cookie.name}
                    </strong>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        color: 'var(--color-secondary-muted)',
                      }}
                    >
                      {cookie.notes[0]}
                    </span>
                  </div>
                  <Plus size={16} />
                </button>
              ))}
            </div>

            <span className="pack-selector-label">Tu selección en el cofre:</span>
            <div className="box-slots-grid">
              {Array.from({ length: boxSize.count }).map((_, idx) => {
                const chosen = customBoxCookies[idx];
                return (
                  <div
                    key={idx}
                    className={`box-slot-pill ${chosen ? 'filled' : ''}`}
                  >
                    {chosen ? (
                      <>
                        <span>
                          {idx + 1}. {chosen.name.split(' ')[0]}
                        </span>
                        <button
                          type="button"
                          className="slot-remove-btn"
                          onClick={() => handleRemoveSlotCookie(idx)}
                          title="Quitar"
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <span style={{ color: 'var(--color-secondary-muted)' }}>
                        Espacio #{idx + 1} vacío
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.85rem',
                marginTop: '1.5rem',
              }}
            >
              <button
                type="button"
                className="btn-editorial-primary"
                onClick={handleOrderCustomBoxWhatsApp}
              >
                <MessageCircle size={17} /> Pedir Cofre por WhatsApp (
                {formatCookiePrice(boxSize.priceUsd, currencyMode, bcvRate)})
              </button>

              <button
                type="button"
                className="btn-editorial-outline"
                onClick={handleAddCustomBoxToBag}
              >
                <ShoppingBag size={17} /> Agregar Cofre a mi Bolsa
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRENSA Y CULTURA EDITORIAL (INSPIRADO EN DAVELLE NEW YORK #PRESS) */}
      <section className="press-section" id="press">
        <span className="editorial-eyebrow">DAVELLE NY & CARACAS EDITORIAL ARCHIVE · #PRESS</span>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <h2 className="section-title">Lo que dice la Prensa</h2>
          <a
            href={buildWhatsAppUrl(
              `¡Hola ${ENV_CONFIG.brandName}! Me gustaría solicitar su Press Kit o realizar una colaboración editorial en Venezuela.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.76rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: 'var(--color-tertiary)',
            }}
          >
            Solicitar Press Kit & Colaboraciones <ArrowUpRight size={15} />
          </a>
        </div>

        <div className="press-grid">
          {PRESS_QUOTES.map((item) => (
            <article key={item.outlet} className="press-card">
              <div>
                <h3 className="press-magazine">{item.outlet}</h3>
                <p className="press-quote">{item.quote}</p>
              </div>
              <div className="press-meta">
                <span>{item.tag}</span>
                <span>{item.date}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5. DEMOSTRADOR DEL CSS MAESTRO (COLORES PRIMARIOS, SECUNDARIOS Y TERCIARIOS) */}
      <section className="palette-bar" aria-label="Configurador de CSS Maestro">
        <div className="palette-card">
          <div>
            <span className="editorial-eyebrow" style={{ marginBottom: '0.3rem' }}>
              <Palette size={14} /> SISTEMA DE DISEÑO · src/master.css
            </span>
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.45rem',
                fontWeight: 600,
              }}
            >
              Prueba en vivo las Paletas del CSS Maestro
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-secondary-light)' }}>
              Cambia los colores Primarios, Secundarios y Terciarios al instante o
              edítalos en <code>src/master.css</code>.
            </p>
          </div>

          <div className="palette-swatches">
            {MASTER_COLOR_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className={`preset-theme-btn ${
                  activePresetId === preset.id ? 'active' : ''
                }`}
                onClick={() => onSelectColorPreset(preset)}
              >
                <span className="swatch-dots">
                  <i style={{ backgroundColor: preset.primary }} />
                  <i style={{ backgroundColor: preset.secondary }} />
                  <i style={{ backgroundColor: preset.tertiary }} />
                </span>
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
