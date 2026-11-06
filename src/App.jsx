import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  MessageCircle,
  MapPin,
  Clock,
  Check,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';
import WhatsAppCartDrawer from './components/WhatsAppCartDrawer';
import {
  ENV_CONFIG,
  COOKIES_CATALOG,
  MENU_CATEGORIES,
  PACK_OPTIONS,
  buildWhatsAppUrl,
  formatCookiePrice,
  formatDualPrice,
  getStoreOpenStatus,
} from './data/cookiesData';

export default function App() {
  // Visualización de precios en Dólares ('USD') o Bolívares ('VES' a tasa BCV)
  const [currencyMode, setCurrencyMode] = useState('USD');
  const [bcvRate, setBcvRate] = useState(ENV_CONFIG.bcvFallbackRate);
  const [activeMenuTab, setActiveMenuTab] = useState('signature');
  const [selectedPacks, setSelectedPacks] = useState(() =>
    COOKIES_CATALOG.reduce((acc, item) => {
      acc[item.id] = PACK_OPTIONS[0];
      return acc;
    }, {})
  );
  const [addedCookieId, setAddedCookieId] = useState(null);

  const [cartItems, setCartItems] = useState([
    {
      cartKey: 'matcha-pistachio-cream-single',
      id: 'matcha-pistachio-cream',
      name: 'Uji Matcha & Sicilian Pistachio',
      packLabel: '1 Pieza',
      unitPrice: 4.5,
      quantity: 1,
      image: '/images/cookie-pistachio.jpg',
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openStatus = getStoreOpenStatus();
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Consulta automática de la tasa oficial del BCV (desde /bcv-rate.json y API en vivo)
  useEffect(() => {
    let isMounted = true;

    async function fetchBcvRate() {
      try {
        const localRes = await fetch('/bcv-rate.json', { cache: 'no-store' });
        if (localRes.ok) {
          const localData = await localRes.json();
          if (isMounted && localData?.rate && !Number.isNaN(Number(localData.rate))) {
            setBcvRate(Number(localData.rate));
          }
        }
      } catch {
        // Continúa hacia la API en vivo
      }

      try {
        const liveRes = await fetch(ENV_CONFIG.bcvApiUrl);
        if (liveRes.ok) {
          const liveData = await liveRes.json();
          const liveRate = Number(liveData?.promedio || liveData?.venta);
          if (isMounted && liveRate && !Number.isNaN(liveRate)) {
            setBcvRate(Number(liveRate.toFixed(2)));
          }
        }
      } catch {
        // Usa el respaldo en caso de fallo de red
      }
    }

    fetchBcvRate();
    return () => {
      isMounted = false;
    };
  }, []);

  const computeUsdPrice = (cookie, pack) => {
    if (cookie.isFixedBox) return Number(cookie.basePrice.toFixed(2));
    return Number((cookie.basePrice * pack.multiplier * pack.discount).toFixed(2));
  };

  const handlePackChange = (cookieId, packObj) => {
    setSelectedPacks((prev) => ({ ...prev, [cookieId]: packObj }));
  };

  const handleAddToCart = (cookie) => {
    const chosenPack = cookie.isFixedBox
      ? { id: 'box', label: 'Takeout Box' }
      : selectedPacks[cookie.id] || PACK_OPTIONS[0];
    const finalUsdPrice = computeUsdPrice(cookie, chosenPack);
    const cartKey = `${cookie.id}-${chosenPack.id}`;

    setCartItems((prev) => {
      const idx = prev.findIndex((item) => item.cartKey === cartKey);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        return next;
      }
      return [
        ...prev,
        {
          cartKey,
          id: cookie.id,
          name: cookie.name,
          packLabel: chosenPack.label,
          unitPrice: finalUsdPrice,
          quantity: 1,
          image: cookie.image,
        },
      ];
    });

    setAddedCookieId(cookie.id);
    setTimeout(() => setAddedCookieId(null), 1100);
  };

  const handleDirectWhatsAppOrder = (cookie) => {
    const chosenPack = cookie.isFixedBox
      ? { label: 'Takeout Box' }
      : selectedPacks[cookie.id] || PACK_OPTIONS[0];
    const finalUsdPrice = computeUsdPrice(cookie, chosenPack);

    const text =
      `¡Hola *${ENV_CONFIG.brandName}*!\n\n` +
      `Quiero hacer un pedido de *Order Takeout*:\n` +
      `- *${cookie.name}* (${chosenPack.label}) — ${formatDualPrice(
        finalUsdPrice,
        bcvRate
      )}\n\n` +
      `¿Tienen disponibilidad para hoy?`;

    window.open(buildWhatsAppUrl(text), '_blank', 'noopener,noreferrer');
  };

  const handleUpdateQty = (cartKey, newQty) => {
    if (newQty <= 0) {
      setCartItems((prev) => prev.filter((item) => item.cartKey !== cartKey));
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.cartKey === cartKey ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveItem = (cartKey) => {
    setCartItems((prev) => prev.filter((item) => item.cartKey !== cartKey));
  };

  const visibleMenuCookies = COOKIES_CATALOG.filter(
    (c) => c.category === activeMenuTab
  );

  return (
    <div>
      {/* ====================================================================
          1. NAVBAR: logo, our story, menu, open/closed, order takeout
          ==================================================================== */}
      <header className="davelle-navbar">
        <div className="davelle-navbar-inner">
          <a href="#top" className="davelle-logo">
            {ENV_CONFIG.brandName}
            <span>caracas · cookie café</span>
          </a>

          <nav className="davelle-nav-links" aria-label="Primary Navigation">
            <a href="#our-story">Our Story</a>
            <a href="#menu">Menu</a>
            <a href="#visit">Visit</a>
          </nav>

          <div className="davelle-nav-right">
            {/* Open / Closed Status Indicator */}
            <div className="open-closed-badge" title="Horario en Caracas (UTC-4)">
              <span
                className={`status-dot ${openStatus.isOpen ? 'open' : 'closed'}`}
              />
              <span>{openStatus.label}</span>
            </div>

            {/* Conmutador claro de precios en Dólares ($) y Bolívares (Bs. BCV) */}
            <div
              className="currency-mini-switch"
              role="group"
              aria-label="Cambiar moneda entre Dólares y Bolívares BCV"
            >
              <button
                type="button"
                className={`currency-mini-btn ${
                  currencyMode === 'USD' ? 'active' : ''
                }`}
                onClick={() => setCurrencyMode('USD')}
              >
                USD ($)
              </button>
              <button
                type="button"
                className={`currency-mini-btn ${
                  currencyMode === 'VES' ? 'active' : ''
                }`}
                onClick={() => setCurrencyMode('VES')}
              >
                Bs. (BCV)
              </button>
            </div>

            {/* Order Takeout Button */}
            <button
              type="button"
              className="btn-order-takeout"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag size={14} />
              <span>Order Takeout ({totalCartCount})</span>
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        {/* ====================================================================
            2. LOOP VIDEO SECTION
            ==================================================================== */}
        <section className="loop-video-section" aria-label="Loop Video Showcase">
          <div className="loop-video-frame">
            {ENV_CONFIG.loopVideoUrl ? (
              <video
                className="loop-video-element"
                src={ENV_CONFIG.loopVideoUrl}
                poster="/images/hero-cookies.jpg"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <div className="loop-cinematic-reel" role="img" aria-label="Loop visual de galletas recién horneadas">
                <img
                  src="/images/hero-cookies.jpg"
                  alt="Galletas partidas con chocolate fundido"
                  className="reel-slide slide-1"
                />
                <img
                  src="/images/cookie-pistachio.jpg"
                  alt="Galleta de Matcha y Pistacho"
                  className="reel-slide slide-2"
                />
                <img
                  src="/images/cookie-classic.jpg"
                  alt="Galleta clásica con chispas de chocolate Chuao"
                  className="reel-slide slide-3"
                />
              </div>
            )}

            <div className="loop-video-overlay">
              <span className="loop-tag-top">
                FRESH BAKED DAILY · CARACAS, VENEZUELA
              </span>

              <div className="loop-bottom-bar">
                <div className="loop-caption-box">
                  <h1>Warm Artisanal Cookies & Specialty Takeout</h1>
                  <p>
                    Horneadas en pequeños lotes todos los días. Pide para llevar
                    (Takeout) o por Delivery directo en WhatsApp.
                  </p>
                </div>

                <button
                  type="button"
                  className="btn-order-takeout"
                  onClick={() => setIsCartOpen(true)}
                >
                  <MessageCircle size={15} /> Order Takeout on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            3. SHORT DESCRIPTION SECTION
            ==================================================================== */}
        <section className="short-description-section" aria-label="Short Description">
          <div className="short-description-card">
            <span className="section-name">WELCOME TO DELULU COOKIES</span>
            <h2 className="short-description-heading">
              Small-batch cookies crafted with brown butter, Chuao 70% cacao &
              creamy centers.
            </h2>
            <p className="short-description-body">
              {ENV_CONFIG.brandTagline} Inspirados en la calidez de los pequeños
              cafés de barrio como Davelle en Nueva York, cada galleta se hornea al
              momento para que llegue tibia a tus manos.
            </p>

            {/* Aviso explícito del cambio de precios entre USD y Bolívares BCV */}
            <div className="bcv-notice-pill">
              <span>
                <strong>Tasa Oficial BCV hoy:</strong> Bs. {bcvRate.toFixed(2)} / $1
                USD
              </span>
              <span>·</span>
              <button
                type="button"
                onClick={() =>
                  setCurrencyMode(currencyMode === 'USD' ? 'VES' : 'USD')
                }
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--color-section-name)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <RefreshCw size={12} /> Cambiar precios a{' '}
                {currencyMode === 'USD' ? 'Bolívares (Bs. BCV)' : 'Dólares ($ USD)'}
              </button>
            </div>
          </div>
        </section>

        {/* ====================================================================
            4. OUR STORY SECTION
            ==================================================================== */}
        <section className="our-story-section" id="our-story">
          <div className="our-story-grid">
            <div className="our-story-image-wrap">
              <img
                src="/images/cookie-box.jpg"
                alt="Nuestra historia - Delulu Cookies"
              />
            </div>

            <div className="our-story-content">
              <span className="section-name">OUR STORY</span>
              <h2 className="our-story-title">
                A cozy neighborhood cookie counter born from slow mornings.
              </h2>
              <p className="our-story-text">
                Delulu Cookies nació con una idea sencilla: crear un refugio íntimo
                donde el aroma a mantequilla avellana tostada, vainilla natural y
                chocolate venezolano de Chuao al 70% transforme cualquier tarde en
                un ritual especial.
              </p>
              <p className="our-story-text">
                Nuestra masa reposa en frío durante 48 horas antes de entrar al
                horno, logrando bordes dorados y crujientes con un corazón fundente
                de pistacho siciliano, mascarpone con frutos rojos o praliné de
                avellanas.
              </p>
              <div className="our-story-signature">
                HANDCRAFTED IN VENEZUELA · SMALL BATCHES ONLY
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            5. MENU TOGGLE SECTION
            ==================================================================== */}
        <section className="menu-toggle-section" id="menu">
          <div className="menu-section-header">
            <span className="section-name">OUR MENU</span>
            <h2 className="menu-section-title">Daily Cookie & Takeout Menu</h2>
            <p style={{ fontSize: '0.92rem', maxWidth: '540px', margin: '0 auto' }}>
              Selecciona una categoría del menú y alterna libremente la
              visualización de precios entre{' '}
              <strong>Dólares ($ USD)</strong> y{' '}
              <strong>Bolívares (Bs. a tasa BCV)</strong>.
            </p>

            {/* Pestañas del Menu Toggle */}
            <div className="menu-tabs-bar" role="tablist">
              {MENU_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={activeMenuTab === cat.id}
                  className={`menu-tab-btn ${
                    activeMenuTab === cat.id ? 'active' : ''
                  }`}
                  onClick={() => setActiveMenuTab(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="menu-cards-grid">
            {visibleMenuCookies.map((cookie) => {
              const currentPack = selectedPacks[cookie.id] || PACK_OPTIONS[0];
              const finalUsd = computeUsdPrice(cookie, currentPack);
              const mainPrice = formatCookiePrice(finalUsd, currencyMode, bcvRate);
              const altPrice = formatCookiePrice(
                finalUsd,
                currencyMode === 'USD' ? 'VES' : 'USD',
                bcvRate
              );
              const isJustAdded = addedCookieId === cookie.id;

              return (
                <article key={cookie.id} className="davelle-menu-card">
                  <div className="menu-card-top">
                    <img
                      src={cookie.image}
                      alt={cookie.name}
                      className="menu-card-thumb"
                    />
                    <div>
                      <div className="menu-card-heading-row">
                        <h3 className="menu-card-title">{cookie.name}</h3>
                        <div className="menu-card-price-block">
                          <span className="menu-card-price-main">{mainPrice}</span>
                          <span className="menu-card-price-sub">≈ {altPrice}</span>
                        </div>
                      </div>
                      <p className="menu-card-desc">{cookie.description}</p>
                      <div className="menu-card-notes">
                        {cookie.notes.map((note) => (
                          <span key={note} className="menu-note-tag">
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="menu-card-bottom">
                    {!cookie.isFixedBox ? (
                      <div className="pack-pills-inline">
                        {PACK_OPTIONS.map((pack) => (
                          <button
                            key={pack.id}
                            type="button"
                            className={`pack-pill-btn ${
                              currentPack.id === pack.id ? 'active' : ''
                            }`}
                            onClick={() => handlePackChange(cookie.id, pack)}
                          >
                            {pack.label}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.7rem',
                          color: 'var(--color-section-name)',
                          fontWeight: 700,
                        }}
                      >
                        ✦ READY FOR TAKEOUT OR GIFT
                      </span>
                    )}

                    <div className="menu-card-actions">
                      <button
                        type="button"
                        className="btn-card-takeout"
                        onClick={() => handleAddToCart(cookie)}
                      >
                        {isJustAdded ? (
                          <>
                            <Check size={13} /> Added
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={13} /> Add Takeout
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        className="btn-card-wa"
                        onClick={() => handleDirectWhatsAppOrder(cookie)}
                        title="Pedir directo por WhatsApp"
                      >
                        WhatsApp ↗
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ====================================================================
            6. VISIT SECTION
            ==================================================================== */}
        <section className="visit-section" id="visit">
          <div className="visit-card">
            <div>
              <span className="section-name">VISIT US</span>
              <h2 className="visit-heading">
                Stop by for warm cookies or schedule your takeout pickup.
              </h2>
              <p>
                Puedes pasar retirando tu pedido recién horneado en nuestro punto de
                entrega o solicitar Delivery inmediato en toda Caracas pagando con
                Pago Móvil (a tasa BCV del día), Zelle o Efectivo.
              </p>

              <div className="visit-details-list">
                <div className="visit-detail-block">
                  <h4>
                    <MapPin size={14} style={{ display: 'inline', marginRight: 6 }} />
                    LOCATION
                  </h4>
                  <p>{ENV_CONFIG.brandLocation}</p>
                </div>

                <div className="visit-detail-block">
                  <h4>
                    <MessageCircle
                      size={14}
                      style={{ display: 'inline', marginRight: 6 }}
                    />
                    DIRECT WHATSAPP TAKEOUT
                  </h4>
                  <p>+{ENV_CONFIG.whatsappNumber} · Atención inmediata</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
                <a
                  href={ENV_CONFIG.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-order-takeout"
                >
                  Open in Google Maps <ArrowUpRight size={14} />
                </a>
                <a
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-card-wa"
                  style={{ padding: '0.5rem 1.1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <MessageCircle size={14} /> Chat on WhatsApp
                </a>
              </div>
            </div>

            <div className="visit-map-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="section-name" style={{ marginBottom: 0 }}>
                  <Clock size={14} style={{ display: 'inline', marginRight: 6 }} />
                  HOURS OF OPERATION
                </span>
                <span className="open-closed-badge">{openStatus.label}</span>
              </div>

              <table className="hours-table">
                <tbody>
                  <tr>
                    <td>Tuesday – Friday</td>
                    <td>8:00 AM – 9:00 PM</td>
                  </tr>
                  <tr>
                    <td>Saturday</td>
                    <td>9:00 AM – 9:00 PM</td>
                  </tr>
                  <tr>
                    <td>Sunday</td>
                    <td>9:00 AM – 8:00 PM</td>
                  </tr>
                  <tr>
                    <td>Monday</td>
                    <td>Closed (Dough Prep)</td>
                  </tr>
                </tbody>
              </table>

              <p style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                * Todos los pedidos de Order Takeout se confirman al instante vía
                WhatsApp.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ====================================================================
          7. FOOTER
          ==================================================================== */}
      <footer className="davelle-footer">
        <div className="davelle-footer-inner">
          <div>
            <a href="#top" className="davelle-logo">
              {ENV_CONFIG.brandName}
            </a>
            <p style={{ fontSize: '0.82rem', marginTop: '0.35rem' }}>
              © {new Date().getFullYear()} {ENV_CONFIG.brandName}. Inspired by
              Davelle New York. {ENV_CONFIG.brandLocation}.
            </p>
          </div>

          <div className="davelle-footer-nav">
            <a href="#our-story">Our Story</a>
            <a href="#menu">Menu</a>
            <a href="#visit">Visit</a>
            <a
              href={ENV_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              Order Takeout
            </a>
          </div>
        </div>
      </footer>

      {/* Drawer de Order Takeout conectado a WhatsApp */}
      <WhatsAppCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCartItems([])}
        currencyMode={currencyMode}
        onToggleCurrency={setCurrencyMode}
        bcvRate={bcvRate}
      />
    </div>
  );
}
