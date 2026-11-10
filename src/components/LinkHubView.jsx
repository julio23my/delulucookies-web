import React from 'react';
import { ENV_CONFIG } from '../data/cookiesData';

export default function LinkHubView({ onEnterMainSite }) {
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
          <p className="linkhub-handle">@delulucookies.ve</p>
          <p className="linkhub-bio">
            Galletas artesanales · San Antonio de Los Altos
          </p>
        </header>

        {/* Botones de Redirección iguales, sin imágenes, texto marrón y outline coherente */}
        <div className="linkhub-links-stack">
          <button
            type="button"
            className="linkhub-action-btn"
            onClick={() => onEnterMainSite('top')}
          >
            Sitio web / menú
          </button>

          <button
            type="button"
            className="linkhub-action-btn"
            disabled
            aria-disabled="true"
          >
            WhatsApp (Próximamente!)
          </button>

          <a
            href={ENV_CONFIG.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="linkhub-action-btn"
          >
            Instagram
          </a>
        </div>

        {/* Pie del Modal con iconos de Instagram (@delulucookies.ve) y WhatsApp (deshabilitado) */}
        <footer className="linkhub-footer">
          <div className="linkhub-socials">
            <a
              href={ENV_CONFIG.instagramUrl}
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
                <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
              </svg>
            </button>
          </div>
        </footer>
      </section>
    </main>
  );
}
