import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
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
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const videoRef = useRef(null);

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
        // Mantiene la tasa de respaldo
      }
    }

    fetchBcvRate();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleVideoPlay = () => {
    const vid = videoRef.current;
    if (vid) {
      if (vid.paused) {
        vid.play();
        setIsVideoPaused(false);
      } else {
        vid.pause();
        setIsVideoPaused(true);
      }
      return;
    }
    setIsVideoPaused((prev) => !prev);
  };

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
    <div className="site">
      {/* ====================================================================
          1. NAVBAR: logo, our story, menu, open/closed, order takeout
          ==================================================================== */}
      <div className="wrap-nav">
        <nav className="davelle-nav" aria-label="Primary">
          <a href="#top" className="davelle-brand">
            {ENV_CONFIG.brandName}
          </a>

          <div className="links">
            <a href="#story">Our story</a>
            <a href="#menu">Menu</a>
            <a href="#visit">Visit</a>
          </div>

          <div
            className={`status ${openStatus.isOpen ? 'on' : ''}`}
            id="status"
            aria-live="polite"
          >
            <b />
            <span>{openStatus.label}</span>
          </div>

          {/* Selector claro de visualización de precios USD ($) vs Bs. BCV */}
          <div
            className="currency-pill"
            role="group"
            aria-label="Cambiar visualización de precios entre Dólares y Bolívares BCV"
          >
            <button
              type="button"
              className={currencyMode === 'USD' ? 'active' : ''}
              onClick={() => setCurrencyMode('USD')}
              title="Ver precios en Dólares ($ USD)"
            >
              USD $
            </button>
            <button
              type="button"
              className={currencyMode === 'VES' ? 'active' : ''}
              onClick={() => setCurrencyMode('VES')}
              title={`Ver precios en Bolívares (BCV Bs. ${bcvRate.toFixed(2)})`}
            >
              Bs. BCV
            </button>
          </div>

          <button
            type="button"
            className="order-btn"
            onClick={() => setIsCartOpen(true)}
          >
            <span className="ot">Order takeout ({totalCartCount})</span>
            <span className="os">WhatsApp · Delivery &amp; Pickup</span>
          </button>
        </nav>
      </div>

      <main id="main">
        {/* ====================================================================
            2. FULL-BLEED LOOP VIDEO / COLLAGE (100vw como Davelle New York .hero)
            ==================================================================== */}
        <div className="hero" id="top">
          {ENV_CONFIG.loopVideoUrl ? (
            <video
              ref={videoRef}
              className="hv"
              src={ENV_CONFIG.loopVideoUrl}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/images/hero-cookies.jpg"
              aria-label="Delulu Cookies loop video"
            />
          ) : (
            <div
              className={`loop-cinematic-reel ${isVideoPaused ? 'paused' : ''}`}
              role="img"
              aria-label="Collage en loop de galletas recién horneadas de Delulu Cookies"
            >
              <img
                src="/images/hero-cookies.jpg"
                alt="Galletas partidas con chocolate fundido y pistacho"
                className="reel-slide slide-1"
              />
              <img
                src="/images/cookie-pistachio.jpg"
                alt="Galleta de Matcha y Pistacho Siciliano"
                className="reel-slide slide-2"
              />
              <img
                src="/images/cookie-classic.jpg"
                alt="Galleta clásica con trozos de chocolate Chuao 70%"
                className="reel-slide slide-3"
              />
              <img
                src="/images/cookie-box.jpg"
                alt="Caja de regalo artesanal de Delulu Cookies"
                className="reel-slide slide-4"
              />
            </div>
          )}

          <button
            className="hvbtn"
            type="button"
            aria-label={isVideoPaused ? 'Play loop' : 'Pause loop'}
            aria-pressed={isVideoPaused}
            onClick={handleToggleVideoPlay}
          >
            <span aria-hidden="true">{isVideoPaused ? '▶' : '❚❚'}</span>
          </button>

          <div className="cap">
            <span>{ENV_CONFIG.brandLocation}</span>
            <span>Small-Batch Cookie Café · Est. 2026</span>
          </div>
        </div>

        <div className="wrap">
          {/* ==================================================================
              3. SHORT DESCRIPTION (.lede con el zig-zag y pills de Davelle NY)
              ================================================================== */}
          <div className="lede">
            <svg
              className="zig"
              width="140"
              height="10"
              viewBox="0 0 140 10"
              aria-hidden="true"
            >
              <path
                d="M0 8 L7 2 L14 8 L21 2 L28 8 L35 2 L42 8 L49 2 L56 8 L63 2 L70 8 L77 2 L84 8 L91 2 L98 8 L105 2 L112 8 L119 2 L126 8 L133 2 L140 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>

            <div className="eyebrow">
              Artisanal Cookie Café · {ENV_CONFIG.brandLocation}
            </div>

            <h1>
              Warm brown-butter cookies,
              <br />
              Chuao 70% dark cacao,
              <br />
              creamy pistachio centers,
              <br />
              baked fresh in small batches.
            </h1>

            <p>{ENV_CONFIG.brandTagline}</p>

            <div className="pills">
              <span>
                Open Tue–Sun <b>8 AM – 9 PM</b>
              </span>
              <span>
                Tasa BCV hoy <b>Bs. {bcvRate.toFixed(2)} / $1 USD</b>
              </span>
              <button
                type="button"
                onClick={() =>
                  setCurrencyMode(currencyMode === 'USD' ? 'VES' : 'USD')
                }
              >
                Cambiar precios a{' '}
                <b>{currencyMode === 'USD' ? 'Bolívares (Bs. BCV)' : 'Dólares ($ USD)'}</b>
              </button>
            </div>
          </div>

          {/* ==================================================================
              4. OUR STORY (#story idéntico a Davelle NY)
              ================================================================== */}
          <section id="story">
            <h2 className="section-heading">Our story</h2>
            <div className="story">
              <div className="ph">
                <img
                  src="/images/hero-cookies.jpg"
                  alt="Galletas recién horneadas partidas por la mitad mostrando el corazón fundente"
                  loading="lazy"
                />
              </div>
              <div>
                <h3>What Delulu means to us</h3>
                <p>
                  Delulu Cookies nació de la obsesión por hornear la galleta
                  perfecta: corteza dorada con mantequilla avellana tostada,
                  interior suave y un corazón fundente hecho con ingredientes
                  reales.
                </p>
                <p>
                  Cada lote reposa en frío durante 48 horas antes de entrar al
                  horno. Usamos cacao venezolano de Chuao al 70%, sal marina de
                  Araya, matcha ceremonial y praliné artesanal de pistacho y
                  avellanas.
                </p>
                <p>
                  Ya sea que vengas por una galleta tibia a media tarde o pidas
                  una caja de regalo por WhatsApp, horneamos todo el mismo día
                  para ti.
                </p>
                <div className="coffee">
                  <b>The cacao &amp; butter.</b> Cacao de origen único venezolano
                  y mantequilla avellana batida lentamente en nuestra cocina.
                </div>
                <div className="sig">Eat it warm · Order takeout on WhatsApp</div>
              </div>
            </div>
          </section>

          {/* ==================================================================
              5. MENU TOGGLE (#menu .menuwrap con pestañas como Davelle NY)
              ================================================================== */}
          <section id="menu">
            <h2 className="section-heading">The menu</h2>
            <div className="menuwrap">
              <div className="mtabs" role="tablist">
                {MENU_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={activeMenuTab === cat.id}
                    onClick={() => setActiveMenuTab(cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div role="tabpanel">
                <p className="blurb">
                  Precios expresados en{' '}
                  <strong>
                    {currencyMode === 'USD'
                      ? 'Dólares ($ USD)'
                      : `Bolívares a tasa BCV del día (Bs. ${bcvRate.toFixed(2)})`}
                  </strong>
                  . Puedes cambiar la moneda arriba en cualquier momento.
                </p>

                <h3 className="cat">
                  <i />
                  <span>
                    {MENU_CATEGORIES.find((c) => c.id === activeMenuTab)?.label}
                  </span>
                  <i />
                </h3>
                <p className="sub">
                  Horneadas al momento · Elige presentación individual o en caja
                  para compartir
                </p>

                {visibleMenuCookies.map((cookie) => {
                  const currentPack = selectedPacks[cookie.id] || PACK_OPTIONS[0];
                  const finalUsd = computeUsdPrice(cookie, currentPack);
                  const mainPrice = formatCookiePrice(
                    finalUsd,
                    currencyMode,
                    bcvRate
                  );
                  const altPrice = formatCookiePrice(
                    finalUsd,
                    currencyMode === 'USD' ? 'VES' : 'USD',
                    bcvRate
                  );
                  const isJustAdded = addedCookieId === cookie.id;

                  return (
                    <div key={cookie.id} className="item">
                      <div className="row">
                        <span className="nm">
                          {cookie.name}
                          <small>{cookie.notes.join(' · ')}</small>
                        </span>
                        <span className="pr">
                          {mainPrice}
                          <span className="pr-sub">(≈ {altPrice})</span>
                        </span>
                      </div>

                      <p className="dsc">{cookie.description}</p>

                      <div className="item-controls">
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
                              fontFamily: 'var(--sans)',
                              fontSize: '11px',
                              letterSpacing: '0.16em',
                              textTransform: 'uppercase',
                              color: 'var(--color-section-name)',
                              fontWeight: 600,
                            }}
                          >
                            ✦ Takeout Box lista para regalar o compartir
                          </span>
                        )}

                        <div className="item-actions">
                          <button
                            type="button"
                            className="btn-menu-order"
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
                            className="btn-menu-wa"
                            onClick={() => handleDirectWhatsAppOrder(cookie)}
                          >
                            WhatsApp →
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <p className="legend">
                  Pago Móvil (Tasa BCV) · Zelle · Efectivo USD · Delivery &amp;
                  Takeout
                </p>
              </div>
            </div>
          </section>

          {/* ==================================================================
              6. VISIT (#visit idéntico a Davelle NY)
              ================================================================== */}
          <section id="visit">
            <h2 className="section-heading">Visit</h2>
            <div className="visit">
              <div>
                <p className="big">{ENV_CONFIG.brandLocation}</p>
                <p>
                  Retira tus galletas recién salidas del horno o pide Delivery a
                  toda Caracas directo por WhatsApp.
                </p>

                <div className="hours">
                  <div>
                    <span>
                      Delulu Cookie Counter · Takeout &amp; Pickup
                      <small>galletas tibias, cajas de regalo y café</small>
                    </span>
                    <span>8 AM – 9 PM · Mar–Dom</span>
                  </div>
                  <div>
                    <span>
                      WhatsApp Delivery · Caracas
                      <small>Pago Móvil BCV, Zelle o Efectivo</small>
                    </span>
                    <span>9 AM – 8:30 PM · Mar–Dom</span>
                  </div>
                </div>

                <div className="acts">
                  <a
                    href={ENV_CONFIG.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open in Maps
                  </a>
                  <a
                    href={buildWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Order on WhatsApp
                  </a>
                  <a
                    href={ENV_CONFIG.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {ENV_CONFIG.brandHandle}
                  </a>
                </div>
              </div>

              <div className="ph">
                <img
                  src="/images/cookie-box.jpg"
                  alt="Caja de regalo Delulu Cookies"
                  loading="lazy"
                />
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ====================================================================
          7. FOOTER (idéntico a Davelle NY)
          ==================================================================== */}
      <div className="wrap">
        <footer>
          <span className="footer-logo">{ENV_CONFIG.brandName}</span>
          <p>{ENV_CONFIG.brandLocation} · Baked Fresh Daily</p>
          <p>
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp +{ENV_CONFIG.whatsappNumber}
            </a>{' '}
            ·{' '}
            <a
              href={ENV_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {ENV_CONFIG.brandHandle}
            </a>
          </p>
          <p style={{ marginTop: '12px', opacity: 0.75 }}>
            © {new Date().getFullYear()} {ENV_CONFIG.brandName} · Precios en USD
            ($) y Bolívares (Bs. BCV Bs. {bcvRate.toFixed(2)})
          </p>
        </footer>
      </div>

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
