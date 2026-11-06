import React, { useState, useEffect, useRef } from 'react';
import DeluluTakeoutStore from './components/DeluluTakeoutStore';
import {
  ENV_CONFIG,
  HOME_MENU_COOKIES,
  buildWhatsAppUrl,
  formatCookiePrice,
  getStoreOpenStatus,
} from './data/cookiesData';

export default function App() {
  // Visualización de precios en Dólares ('USD') o Bolívares ('VES' a tasa BCV)
  const [currencyMode, setCurrencyMode] = useState('USD');
  const [bcvRate, setBcvRate] = useState(ENV_CONFIG.bcvFallbackRate);

  // Vista activa: 'home' | 'store' (tienda de pedidos de delulucookies)
  const [viewMode, setViewMode] = useState('home');

  // Pausa/reproducción del loop full-width (.hero)
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const videoRef = useRef(null);

  // Carrito de pedidos conectado a WhatsApp
  const [cartItems, setCartItems] = useState([
    {
      cartKey: 'chocolate-blanco-crema-pistacho-single',
      id: 'chocolate-blanco-crema-pistacho',
      name: 'De chocolate blanco y crema de pistacho',
      packLabel: 'Individual (1 Galleta)',
      unitPrice: 4.0,
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

  const handleOpenStoreWithItem = (item, packLabel = 'Individual (1 Galleta)') => {
    handleAddToCart(
      {
        cartKey: `${item.id || item.name}-single`,
        id: item.id || item.name,
        name: item.name,
        packLabel,
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

  // Si el usuario entra a la tienda ("Ordenar ahora" / "Ir a ordenar"), mostramos la tienda de delulucookies
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
          1. NAVBAR (4 columnas: logo, links, status, Ordenar ahora)
          ==================================================================== */}
      <div className="wrap">
        <nav className="delulu-top-nav" aria-label="Primary">
          <a href="#top" className="delulu-brand">
            {ENV_CONFIG.brandName}
          </a>

          <div className="links">
            <a href="#story">nosotros</a>
            <a href="#menu">menu</a>
            <a href="#visit">whatsapp</a>
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
              Ordenar ahora{totalCartCount > 0 ? ` (${totalCartCount})` : ''}
            </span>
          </button>
        </nav>
      </div>

      <main id="main">
        {/* ====================================================================
            2. FULL-BLEED LOOP VIDEO / COLLAGE (100vw .hero sin texto sobrepuesto)
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
                alt="Galleta de chocolate blanco y crema de pistacho"
                className="reel-slide slide-2"
              />
              <img
                src="/images/cookie-classic.jpg"
                alt="Galleta clásica con chispas de chocolate"
                className="reel-slide slide-3"
              />
              <img
                src="/images/cookie-box.jpg"
                alt="Caja artesanal de delulucookies"
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
        </div>

        <div className="wrap">
          {/* ==================================================================
              3. SHORT DESCRIPTION (.lede sin svg ni botones inferiores)
              ================================================================== */}
          <div className="lede">
            <div className="eyebrow">
              obrador artesanal · cookies estilo nyc · delivery y pick-up
            </div>

            <h1>Delulu es la solulu: Cada bocado hecho a mano con amor</h1>

            <p>
              Somos una línea de galletas artesanales gigantes y absolutamente
              deliciosas inspiradas en las famosas galletas de la ciudad de
              Nueva York.
            </p>
          </div>

          {/* ==================================================================
              4. OUR STORY (#story)
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
                <h3>Delulu es la Solulu</h3>
                <p>
                  Delulu, del inglés delusional, es una palabra lúdica de
                  internet que describe el acto de abrazar fantasías o ideas que
                  desafían la realidad.
                </p>
                <p style={{ marginBottom: 0 }}>
                  Para nosotros, Delulu es un refugio frente al pesimismo al que
                  a veces nos empujan las circunstancias. Es la decisión de
                  mantener un optimismo terco contra todo pronóstico; el impulso
                  de construir algo desde cero que, por más difícil que parezca,
                  nos devuelve las ganas de soñar.
                </p>
              </div>
            </div>
          </section>

          {/* ==================================================================
              5. THE MENU (#menu — Solo Cookies, 1 solo borde)
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
                    aria-selected="true"
                    aria-controls="p-food"
                  >
                    Cookies
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

              <div id="p-food" role="tabpanel" aria-labelledby="t-food">
                <p className="blurb">{HOME_MENU_COOKIES.blurb}</p>

                {HOME_MENU_COOKIES.sections.map((sec) => (
                  <React.Fragment key={sec.title}>
                    <h3 className="cat">
                      <i />
                      <span>{sec.title}</span>
                      <i />
                    </h3>

                    {sec.items.map((item) => (
                      <div
                        key={item.id}
                        className="item"
                        onClick={() =>
                          handleOpenStoreWithItem(item, 'Individual (1 Galleta)')
                        }
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleOpenStoreWithItem(
                              item,
                              'Individual (1 Galleta)'
                            );
                          }
                        }}
                        title="Haz clic para agregar a tu pedido"
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
              </div>

              <p className="legend">Tasa BCV Bs. {bcvRate.toFixed(2)}</p>
              <p className="allergy">
                Por favor infórmanos sobre cualquier alergia a frutos secos,
                lácteos o gluten al enviar tu pedido por WhatsApp.
              </p>
              <p className="mver">
                Menú y precios en USD ($) y bolívares (BCV) · Actualizado
                diariamente
              </p>
            </div>
          </section>

          {/* ==================================================================
              6. VISIT (#visit)
              ================================================================== */}
          <section id="visit">
            <h2>Visit</h2>
            <div className="visit">
              <div>
                <p className="big">Ordena ahora</p>
                <p>
                  Arma tu pedido a través de nuestro formulario, selecciona las
                  galletas que quieras ordenar, llena la información y envía
                  directo a WhatsApp. Tu pedido recién horneado estará listo en
                  aproximadamente 20 minutos.
                </p>

                <div className="acts">
                  <button type="button" onClick={handleOpenStore}>
                    Ir a ordenar
                  </button>
                  <a
                    href={buildWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp Directo
                  </a>
                  <a
                    href="https://www.instagram.com/delulucookies.ve/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @delulucookies.ve
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
          7. FOOTER
          ==================================================================== */}
      <div className="wrap">
        <footer>
          <span className="footer-wordmark">{ENV_CONFIG.brandName}</span>
          <p>obrador artesanal · cookies estilo nyc · delivery y pick-up</p>
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
              href="https://www.instagram.com/delulucookies.ve/"
              target="_blank"
              rel="noopener noreferrer"
            >
              @delulucookies.ve
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
