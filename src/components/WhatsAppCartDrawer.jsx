import React, { useState } from 'react';
import { X, Trash2, MessageCircle, ShoppingBag } from 'lucide-react';
import { ENV_CONFIG, buildWhatsAppUrl } from '../data/cookiesData';

export default function WhatsAppCartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
}) {
  const [customerName, setCustomerName] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('Envío a domicilio');
  const [giftNote, setGiftNote] = useState('');

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
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
          `• ${item.quantity}x *${item.name}* (${item.packLabel}) — ${
            ENV_CONFIG.currencySymbol
          }${item.unitPrice * item.quantity}`
      )
      .join('\n');

    const messageParts = [
      `¡Hola *${ENV_CONFIG.brandName}*! 🍪✨`,
      `Quiero confirmar el siguiente pedido desde la web:`,
      ``,
      itemsLines,
      ``,
      `*Total Estimado:* ${ENV_CONFIG.currencySymbol}${totalAmount}`,
      `*Modalidad:* ${deliveryMethod}`,
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
            <h3>Tu Selección de Galletas</h3>
            <p style={{ fontSize: '0.76rem', color: 'var(--color-secondary-muted)' }}>
              Confirmación directa y personalizada vía WhatsApp
            </p>
          </div>
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
              {cartItems.map((item) => (
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
                        fontSize: '0.9rem',
                        display: 'block',
                      }}
                    >
                      {ENV_CONFIG.currencySymbol}
                      {item.unitPrice * item.quantity}
                    </strong>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.cartKey)}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        color: 'var(--color-secondary-muted)',
                        marginTop: '0.35rem',
                      }}
                      title="Eliminar"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}

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
                  Personaliza tu envío a WhatsApp:
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
                  value={deliveryMethod}
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                >
                  <option value="Envío a domicilio">🛵 Envío a domicilio hoy</option>
                  <option value="Pick-up en Boutique">🛍️ Pick-up en Atelier</option>
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
            <div className="drawer-total-row">
              <span style={{ fontSize: '0.85rem', color: 'var(--color-secondary-light)' }}>
                Total Estimado
              </span>
              <strong>
                {ENV_CONFIG.currencySymbol}
                {totalAmount}
              </strong>
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
