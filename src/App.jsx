import React, { useState, useEffect, useRef } from 'react';
import DeluluTakeoutStore from './components/DeluluTakeoutStore';
import {
  ENV_CONFIG,
  HOME_MENU_COOKIES,
  HOME_MENU_BOXES_DRINKS,
  buildWhatsAppUrl,
  formatCookiePrice,
  getStoreOpenStatus,
} from './data/cookiesData';

export default function App() {
  // Visualización de precios en Dólares ('USD') o Bolívares ('VES' a tasa BCV)
  const [currencyMode, setCurrencyMode] = useState('USD');
  const [bcvRate, setBcvRate] = useState(ENV_CONFIG.bcvFallbackRate);

  // Vista activa: 'home' | 'store' (tienda Order Takeout de delulucookies)
  const [viewMode, setViewMode] = useState('home');

  // Pestaña activa en #menu ('cookies' | 'boxes')
  const [menuTab, setMenuTab] = useState('cookies');

  // Pausa/reproducción del loop full-width (.hero)
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const videoRef = useRef(null);

  // Carrito de Order Takeout conectado a WhatsApp
  const [cartItems, setCartItems] = useState([
    {
      cartKey: 'matcha-pistachio-cream-single',
      id: 'matcha-pistachio-cream',
      name: 'Uji Matcha & Sicilian Pistachio',
      packLabel: 'Individual (1 Galleta)',
      unitPrice: 4.5,
      quantity: 1,
      image: '/images/cookie-pistachio.jpg',
    },
  ]);

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

  const handleAddToCart = (newItem, qtyToAdd = 1) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((item) => item.cartKey === newItem.cartKey);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qtyToAdd };
        return next;
      }
      return [
        ...prev,
        {
          ...newItem,
          quantity: qtyToAdd,
        },
      ];
    });
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

  const handleOpenStoreWithItem = (item, packLabel = 'Takeout') => {
    handleAddToCart(
      {
        cartKey: `${item.id || item.name}-menu`,
        id: item.id || item.name,
        name: item.name,
        packLabel: item.tag || item.small || packLabel,
        unitPrice: Number(item.priceUsd) || 0,
        image: '/images/cookie-classic.jpg',
      },
      1
    );
    setViewMode('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenStore = () => {
    setViewMode('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setViewMode('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Si el usuario entra a la tienda (Order Takeout), mostramos la tienda de delulucookies
  if (viewMode === 'store') {
    return (
      <DeluluTakeoutStore
        onBackToHome={handleBackToHome}
        cartItems={cartItems}
        onAddToCart={handleAddToCart}
        onUpdateQty={handleUpdateQty}
        onClearCart={() => setCartItems([])}
        currencyMode={currencyMode}
        onToggleCurrency={setCurrencyMode}
        bcvRate={bcvRate}
      />
    );
  }

  return (
    <div className="site">
      {/* ====================================================================
          1. NAVBAR (4 columnas exactas: logo, links, status, order takeout)
          ==================================================================== */}
      <div className="wrap">
        <nav className="delulu-top-nav" aria-label="Primary">
          <a href="#top" className="delulu-brand">
            {ENV_CONFIG.brandName}
          </a>

          <div className="links">
            <a href="#doors">Two doors</a>
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

          <button
            type="button"
            className="order"
            onClick={handleOpenStore}
          >
            <span className="ot">
              Order takeout{totalCartCount > 0 ? ` (${totalCartCount})` : ''}
            </span>
            <span className="os">WhatsApp · Pickup &amp; Delivery</span>
          </button>
        </nav>
      </div>

      <main id="main">
        {/* ====================================================================
            2. FULL-BLEED LOOP VIDEO / COLLAGE (100vw .hero)
            ==================================================================== */}
        <div className="hero" id="top">
          {ENV_CONFIG.loopVideoUrl ? (
            <video
              ref={videoRef}
              id="hv"
              src={ENV_CONFIG.loopVideoUrl}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/images/hero-cookies.jpg"
              aria-label="delulucookies loop video"
            />
          ) : (
            <div
              className={`loop-cinematic-reel ${isVideoPaused ? 'paused' : ''}`}
              role="img"
              aria-label="Collage en loop de galletas recién horneadas de delulucookies"
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
                alt="Caja de regalo artesanal de delulucookies"
                className="reel-slide slide-4"
              />
            </div>
          )}

          <button
            className="hvbtn"
            id="hvbtn"
            type="button"
            aria-label={isVideoPaused ? 'Play video' : 'Pause video'}
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
              3. SHORT DESCRIPTION (.lede)
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
                Tasa BCV <b>Bs. {bcvRate.toFixed(2)}</b>
              </span>
              <div
                className="currency-switch"
                role="tablist"
                aria-label="Cambiar moneda entre Dólares y Bolívares BCV"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={currencyMode === 'USD'}
                  onClick={() => setCurrencyMode('USD')}
                >
                  $ USD
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={currencyMode === 'VES'}
                  onClick={() => setCurrencyMode('VES')}
                >
                  Bs. BCV
                </button>
              </div>
            </div>
          </div>

          {/* ==================================================================
              4. SECCIÓN TIENDA EN LA HOME (#doors — One house · two doors)
              ================================================================== */}
          <section id="doors">
            <h2>One house · two doors</h2>
            <div className="doors">
              <a className="door" href="#menu">
                <div className="ph">
                  <img
                    src="/images/cookie-pistachio.jpg"
                    alt="Galletas recién horneadas rellenas de crema de pistacho y matcha"
                    loading="lazy"
                    width="900"
                    height="1125"
                  />
                </div>
                <div className="tx">
                  <div className="mark">{ENV_CONFIG.brandName}</div>
                  <div className="jp">COOKIE CAFÉ · RECIÉN HORNEADAS</div>
                  <p>
                    Galletas tibias de masa reposada 48 horas con mantequilla
                    avellana, chocolate venezolano Chuao 70%, centros cremosos de
                    pistacho y café de especialidad.
                  </p>
                  <div className="when">Tue–Sun · 8 AM – 9 PM</div>
                </div>
                <div className="more">
                  See the menu <span>↓</span>
                </div>
              </a>

              <button
                type="button"
                className="door"
                onClick={handleOpenStore}
              >
                <div className="ph">
                  <img
                    src="/images/cookie-box.jpg"
                    alt="Caja de regalo artesanal de delulucookies lista para takeout"
                    loading="lazy"
                    width="900"
                    height="1125"
                  />
                </div>
                <div className="tx">
                  <div className="mark">delulucookies takeout</div>
                  <div className="jp">TIENDA ONLINE · PEDIDOS POR WHATSAPP</div>
                  <p>
                    Arma tu pedido de galletas individuales, cajas de regalo de
                    4, 6 o 12 piezas y bebidas. Calcula en USD ($) o Bolívares
                    (BCV) y envía directo a WhatsApp.
                  </p>
                  <div className="when">Pickup &amp; Delivery · Caracas</div>
                </div>
                <div className="more">
                  Open takeout store <span>→</span>
                </div>
              </button>
            </div>
          </section>

          {/* ==================================================================
              5. OUR STORY (#story)
              ================================================================== */}
          <section id="story">
            <h2>Our story</h2>
            <div className="story">
              <div className="ph">
                <img
                  src="/images/hero-cookies.jpg"
                  alt="Galletas recién horneadas partidas por la mitad mostrando el corazón fundente"
                  loading="lazy"
                  width="900"
                  height="1125"
                />
              </div>
              <div>
                <h3>What delulucookies means to us</h3>
                <p>
                  <em>delulucookies</em> nació de la obsesión por hornear la
                  galleta perfecta: corteza dorada con mantequilla avellana
                  tostada, interior suave y un corazón fundente hecho con
                  ingredientes reales.
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
              6. THE MENU (#menu)
              ================================================================== */}
          <section id="menu">
            <h2>The menu</h2>
            <div className="menuwrap">
              <div className="menu-controls-row">
                <div className="mtabs" role="tablist" aria-label="Categorías del menú">
                  <button
                    type="button"
                    role="tab"
                    id="t-food"
                    aria-selected={menuTab === 'cookies'}
                    aria-controls="p-food"
                    onClick={() => setMenuTab('cookies')}
                  >
                    Cookies
                  </button>
                  <button
                    type="button"
                    role="tab"
                    id="t-drink"
                    aria-selected={menuTab === 'boxes'}
                    aria-controls="p-drink"
                    onClick={() => setMenuTab('boxes')}
                  >
                    Boxes &amp; Drinks
                  </button>
                </div>

                <div
                  className="currency-switch"
                  role="tablist"
                  aria-label="Moneda del menú"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={currencyMode === 'USD'}
                    onClick={() => setCurrencyMode('USD')}
                  >
                    $ USD
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={currencyMode === 'VES'}
                    onClick={() => setCurrencyMode('VES')}
                  >
                    Bs. BCV
                  </button>
                </div>
              </div>

              {/* PANEL 1: COOKIES (#p-food) */}
              <div
                id="p-food"
                role="tabpanel"
                aria-labelledby="t-food"
                hidden={menuTab !== 'cookies'}
              >
                <p className="blurb">{HOME_MENU_COOKIES.blurb}</p>

                {HOME_MENU_COOKIES.sections.map((sec) => (
                  <React.Fragment key={sec.title}>
                    <h3 className="cat">
                      <i />
                      <span>{sec.title}</span>
                      <i />
                    </h3>
                    {sec.sub && <p className="sub">{sec.sub}</p>}

                    {sec.items.map((item) => (
                      <div
                        key={item.id}
                        className="item"
                        onClick={() => handleOpenStoreWithItem(item, '1 Galleta')}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleOpenStoreWithItem(item, '1 Galleta');
                          }
                        }}
                        title="Haz clic para agregar a tu pedido en la tienda Takeout"
                      >
                        <div className="row">
                          <span className="nm">
                            {item.name}
                            {item.tag && <small>{item.tag}</small>}
                          </span>
                          <span className="pr">
                            {formatCookiePrice(
                              item.priceUsd,
                              currencyMode,
                              bcvRate
                            )}
                          </span>
                        </div>
                        {item.desc && <p className="dsc">{item.desc}</p>}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>

              {/* PANEL 2: BOXES & DRINKS (#p-drink) */}
              <div
                id="p-drink"
                role="tabpanel"
                aria-labelledby="t-drink"
                hidden={menuTab !== 'boxes'}
              >
                <p className="blurb">{HOME_MENU_BOXES_DRINKS.blurb}</p>

                {HOME_MENU_BOXES_DRINKS.sections.map((sec) => (
                  <React.Fragment key={sec.title}>
                    <h3 className="cat">
                      <i />
                      <span>{sec.title}</span>
                      <i />
                    </h3>
                    {sec.sub && <p className="sub">{sec.sub}</p>}

                    {sec.items.map((item) => (
                      <div
                        key={item.id}
                        className="item"
                        onClick={() =>
                          handleOpenStoreWithItem(item, 'Takeout Box')
                        }
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleOpenStoreWithItem(item, 'Takeout Box');
                          }
                        }}
                        title="Haz clic para pedir esta caja en la tienda Takeout"
                      >
                        <div className="row">
                          <span className="nm">{item.name}</span>
                          <span className="pr">
                            {formatCookiePrice(
                              item.priceUsd,
                              currencyMode,
                              bcvRate
                            )}
                          </span>
                        </div>
                        {item.desc && <p className="dsc">{item.desc}</p>}
                      </div>
                    ))}
                  </React.Fragment>
                ))}

                {HOME_MENU_BOXES_DRINKS.gridSections.map((gSec) => (
                  <React.Fragment key={gSec.title}>
                    <h3 className="cat">
                      <i />
                      <span>{gSec.title}</span>
                      <i />
                    </h3>
                    {gSec.sub && <p className="sub">{gSec.sub}</p>}

                    <div className="grid2">
                      {gSec.lines.map((line) => (
                        <div
                          key={line.name}
                          className="line"
                          onClick={() => handleOpenStoreWithItem(line, 'Bebida')}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleOpenStoreWithItem(line, 'Bebida');
                            }
                          }}
                          title="Haz clic para agregar bebida a tu pedido Takeout"
                        >
                          <span>
                            {line.name}
                            {line.small && <small>{line.small}</small>}
                          </span>
                          <i />
                          <span className="pr">
                            {formatCookiePrice(
                              line.priceUsd,
                              currencyMode,
                              bcvRate
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </React.Fragment>
                ))}
              </div>

              <p className="legend">
                GF gluten-free · Tasa BCV Bs. {bcvRate.toFixed(2)} · Haz clic en
                cualquier producto para pedir en la tienda Takeout
              </p>
              <p className="allergy">
                Por favor infórmanos sobre cualquier alergia a frutos secos,
                lácteos o gluten al enviar tu pedido por WhatsApp.
              </p>
              <p className="mver">
                Menu &amp; Prices in USD ($) and Bolívares (BCV) · Updated Daily
              </p>
            </div>
          </section>

          {/* ==================================================================
              7. VISIT (#visit)
              ================================================================== */}
          <section id="visit">
            <h2>Visit</h2>
            <div className="visit">
              <div>
                <p className="big">{ENV_CONFIG.brandLocation}</p>
                <p>
                  Retira tus galletas recién salidas del horno o pide Delivery a
                  toda Caracas directo desde nuestra tienda de WhatsApp.
                </p>

                <div className="hours">
                  <div>
                    <span>
                      {ENV_CONFIG.brandName}
                      <small>galletas tibias, cajas de regalo y café</small>
                    </span>
                    <span>8 AM – 9 PM · Mar–Dom</span>
                  </div>
                  <div>
                    <span>
                      delulucookies takeout
                      <small>pedidos online por WhatsApp · USD y Bs. BCV</small>
                    </span>
                    <span>9 AM – 8:30 PM · Mar–Dom</span>
                  </div>
                </div>

                <div className="acts">
                  <button type="button" onClick={handleOpenStore}>
                    Order takeout
                  </button>
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
                    WhatsApp Directo
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
                  src="/images/cookie-classic.jpg"
                  alt="Galleta recién horneada de delulucookies"
                  loading="lazy"
                  width="900"
                  height="900"
                />
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ====================================================================
          8. FOOTER
          ==================================================================== */}
      <div className="wrap">
        <footer>
          <span className="footer-wordmark">{ENV_CONFIG.brandName}</span>
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
          <p style={{ marginTop: '14px', opacity: 0.7 }}>
            © {new Date().getFullYear()} {ENV_CONFIG.brandName} · Precios en USD
            ($) y Bolívares (BCV Bs. {bcvRate.toFixed(2)})
          </p>
        </footer>
      </div>
    </div>
  );
}
