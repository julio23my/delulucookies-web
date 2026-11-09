// Configuración centralizada leída desde el archivo .env (delulucookies · Venezuela)
export const ENV_CONFIG = {
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '584242107505',
  whatsappDefaultMessage:
    import.meta.env.VITE_WHATSAPP_DEFAULT_MESSAGE ||
    '¡Hola delulucookies! Me gustaría hacer un pedido de galletas recién horneadas.',
  brandName: import.meta.env.VITE_BRAND_NAME || 'delulucookies',
  brandTagline:
    import.meta.env.VITE_BRAND_TAGLINE ||
    'Somos una línea de galletas artesanales gigantes y absolutamente deliciosas inspiradas en las famosas galletas de la ciudad de Nueva York.',
  brandHandle: import.meta.env.VITE_BRAND_HANDLE || '@delulucookies.ve',
  brandLocation:
    import.meta.env.VITE_BRAND_LOCATION ||
    'obrador artesanal',
  instagramUrl:
    import.meta.env.VITE_INSTAGRAM_URL ||
    'https://www.instagram.com/delulucookies.ve/',
  tiktokUrl:
    import.meta.env.VITE_TIKTOK_URL || 'https://tiktok.com/@delulucookies.ve',
  mapsUrl: import.meta.env.VITE_MAPS_URL || 'https://maps.google.com',
  currencySymbol: import.meta.env.VITE_CURRENCY_SYMBOL || '$',
  bcvApiUrl:
    import.meta.env.VITE_BCV_API_URL || 'https://ve.dolarapi.com/v1/dolares/oficial',
  bcvFallbackRate: Number(import.meta.env.VITE_BCV_FALLBACK_RATE) || 896.12,
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
 * Evalúa si la tienda está Abierta (abierto) o Cerrada (cerrado) en horario 11 am - 6 pm (Venezuela UTC-4)
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

    const isOpen = hour >= 11 && hour < 18 && day !== 1;
    return {
      isOpen,
      label: isOpen ? 'abierto 11 am - 6 pm' : 'cerrado · 11 am - 6 pm',
    };
  } catch {
    return {
      isOpen: true,
      label: 'abierto 11 am - 6 pm',
    };
  }
}

// ============================================================================
// DATOS DEL MENÚ PRINCIPAL (#menu en la Home de delulucookies)
// ============================================================================
export const HOME_MENU_COOKIES = {
  blurb: 'Galletas estilo NYC',
  sections: [
    {
      title: 'Galletas NYC Clásicas',
      items: [
        {
          id: 'choco-chip',
          name: 'Choco Chip',
          priceUsd: 3.5,
          image: '/images/cookie-classic.jpg',
          desc: 'Galleta de beurre noisette, chips de chocolate, chips de chocolate blanco y sal marina.',
        },
        {
          id: 'navidena',
          name: 'Navideña',
          priceUsd: 3.5,
          image: '/images/hero-cookies.jpg',
          desc: 'Galleta de canela, jengibre, nuez moscada, chips de chocolate blanco, y sal marina.',
        },
        {
          id: 'cookies-and-cream',
          name: 'Cookies & Cream',
          priceUsd: 3.5,
          image: '/images/cookie-classic.jpg',
          desc: 'Galleta de Oreo, chips de chocolate, y chips de chocolate blanco.',
        },
      ],
    },
    {
      title: 'Galletas NYC Rellenas',
      items: [
        {
          id: 'almendras',
          name: 'Almendras',
          priceUsd: 4.0,
          image: '/images/cookie-box.jpg',
          desc: 'Galleta de almendras, rellena de suave frangipane, y almendras fileteadas.',
        },
        {
          id: 'choco-mani',
          name: 'Choco Maní',
          priceUsd: 4.0,
          image: '/images/hero-cookies.jpg',
          desc: 'Galleta de chocolate, chips de chocolate, rellena de mantequilla de maní, y sal marina.',
        },
        {
          id: 'pistacho',
          name: 'Pistacho',
          priceUsd: 4.0,
          image: '/images/cookie-pistachio.jpg',
          desc: 'Galleta de pistacho, chips de chocolate blanco, rellena de crema de pistacho, y sal marina.',
        },
        {
          id: 'choco-avellana',
          name: 'Choco Avellana',
          priceUsd: 4.0,
          image: '/images/cookie-classic.jpg',
          desc: 'Galleta de chips de chocolate, rellena de crema de avellanas, y sal marina.',
        },
      ],
    },
  ],
};

// ============================================================================
// DATOS DE LA TIENDA / ORDENAR AHORA (delulucookies store)
// ============================================================================
export const TAKEOUT_STORE_SECTIONS = [
  {
    id: 'clasicas',
    title: 'Galletas NYC Clásicas',
    kind: 'cookies',
    tiles: [
      {
        id: 'choco-chip',
        name: 'Choco Chip',
        priceUsd: 3.5,
        image: '/images/cookie-classic.jpg',
        desc: 'Galleta de beurre noisette, chips de chocolate, chips de chocolate blanco y sal marina.',
        packs: [
          { id: 'single', name: 'Individual (1 Galleta)', extraUsd: 0 },
          { id: 'box4', name: 'Caja de 4 Galletas', extraUsd: 10.5 },
          { id: 'box6', name: 'Caja de 6 Galletas', extraUsd: 17.5 },
        ],
      },
      {
        id: 'navidena',
        name: 'Navideña',
        priceUsd: 3.5,
        image: '/images/hero-cookies.jpg',
        desc: 'Galleta de canela, jengibre, nuez moscada, chips de chocolate blanco, y sal marina.',
        packs: [
          { id: 'single', name: 'Individual (1 Galleta)', extraUsd: 0 },
          { id: 'box4', name: 'Caja de 4 Galletas', extraUsd: 10.5 },
          { id: 'box6', name: 'Caja de 6 Galletas', extraUsd: 17.5 },
        ],
      },
      {
        id: 'cookies-and-cream',
        name: 'Cookies & Cream',
        priceUsd: 3.5,
        image: '/images/cookie-classic.jpg',
        desc: 'Galleta de Oreo, chips de chocolate, y chips de chocolate blanco.',
        packs: [
          { id: 'single', name: 'Individual (1 Galleta)', extraUsd: 0 },
          { id: 'box4', name: 'Caja de 4 Galletas', extraUsd: 10.5 },
          { id: 'box6', name: 'Caja de 6 Galletas', extraUsd: 17.5 },
        ],
      },
    ],
    rows: [],
  },
  {
    id: 'rellenas',
    title: 'Galletas NYC Rellenas',
    kind: 'cookies',
    tiles: [
      {
        id: 'almendras',
        name: 'Almendras',
        priceUsd: 4.0,
        image: '/images/cookie-box.jpg',
        desc: 'Galleta de almendras, rellena de suave frangipane, y almendras fileteadas.',
        packs: [
          { id: 'single', name: 'Individual (1 Galleta)', extraUsd: 0 },
          { id: 'box4', name: 'Caja de 4 Galletas', extraUsd: 12.0 },
          { id: 'box6', name: 'Caja de 6 Galletas', extraUsd: 20.0 },
        ],
      },
      {
        id: 'choco-mani',
        name: 'Choco Maní',
        priceUsd: 4.0,
        image: '/images/hero-cookies.jpg',
        desc: 'Galleta de chocolate, chips de chocolate, rellena de mantequilla de maní, y sal marina.',
        packs: [
          { id: 'single', name: 'Individual (1 Galleta)', extraUsd: 0 },
          { id: 'box4', name: 'Caja de 4 Galletas', extraUsd: 12.0 },
          { id: 'box6', name: 'Caja de 6 Galletas', extraUsd: 20.0 },
        ],
      },
      {
        id: 'pistacho',
        name: 'Pistacho',
        priceUsd: 4.0,
        image: '/images/cookie-pistachio.jpg',
        desc: 'Galleta de pistacho, chips de chocolate blanco, rellena de crema de pistacho, y sal marina.',
        packs: [
          { id: 'single', name: 'Individual (1 Galleta)', extraUsd: 0 },
          { id: 'box4', name: 'Caja de 4 Galletas', extraUsd: 12.0 },
          { id: 'box6', name: 'Caja de 6 Galletas', extraUsd: 20.0 },
        ],
      },
      {
        id: 'choco-avellana',
        name: 'Choco Avellana',
        priceUsd: 4.0,
        image: '/images/cookie-classic.jpg',
        desc: 'Galleta de chips de chocolate, rellena de crema de avellanas, y sal marina.',
        packs: [
          { id: 'single', name: 'Individual (1 Galleta)', extraUsd: 0 },
          { id: 'box4', name: 'Caja de 4 Galletas', extraUsd: 12.0 },
          { id: 'box6', name: 'Caja de 6 Galletas', extraUsd: 20.0 },
        ],
      },
    ],
    rows: [],
  },
];
