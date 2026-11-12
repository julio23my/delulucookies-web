import React, { useState } from 'react';
import {
  ENV_CONFIG,
  BOX_DELULU_CONFIG,
  TAKEOUT_STORE_SECTIONS,
  buildWhatsAppUrl,
  formatCookiePrice,
  formatDualPrice,
} from '../data/cookiesData';

const ALL_STORE_COOKIES = TAKEOUT_STORE_SECTIONS.flatMap((sec) => sec.tiles);

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
  // Selección actual para armar una Caja Delulu de 4 galletas variadas ($15)
  const [boxSelection, setBoxSelection] = useState([]);
  const [boxQty, setBoxQty] = useState(1);

  // Modal de detalle de galleta para armar Caja Delulu con 4 sabores
  const [activeSheetItem, setActiveSheetItem] = useState(null);

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

  // Contabiliza cuántas veces está un sabor dentro de la caja actual (máx. 4 galletas en total)
  const getCountInCurrentBox = (cookieId) =>
    boxSelection.filter((c) => c.id === cookieId).length;

  const handleAddCookieToBox = (cookie) => {
    setBoxSelection((prev) => {
      if (prev.length >= BOX_DELULU_CONFIG.size) return prev;
      return [...prev, cookie];
    });
  };

  const handleRemoveCookieFromBox = (cookieId) => {
    setBoxSelection((prev) => {
      const idx = prev.findIndex((c) => c.id === cookieId);
      if (idx === -1) return prev;
      const next = [...prev];
      next.splice(idx, 1);
      return next;
    });
  };

  const handleOpenItemSheet = (item) => {
    setActiveSheetItem(item);
    // Si la caja está vacía al abrir el modal, preselecciona esta galleta como la primera de las 4
    setBoxSelection((prev) => (prev.length === 0 ? [item] : prev));
    setBoxQty(1);
  };

  const commitCurrentBoxToCart = () => {
    if (boxSelection.length !== BOX_DELULU_CONFIG.size) return false;

    // Agrupa los 4 sabores seleccionados para mostrar el detalle de la Caja Delulu
    const countsMap = {};
    boxSelection.forEach((c) => {
      countsMap[c.name] = (countsMap[c.name] || 0) + 1;
    });
    const flavorsSummary = Object.entries(countsMap)
      .map(([name, count]) => (count > 1 ? `${count}x ${name}` : name))
      .join(', ');

    const sortedIds = boxSelection
      .map((c) => c.id)
      .sort()
      .join('-');
    const cartKey = `caja-delulu-${sortedIds}`;

    onAddToCart(
      {
        cartKey,
        id: BOX_DELULU_CONFIG.id,
        name: BOX_DELULU_CONFIG.name,
        packLabel: `4 galletas: ${flavorsSummary}`,
        unitPrice: BOX_DELULU_CONFIG.priceUsd,
        image: boxSelection[0]?.image || '/images/cookie-box.jpg',
      },
      boxQty
    );

    setBoxSelection([]);
    setBoxQty(1);
    return true;
  };

  const handleConfirmCompletedBox = () => {
    if (!commitCurrentBoxToCart()) return;
    setActiveSheetItem(null);
    setStoreStep('checkout');
  };

  const handleConfirmAndBuildAnotherBox = () => {
    if (!commitCurrentBoxToCart()) return;
    // Mantiene abierto el modal o el armador con 0/4 para armar otra caja de inmediato
  };

  const handleStartAnotherBox = () => {
    setBoxSelection([]);
    setBoxQty(1);
    setStoreStep('browse');
    if (ALL_STORE_COOKIES.length > 0) {
      setActiveSheetItem(ALL_STORE_COOKIES[0]);
    }
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

  const boxPriceFormatted = formatCookiePrice(
    BOX_DELULU_CONFIG.priceUsd,
    currencyMode,
    bcvRate
  );

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
            Presentación única:{' '}
            <strong>
              Caja Delulu (4 galletas a escoger) · {boxPriceFormatted}
            </strong>
          </div>
        </section>

        {storeStep === 'browse' ? (
          <>
            {/* Armador interactivo de Caja Delulu (4 galletas variadas por $15) */}
            <section className="to-box-builder" aria-label="Armador de Caja Delulu">
              <div className="to-box-builder-head">
                <div>
                  <span className="to-k">Presentación única</span>
                  <h3>
                    {BOX_DELULU_CONFIG.name} · {boxPriceFormatted}
                  </h3>
                  <p>
                    Elige 4 galletas del menú para armar tu caja ({boxSelection.length}/{BOX_DELULU_CONFIG.size} seleccionadas)
                  </p>
                </div>
                {boxSelection.length > 0 && (
                  <button
                    type="button"
                    className="to-more"
                    onClick={() => setBoxSelection([])}
                  >
                    Reiniciar caja
                  </button>
                )}
              </div>

              <div className="to-box-slots">
                {Array.from({ length: BOX_DELULU_CONFIG.size }).map((_, idx) => {
                  const chosen = boxSelection[idx];
                  return (
                    <div
                      key={idx}
                      className={`to-box-slot ${chosen ? 'filled' : ''}`}
                    >
                      {chosen ? (
                        <>
                          <span>
                            {idx + 1}. {chosen.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCookieFromBox(chosen.id)}
                            aria-label={`Quitar ${chosen.name} de la caja`}
                          >
                            ×
                          </button>
                        </>
                      ) : (
                        <span>Espacio {idx + 1} · Elige una galleta</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {boxSelection.length === BOX_DELULU_CONFIG.size && (
                <div className="to-box-complete-bar">
                  <div className="to-box-complete-row">
                    <div className="to-qty">
                      <button
                        type="button"
                        onClick={() => setBoxQty((q) => Math.max(1, q - 1))}
                      >
                        −
                      </button>
                      <span>{boxQty} {boxQty === 1 ? 'caja' : 'cajas'}</span>
                      <button
                        type="button"
                        onClick={() => setBoxQty((q) => q + 1)}
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className="to-go"
                      onClick={handleConfirmCompletedBox}
                    >
                      <span>Cerrar pedido ({boxQty} {boxQty === 1 ? 'caja' : 'cajas'})</span>
                      <span>
                        {formatCookiePrice(
                          BOX_DELULU_CONFIG.priceUsd * boxQty,
                          currencyMode,
                          bcvRate
                        )}
                      </span>
                    </button>
                  </div>

                  <button
                    type="button"
                    className="to-another-box-btn"
                    onClick={handleConfirmAndBuildAnotherBox}
                  >
                    + Armar otra caja
                  </button>
                </div>
              )}
            </section>

            {/* Chips de navegación rápida .to-chips */}
            <nav className="to-chips" aria-label="Sections">
              {TAKEOUT_STORE_SECTIONS.map((sec) => (
                <a key={sec.id} href={`#store-${sec.id}`}>
                  {sec.title}
                </a>
              ))}
            </nav>

            {/* Secciones con cuadrícula .to-tiles (solo para añadir a la Caja Delulu de 4) */}
            {TAKEOUT_STORE_SECTIONS.map((sec) => (
              <section key={sec.id} id={`store-${sec.id}`} className="to-sec">
                <h2>{sec.title}</h2>

                {sec.tiles && sec.tiles.length > 0 && (
                  <ul className="to-tiles">
                    {sec.tiles.map((item) => {
                      const countInBox = getCountInCurrentBox(item.id);
                      const isBoxFull = boxSelection.length >= BOX_DELULU_CONFIG.size;

                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            className="to-art"
                            onClick={() => handleOpenItemSheet(item)}
                            aria-label={`Armar Caja Delulu con ${item.name}`}
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
                            {countInBox > 0 && (
                              <span>{countInBox} en tu caja</span>
                            )}
                          </div>
                          {item.desc && <div className="to-tag">{item.desc}</div>}

                          <button
                            type="button"
                            className="to-add"
                            disabled={isBoxFull}
                            onClick={() => handleAddCookieToBox(item)}
                          >
                            {isBoxFull
                              ? 'Caja completa (4/4)'
                              : `+ Añadir a Caja (${boxSelection.length}/${BOX_DELULU_CONFIG.size})`}
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
                  No tienes Cajas Delulu en tu orden todavía.{' '}
                  <button
                    type="button"
                    className="to-more"
                    onClick={() => setStoreStep('browse')}
                    style={{ textDecoration: 'underline' }}
                  >
                    Armar Caja Delulu
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
                + Armar otra Caja Delulu (4 galletas)
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

              {cartItems.length > 0 && (
                <button
                  type="button"
                  className="to-notip"
                  onClick={onClearCart}
                >
                  Vaciar mi orden actual
                </button>
              )}
            </form>
          </section>
        )}
      </div>

      {/* Barra fija inferior .to-bar */}
      {totalItemsCount > 0 && (
        <div className="to-bar">
          <div className="to-bar-inner">
            <button
              type="button"
              className="to-bar-main"
              onClick={() =>
                storeStep === 'browse'
                  ? setStoreStep('checkout')
                  : handleSendWhatsAppCheckout({ preventDefault: () => {} })
              }
            >
              <span>
                {storeStep === 'browse'
                  ? `Cerrar pedido (${totalItemsCount} ${totalItemsCount === 1 ? 'caja' : 'cajas'})`
                  : `Enviar por WhatsApp (${totalItemsCount} ${totalItemsCount === 1 ? 'caja' : 'cajas'})`}
              </span>
              <span>
                {formatCookiePrice(totalUsdAmount, currencyMode, bcvRate)} →
              </span>
            </button>

            <button
              type="button"
              className="to-another-box-btn"
              onClick={handleStartAnotherBox}
            >
              + Armar otra caja
            </button>
          </div>
        </div>
      )}

      {/* Modal / Bottom Sheet para elegir los 4 sabores de la Caja Delulu ($15) */}
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
              <h3>{BOX_DELULU_CONFIG.name}</h3>
              <span>{boxPriceFormatted}</span>
            </div>

            <p className="to-desc">{activeSheetItem.desc}</p>
            <p className="to-fresh">
              Selecciona 4 galletas variadas para tu caja ({boxSelection.length}/{BOX_DELULU_CONFIG.size})
            </p>

            <fieldset className="to-group">
              <legend>
                <span>Elige tus 4 galletas</span>
                <i className="req">
                  {boxSelection.length}/{BOX_DELULU_CONFIG.size} seleccionadas
                </i>
              </legend>

              {ALL_STORE_COOKIES.map((cookie) => {
                const count = getCountInCurrentBox(cookie.id);
                const isFull = boxSelection.length >= BOX_DELULU_CONFIG.size;

                return (
                  <div key={cookie.id} className="to-opt">
                    <span>{cookie.name}</span>
                    <div className="to-qty sm">
                      <button
                        type="button"
                        disabled={count === 0}
                        onClick={() => handleRemoveCookieFromBox(cookie.id)}
                      >
                        −
                      </button>
                      <span>{count}</span>
                      <button
                        type="button"
                        disabled={isFull}
                        onClick={() => handleAddCookieToBox(cookie)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </fieldset>

            <div className="to-sheetbar">
              <div className="to-sheetbar-row">
                <div className="to-qty">
                  <button
                    type="button"
                    onClick={() => setBoxQty((q) => Math.max(1, q - 1))}
                  >
                    −
                  </button>
                  <span>{boxQty}</span>
                  <button
                    type="button"
                    onClick={() => setBoxQty((q) => q + 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="to-go"
                  disabled={boxSelection.length !== BOX_DELULU_CONFIG.size}
                  onClick={handleConfirmCompletedBox}
                >
                  <span>
                    {boxSelection.length === BOX_DELULU_CONFIG.size
                      ? `Cerrar pedido (${boxQty} ${boxQty === 1 ? 'caja' : 'cajas'})`
                      : `Elige ${BOX_DELULU_CONFIG.size - boxSelection.length} más`}
                  </span>
                  <span>
                    {formatCookiePrice(
                      BOX_DELULU_CONFIG.priceUsd * boxQty,
                      currencyMode,
                      bcvRate
                    )}
                  </span>
                </button>
              </div>

              {boxSelection.length === BOX_DELULU_CONFIG.size && (
                <button
                  type="button"
                  className="to-another-box-btn"
                  onClick={handleConfirmAndBuildAnotherBox}
                >
                  + Armar otra caja
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
