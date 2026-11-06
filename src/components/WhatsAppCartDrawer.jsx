import React, { useState } from 'react';
import { X, Trash2, MessageCircle, ShoppingBag, RefreshCw } from 'lucide-react';
import {
  ENV_CONFIG,
  buildWhatsAppUrl,
  formatCookiePrice,
  formatDualPrice,
} from '../data/cookiesData';

export default function WhatsAppCartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  currencyMode,
  onToggleCurrency,
  bcvRate,
}) {
  const [customerName, setCustomerName] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('Delivery en Caracas');
  const [paymentMethod, setPaymentMethod] = useState('Pago Móvil (Tasa BCV)');
  const [giftNote, setGiftNote] = useState('');

  if (!isOpen) return null;

  const totalUsdAmount = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const handleSendOrderToWhatsApp = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      window.open(buildWhatsAppUrl(), '_blank', 'noopener,noreferrer');
      return;
    }

    const itemsLines = cartItems
      .map(
        (item) =>
          `- ${item.quantity}x *${item.name}* (${item.packLabel}) — ${formatDualPrice(
            item.unitPrice * item.quantity,
            bcvRate
          )}`
      )
      .join('\n');

    const messageParts = [
      `¡Hola *${ENV_CONFIG.brandName}*!`,
      `Quiero confirmar el siguiente pedido desde la web:`,
      ``,
      itemsLines,
      ``,
      `*Total en Dólares:* ${formatCookiePrice(totalUsdAmount, 'USD', bcvRate)}`,
      `*Total en Bolívares (BCV Bs. ${bcvRate.toFixed(2)}):* ${formatCookiePrice(
        totalUsdAmount,
        'VES',
        bcvRate
      )}`,
      `*Método de Pago:* ${paymentMethod}`,
      `*Modalidad de Entrega:* ${deliveryMethod}`,
    ];

    if (customerName.trim()) {
      messageParts.push(`*Nombre:* ${customerName.trim()}`);
    }
    if (giftNote.trim()) {
      messageParts.push(`*Nota / Dedicatoria:* "${giftNote.trim()}"`);
    }

    messageParts.push(``, `¿Me indican los datos para finalizar mi pedido?`);

    const finalUrl = buildWhatsAppUrl(messageParts.join('\n'));
    window.open(finalUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside
        className="drawer-panel"
        onClick={(e) => e.stopPropagation()}
        aria-label="Bolsa de Pedido para WhatsApp"
      >
        <header className="drawer-header">
          <div>
            <h3>Order Takeout</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-body)' }}>
              Tasa BCV hoy: <strong>Bs. {bcvRate.toFixed(2)} / $1 USD</strong>
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              type="button"
              onClick={() => onToggleCurrency(currencyMode === 'USD' ? 'VES' : 'USD')}
              style={{
                border: '1.5px solid var(--color-outline)',
                backgroundColor: 'var(--color-bg)',
                padding: '0.3rem 0.6rem',
                borderRadius: 'var(--radius-pill)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                color: 'var(--color-section-name)',
              }}
              title="Alternar entre USD ($) y Bolívares (Bs. BCV)"
            >
              <RefreshCw size={11} />
              {currencyMode === 'USD' ? 'Ver Bs.' : 'Ver USD'}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                padding: '0.35rem',
              }}
              aria-label="Cerrar bolsa"
            >
              <X size={22} />
            </button>
          </div>
        </header>

        <div className="drawer-body">
          {cartItems.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '3rem 1rem',
                color: 'var(--color-secondary-muted)',
              }}
            >
              <ShoppingBag
                size={38}
                style={{ margin: '0 auto 0.75rem', opacity: 0.5 }}
              />
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem' }}>
                Tu bolsa está vacía
              </p>
              <p style={{ fontSize: '0.84rem', marginTop: '0.35rem' }}>
                Explora nuestras galletas recién horneadas o arma tu cofre de regalo.
              </p>
            </div>
          ) : (
            <>
              {cartItems.map((item) => {
                const subTotalUsd = item.unitPrice * item.quantity;
                return (
                  <div key={item.cartKey} className="cart-item-row">
                    <img src={item.image} alt={item.name} />
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <p>{item.packLabel}</p>
                      <div className="qty-controls">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.cartKey, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.cartKey, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <strong
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.88rem',
                          display: 'block',
                        }}
                      >
                        {formatCookiePrice(subTotalUsd, currencyMode, bcvRate)}
                      </strong>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.68rem',
                          color: 'var(--color-secondary-muted)',
                          display: 'block',
                        }}
                      >
                        ≈{' '}
                        {formatCookiePrice(
                          subTotalUsd,
                          currencyMode === 'USD' ? 'VES' : 'USD',
                          bcvRate
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.cartKey)}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          color: 'var(--color-secondary-muted)',
                          marginTop: '0.3rem',
                        }}
                        title="Eliminar"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}

              <form onSubmit={handleSendOrderToWhatsApp} className="drawer-form-group">
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--color-secondary-muted)',
                  }}
                >
                  Datos para tu pedido en Venezuela:
                </span>
                <input
                  type="text"
                  className="drawer-input"
                  placeholder="Tu nombre (opcional)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
                <select
                  className="drawer-input"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="Pago Móvil (Tasa BCV)">
                    📱 Pago Móvil en Bs. (Tasa BCV del día)
                  </option>
                  <option value="Zelle (USD)">💵 Zelle ($ USD)</option>
                  <option value="Efectivo USD / Divisas">💶 Efectivo ($ USD)</option>
                  <option value="Binance Pay / Zinli">⚡ Binance Pay / Zinli</option>
                </select>
                <select
                  className="drawer-input"
                  value={deliveryMethod}
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                >
                  <option value="Delivery en Caracas">🛵 Delivery en Caracas hoy</option>
                  <option value="Pick-up en Atelier">🛍️ Pick-up en Atelier</option>
                  <option value="Envío como Regalo Sorpresa">
                    🎁 Envío como Regalo Sorpresa
                  </option>
                </select>
                <input
                  type="text"
                  className="drawer-input"
                  placeholder="Dedicatoria para la tarjeta caligrafiada (opcional)"
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                />
              </form>
            </>
          )}
        </div>

        <footer className="drawer-footer">
          {cartItems.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <div className="drawer-total-row" style={{ marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-secondary-light)' }}>
                  Total ({currencyMode === 'USD' ? 'Dólares USD' : 'Bolívares BCV'})
                </span>
                <strong>
                  {formatCookiePrice(totalUsdAmount, currencyMode, bcvRate)}
                </strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.76rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-secondary-muted)',
                }}
              >
                <span>
                  Equivalente en {currencyMode === 'USD' ? 'Bolívares (BCV)' : 'Dólares ($)'}:
                </span>
                <span>
                  {formatCookiePrice(
                    totalUsdAmount,
                    currencyMode === 'USD' ? 'VES' : 'USD',
                    bcvRate
                  )}
                </span>
              </div>
            </div>
          )}

          <button
            type="button"
            className="btn-checkout-whatsapp"
            onClick={handleSendOrderToWhatsApp}
          >
            <MessageCircle size={18} />
            {cartItems.length > 0
              ? 'Enviar Pedido por WhatsApp'
              : 'Chatear con Nosotros en WhatsApp'}
          </button>

          {cartItems.length > 0 && (
            <button
              type="button"
              onClick={onClearCart}
              style={{
                width: '100%',
                marginTop: '0.6rem',
                background: 'transparent',
                border: 'none',
                fontSize: '0.75rem',
                color: 'var(--color-secondary-muted)',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Vaciar selección
            </button>
          )}
        </footer>
      </aside>
    </div>
  );
}
