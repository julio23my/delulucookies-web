import React, { useState } from 'react';
import {
  ShoppingBag,
  MessageCircle,
  Link2,
  Sparkles,
  Camera,
  MapPin,
} from 'lucide-react';
import LinkHubView from './components/LinkHubView';
import MainEditorialSite from './components/MainEditorialSite';
import WhatsAppCartDrawer from './components/WhatsAppCartDrawer';
import {
  ENV_CONFIG,
  MASTER_COLOR_PRESETS,
  buildWhatsAppUrl,
} from './data/cookiesData';

export default function App() {
  // Por defecto inicia en la página estilo Linktree ('linkhub') que redirige a WhatsApp o al Sitio Principal ('site')
  const [viewMode, setViewMode] = useState('linkhub');
  const [cartItems, setCartItems] = useState([
    {
      cartKey: 'no2-pistacchio-bronte-single',
      id: 'no2-pistacchio-bronte',
      name: 'Pistacchio di Sicilia & Matcha',
      packLabel: '1 Pieza',
      unitPrice: 98,
      quantity: 1,
      image: '/images/cookie-pistachio.jpg',
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activePresetId, setActivePresetId] = useState('default');

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
      `¡Hola ${ENV_CONFIG.brandName}! 🍪\n\n` +
      `Vengo desde su Link principal y me gustaría pedir:\n` +
      `• *${cookie.name}* (${ENV_CONFIG.currencySymbol}${cookie.basePrice})\n\n` +
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
              <span>Pedido</span>
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
        />
      ) : (
        <>
          <MainEditorialSite
            onAddToCart={handleAddToCart}
            activePresetId={activePresetId}
            onSelectColorPreset={handleSelectColorPreset}
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
                    marginBottom: '1.25rem',
                  }}
                >
                  {ENV_CONFIG.brandTagline}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    opacity: 0.7,
                  }}
                >
                  {ENV_CONFIG.brandLocation}
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
                  Navegación Rápida
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
                  <li>
                    <a href="#press">Archivo de Prensa (#Press)</a>
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
                  Pedidos & Contacto Directo
                </h4>
                <p style={{ fontSize: '0.86rem', opacity: 0.85, marginBottom: '1rem' }}>
                  Horneamos de martes a domingo. Todos nuestros pedidos se confirman
                  de manera personalizada por WhatsApp.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <a
                    href={buildWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-direct-wa"
                    style={{ textDecoration: 'none' }}
                  >
                    <MessageCircle size={16} /> WhatsApp ({ENV_CONFIG.whatsappNumber})
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

      {/* Drawer de Pedido que formatea y envía todo a WhatsApp */}
      <WhatsAppCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
