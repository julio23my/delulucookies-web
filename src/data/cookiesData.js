// Configuración centralizada leída desde el archivo .env (delulucookies · Venezuela)
export const ENV_CONFIG = {
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '584242107505',
  whatsappDefaultMessage:
    import.meta.env.VITE_WHATSAPP_DEFAULT_MESSAGE ||
    '¡Hola delulucookies! Me gustaría hacer un pedido de galletas recién horneadas.',
  brandName: import.meta.env.VITE_BRAND_NAME || 'delulucookies',
  brandTagline:
    import.meta.env.VITE_BRAND_TAGLINE ||
    'Delulu es una línea de galletas artesanales gorditas y absolutamente deliciosas, que nacen como reinterpretación de las famosas galletas de la ciudad de Nueva York.',
  brandHandle: import.meta.env.VITE_BRAND_HANDLE || '@delulucookies.ve',
  brandLocation:
    import.meta.env.VITE_BRAND_LOCATION ||
    'repostería de autor · san antonio de los altos',
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
  loopVideoUrl: import.meta.env.VITE_LOOP_VIDEO_URL || '/images/delulu-video.mp4',
};

// Configuración única de Caja Delulu (4 galletas variadas a escoger por $15)
export const BOX_DELULU_CONFIG = {
  id: 'caja-delulu',
  name: 'Caja Delulu',
  desc: '4 galletas a escoger del menú',
  size: 4,
  priceUsd: 15,
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
  return Number.isInteger(numUsd) ? `$${numUsd}` : `$${numUsd.toFixed(2)}`;
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
// Sin precios individuales en cada galleta; 3ra sección "Presentación" con Caja Delulu ($15)
// ============================================================================
export const HOME_MENU_COOKIES = {
  blurb: 'Galletas Artesanales Estilo NYC',
  sections: [
    {
      title: 'Galletas NYC Clásicas',
      items: [
        {
          id: 'choco-chip',
          name: 'Choco Chip',
          image: '/images/cookie-classic.jpg',
          desc: 'Galleta de beurre noisette, chips de chocolate, chips de chocolate blanco y sal marina.',
        },
        {
          id: 'navidena',
          name: 'Navideña',
          image: '/images/hero-cookies.jpg',
          desc: 'Galleta de canela, jengibre, nuez moscada, chips de chocolate blanco, y sal marina.',
        },
        {
          id: 'cookies-and-cream',
          name: 'Cookies & Cream',
          image: '/images/cookie-classic.jpg',
          desc: 'Galleta de Oreo, chips de chocolate, y chips de chocolate blanco.',
        },
        {
          id: 'caramelo-salado',
          name: 'Caramelo Salado',
          image: '/images/delulu-visit.jpeg',
          desc: 'Galleta de chips de chocolate, trozos de caramelo salado, y sal marina.',
        },
      ],
    },
    {
      title: 'Galletas NYC Rellenas',
      items: [
        {
          id: 'almendras',
          name: 'Almendras',
          image: '/images/cookie-box.jpg',
          desc: 'Galleta de almendras, rellena de suave frangipane, y almendras fileteadas.',
        },
        {
          id: 'choco-mani',
          name: 'Choco Maní',
          image: '/images/hero-cookies.jpg',
          desc: 'Galleta de chocolate, chips de chocolate, rellena de mantequilla de maní, y sal marina.',
        },
        {
          id: 'pistacho',
          name: 'Pistacho',
          image: '/images/cookie-pistachio.jpg',
          desc: 'Galleta de pistacho, chips de chocolate blanco, rellena de crema de pistacho, y sal marina.',
        },
        {
          id: 'choco-avellana',
          name: 'Choco Avellana',
          image: '/images/cookie-classic.jpg',
          desc: 'Galleta de chips de chocolate, rellena de crema de avellanas, y sal marina.',
        },
      ],
    },
    {
      title: 'Presentación',
      items: [
        {
          id: 'caja-delulu',
          name: 'Caja Delulu',
          desc: '4 galletas a escoger del menú',
          priceUsd: 15,
          showPrice: true,
        },
      ],
    },
  ],
};

// ============================================================================
// OPCIONES EXCLUSIVAS PARA EL MODAL DE REDIRECCIÓN (Sección "Galletas estilo NYC")
// ============================================================================
export const LINKHUB_FEATURED_COOKIES = [
  {
    id: 'choco-chip',
    name: 'Choco chip',
    image: '/images/cookie-classic.jpg',
  },
  {
    id: 'navidena',
    name: 'Navideña',
    image: '/images/hero-cookies.jpg',
  },
  {
    id: 'pistacho',
    name: 'Pistacho',
    image: '/images/cookie-pistachio.jpg',
  },
  {
    id: 'choco-avellana',
    name: 'Avellana',
    image: '/images/cookie-classic.jpg',
  },
];

// ============================================================================
// LISTA DE 18 INGREDIENTES ("Ingredientes queridos" — Inspiración Lavoratti)
// ============================================================================
export const INGREDIENTS_LIST = [
  { id: 'beurre-noisette', name: 'Beurre Noisette' },
  { id: 'sal-marina', name: 'Sal Marina' },
  { id: 'vainilla', name: 'Vainilla' },
  { id: 'caramelo-salado', name: 'Caramelo Salado' },
  { id: 'frangipane', name: 'Frangipane' },
  { id: 'almendras', name: 'Almendras' },
  { id: 'pistacho', name: 'Pistacho' },
  { id: 'avellana', name: 'Avellana' },
  { id: 'chocolate', name: 'Chocolate' },
  { id: 'chocolate-blanco', name: 'Chocolate Blanco' },
  { id: 'cacao-100', name: 'Cacao 100%' },
  { id: 'azucar-morena', name: 'Azúcar Morena' },
  { id: 'canela', name: 'Canela' },
  { id: 'jengibre', name: 'Jengibre' },
  { id: 'nuez-moscada', name: 'Nuez Moscada' },
  { id: 'gingerbread', name: 'Gingerbread' },
  { id: 'amaretto', name: 'Amaretto' },
  { id: 'mantequilla', name: 'Mantequilla' },
];

// ============================================================================
// DATOS DE LA TIENDA / CREA TU PEDIDO (Caja Delulu de 4 galletas variadas a $15)
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
        image: '/images/cookie-classic.jpg',
        desc: 'Galleta de beurre noisette, chips de chocolate, chips de chocolate blanco y sal marina.',
      },
      {
        id: 'navidena',
        name: 'Navideña',
        image: '/images/hero-cookies.jpg',
        desc: 'Galleta de canela, jengibre, nuez moscada, chips de chocolate blanco, y sal marina.',
      },
      {
        id: 'cookies-and-cream',
        name: 'Cookies & Cream',
        image: '/images/cookie-classic.jpg',
        desc: 'Galleta de Oreo, chips de chocolate, y chips de chocolate blanco.',
      },
      {
        id: 'caramelo-salado',
        name: 'Caramelo Salado',
        image: '/images/delulu-visit.jpeg',
        desc: 'Galleta de chips de chocolate, trozos de caramelo salado, y sal marina.',
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
        image: '/images/cookie-box.jpg',
        desc: 'Galleta de almendras, rellena de suave frangipane, y almendras fileteadas.',
      },
      {
        id: 'choco-mani',
        name: 'Choco Maní',
        image: '/images/hero-cookies.jpg',
        desc: 'Galleta de chocolate, chips de chocolate, rellena de mantequilla de maní, y sal marina.',
      },
      {
        id: 'pistacho',
        name: 'Pistacho',
        image: '/images/cookie-pistachio.jpg',
        desc: 'Galleta de pistacho, chips de chocolate blanco, rellena de crema de pistacho, y sal marina.',
      },
      {
        id: 'choco-avellana',
        name: 'Choco Avellana',
        image: '/images/cookie-classic.jpg',
        desc: 'Galleta de chips de chocolate, rellena de crema de avellanas, y sal marina.',
      },
    ],
    rows: [],
  },
];
