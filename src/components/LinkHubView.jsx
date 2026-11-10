import React from 'react';
import {
  MessageCircle,
  Sparkles,
  ShoppingBag,
  ArrowUpRight,
  Camera,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import {
  ENV_CONFIG,
  HOME_MENU_COOKIES,
  buildWhatsAppUrl,
  formatCookiePrice,
  getStoreOpenStatus,
} from '../data/cookiesData';

export default function LinkHubView({
  onEnterMainSite,
  onOpenStore,
  currencyMode,
  onToggleCurrency,
  bcvRate,
}) {
  const openStatus = getStoreOpenStatus();
  const featuredCookies = HOME_MENU_COOKIES.sections
    .flatMap((sec) => sec.items)
    .slice(0, 4);

  const handleDirectWhatsApp = (customText) => {
    window.open(buildWhatsAppUrl(customText), '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="linkhub-wrapper">
      <section className="linkhub-card" aria-label="Enlaces principales de Delulu Cookies">
        <div className="linkhub-top-bar">
          <span className="linkhub-status-pill">
            <span className="status-dot-live" />
            {openStatus.label}
          </span>

          <button
            type="button"
            className="linkhub-currency-btn"
            onClick={() => onToggleCurrency(currencyMode === 'USD' ? 'VES' : 'USD')}
            title="Cambiar moneda entre Dólares ($) y Bolívares (Bs. BCV)"
          >
            <RefreshCw size={12} />
            {currencyMode === 'USD'
              ? `Ver en Bs. (BCV: ${bcvRate.toFixed(2)})`
              : 'Ver precios en USD ($)'}
          </button>
        </div>

        {/* Cabecera del Linktree Editorial */}
        <header className="linkhub-header">
          <div className="linkhub-logo-wrap">
            <img
              src="/images/DELULU - logo.png"
              alt="delulu cookies"
              className="linkhub-logo-img"
            />
          </div>
          <p className="linkhub-handle">@delulucookies.ve</p>
          <p className="linkhub-bio">
            Cada bocado hecho a mano con amor · Galletas artesanales estilo NYC
          </p>
        </header>

        {/* Banner destacado que lleva al Sitio Principal */}
        <div
          className="linkhub-featured-banner"
          onClick={() => onEnterMainSite('top')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onEnterMainSite('top')}
        >
          <img
            src="/images/delulu-nosotros.jpeg"
            alt="Delulu Cookies — Galletas estilo NYC"
          />
          <div className="linkhub-featured-overlay">
            <span className="linkhub-featured-tag">
              DELULU ES LA SOLULU · LISTO EN APROX. 25 MINUTOS
            </span>
            <div className="linkhub-featured-title">
              <span>Entrar al Sitio Web Principal & Menú</span>
              <ArrowUpRight size={20} />
            </div>
          </div>
        </div>

        {/* Pila de Botones Tipo Linktree */}
        <div className="linkhub-links-stack">
          <button
            type="button"
            className="linkhub-action-btn primary-site"
            disabled
            aria-disabled="true"
            title="Próximamente"
          >
            <div className="linkhub-btn-left">
              <span className="linkhub-icon-box">
                <ShoppingBag size={19} />
              </span>
              <div>
                <span className="linkhub-btn-title">
                  Crea tu pedido (Próximamente)
                </span>
                <span className="linkhub-btn-subtitle">
                  Arma tu pedido o caja de 4 galletas y envía directo a WhatsApp
                </span>
              </div>
            </div>
          </button>

          <button
            type="button"
            className="linkhub-action-btn"
            onClick={() => onEnterMainSite('top')}
          >
            <div className="linkhub-btn-left">
              <span className="linkhub-icon-box">
                <Sparkles size={19} />
              </span>
              <div>
                <span className="linkhub-btn-title">
                  Ver Sitio Web Principal & Menú Completo
                </span>
                <span className="linkhub-btn-subtitle">
                  Conoce nuestra historia y el menú en USD ($) y Bs. (BCV)
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
                `${ENV_CONFIG.whatsappDefaultMessage} Vengo desde Instagram y quiero hacer un pedido.`
              )
            }
          >
            <div className="linkhub-btn-left">
              <span className="linkhub-icon-box">
                <MessageCircle size={19} />
              </span>
              <div>
                <span className="linkhub-btn-title">
                  Escribir Directo por WhatsApp
                </span>
                <span className="linkhub-btn-subtitle">
                  Pago Móvil (BCV), Zelle, Binance ($ USDT) o Efectivo
                </span>
              </div>
            </div>
            <ExternalLink size={17} />
          </button>
        </div>

        {/* Vista rápida de sabores */}
        <div className="linkhub-quick-flavors">
          <div className="linkhub-quick-header">
            <span>Galletas estilo NYC</span>
            <span>{currencyMode === 'USD' ? 'USD ($)' : 'Bs. (BCV)'}</span>
          </div>
          <div className="linkhub-flavor-pills">
            {featuredCookies.map((cookie) => (
              <button
                key={cookie.id}
                type="button"
                className="flavor-mini-card"
                onClick={() => onEnterMainSite('menu')}
                title={`Ver ${cookie.name} en el menú`}
              >
                <img src={cookie.image} alt={cookie.name} />
                <div className="flavor-mini-info">
                  <h5>{cookie.name}</h5>
                  <span>
                    {formatCookiePrice(cookie.priceUsd, currencyMode, bcvRate)} · Ver menú →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Pie del Linktree */}
        <footer className="linkhub-footer">
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
          </div>
        </footer>
      </section>
    </main>
  );
}
