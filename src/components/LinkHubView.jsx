import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function LinkHubView({ onEnterMainSite, onOpenStore }) {
  return (
    <main className="linkhub-wrapper">
      <section className="linkhub-card" aria-label="Enlaces principales de Delulu Cookies">
        {/* Cabecera del Modal / Menú de Redirecciones */}
        <header className="linkhub-header">
          <div className="linkhub-logo-wrap">
            <img
              src="/images/DELULU - logo.png"
              alt="delulu cookies"
              className="delulu-logo-img"
            />
          </div>
          <p className="linkhub-bio">
            SAN ANTONIO DE LOS ALTOS
          </p>
        </header>

        {/* Banner destacado que lleva al Sitio Web y Menú */}
        <div
          className="linkhub-featured-banner"
          onClick={() => onEnterMainSite('top')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onEnterMainSite('top')}
        >
          <img
            src="/images/delulu-nosotros-1.JPG"
            alt="Delulu Cookies — Sitio Web y Menú"
          />
          <div className="linkhub-featured-overlay">
            <div className="linkhub-featured-title">
              <span>Sitio Web y Menú</span>
              <ArrowUpRight size={20} />
            </div>
          </div>
        </div>

        {/* Pila de Botones de Redirección (sin opción de Instagram, Crear pedido habilitado) */}
        <div className="linkhub-links-stack">
          <button
            type="button"
            className="linkhub-action-btn"
            onClick={onOpenStore}
          >
            <div>
              <span className="linkhub-btn-title">Crear pedido</span>
              <span className="linkhub-btn-subtitle">
                Arma tu Caja Delulu de 4 galletas y envía a WhatsApp
              </span>
            </div>
            <ArrowUpRight size={18} />
          </button>

          <button
            type="button"
            className="linkhub-action-btn"
            disabled
            aria-disabled="true"
            title="Próximamente"
          >
            <div>
              <span className="linkhub-btn-title">WhatsApp (Próximamente)</span>
            </div>
          </button>
        </div>

        {/* Pie del Modal con iconos del mismo tamaño exacto */}
        <footer className="linkhub-footer">
          <div className="linkhub-socials">
            <a
              href="https://www.instagram.com/delulucookies.ve/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-circle-link"
              aria-label="Instagram @delulucookies.ve"
              title="@delulucookies.ve"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>

            <button
              type="button"
              className="social-circle-link is-disabled"
              disabled
              aria-disabled="true"
              aria-label="WhatsApp (Próximamente)"
              title="WhatsApp (Próximamente)"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                <path d="M9.5 9.5c.3 1.8 1.7 3.2 3.5 3.5" />
              </svg>
            </button>
          </div>
        </footer>
      </section>
    </main>
  );
}
