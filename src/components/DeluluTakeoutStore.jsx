import React, { useState } from 'react';
import {
  ENV_CONFIG,
  BOX_DELULU_CONFIG,
  TAKEOUT_STORE_SECTIONS,
  buildWhatsAppUrl,
  // formatCookiePrice, // Comentado temporalmente junto al precio de la Caja Delulu
  // formatDualPrice,
} from '../data/cookiesData';

const ALL_STORE_COOKIES = TAKEOUT_STORE_SECTIONS.flatMap((sec) => sec.tiles);

function summarizeBoxCookies(cookies) {
  const countsMap = {};
  cookies.forEach((c) => {
    countsMap[c.name] = (countsMap[c.name] || 0) + 1;
  });
  const flavorsSummary = Object.entries(countsMap)
    .map(([name, count]) => (count > 1 ? `${count}x ${name}` : name))
    .join(', ');
  return `4 galletas: ${flavorsSummary}`;
}

export default function DeluluTakeoutStore({
  onBackToHome,
  boxes,
  setBoxes,
  currencyMode,
  onToggleCurrency,
  // bcvRate, // Comentado temporalmente junto al precio de la Caja Delulu
}) {
  // Modal de detalle de galleta para seleccionar sabores de la caja activa
  const [activeSheetItem, setActiveSheetItem] = useState(null);

  // Vista dentro de la tienda: 'browse' (armar cajas) | 'checkout' (revisión de pedido)
  const [storeStep, setStoreStep] = useState('browse');

  const [whenMode, setWhenMode] = useState('ASAP (aprox. 25 min)');
  const [deliveryType, setDeliveryType] = useState('Delivery');
  const [paymentMethod, setPaymentMethod] = useState('Pago Móvil (Tasa BCV)');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  // Cajas que ya tienen sus 4 galletas completas
  const completedBoxes = boxes.filter(
    (b) => b.cookies.length === BOX_DELULU_CONFIG.size
  );

  // Total de cajas creadas (considerando duplicación en la vista de revisión)
  const totalCompletedBoxesCount = completedBoxes.reduce(
    (sum, b) => sum + b.quantity,
    0
  );

  // Índice de la caja activa en construcción (la primera que tenga menos de 4 galletas)
  const activeBoxIndex = boxes.findIndex(
    (b) => b.cookies.length < BOX_DELULU_CONFIG.size
  );
  const activeBox =
    activeBoxIndex !== -1 ? boxes[activeBoxIndex] : boxes[boxes.length - 1];
  const isAllBoxesFull = activeBoxIndex === -1;

  /* Precios de la Caja Delulu comentados temporalmente:
  const totalUsdAmount = totalCompletedBoxesCount * BOX_DELULU_CONFIG.priceUsd;
  const boxPriceFormatted = formatCookiePrice(
    BOX_DELULU_CONFIG.priceUsd,
    currencyMode,
    bcvRate
  );
  */

  // Contabiliza cuántas veces está un sabor dentro de la caja activa
  const getCountInActiveBox = (cookieId) => {
    if (!activeBox) return 0;
    return activeBox.cookies.filter((c) => c.id === cookieId).length;
  };

  // Añade una galleta a la primera caja que aún no tenga 4 galletas
  const handleAddCookieToActiveBox = (cookie) => {
    setBoxes((prev) => {
      const targetIdx = prev.findIndex(
        (b) => b.cookies.length < BOX_DELULU_CONFIG.size
      );
      if (targetIdx === -1) return prev;
      const next = [...prev];
      next[targetIdx] = {
        ...next[targetIdx],
        cookies: [...next[targetIdx].cookies, cookie],
      };
      return next;
    });
  };

  // Quita una galleta de una caja específica (por id de caja e índice/id de galleta)
  const handleRemoveCookieFromBox = (boxId, cookieId, slotIdx = null) => {
    setBoxes((prev) =>
      prev.map((box) => {
        if (box.id !== boxId) return box;
        const nextCookies = [...box.cookies];
        if (slotIdx !== null && slotIdx >= 0 && slotIdx < nextCookies.length) {
          nextCookies.splice(slotIdx, 1);
        } else {
          const foundIdx = nextCookies.findIndex((c) => c.id === cookieId);
          if (foundIdx === -1) return box;
          nextCookies.splice(foundIdx, 1);
        }
        return { ...box, cookies: nextCookies };
      })
    );
  };

  // Reinicia las 4 galletas de una caja específica
  const handleResetBox = (boxId) => {
    setBoxes((prev) =>
      prev.map((box) => (box.id === boxId ? { ...box, cookies: [] } : box))
    );
  };

  // Elimina una sección de caja si hay más de una caja en pantalla
  const handleRemoveBoxSection = (boxId) => {
    setBoxes((prev) => {
      const filtered = prev.filter((b) => b.id !== boxId);
      if (filtered.length === 0) {
        return [{ id: `box-${Date.now()}`, cookies: [], quantity: 1 }];
      }
      return filtered;
    });
  };

  // Genera una nueva sección para la siguiente caja manteniendo visibles las anteriores
  const handleBuildAnotherBox = () => {
    const newBoxId = `box-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 6)}`;

    setBoxes((prev) => {
      // Si ya existe una caja vacía/incompleta, no necesitamos duplicar otra vacía
      const hasIncomplete = prev.some(
        (b) => b.cookies.length < BOX_DELULU_CONFIG.size
      );
      if (hasIncomplete) return prev;
      return [...prev, { id: newBoxId, cookies: [], quantity: 1 }];
    });

    setActiveSheetItem(null);
    setStoreStep('browse');

    setTimeout(() => {
      const builderNodes = document.querySelectorAll('.to-box-builder');
      const lastBuilder = builderNodes[builderNodes.length - 1];
      if (lastBuilder) {
        lastBuilder.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 60);
  };

  // Pasa a la sección de revisión de pedido ("Cerrar pedido")
  const handleProceedToCheckout = () => {
    if (completedBoxes.length === 0) return;
    // Limpia cajas vacías (0/4) sin completar al pasar a la revisión de pedido
    setBoxes((prev) => {
      const onlyCompleted = prev.filter(
        (b) => b.cookies.length === BOX_DELULU_CONFIG.size
      );
      return onlyCompleted.length > 0 ? onlyCompleted : prev;
    });
    setActiveSheetItem(null);
    setStoreStep('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Duplica o reduce la cantidad de una caja (permitido únicamente en la sección de revisión de pedido)
  const handleUpdateBoxQtyInCheckout = (boxId, newQty) => {
    setBoxes((prev) => {
      if (newQty <= 0) {
        const remaining = prev.filter((b) => b.id !== boxId);
        if (remaining.length === 0) {
          return [{ id: `box-${Date.now()}`, cookies: [], quantity: 1 }];
        }
        return remaining;
      }
      return prev.map((b) =>
        b.id === boxId ? { ...b, quantity: newQty } : b
      );
    });
  };

  const handleClearAllBoxes = () => {
    setBoxes([{ id: `box-${Date.now()}`, cookies: [], quantity: 1 }]);
    setStoreStep('browse');
  };

  const handleOpenItemSheet = (item) => {
    setActiveSheetItem(item);
    // Si la caja activa está vacía al abrir el modal, preselecciona esta galleta
    setBoxes((prev) => {
      const targetIdx = prev.findIndex(
        (b) => b.cookies.length < BOX_DELULU_CONFIG.size
      );
      if (targetIdx === -1) return prev;
      if (prev[targetIdx].cookies.length === 0) {
        const next = [...prev];
        next[targetIdx] = {
          ...next[targetIdx],
          cookies: [item],
        };
        return next;
      }
      return prev;
    });
  };

  const handleSendWhatsAppCheckout = (e) => {
    e.preventDefault();
    if (completedBoxes.length === 0) {
      window.open(buildWhatsAppUrl(), '_blank', 'noopener,noreferrer');
      return;
    }

    const lines = completedBoxes
      .map((box, idx) => {
        const packLabel = summarizeBoxCookies(box.cookies);
        return `- ${box.quantity}x *${BOX_DELULU_CONFIG.name} #${idx + 1}* (${packLabel})`;
        /* Precio de Caja Delulu comentado temporalmente:
        return `- ${box.quantity}x *${BOX_DELULU_CONFIG.name} #${idx + 1}* (${packLabel}) — ${formatDualPrice(
          BOX_DELULU_CONFIG.priceUsd * box.quantity,
          bcvRate
        )}`;
        */
      })
      .join('\n');

    const msgParts = [
      `¡Hola *${ENV_CONFIG.brandName}*!`,
      `Nuevo pedido desde *Crear pedido*:`,
      ``,
      lines,
      ``,
      /* Totales comentados temporalmente junto al precio de Caja Delulu:
      `*Total en Dólares:* ${formatCookiePrice(totalUsdAmount, 'USD', bcvRate)}`,
      `*Total en Bolívares (BCV Bs. ${bcvRate.toFixed(2)}):* ${formatCookiePrice(
        totalUsdAmount,
        'VES',
        bcvRate
      )}`,
      */
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
              onClick={() => {
                if (storeStep === 'checkout') {
                  setStoreStep('browse');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  onBackToHome();
                }
              }}
            >
              {storeStep === 'checkout' ? '← Volver a pedidos' : '← Inicio'}
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
              Caja Delulu (4 galletas a escoger)
              {/* · {boxPriceFormatted} */}
            </strong>
          </div>
        </section>

        {storeStep === 'browse' ? (
          <>
            {/* Secciones dinámicas para cada Caja Delulu (Caja #1, Caja #2, etc. visibles en pantalla) */}
            <div className="to-boxes-stack">
              {boxes.map((box, boxIdx) => {
                const isThisBoxComplete =
                  box.cookies.length === BOX_DELULU_CONFIG.size;
                const isCurrentActiveBox = boxIdx === activeBoxIndex;

                return (
                  <section
                    key={box.id}
                    className={`to-box-builder ${
                      isThisBoxComplete ? 'is-complete' : ''
                    } ${isCurrentActiveBox ? 'is-active' : ''}`}
                    aria-label={`Armador de ${BOX_DELULU_CONFIG.name} ${boxIdx + 1}`}
                  >
                    <div className="to-box-builder-head">
                      <div>
                        <span className="to-k">
                          {isThisBoxComplete
                            ? `Caja #${boxIdx + 1} armada`
                            : `Armando Caja #${boxIdx + 1}`}
                        </span>
                        <h3>
                          {BOX_DELULU_CONFIG.name} #{boxIdx + 1}
                          {/* · {boxPriceFormatted} */}
                        </h3>
                        <p>
                          Elige 4 galletas del menú para armar tu caja (
                          {box.cookies.length}/{BOX_DELULU_CONFIG.size}{' '}
                          seleccionadas)
                        </p>
                      </div>

                      <div className="to-box-builder-actions">
                        {box.cookies.length > 0 && (
                          <button
                            type="button"
                            className="to-more"
                            onClick={() => handleResetBox(box.id)}
                          >
                            Reiniciar caja
                          </button>
                        )}
                        {boxes.length > 1 && (
                          <button
                            type="button"
                            className="to-more to-remove-box-link"
                            onClick={() => handleRemoveBoxSection(box.id)}
                          >
                            Eliminar caja
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="to-box-slots">
                      {Array.from({ length: BOX_DELULU_CONFIG.size }).map(
                        (_, slotIdx) => {
                          const chosen = box.cookies[slotIdx];
                          return (
                            <div
                              key={slotIdx}
                              className={`to-box-slot ${chosen ? 'filled' : ''}`}
                            >
                              {chosen ? (
                                <>
                                  <span>
                                    {slotIdx + 1}. {chosen.name}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveCookieFromBox(
                                        box.id,
                                        chosen.id,
                                        slotIdx
                                      )
                                    }
                                    aria-label={`Quitar ${chosen.name} de la caja ${boxIdx + 1}`}
                                  >
                                    ×
                                  </button>
                                </>
                              ) : (
                                <span>
                                  Espacio {slotIdx + 1} · Elige una galleta
                                </span>
                              )}
                            </div>
                          );
                        }
                      )}
                    </div>
                  </section>
                );
              })}
            </div>

            {/* Chips de navegación rápida .to-chips */}
            <nav className="to-chips" aria-label="Sections">
              {TAKEOUT_STORE_SECTIONS.map((sec) => (
                <a key={sec.id} href={`#store-${sec.id}`}>
                  {sec.title}
                </a>
              ))}
            </nav>

            {/* Secciones con cuadrícula .to-tiles (para añadir galletas a la caja activa) */}
            {TAKEOUT_STORE_SECTIONS.map((sec) => (
              <section key={sec.id} id={`store-${sec.id}`} className="to-sec">
                <h2>{sec.title}</h2>

                {sec.tiles && sec.tiles.length > 0 && (
                  <ul className="to-tiles">
                    {sec.tiles.map((item) => {
                      const countInActive = getCountInActiveBox(item.id);
                      const currentActiveCount = activeBox
                        ? activeBox.cookies.length
                        : BOX_DELULU_CONFIG.size;
                      const currentBoxNumber =
                        activeBoxIndex !== -1 ? activeBoxIndex + 1 : boxes.length;

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
                            {countInActive > 0 && (
                              <span>
                                {countInActive} en Caja #{currentBoxNumber}
                              </span>
                            )}
                          </div>
                          {item.desc && <div className="to-tag">{item.desc}</div>}

                          <button
                            type="button"
                            className="to-add"
                            disabled={isAllBoxesFull}
                            onClick={() => handleAddCookieToActiveBox(item)}
                          >
                            {isAllBoxesFull
                              ? `Caja #${boxes.length} completa (4/4)`
                              : `+ Añadir a Caja #${currentBoxNumber} (${currentActiveCount}/${BOX_DELULU_CONFIG.size})`}
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
             PASO DE REVISIÓN Y ENVÍO A WHATSAPP (.to-cart / .to-form)
             ================================================================== */
          <section className="to-sec to-cart">
            <h2>Tu Pedido</h2>
            <p className="to-sub">Revisa tu pedido y envía directo a WhatsApp</p>

            <div className="to-box" style={{ marginTop: '14px' }}>
              {completedBoxes.length === 0 ? (
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
                  {completedBoxes.map((box, idx) => {
                    const packLabel = summarizeBoxCookies(box.cookies);
                    return (
                      <li key={box.id}>
                        <div>
                          <b>
                            {BOX_DELULU_CONFIG.name} #{idx + 1}
                          </b>
                          <span>
                            {packLabel}
                            {/* Precio de la Caja Delulu comentado temporalmente:
                            {' · '}
                            {formatCookiePrice(
                              BOX_DELULU_CONFIG.priceUsd * box.quantity,
                              currencyMode,
                              bcvRate
                            )}
                            */}
                          </span>
                        </div>
                        {/* Únicamente en esta sección de revisión está permitido duplicar cada caja */}
                        <div className="to-qty sm">
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateBoxQtyInCheckout(
                                box.id,
                                box.quantity - 1
                              )
                            }
                            aria-label={`Reducir cantidad de ${BOX_DELULU_CONFIG.name} #${idx + 1}`}
                          >
                            −
                          </button>
                          <span>{box.quantity}</span>
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateBoxQtyInCheckout(
                                box.id,
                                box.quantity + 1
                              )
                            }
                            aria-label={`Duplicar ${BOX_DELULU_CONFIG.name} #${idx + 1}`}
                          >
                            +
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              <button
                type="button"
                className="to-more"
                onClick={handleBuildAnotherBox}
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

              {/* Resumen de precios de Caja Delulu comentado temporalmente:
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
              */}

              {completedBoxes.length > 0 && (
                <button
                  type="button"
                  className="to-notip"
                  onClick={handleClearAllBoxes}
                >
                  Vaciar mi orden actual
                </button>
              )}
            </form>
          </section>
        )}
      </div>

      {/* Footer flotante (.to-bar):
          En 'browse' muestra los dos botones flotantes: "Cerrar pedido (X cajas)" y "Armar otra caja".
          En 'checkout' muestra el botón para enviar el pedido por WhatsApp. */}
      {totalCompletedBoxesCount > 0 && (
        <div className="to-bar">
          {storeStep === 'browse' ? (
            <div className="to-bar-floating-pair">
              <button
                type="button"
                className="to-bar-btn to-bar-close-order"
                onClick={handleProceedToCheckout}
              >
                <span>
                  Cerrar pedido ({totalCompletedBoxesCount}{' '}
                  {totalCompletedBoxesCount === 1 ? 'caja' : 'cajas'})
                </span>
                {/* <span>{formatCookiePrice(totalUsdAmount, currencyMode, bcvRate)}</span> */}
              </button>

              <button
                type="button"
                className="to-bar-btn to-bar-another-box"
                onClick={handleBuildAnotherBox}
              >
                <span>Armar otra caja</span>
              </button>
            </div>
          ) : (
            <div className="to-bar-inner">
              <button
                type="button"
                className="to-bar-main"
                onClick={() =>
                  handleSendWhatsAppCheckout({ preventDefault: () => {} })
                }
              >
                <span>
                  Enviar por WhatsApp ({totalCompletedBoxesCount}{' '}
                  {totalCompletedBoxesCount === 1 ? 'caja' : 'cajas'})
                </span>
                <span>
                  {/* {formatCookiePrice(totalUsdAmount, currencyMode, bcvRate)} */} →
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal / Bottom Sheet para elegir los 4 sabores de la Caja Delulu activa */}
      {activeSheetItem && activeBox && (
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
              <h3>
                {BOX_DELULU_CONFIG.name} #
                {activeBoxIndex !== -1 ? activeBoxIndex + 1 : boxes.length}
              </h3>
              {/* <span>{boxPriceFormatted}</span> */}
            </div>

            <p className="to-desc">{activeSheetItem.desc}</p>
            <p className="to-fresh">
              Selecciona 4 galletas variadas para tu caja (
              {activeBox.cookies.length}/{BOX_DELULU_CONFIG.size})
            </p>

            <fieldset className="to-group">
              <legend>
                <span>Elige tus 4 galletas</span>
                <i className="req">
                  {activeBox.cookies.length}/{BOX_DELULU_CONFIG.size}{' '}
                  seleccionadas
                </i>
              </legend>

              {ALL_STORE_COOKIES.map((cookie) => {
                const count = getCountInActiveBox(cookie.id);
                const isFull =
                  activeBox.cookies.length >= BOX_DELULU_CONFIG.size;

                return (
                  <div key={cookie.id} className="to-opt">
                    <span>{cookie.name}</span>
                    <div className="to-qty sm">
                      <button
                        type="button"
                        disabled={count === 0}
                        onClick={() =>
                          handleRemoveCookieFromBox(activeBox.id, cookie.id)
                        }
                      >
                        −
                      </button>
                      <span>{count}</span>
                      <button
                        type="button"
                        disabled={isFull}
                        onClick={() => handleAddCookieToActiveBox(cookie)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </fieldset>

            <div className="to-sheetbar">
              {activeBox.cookies.length === BOX_DELULU_CONFIG.size ? (
                <div className="to-bar-floating-pair">
                  <button
                    type="button"
                    className="to-bar-btn to-bar-close-order"
                    onClick={handleProceedToCheckout}
                  >
                    <span>
                      Cerrar pedido ({totalCompletedBoxesCount}{' '}
                      {totalCompletedBoxesCount === 1 ? 'caja' : 'cajas'})
                    </span>
                  </button>

                  <button
                    type="button"
                    className="to-bar-btn to-bar-another-box"
                    onClick={handleBuildAnotherBox}
                  >
                    <span>Armar otra caja</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="to-go"
                  onClick={() => setActiveSheetItem(null)}
                >
                  <span>
                    Elige{' '}
                    {BOX_DELULU_CONFIG.size - activeBox.cookies.length}{' '}
                    {BOX_DELULU_CONFIG.size - activeBox.cookies.length === 1
                      ? 'galleta más'
                      : 'galletas más'}
                  </span>
                  <span>
                    {activeBox.cookies.length}/{BOX_DELULU_CONFIG.size}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
