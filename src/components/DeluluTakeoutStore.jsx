import React, { useState } from 'react';
import {
  ENV_CONFIG,
  TAKEOUT_STORE_SECTIONS,
  buildWhatsAppUrl,
  formatCookiePrice,
  formatDualPrice,
} from '../data/cookiesData';

export default function DeluluTakeoutStore({
  onBackToHome,
  cartItems,
  onAddToCart,
  onUpdateQty,
  onClearCart,
  currencyMode,
  onToggleCurrency,
  bcvRate,
}) {
  // Item abierto en el bottom-sheet (.to-shade / .to-sheet)
  const [activeSheetItem, setActiveSheetItem] = useState(null);
  const [sheetPack, setSheetPack] = useState(null);
  const [sheetQty, setSheetQty] = useState(1);

  // Vista de revisión de bolsa/checkout dentro de la tienda ('browse' | 'checkout')
  const [storeStep, setStoreStep] = useState('browse');
  const [whenMode, setWhenMode] = useState('ASAP (aprox. 25 min)');
  const [deliveryType, setDeliveryType] = useState('Delivery');
  const [paymentMethod, setPaymentMethod] = useState('Pago Móvil (Tasa BCV)');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  const totalItemsCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalUsdAmount = cartItems.reduce(
    (sum, i) => sum + i.unitPrice * i.quantity,
    0
  );

  const handleOpenItemSheet = (item) => {
    setActiveSheetItem(item);
    setSheetPack(item.packs ? item.packs[0] : null);
    setSheetQty(1);
  };

  const handleConfirmSheetAdd = () => {
    if (!activeSheetItem) return;
    const baseUsd = Number(activeSheetItem.priceUsd) || 0;
    const extraUsd = sheetPack ? Number(sheetPack.extraUsd) || 0 : 0;
    const finalUnitUsd = Number((baseUsd + extraUsd).toFixed(2));
    const packLabel = sheetPack ? sheetPack.name : 'Individual (1 galleta)';
    const cartKey = `${activeSheetItem.id}-${sheetPack ? sheetPack.id : 'single'}`;

    onAddToCart(
      {
        cartKey,
        id: activeSheetItem.id,
        name: activeSheetItem.name,
        packLabel,
        unitPrice: finalUnitUsd,
        image: activeSheetItem.image || '/images/cookie-classic.jpg',
      },
      sheetQty
    );

    setActiveSheetItem(null);
  };

  const handleQuickAddTile = (item) => {
    if (item.packs && item.packs.length > 0) {
      handleOpenItemSheet(item);
      return;
    }
    onAddToCart(
      {
        cartKey: `${item.id}-single`,
        id: item.id,
        name: item.name,
        packLabel: 'Individual (1 galleta)',
        unitPrice: item.priceUsd,
        image: item.image || '/images/cookie-classic.jpg',
      },
      1
    );
  };

  const handleSendWhatsAppCheckout = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      window.open(buildWhatsAppUrl(), '_blank', 'noopener,noreferrer');
      return;
    }

    const lines = cartItems
      .map(
        (item) =>
          `- ${item.quantity}x *${item.name}* (${item.packLabel}) — ${formatDualPrice(
            item.unitPrice * item.quantity,
            bcvRate
          )}`
      )
      .join('\n');

    const msgParts = [
      `¡Hola *${ENV_CONFIG.brandName}*!`,
      `Nuevo pedido desde *Crea tu pedido*:`,
      ``,
      lines,
      ``,
      `*Total en Dólares:* ${formatCookiePrice(totalUsdAmount, 'USD', bcvRate)}`,
      `*Total en Bolívares (BCV Bs. ${bcvRate.toFixed(2)}):* ${formatCookiePrice(
        totalUsdAmount,
        'VES',
        bcvRate
      )}`,
      `*Entrega:* ${deliveryType} (${whenMode})`,
      `*Método de Pago:* ${paymentMethod}`,
    ];

    if (customerName.trim()) msgParts.push(`*Cliente:* ${customerName.trim()}`);
    if (customerPhone.trim()) msgParts.push(`*Teléfono:* ${customerPhone.trim()}`);
    if (customerAddress.trim()) {
      msgParts.push(`*Dirección / Notas:* ${customerAddress.trim()}`);
    }

    msgParts.push(``, `¿Me confirman los datos de pago para procesar mi orden?`);

    window.open(buildWhatsAppUrl(msgParts.join('\n')), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="cm">
      <div className="to-wrap">
        {/* Cabecera de la Tienda delulucookies */}
        <header className="to-mast">
          <div className="to-mast-bar">
            <button
              type="button"
              className="to-back-pill"
              onClick={() => onBackToHome()}
            >
              ← Inicio
            </button>

            <div
              className="currency-switch"
              role="tablist"
              aria-label="Seleccionar moneda"
            >
              <button
                type="button"
                role="tab"
                aria-selected={currencyMode === 'USD'}
                onClick={() => onToggleCurrency('USD')}
              >
                $ USD
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={currencyMode === 'VES'}
                onClick={() => onToggleCurrency('VES')}
              >
                Bs. BCV
              </button>
            </div>
          </div>

          <button
            type="button"
            className="delulu-brand"
            onClick={() => onBackToHome()}
            aria-label="Volver al inicio"
          >
            <img
              src="/images/DELULU - logo.png"
              alt={ENV_CONFIG.brandName}
              className="delulu-logo-img store-logo-img"
            />
          </button>
        </header>

        {/* Tarjeta de estado Pickup / Delivery (.to-pickup) */}
        <section className="to-pickup">
          <div className="to-k">Ordena ahora · Directo por WhatsApp</div>
          <div className="to-big">Listo en aprox. 25 minutos</div>
          <div className="to-small">
            Horario: 11:00 am – 6:00 pm · Tasa BCV:{' '}
            <strong>Bs. {bcvRate.toFixed(2)}</strong>
          </div>
        </section>

        {storeStep === 'browse' ? (
          <>
            {/* Chips de navegación rápida .to-chips */}
            <nav className="to-chips" aria-label="Sections">
              {TAKEOUT_STORE_SECTIONS.map((sec) => (
                <a key={sec.id} href={`#store-${sec.id}`}>
                  {sec.title}
                </a>
              ))}
            </nav>

            {/* Secciones con cuadrícula .to-tiles */}
            {TAKEOUT_STORE_SECTIONS.map((sec) => (
              <section key={sec.id} id={`store-${sec.id}`} className="to-sec">
                <h2>{sec.title}</h2>

                {sec.tiles && sec.tiles.length > 0 && (
                  <ul className="to-tiles">
                    {sec.tiles.map((item) => {
                      const mainPrice = formatCookiePrice(
                        item.priceUsd,
                        currencyMode,
                        bcvRate
                      );
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            className="to-art"
                            onClick={() => handleOpenItemSheet(item)}
                            aria-label={`Ver ${item.name}`}
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              loading="lazy"
                              width="600"
                              height="600"
                            />
                          </button>
                          <div className="to-line">
                            <span>{item.name}</span>
                            <span>{mainPrice}</span>
                          </div>
                          {item.desc && <div className="to-tag">{item.desc}</div>}
                          <button
                            type="button"
                            className="to-add"
                            onClick={() => handleQuickAddTile(item)}
                          >
                            Agregar
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            ))}
          </>
        ) : (
          /* ==================================================================
             PASO DE REVISIÓN Y ENVÍO A WHATSAPP (.to-cart / .to-form / .to-sum)
             ================================================================== */
          <section className="to-sec to-cart">
            <h2>Tu Pedido</h2>
            <p className="to-sub">Revisa tu pedido y envía directo a WhatsApp</p>

            <div className="to-box" style={{ marginTop: '14px' }}>
              {cartItems.length === 0 ? (
                <p style={{ margin: 0 }}>
                  No tienes galletas en tu orden todavía.{' '}
                  <button
                    type="button"
                    className="to-more"
                    onClick={() => setStoreStep('browse')}
                    style={{ textDecoration: 'underline' }}
                  >
                    Explorar menú
                  </button>
                </p>
              ) : (
                <ul className="to-lines">
                  {cartItems.map((item) => (
                    <li key={item.cartKey}>
                      <div>
                        <b>{item.name}</b>
                        <span>
                          {item.packLabel} ·{' '}
                          {formatCookiePrice(
                            item.unitPrice * item.quantity,
                            currencyMode,
                            bcvRate
                          )}
                        </span>
                      </div>
                      <div className="to-qty sm">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQty(item.cartKey, item.quantity - 1)
                          }
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQty(item.cartKey, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <button
                type="button"
                className="to-more"
                onClick={() => setStoreStep('browse')}
              >
                + Agregar más galletas
              </button>
            </div>

            <div style={{ marginTop: '20px' }}>
              <div className="to-k">Cuándo deseas tu pedido</div>
              <div className="to-when">
                <button
                  type="button"
                  aria-pressed={whenMode === 'ASAP (aprox. 25 min)'}
                  onClick={() => setWhenMode('ASAP (aprox. 25 min)')}
                >
                  <b>Lo antes posible</b>
                  <span>Hoy · ~25 min</span>
                </button>
                <button
                  type="button"
                  aria-pressed={whenMode === 'Programar hora (11 am - 6 pm)'}
                  onClick={() => setWhenMode('Programar hora (11 am - 6 pm)')}
                >
                  <b>Programar hora</b>
                  <span>11 am - 6 pm</span>
                </button>
              </div>
            </div>

            <form className="to-form" onSubmit={handleSendWhatsAppCheckout}>
              <label>
                Modalidad de Entrega
                <select
                  className="to-select-input"
                  value={deliveryType}
                  onChange={(e) => setDeliveryType(e.target.value)}
                >
                  <option value="Delivery">Delivery</option>
                  <option value="Pick-up">Pick-up</option>
                </select>
              </label>

              <label>
                Método de Pago
                <select
                  className="to-select-input"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="Pago Móvil (Tasa BCV)">
                    Pago Móvil en Bs. (Tasa BCV)
                  </option>
                  <option value="Zelle (USD)">Zelle ($ USD)</option>
                  <option value="Binance ($ USDT)">Binance ($ USDT)</option>
                  <option value="Efectivo (USD)">Efectivo ($ USD)</option>
                </select>
              </label>

              <label>
                Tu Nombre
                <input
                  type="text"
                  placeholder="Ej. María Valentina"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </label>

              <label>
                Tu Teléfono / WhatsApp
                <input
                  type="tel"
                  placeholder="Ej. 0412-1234567"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </label>

              <label>
                Dirección de entrega o notas
                <input
                  type="text"
                  placeholder="Dirección de entrega o nota para tu pedido..."
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                />
              </label>

              <div className="to-sum">
                <div className="m">
                  <span>Subtotal en Dólares (USD)</span>
                  <span>{formatCookiePrice(totalUsdAmount, 'USD', bcvRate)}</span>
                </div>
                <div className="m">
                  <span>
                    Equivalente en Bolívares (BCV Bs. {bcvRate.toFixed(2)})
                  </span>
                  <span>{formatCookiePrice(totalUsdAmount, 'VES', bcvRate)}</span>
                </div>
                <div className="t">
                  <span>
                    Total a pagar ({currencyMode === 'USD' ? 'USD' : 'Bs. BCV'})
                  </span>
                  <strong>
                    {formatCookiePrice(totalUsdAmount, currencyMode, bcvRate)}
                  </strong>
                </div>
              </div>

              <button
                type="submit"
                className="to-go"
                style={{ marginTop: '18px', width: '100%' }}
              >
                <span>Confirmar y Enviar por WhatsApp</span>
                <span>
                  {formatCookiePrice(totalUsdAmount, currencyMode, bcvRate)} →
                </span>
              </button>

              {cartItems.length > 0 && (
                <button
                  type="button"
                  className="to-notip"
                  onClick={onClearCart}
                >
                  Vaciar orden actual
                </button>
              )}
            </form>
          </section>
        )}
      </div>

      {/* Barra fija inferior .to-bar */}
      {totalItemsCount > 0 && (
        <div className="to-bar">
          <button
            type="button"
            onClick={() =>
              storeStep === 'browse'
                ? setStoreStep('checkout')
                : handleSendWhatsAppCheckout({ preventDefault: () => {} })
            }
          >
            <span>
              {storeStep === 'browse'
                ? `Ver pedido (${totalItemsCount})`
                : `Enviar por WhatsApp (${totalItemsCount})`}
            </span>
            <span>
              {formatCookiePrice(totalUsdAmount, currencyMode, bcvRate)} →
            </span>
          </button>
        </div>
      )}

      {/* Modal / Bottom Sheet .to-shade + .to-sheet */}
      {activeSheetItem && (
        <div
          className="to-shade"
          onClick={() => setActiveSheetItem(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="to-sheet" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="to-x"
              onClick={() => setActiveSheetItem(null)}
              aria-label="Cerrar"
            >
              ×
            </button>

            <img
              src={activeSheetItem.image}
              alt={activeSheetItem.name}
              className="to-sheetart"
            />

            <div className="to-sheethead">
              <h3>{activeSheetItem.name}</h3>
              <span>
                {formatCookiePrice(
                  (Number(activeSheetItem.priceUsd) || 0) +
                    (sheetPack ? Number(sheetPack.extraUsd) || 0 : 0),
                  currencyMode,
                  bcvRate
                )}
              </span>
            </div>

            <p className="to-desc">{activeSheetItem.desc}</p>
            <p className="to-fresh">
              Galletas estilo NYC · Listas en aprox. 25 min
            </p>

            {activeSheetItem.packs && activeSheetItem.packs.length > 0 && (
              <fieldset className="to-group">
                <legend>
                  <span>Presentación</span>
                  <i className="req">Requerido</i>
                </legend>
                {activeSheetItem.packs.map((pk) => {
                  const optionTotalUsd =
                    Number(activeSheetItem.priceUsd) + Number(pk.extraUsd);
                  const isChecked = sheetPack?.id === pk.id;
                  return (
                    <label key={pk.id} className="to-opt">
                      <span>
                        <input
                          type="radio"
                          name="cookie-pack"
                          checked={isChecked}
                          onChange={() => setSheetPack(pk)}
                        />
                        {pk.name}
                      </span>
                      <span>
                        {formatCookiePrice(optionTotalUsd, currencyMode, bcvRate)}
                      </span>
                    </label>
                  );
                })}
              </fieldset>
            )}

            <div className="to-sheetbar">
              <div className="to-qty">
                <button
                  type="button"
                  onClick={() => setSheetQty((q) => Math.max(1, q - 1))}
                >
                  −
                </button>
                <span>{sheetQty}</span>
                <button
                  type="button"
                  onClick={() => setSheetQty((q) => q + 1)}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="to-go"
                onClick={handleConfirmSheetAdd}
              >
                <span>Agregar al pedido</span>
                <span>
                  {formatCookiePrice(
                    ((Number(activeSheetItem.priceUsd) || 0) +
                      (sheetPack ? Number(sheetPack.extraUsd) || 0 : 0)) *
                      sheetQty,
                    currencyMode,
                    bcvRate
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
