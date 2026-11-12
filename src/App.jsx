import React, { useState, useEffect, useRef } from 'react';
import DeluluTakeoutStore from './components/DeluluTakeoutStore';
import LinkHubView from './components/LinkHubView';
import IngredientsSection from './components/IngredientsSection';
import {
  ENV_CONFIG,
  BOX_DELULU_CONFIG,
  HOME_MENU_COOKIES,
  // formatCookiePrice, // Comentado temporalmente junto al precio de Caja Delulu
  getStoreOpenStatus,
} from './data/cookiesData';

export default function App() {
  // Visualización de precios en Dólares ('USD') o Bolívares ('VES' a tasa BCV)
  const [currencyMode, setCurrencyMode] = useState('USD');
  const [bcvRate, setBcvRate] = useState(ENV_CONFIG.bcvFallbackRate);

  // Vista activa: 'linkhub' (vista inicial desde Instagram) | 'home' | 'store'
  const [viewMode, setViewMode] = useState('linkhub');

  // Pausa/reproducción del video en loop (.hero)
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const videoRef = useRef(null);

  // Cajas Delulu en construcción y armadas
  const [boxes, setBoxes] = useState([
    { id: 'box-1', cookies: [], quantity: 1 },
  ]);

  const openStatus = getStoreOpenStatus();
  const totalCartCount = boxes
    .filter((b) => b.cookies.length === BOX_DELULU_CONFIG.size)
    .reduce((sum, b) => sum + b.quantity, 0);

  // Asegurar que el video esté siempre en loop, sin sonido (mute) y en slow motion (65%)
  useEffect(() => {
    const vid = videoRef.current;
    if (vid) {
      vid.defaultMuted = true;
      vid.muted = true;
      vid.loop = true;
      vid.defaultPlaybackRate = 0.65;
      vid.playbackRate = 0.65;
      vid.play().catch(() => {});
    }
  }, [viewMode]);

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
      vid.muted = true;
      vid.defaultPlaybackRate = 0.65;
      vid.playbackRate = 0.65;
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

  const handleEnterMainSite = (sectionId = 'top') => {
    setViewMode('home');
    setTimeout(() => {
      if (sectionId && sectionId !== 'top') {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 60);
  };

  const handleOpenStore = () => {
    setViewMode('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setViewMode('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Vista inicial tipo Linktree para quienes entran desde Instagram
  if (viewMode === 'linkhub') {
    return (
      <LinkHubView
        onEnterMainSite={handleEnterMainSite}
        onOpenStore={handleOpenStore}
        currencyMode={currencyMode}
        onToggleCurrency={setCurrencyMode}
        bcvRate={bcvRate}
      />
    );
  }

  // Si el usuario entra a la tienda ("Crear pedido"), mostramos la tienda de delulucookies
  if (viewMode === 'store') {
    return (
      <DeluluTakeoutStore
        onBackToHome={handleBackToHome}
        boxes={boxes}
        setBoxes={setBoxes}
        currencyMode={currencyMode}
        onToggleCurrency={setCurrencyMode}
        bcvRate={bcvRate}
      />
    );
  }

  return (
    <div className="site" id="top">
      {/* ====================================================================
          1. NAVBAR (4 columnas: logo, links, status, Crear pedido)
          ==================================================================== */}
      <div className="wrap">
        <nav className="delulu-top-nav" aria-label="Primary">
          <a href="#top" className="delulu-brand" aria-label={ENV_CONFIG.brandName}>
            <img
              src="/images/DELULU - logo.png"
              alt={ENV_CONFIG.brandName}
              className="delulu-logo-img"
            />
          </a>

          <div className="links">
            <a href="#story">historia</a>
            <a href="#menu">menú</a>
            <a href="#ingredientes">ingredientes</a>
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
            disabled
            aria-disabled="true"
            title="Próximamente!"
          >
            <span className="ot">Crear pedido (Próximamente!)</span>
          </button>
        </nav>
      </div>

      <main id="main">
        {/* ====================================================================
            2. FULL-BLEED LOOP VIDEO (100vw .hero en loop, sin sonido y slow-motion)
            ==================================================================== */}
        <div className="hero">
          <video
            ref={videoRef}
            id="hv"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/images/delulu-nosotros-1.JPG"
            aria-label="delulu cookies loop video"
            onLoadedMetadata={(e) => {
              e.currentTarget.defaultPlaybackRate = 0.65;
              e.currentTarget.playbackRate = 0.65;
            }}
            onPlay={(e) => {
              e.currentTarget.playbackRate = 0.65;
            }}
          >
            <source src="/images/delulu-video.mp4" type="video/mp4" />
            <source src="/images/delulu-video.mov" type="video/quicktime" />
          </video>

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
              3. SHORT DESCRIPTION (.lede)
              ================================================================== */}
          <div className="lede">
            <div className="eyebrow">
              repostería artesanal · san antonio de los altos
            </div>

            <h1>Horneado con alma para saborear con calma.</h1>

            <p>
              Hecho a mano con amor, sin prisas ni atajos, para regalar una
              experiencia inolvidable desde el primer bocado.
            </p>
          </div>

          {/* ==================================================================
              4. HISTORIA (#story — imagen delulu-nosotros-1)
              ================================================================== */}
          <section id="story">
            <h2>Historia</h2>
            <div className="story">
              <div className="ph">
                <img
                  src="/images/delulu-nosotros-1.JPG"
                  alt="Galletas recién horneadas de delulu cookies"
                  loading="lazy"
                  width="900"
                  height="1125"
                />
              </div>
              <div>
                <h3>Delulu es la solulu</h3>
                <p>
                  Delulu viene del inglés <em>delusional</em>, un término de
                  internet que describe el acto de abrazar fantasías que
                  desafían la realidad.
                </p>
                <p>
                  Aquí significa un refugio de optimismo terco contra todo
                  pronóstico: la decisión de soñar con la imaginación como único
                  límite.
                </p>
                <p style={{ marginBottom: 0 }}>
                  Hoy, esa fantasía y años de amor a la repostería toman forma
                  de artesanía apasionada, procesos pacientes, ingredientes de
                  calidad, experimentación continua, y detalles intencionales
                  que buscan crear un momento dulce y reconfortante.
                </p>
              </div>
            </div>
          </section>

          {/* ==================================================================
              5. MENÚ (#menu — Sin precios individuales, con sección Presentación)
              ================================================================== */}
          <section id="menu">
            <h2>Menú</h2>
            <div className="menuwrap">
              <div className="menu-controls-row">
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

              <div id="p-food" role="region" aria-label="Menú de galletas">
                <p className="blurb">{HOME_MENU_COOKIES.blurb}</p>

                {HOME_MENU_COOKIES.sections.map((sec) => (
                  <React.Fragment key={sec.title}>
                    <h3 className="cat">
                      <span>{sec.title}</span>
                    </h3>

                    {sec.items.map((item) => (
                      <div key={item.id} className="item">
                        <div className="row">
                          <span className="nm">{item.name}</span>
                          {/* Precio de la Caja Delulu comentado temporalmente:
                          {item.showPrice && (
                            <span className="pr">
                              {formatCookiePrice(
                                item.priceUsd,
                                currencyMode,
                                bcvRate
                              )}
                            </span>
                          )}
                          */}
                        </div>
                        {item.desc && <p className="dsc">{item.desc}</p>}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>

              <p className="legend">Tasa BCV Bs. {bcvRate.toFixed(2)}</p>
              <p className="allergy">
                Por favor recuerda detallar cualquier alergia a frutos secos,
                lácteos o gluten al enviar tu pedido
              </p>
              <p className="mver">
                Menú y precios en USD ($) y bolívares (BCV) · Actualizado
                diariamente
              </p>
            </div>
          </section>

          {/* ==================================================================
              6. INGREDIENTES (#ingredientes — Inspiración Lavoratti)
              ================================================================== */}
          <IngredientsSection />

          {/* ==================================================================
              7. PEDIDOS (#visit — imagen delulu-esperamos-1)
              ================================================================== */}
          <section id="visit">
            <h2>Pedidos</h2>
            <div className="visit">
              <div>
                <p className="big">La puerta está abierta</p>
                <p>
                  Hacer tu pedido es muy fácil: usa el formulario para generar
                  tu mensaje de WhatsApp automáticamente o escribe directamente
                  al chat. Tu pedido estará listo para disfrutar en
                  aproximadamente 25 minutos.
                </p>

                <div className="acts">
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    title="Próximamente!"
                  >
                    Crear pedido (Próximamente!)
                  </button>
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    title="Próximamente!"
                  >
                    WhatsApp (Próximamente!)
                  </button>
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
                  src="/images/delulu-esperamos-1.JPG"
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
          7. FOOTER (sin "obrador artesanal", WhatsApp sin número y deshabilitado)
          ==================================================================== */}
      <div className="wrap">
        <footer>
          <a href="#top" className="footer-wordmark" aria-label={ENV_CONFIG.brandName}>
            <img
              src="/images/DELULU - logo.png"
              alt={ENV_CONFIG.brandName}
              className="delulu-logo-img footer-logo-img"
            />
          </a>
          <p>
            <span
              className="footer-disabled-link"
              aria-disabled="true"
              title="Próximamente!"
            >
              WhatsApp (Próximamente!)
            </span>{' '}
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
