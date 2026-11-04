import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  MessageCircle,
  Link2,
  Sparkles,
  Camera,
  RefreshCw,
} from 'lucide-react';
import LinkHubView from './components/LinkHubView';
import MainEditorialSite from './components/MainEditorialSite';
import WhatsAppCartDrawer from './components/WhatsAppCartDrawer';
import {
  ENV_CONFIG,
  buildWhatsAppUrl,
  formatDualPrice,
} from './data/cookiesData';

export default function App() {
  // Por defecto inicia en la página estilo Linktree ('linkhub') que redirige a WhatsApp o al Sitio Principal ('site')
  const [viewMode, setViewMode] = useState('linkhub');
  // Moneda de visualización activa: 'USD' ($ Dólares) o 'VES' (Bs. a tasa BCV)
  const [currencyMode, setCurrencyMode] = useState('USD');
  const [bcvRate, setBcvRate] = useState(ENV_CONFIG.bcvFallbackRate);
  const [bcvSource, setBcvSource] = useState('BCV Oficial');
  const [bcvUpdatedAt, setBcvUpdatedAt] = useState(null);

  const [cartItems, setCartItems] = useState([
    {
      cartKey: 'no2-pistacchio-bronte-single',
      id: 'no2-pistacchio-bronte',
      name: 'Pistacchio di Sicilia & Matcha',
      packLabel: '1 Galleta',
      unitPrice: 4.5,
      quantity: 1,
      image: '/images/cookie-pistachio.jpg',
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activePresetId, setActivePresetId] = useState('default');

  // Al iniciar la app, consulta el archivo generado por el script diario (/bcv-rate.json) y luego la API oficial en vivo del BCV
  useEffect(() => {
    let isMounted = true;

    async function loadDailyBcvRate() {
      // 1. Leer primero el JSON local actualizado por `npm run update-bcv`
      try {
        const localRes = await fetch('/bcv-rate.json', { cache: 'no-store' });
        if (localRes.ok) {
          const localData = await localRes.json();
          if (isMounted && localData?.rate && !Number.isNaN(Number(localData.rate))) {
            setBcvRate(Number(localData.rate));
            setBcvSource(localData.source || 'BCV Oficial');
            setBcvUpdatedAt(localData.updatedAt || localData.fetchedAt);
          }
        }
      } catch {
        // Continúa hacia la API en vivo
      }

      // 2. Consultar en tiempo real la API del dólar oficial BCV de Venezuela
      try {
        const liveRes = await fetch(ENV_CONFIG.bcvApiUrl);
        if (liveRes.ok) {
          const liveData = await liveRes.json();
          const liveRate = Number(liveData?.promedio || liveData?.venta);
          if (isMounted && liveRate && !Number.isNaN(liveRate)) {
            setBcvRate(Number(liveRate.toFixed(2)));
            setBcvSource('BCV en vivo');
            setBcvUpdatedAt(liveData?.fechaActualizacion || new Date().toISOString());
          }
        }
      } catch {
        // Se mantiene el valor de bcv-rate.json o VITE_BCV_FALLBACK_RATE
      }
    }

    loadDailyBcvRate();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Cambiar desde el Linktree hacia una sección específica del Sitio Principal
  const handleEnterMainSite = (sectionId = 'top') => {
    setViewMode('site');
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

  // Pedido rápido desde las tarjetas miniatura del Linktree
  const handleQuickOrderFromHub = (cookie) => {
    const msg =
      `¡Hola ${ENV_CONFIG.brandName}! 🍪🇻🇪\n\n` +
      `Vengo desde su Link principal y me gustaría pedir:\n` +
      `• *${cookie.name}* — ${formatDualPrice(cookie.basePrice, bcvRate)}\n\n` +
      `¿Tienen disponibles hoy?`;
    window.open(buildWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
  };

  // Agregar galleta o caja a la bolsa
  const handleAddToCart = (newItem) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.cartKey === newItem.cartKey
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
  };

  const handleUpdateQty = (cartKey, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(cartKey);
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

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Actualiza dinámicamente las variables del CSS Maestro (:root)
  const handleSelectColorPreset = (preset) => {
    setActivePresetId(preset.id);
    const root = document.documentElement;
    root.style.setProperty('--color-primary', preset.primary);
    root.style.setProperty('--color-primary-light', preset.primaryLight);
    root.style.setProperty('--color-primary-dark', preset.primaryDark);
    root.style.setProperty('--color-secondary', preset.secondary);
    root.style.setProperty('--color-tertiary', preset.tertiary);
    root.style.setProperty('--color-tertiary-light', preset.tertiaryLight);
  };

  return (
    <div className="app-shell">
      {/* Barra de anuncios superior configurable desde .env */}
      <div className="announcement-bar">{ENV_CONFIG.announcementBar}</div>

      {/* Barra Informativa de Tasa BCV y Selector Claro de Moneda: USD ($) vs Bolívares (Bs. BCV) */}
      <div className="bcv-currency-banner">
        <div className="bcv-currency-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span className="bcv-rate-pill">
              <span className="status-dot-live" />
              <strong>Tasa BCV del día:</strong> 1 USD = Bs. {bcvRate.toFixed(2)}
            </span>
            <span style={{ color: 'var(--color-secondary-light)', fontSize: '0.76rem' }}>
              Puedes cambiar la visualización de todos los precios entre{' '}
              <strong>Dólares ($ USD)</strong> y <strong>Bolívares (Bs. BCV)</strong>:
            </span>
          </div>

          <div className="currency-switch-group" role="group" aria-label="Selector de moneda">
            <div className="currency-toggle-pill">
              <button
                type="button"
                className={`currency-toggle-btn ${currencyMode === 'USD' ? 'active' : ''}`}
                onClick={() => setCurrencyMode('USD')}
              >
                💵 Ver en USD ($)
              </button>
              <button
                type="button"
                className={`currency-toggle-btn ${currencyMode === 'VES' ? 'active' : ''}`}
                onClick={() => setCurrencyMode('VES')}
              >
                🇻🇪 Ver en Bolívares (Bs. BCV)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación Superior con Conmutador entre Linktree y Sitio Principal */}
      <header className="mode-switcher-bar">
        <div className="mode-switcher-inner">
          <div
            className="brand-logo"
            onClick={() => setViewMode(viewMode === 'linkhub' ? 'site' : 'linkhub')}
            title="Cambiar vista"
          >
            <span>{ENV_CONFIG.brandName}</span>
            <span className="brand-logo-dot" />
          </div>

          {viewMode === 'site' && (
            <nav className="nav-links-desktop" aria-label="Secciones del sitio">
              <a href="#catalogo">Colección</a>
              <a href="#caja-regalo">Cofres de Regalo</a>
              <a href="#press">Prensa</a>
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp Directo
              </a>
            </nav>
          )}

          <div className="nav-actions">
            <div className="pill-toggle-group" role="tablist">
              <button
                type="button"
                className={`pill-toggle-btn ${
                  viewMode === 'linkhub' ? 'active' : ''
                }`}
                onClick={() => setViewMode('linkhub')}
              >
                <Link2 size={14} /> Link Hub
              </button>
              <button
                type="button"
                className={`pill-toggle-btn ${viewMode === 'site' ? 'active' : ''}`}
                onClick={() => handleEnterMainSite('top')}
              >
                <Sparkles size={14} /> Sitio Principal
              </button>
            </div>

            <button
              type="button"
              className="cart-trigger-btn"
              onClick={() => setIsCartOpen(true)}
              aria-label="Abrir bolsa de pedido"
            >
              <ShoppingBag size={16} />
              <span>Pedido ({currencyMode === 'USD' ? '$' : 'Bs.'})</span>
              <span className="cart-count-badge">{totalCartCount}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Renderizado Condicional: Vista 1 (Linktree) o Vista 2 (Sitio Principal Editorial) */}
      {viewMode === 'linkhub' ? (
        <LinkHubView
          onEnterMainSite={handleEnterMainSite}
          onQuickOrderCookie={handleQuickOrderFromHub}
          currencyMode={currencyMode}
          onToggleCurrency={setCurrencyMode}
          bcvRate={bcvRate}
        />
      ) : (
        <>
          <MainEditorialSite
            onAddToCart={handleAddToCart}
            activePresetId={activePresetId}
            onSelectColorPreset={handleSelectColorPreset}
            currencyMode={currencyMode}
            onToggleCurrency={setCurrencyMode}
            bcvRate={bcvRate}
          />

          {/* Footer Editorial en el Sitio Principal */}
          <footer className="site-footer">
            <div className="site-footer-inner">
              <div>
                <h2 className="footer-brand-title">{ENV_CONFIG.brandName}</h2>
                <p
                  style={{
                    fontSize: '0.9rem',
                    opacity: 0.8,
                    maxWidth: '380px',
                    marginBottom: '1rem',
                  }}
                >
                  {ENV_CONFIG.brandTagline}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    opacity: 0.75,
                    marginBottom: '0.35rem',
                  }}
                >
                  📍 {ENV_CONFIG.brandLocation}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    opacity: 0.65,
                  }}
                >
                  💱 Tasa BCV aplicada: Bs. {bcvRate.toFixed(2)} / $1 USD ({bcvSource})
                  {bcvUpdatedAt ? ` · Actualizado` : ''}
                </p>
              </div>

              <div>
                <h4
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '1rem',
                    opacity: 0.7,
                  }}
                >
                  Moneda y Navegación
                </h4>
                <ul
                  style={{
                    listStyle: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                    fontSize: '0.88rem',
                  }}
                >
                  <li>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrencyMode(currencyMode === 'USD' ? 'VES' : 'USD')
                      }
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <RefreshCw size={14} /> Cambiar precios a{' '}
                      {currencyMode === 'USD' ? 'Bolívares (Bs. BCV)' : 'Dólares ($ USD)'}
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setViewMode('linkhub')}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      Volver al Linktree Inicial
                    </button>
                  </li>
                  <li>
                    <a href="#catalogo">Catálogo de Galletas</a>
                  </li>
                  <li>
                    <a href="#caja-regalo">Armar Caja de Regalo</a>
                  </li>
                </ul>
              </div>

              <div>
                <h4
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '1rem',
                    opacity: 0.7,
                  }}
                >
                  Pedidos en Venezuela
                </h4>
                <p style={{ fontSize: '0.86rem', opacity: 0.85, marginBottom: '1rem' }}>
                  Aceptamos Pago Móvil a tasa oficial BCV del día, Zelle y Efectivo.
                  Todos nuestros pedidos se confirman directo por WhatsApp.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <a
                    href={buildWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-direct-wa"
                    style={{ textDecoration: 'none' }}
                  >
                    <MessageCircle size={16} /> WhatsApp (+{ENV_CONFIG.whatsappNumber})
                  </a>
                  <a
                    href={ENV_CONFIG.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-direct-wa"
                    style={{ textDecoration: 'none' }}
                  >
                    <Camera size={16} /> Instagram
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* Botón Flotante de WhatsApp permanente */}
      <button
        type="button"
        className="floating-wa-pill"
        onClick={() => setIsCartOpen(true)}
      >
        <span className="status-dot-live" />
        <MessageCircle size={17} />
        <span>
          {totalCartCount > 0
            ? `Finalizar Pedido (${totalCartCount})`
            : 'Pedir por WhatsApp'}
        </span>
      </button>

      {/* Drawer de Pedido que formatea y envía todo a WhatsApp en USD y Bs. BCV */}
      <WhatsAppCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        currencyMode={currencyMode}
        onToggleCurrency={setCurrencyMode}
        bcvRate={bcvRate}
      />
    </div>
  );
}
