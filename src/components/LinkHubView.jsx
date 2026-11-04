import React from 'react';
import {
  MessageCircle,
  Sparkles,
  ShoppingBag,
  Gift,
  ArrowUpRight,
  MapPin,
  Camera,
  ExternalLink,
} from 'lucide-react';
import { ENV_CONFIG, COOKIES_CATALOG, buildWhatsAppUrl } from '../data/cookiesData';

export default function LinkHubView({ onEnterMainSite, onQuickOrderCookie }) {
  const handleDirectWhatsApp = (customText) => {
    window.open(buildWhatsAppUrl(customText), '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="linkhub-wrapper">
      <section className="linkhub-card" aria-label="Enlaces principales de Delulu Cookies">
        <div style={{ textAlign: 'center' }}>
          <span className="linkhub-status-pill">
            <span className="status-dot-live" />
            Horneando lote fresco hoy · Pedidos abiertos
          </span>
        </div>

        {/* Cabecera del Linktree Editorial */}
        <header className="linkhub-header">
          <div className="linkhub-avatar-wrap">
            <img
              src="/images/hero-cookies.jpg"
              alt={ENV_CONFIG.brandName}
              className="linkhub-avatar"
            />
            <span className="linkhub-badge-stamp">EST. 2026</span>
          </div>
          <h1 className="linkhub-title">{ENV_CONFIG.brandName}</h1>
          <p className="linkhub-handle">{ENV_CONFIG.brandHandle}</p>
          <p className="linkhub-bio">{ENV_CONFIG.brandTagline}</p>
        </header>

        {/* Banner destacado que lleva al Sitio Principal */}
        <div
          className="linkhub-featured-banner"
          onClick={() => onEnterMainSite('catalogo')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onEnterMainSite('catalogo')}
        >
          <img
            src="/images/cookie-box.jpg"
            alt="Colección de Galletas y Cajas de Regalo"
          />
          <div className="linkhub-featured-overlay">
            <span className="linkhub-featured-tag">
              COLECCIÓN DE TEMPORADA · INSPIRACIÓN ITALIANA & NY
            </span>
            <div className="linkhub-featured-title">
              <span>Explorar Sitio Principal & Menú Completo</span>
              <ArrowUpRight size={20} />
            </div>
          </div>
        </div>

        {/* Pila de Botones Tipo Linktree (Sitio Principal + WhatsApp Directo) */}
        <div className="linkhub-links-stack">
          <button
            type="button"
            className="linkhub-action-btn primary-site"
            onClick={() => onEnterMainSite('top')}
          >
            <div className="linkhub-btn-left">
              <span className="linkhub-icon-box">
                <Sparkles size={19} />
              </span>
              <div>
                <span className="linkhub-btn-title">
                  Entrar al Sitio Web Principal
                </span>
                <span className="linkhub-btn-subtitle">
                  Catálogo interactivo, armador de cajas, notas de cata y prensa
                </span>
              </div>
            </div>
            <ArrowUpRight size={18} />
          </button>

          <button
            type="button"
            className="linkhub-action-btn whatsapp-direct"
            onClick={() =>
              handleDirectWhatsApp(
                `${ENV_CONFIG.whatsappDefaultMessage} Vi su enlace principal y quiero conocer las galletas disponibles hoy.`
              )
            }
          >
            <div className="linkhub-btn-left">
              <span className="linkhub-icon-box">
                <MessageCircle size={19} />
              </span>
              <div>
                <span className="linkhub-btn-title">
                  Pedir Directo por WhatsApp Ahora
                </span>
                <span className="linkhub-btn-subtitle">
                  Atención personalizada inmediata · Envío hoy mismo
                </span>
              </div>
            </div>
            <ExternalLink size={17} />
          </button>

          <button
            type="button"
            className="linkhub-action-btn"
            onClick={() => onEnterMainSite('caja-regalo')}
          >
            <div className="linkhub-btn-left">
              <span className="linkhub-icon-box">
                <Gift size={19} />
              </span>
              <div>
                <span className="linkhub-btn-title">
                  Armar Caja de Regalo Personalizada (4, 6 o 12 Galletas)
                </span>
                <span className="linkhub-btn-subtitle">
                  Elige tus sabores favoritos y envíalo directo a WhatsApp
                </span>
              </div>
            </div>
            <ArrowUpRight size={18} />
          </button>

          <button
            type="button"
            className="linkhub-action-btn"
            onClick={() =>
              handleDirectWhatsApp(
                `¡Hola ${ENV_CONFIG.brandName}! 🍪 Me interesa cotizar cajas de regalo corporativas o para un evento especial.`
              )
            }
          >
            <div className="linkhub-btn-left">
              <span className="linkhub-icon-box">
                <ShoppingBag size={19} />
              </span>
              <div>
                <span className="linkhub-btn-title">
                  Eventos, Mesas de Postres & Regalos Corporativos
                </span>
                <span className="linkhub-btn-subtitle">
                  Cajas con listón y papelería personalizada por WhatsApp
                </span>
              </div>
            </div>
            <ExternalLink size={17} />
          </button>
        </div>

        {/* Selección rápida de sabores desde el Linktree */}
        <div className="linkhub-quick-flavors">
          <div className="linkhub-quick-header">
            <span>Sabores recién salidos del horno</span>
            <span>Pide en 1 clic</span>
          </div>
          <div className="linkhub-flavor-pills">
            {COOKIES_CATALOG.slice(0, 4).map((cookie) => (
              <button
                key={cookie.id}
                type="button"
                className="flavor-mini-card"
                onClick={() => onQuickOrderCookie(cookie)}
                title={`Pedir ${cookie.name} por WhatsApp`}
              >
                <img src={cookie.image} alt={cookie.name} />
                <div className="flavor-mini-info">
                  <h5>{cookie.name}</h5>
                  <span>
                    {ENV_CONFIG.currencySymbol}
                    {cookie.basePrice} · Pedir →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Pie del Linktree */}
        <footer className="linkhub-footer">
          <p
            style={{
              fontSize: '0.76rem',
              color: 'var(--color-secondary-muted)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <MapPin size={14} /> {ENV_CONFIG.brandLocation}
          </p>
          <div className="linkhub-socials">
            <a
              href={ENV_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="social-circle-link"
              aria-label="Instagram"
            >
              <Camera size={16} />
            </a>
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="social-circle-link"
              aria-label="WhatsApp"
            >
              <MessageCircle size={16} />
            </a>
            <a
              href={ENV_CONFIG.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="social-circle-link"
              aria-label="Ubicación"
            >
              <MapPin size={16} />
            </a>
          </div>
        </footer>
      </section>
    </main>
  );
}
