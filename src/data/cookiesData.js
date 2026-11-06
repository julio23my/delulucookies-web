// Configuración centralizada leída desde el archivo .env (delulucookies · Venezuela)
export const ENV_CONFIG = {
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '584121234567',
  whatsappDefaultMessage:
    import.meta.env.VITE_WHATSAPP_DEFAULT_MESSAGE ||
    '¡Hola delulucookies! Me gustaría hacer un pedido de galletas recién horneadas.',
  brandName: import.meta.env.VITE_BRAND_NAME || 'delulucookies',
  brandTagline:
    import.meta.env.VITE_BRAND_TAGLINE ||
    'Un rincón íntimo de galletas artesanales horneadas a diario en pequeños lotes con mantequilla avellana y cacao venezolano de origen.',
  brandHandle: import.meta.env.VITE_BRAND_HANDLE || '@delulucookies',
  brandLocation:
    import.meta.env.VITE_BRAND_LOCATION ||
    'Caracas, Venezuela · Delivery y Takeout',
  instagramUrl: import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com/delulucookies',
  tiktokUrl: import.meta.env.VITE_TIKTOK_URL || 'https://tiktok.com/@delulucookies',
  mapsUrl: import.meta.env.VITE_MAPS_URL || 'https://maps.google.com',
  currencySymbol: import.meta.env.VITE_CURRENCY_SYMBOL || '$',
  bcvApiUrl:
    import.meta.env.VITE_BCV_API_URL || 'https://ve.dolarapi.com/v1/dolares/oficial',
  bcvFallbackRate: Number(import.meta.env.VITE_BCV_FALLBACK_RATE) || 893.22,
  loopVideoUrl: import.meta.env.VITE_LOOP_VIDEO_URL || '',
};

/**
 * Formatea un monto en USD hacia Dólares ($ USD) o Bolívares a tasa BCV (Bs.)
 */
export function formatCookiePrice(
  amountUsd,
  currencyMode = 'USD',
  bcvRate = ENV_CONFIG.bcvFallbackRate
) {
  const numUsd = Number(amountUsd) || 0;
  if (currencyMode === 'VES') {
    const amountVes = numUsd * (Number(bcvRate) || ENV_CONFIG.bcvFallbackRate);
    return `Bs. ${amountVes.toLocaleString('es-VE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `$${numUsd.toFixed(2)}`;
}

/**
 * Devuelve ambas representaciones ($ USD y Bs. BCV) para los mensajes de WhatsApp
 */
export function formatDualPrice(amountUsd, bcvRate = ENV_CONFIG.bcvFallbackRate) {
  const usdStr = formatCookiePrice(amountUsd, 'USD', bcvRate);
  const vesStr = formatCookiePrice(amountUsd, 'VES', bcvRate);
  return `${usdStr} (${vesStr} BCV)`;
}

/**
 * Construye el enlace oficial de WhatsApp (api.whatsapp.com/send) con codificación UTF-8 limpia
 */
export function buildWhatsAppUrl(customMessage) {
  const cleanPhone = String(ENV_CONFIG.whatsappNumber).replace(/[^\d]/g, '');
  const rawMessage = customMessage || ENV_CONFIG.whatsappDefaultMessage;
  const normalizedMessage = String(rawMessage).normalize('NFC');
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(
    normalizedMessage
  )}`;
}

/**
 * Evalúa si la tienda está Abierta (Open) o Cerrada (Closed) según el horario de Venezuela (UTC-4)
 */
export function getStoreOpenStatus() {
  try {
    const now = new Date();
    const caracasTimeStr = now.toLocaleString('en-US', {
      timeZone: 'America/Caracas',
    });
    const caracasDate = new Date(caracasTimeStr);
    const day = caracasDate.getDay();
    const hour = caracasDate.getHours();

    const isOpen = hour >= 8 && hour < 21 && day !== 1;
    return {
      isOpen,
      label: isOpen ? 'Open daily 8 AM–9 PM' : 'Closed · Opens 8 AM',
    };
  } catch {
    return {
      isOpen: true,
      label: 'Open daily 8 AM–9 PM',
    };
  }
}

// ============================================================================
// DATOS DEL MENÚ PRINCIPAL (#menu en la Home de delulucookies)
// ============================================================================
export const HOME_MENU_COOKIES = {
  blurb:
    'Galletas artesanales con masa reposada 48 horas, mantequilla avellana, cacao venezolano Chuao 70% y centros cremosos.',
  sections: [
    {
      title: 'Signature Cookies',
      sub: 'Masa dorada con mantequilla avellana francesa y escamas de sal marina de Araya',
      items: [
        {
          id: 'chuao-sea-salt',
          name: 'Chuao 70% & Araya Sea Salt',
          tag: 'Bestseller',
          priceUsd: 3.5,
          desc: 'Trozos fundentes de chocolate oscuro venezolano Chuao 70%, mantequilla avellana tostada y flor de sal marina.',
        },
        {
          id: 'sunday-espresso-pecan',
          name: 'Roasted Espresso & Gianduja',
          tag: 'Fresh',
          priceUsd: 3.8,
          desc: 'Infusionada con café de especialidad venezolano recién molido, chocolate con leche avellanado y nueces pecanas tostadas.',
        },
        {
          id: 'glazed-vanilla-milk',
          name: 'Toasted Milk & Vanilla Glaze',
          tag: 'Limited',
          priceUsd: 4.0,
          desc: 'Corteza crujiente con leche tostada en polvo, glaseado translúcido de vainilla en rama y corazón de caramelo salado.',
        },
      ],
    },
    {
      title: 'Stuffed & Creamy Center',
      sub: 'Rellenas a mano antes de hornear para lograr un centro líquido y tibio',
      items: [
        {
          id: 'matcha-pistachio-cream',
          name: 'Uji Matcha & Sicilian Pistachio',
          tag: 'Chef Favorite',
          priceUsd: 4.5,
          desc: 'Masa de té verde ceremonial de Uji rellena con crema tibia de pistacho tostado y trozos de chocolate blanco caramelizado.',
        },
        {
          id: 'berry-mascarpone-toast',
          name: 'Berry Compote & Mascarpone',
          tag: 'New',
          priceUsd: 4.2,
          desc: 'Galleta dorada rellena de crema batida de mascarpone y reducción artesanal de frambuesas y frutos rojos.',
        },
        {
          id: 'hazelnut-praline-core',
          name: 'Dark Cocoa & Hazelnut Praline',
          tag: 'Rich',
          priceUsd: 4.4,
          desc: 'Galleta doble cacao oscuro 70% con corazón fundente de praliné artesanal de avellanas tostadas.',
        },
      ],
    },
    {
      title: 'Cookie Add-ons & Extras',
      items: [
        {
          id: 'addon-pistachio-dip',
          name: 'Extra Vasito de Crema de Pistacho',
          tag: 'GF',
          priceUsd: 1.5,
        },
        {
          id: 'addon-chuao-fudge',
          name: 'Extra Fudge Caliente de Cacao Chuao 70%',
          tag: 'GF',
          priceUsd: 1.2,
        },
        {
          id: 'addon-ice-cream',
          name: 'Scoop de Helado de Vainilla para acompañar',
          priceUsd: 2.0,
        },
        {
          id: 'addon-gift-card',
          name: 'Tarjeta Caligrafiada para Regalo',
          priceUsd: 0.5,
        },
      ],
    },
  ],
};

export const HOME_MENU_BOXES_DRINKS = {
  blurb:
    'Cofres de regalo envueltos en papel crema con cinta y bebidas artesanales para acompañar tus galletas.',
  sections: [
    {
      title: 'Takeout & Gift Boxes',
      sub: 'delulucookies · Empaque de colección con guía de calentamiento',
      items: [
        {
          id: 'takeout-box-4',
          name: 'The Petit Takeout Box (4 Galletas)',
          priceUsd: 13.5,
          desc: 'Caja degustación con 4 galletas de autor a tu elección, lista para llevar o enviar de regalo.',
        },
        {
          id: 'takeout-box-6',
          name: 'The Classic Assortment Box (6 Galletas)',
          priceUsd: 19.5,
          desc: 'Nuestras 6 recetas insignia recién salidas del horno en cofre rígido con listón y tarjeta.',
        },
        {
          id: 'takeout-box-12',
          name: 'Gran Cofre Editorial (12 Galletas)',
          priceUsd: 36.0,
          desc: '12 galletas de autor surtidas horneadas el mismo día. Ideal para compartir, eventos o regalos especiales.',
        },
        {
          id: 'cold-brew-pairing',
          name: 'Cookie & Cold Brew Takeout Duo',
          priceUsd: 7.5,
          desc: '2 galletas recién horneadas a elección + 1 Cold Brew de café venezolano o Matcha Latte.',
        },
      ],
    },
  ],
  gridSections: [
    {
      title: 'Coffee & Matcha',
      sub: 'Preparados al momento para acompañar tu galleta tibia',
      lines: [
        { name: 'Espresso Venezolano', small: 'doble shot', priceUsd: 2.0 },
        { name: 'Cortado / Macchiato', small: 'leche entera o avena', priceUsd: 2.8 },
        { name: 'Cold Brew Slow-Dripped', small: 'botella 10 oz', priceUsd: 3.5 },
        { name: 'Ceremonial Matcha Latte', small: 'hot / iced', priceUsd: 4.2 },
        { name: 'Hojicha Roasted Latte', small: 'hot / iced', priceUsd: 4.0 },
        { name: 'Vaso de Leche Fría de Almendras', small: '8 oz', priceUsd: 2.5 },
      ],
    },
  ],
};

// ============================================================================
// DATOS DE LA TIENDA / ORDER TAKEOUT (delulucookies store)
// ============================================================================
export const TAKEOUT_STORE_SECTIONS = [
  {
    id: 'signature',
    title: 'Signature Cookies',
    kind: 'cookies',
    sub: 'Masa reposada 48 horas con mantequilla avellana y cacao venezolano Chuao 70%',
    tiles: [
      {
        id: 'chuao-sea-salt',
        name: 'Chuao 70% & Araya Sea Salt',
        priceUsd: 3.5,
        tag: 'Bestseller',
        image: '/images/cookie-classic.jpg',
        desc: 'Trozos fundentes de chocolate oscuro venezolano Chuao 70%, mantequilla avellana tostada y flor de sal marina de Araya.',
        packs: [
          { id: 'single', name: 'Individual (1 Galleta)', extraUsd: 0 },
          { id: 'box4', name: 'Caja de 4 Galletas (-8%)', extraUsd: 9.38 },
          { id: 'box6', name: 'Caja de 6 Galletas (-12%)', extraUsd: 14.98 },
        ],
      },
      {
        id: 'sunday-espresso-pecan',
        name: 'Roasted Espresso & Gianduja',
        priceUsd: 3.8,
        tag: 'Fresh',
        image: '/images/hero-cookies.jpg',
        desc: 'Infusionada con café de especialidad venezolano recién molido, chocolate con leche avellanado y nueces pecanas tostadas.',
        packs: [
          { id: 'single', name: 'Individual (1 Galleta)', extraUsd: 0 },
          { id: 'box4', name: 'Caja de 4 Galletas (-8%)', extraUsd: 10.18 },
          { id: 'box6', name: 'Caja de 6 Galletas (-12%)', extraUsd: 16.26 },
        ],
      },
      {
        id: 'glazed-vanilla-milk',
        name: 'Toasted Milk & Vanilla Glaze',
        priceUsd: 4.0,
        tag: 'Limited',
        image: '/images/cookie-classic.jpg',
        desc: 'Corteza crujiente con leche tostada en polvo, glaseado translúcido de vainilla en rama y corazón de caramelo salado.',
        packs: [
          { id: 'single', name: 'Individual (1 Galleta)', extraUsd: 0 },
          { id: 'box4', name: 'Caja de 4 Galletas (-8%)', extraUsd: 10.72 },
          { id: 'box6', name: 'Caja de 6 Galletas (-12%)', extraUsd: 17.12 },
        ],
      },
    ],
    rows: [],
  },
  {
    id: 'stuffed',
    title: 'Cream & Stuffed',
    kind: 'cookies',
    sub: 'Galletas rellenas con corazón cremoso y fundente',
    tiles: [
      {
        id: 'matcha-pistachio-cream',
        name: 'Uji Matcha & Sicilian Pistachio',
        priceUsd: 4.5,
        tag: 'Chef Favorite',
        image: '/images/cookie-pistachio.jpg',
        desc: 'Masa de té verde ceremonial de Uji rellena con crema tibia de pistacho tostado y chocolate blanco caramelizado.',
        packs: [
          { id: 'single', name: 'Individual (1 Galleta)', extraUsd: 0 },
          { id: 'box4', name: 'Caja de 4 Galletas (-8%)', extraUsd: 12.06 },
          { id: 'box6', name: 'Caja de 6 Galletas (-12%)', extraUsd: 19.26 },
        ],
      },
      {
        id: 'berry-mascarpone-toast',
        name: 'Berry Compote & Mascarpone',
        priceUsd: 4.2,
        tag: 'New',
        image: '/images/cookie-pistachio.jpg',
        desc: 'Galleta dorada rellena de crema batida de mascarpone y reducción artesanal de frambuesas silvestres.',
        packs: [
          { id: 'single', name: 'Individual (1 Galleta)', extraUsd: 0 },
          { id: 'box4', name: 'Caja de 4 Galletas (-8%)', extraUsd: 11.26 },
          { id: 'box6', name: 'Caja de 6 Galletas (-12%)', extraUsd: 17.98 },
        ],
      },
      {
        id: 'hazelnut-praline-core',
        name: 'Dark Cocoa & Hazelnut Praline',
        priceUsd: 4.4,
        tag: 'Rich',
        image: '/images/hero-cookies.jpg',
        desc: 'Galleta doble cacao oscuro 70% con corazón fundente de praliné artesanal de avellanas tostadas.',
        packs: [
          { id: 'single', name: 'Individual (1 Galleta)', extraUsd: 0 },
          { id: 'box4', name: 'Caja de 4 Galletas (-8%)', extraUsd: 11.79 },
          { id: 'box6', name: 'Caja de 6 Galletas (-12%)', extraUsd: 18.83 },
        ],
      },
    ],
    rows: [],
  },
  {
    id: 'addons',
    title: 'Dips & Add-ons',
    kind: 'cookies',
    tiles: [],
    rows: [
      {
        id: 'addon-pistachio-dip',
        name: 'Extra Vasito de Crema de Pistacho',
        tag: 'GF',
        priceUsd: 1.5,
      },
      {
        id: 'addon-chuao-fudge',
        name: 'Extra Fudge Caliente de Cacao Chuao 70%',
        tag: 'GF',
        priceUsd: 1.2,
      },
      {
        id: 'addon-ice-cream',
        name: 'Scoop de Helado de Vainilla Artesanal',
        priceUsd: 2.0,
      },
      {
        id: 'addon-gift-card',
        name: 'Tarjeta Caligrafiada con Dedicatoria',
        tag: 'Envolver para regalo',
        priceUsd: 0.5,
      },
    ],
  },
  {
    id: 'boxes',
    title: 'Takeout Gift Boxes',
    kind: 'boxes',
    sub: 'Cajas listas para llevar, compartir o enviar como regalo en Caracas',
    tiles: [
      {
        id: 'takeout-box-4',
        name: 'The Petit Takeout Box (4 Cookies)',
        priceUsd: 13.5,
        tag: '4 Piezas Surtidas',
        image: '/images/cookie-box.jpg',
        desc: 'Caja degustación con 4 galletas de autor a tu elección envuelta en papel crema con cinta.',
      },
      {
        id: 'takeout-box-6',
        name: 'The Classic Assortment Box (6 Cookies)',
        priceUsd: 19.5,
        tag: 'Delivery Gratis CCS',
        image: '/images/cookie-box.jpg',
        desc: 'Nuestra colección completa de 6 galletas recién salidas del horno con tarjeta de notas de cata.',
      },
      {
        id: 'takeout-box-12',
        name: 'Gran Cofre Editorial (12 Cookies)',
        priceUsd: 36.0,
        tag: '12 Piezas · Eventos',
        image: '/images/cookie-box.jpg',
        desc: '12 galletas de autor horneadas el mismo día en cofre de lujo con listón.',
      },
      {
        id: 'cold-brew-pairing',
        name: 'Cookie & Cold Brew Takeout Duo',
        priceUsd: 7.5,
        tag: '2 Galletas + Bebida',
        image: '/images/hero-cookies.jpg',
        desc: 'Dos galletas recién horneadas acompañadas de nuestro Cold Brew de café venezolano o Matcha Latte.',
      },
    ],
    rows: [
      {
        id: 'drink-cold-brew',
        name: 'Cold Brew Slow-Dripped (10 oz)',
        tag: 'Café de especialidad venezolano',
        priceUsd: 3.5,
      },
      {
        id: 'drink-matcha-latte',
        name: 'Ceremonial Matcha Latte (12 oz)',
        tag: 'Hot or Iced · Leche de avena disponible',
        priceUsd: 4.2,
      },
      {
        id: 'drink-espresso',
        name: 'Cortado / Macchiato',
        tag: 'Caliente',
        priceUsd: 2.8,
      },
    ],
  },
];
