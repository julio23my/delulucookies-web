// Configuración centralizada leída desde el archivo .env (Venezuela · Estilo Davelle New York)
export const ENV_CONFIG = {
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '584121234567',
  whatsappDefaultMessage:
    import.meta.env.VITE_WHATSAPP_DEFAULT_MESSAGE ||
    '¡Hola Delulu Cookies! Me gustaría hacer un pedido de galletas recién horneadas.',
  brandName: import.meta.env.VITE_BRAND_NAME || 'delulu cookies',
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
 * Horario: Martes a Domingo, 9:00 AM a 8:00 PM
 */
export function getStoreOpenStatus() {
  try {
    const now = new Date();
    const caracasTimeStr = now.toLocaleString('en-US', {
      timeZone: 'America/Caracas',
    });
    const caracasDate = new Date(caracasTimeStr);
    const day = caracasDate.getDay(); // 0 = Domingo, 1 = Lunes, ...
    const hour = caracasDate.getHours();

    // Abierto todos los días de 8:00 AM a 9:00 PM (excepto lunes después de las 6pm si se desea)
    const isOpen = hour >= 8 && hour < 21 && day !== 1;
    return {
      isOpen,
      label: isOpen ? 'Open Now · 8am–9pm' : 'Closed · Opens 8am',
    };
  } catch {
    return {
      isOpen: true,
      label: 'Open Today · 8am–9pm',
    };
  }
}

// Presentaciones disponibles dentro del menú para cada galleta
export const PACK_OPTIONS = [
  { id: 'single', label: '1 Pieza', multiplier: 1, discount: 1 },
  { id: 'box4', label: 'Caja x4 (-8%)', multiplier: 4, discount: 0.92 },
  { id: 'box6', label: 'Caja x6 (-12%)', multiplier: 6, discount: 0.88 },
];

// Categorías para el Menu Toggle (inspirado en Davelle New York)
export const MENU_CATEGORIES = [
  { id: 'signature', label: 'Signature Cookies' },
  { id: 'stuffed', label: 'Cream & Stuffed' },
  { id: 'boxes', label: 'Takeout Boxes & Pairing' },
];

// Menú de galletas para el Menu Toggle
export const COOKIES_CATALOG = [
  {
    id: 'chuao-sea-salt',
    category: 'signature',
    name: 'Chuao 70% & Araya Sea Salt',
    basePrice: 3.5,
    image: '/images/cookie-classic.jpg',
    description:
      'Masa reposada 48 horas con mantequilla avellana dorada, trozos fundentes de chocolate oscuro venezolano Chuao 70% y escamas de sal de Araya.',
    notes: ['Cacao Chuao 70%', 'Brown Butter', 'Sal Marina'],
  },
  {
    id: 'sunday-espresso-pecan',
    category: 'signature',
    name: 'Roasted Espresso & Gianduja',
    basePrice: 3.8,
    image: '/images/hero-cookies.jpg',
    description:
      'Infusionada con café de especialidad venezolano recién molido, chocolate con leche avellanado y nueces pecanas tostadas al horno.',
    notes: ['Espresso Venezolano', 'Gianduja', 'Nuez Pecana'],
  },
  {
    id: 'glazed-vanilla-milk',
    category: 'signature',
    name: 'Toasted Milk & Vanilla Glaze',
    basePrice: 4.0,
    image: '/images/cookie-classic.jpg',
    description:
      'Corteza crujiente con leche tostada en polvo, glaseado translúcido de vainilla en rama y centro suave de caramelo salado.',
    notes: ['Leche Tostada', 'Vainilla Natural', 'Caramelo'],
  },
  {
    id: 'matcha-pistachio-cream',
    category: 'stuffed',
    name: 'Uji Matcha & Sicilian Pistachio',
    basePrice: 4.5,
    image: '/images/cookie-pistachio.jpg',
    description:
      'Nuestra galleta insignia inspirada en Davelle: masa de té verde ceremonial de Uji rellena con crema tibia de pistacho tostado y chocolate blanco.',
    notes: ['Matcha Ceremonial', 'Crema de Pistacho', 'Bestseller'],
  },
  {
    id: 'berry-mascarpone-toast',
    category: 'stuffed',
    name: 'Berry Compote & Mascarpone',
    basePrice: 4.2,
    image: '/images/cookie-pistachio.jpg',
    description:
      'Inspirada en los famosos toasts de Nueva York: galleta tibia rellena de crema de mascarpone batida y reducción artesanal de frutos rojos.',
    notes: ['Crema Mascarpone', 'Frambuesa Silvestre', 'Mantequilla'],
  },
  {
    id: 'hazelnut-praline-core',
    category: 'stuffed',
    name: 'Dark Cocoa & Hazelnut Praline',
    basePrice: 4.4,
    image: '/images/hero-cookies.jpg',
    description:
      'Galleta doble cacao oscuro con corazón líquido de praliné artesanal de avellanas piamontesas tostadas.',
    notes: ['Doble Cacao', 'Praliné Avellana', 'Centro Fundente'],
  },
  {
    id: 'takeout-box-4',
    category: 'boxes',
    name: 'The Petit Takeout Box (4 Cookies)',
    basePrice: 13.5,
    image: '/images/cookie-box.jpg',
    description:
      'Caja de degustación con 4 galletas de autor a tu elección, envuelta en papel crema con cinta rosa/roja lista para llevar o regalar.',
    notes: ['4 Galletas a Elección', 'Empaque Regalo', 'Takeout'],
    isFixedBox: true,
  },
  {
    id: 'takeout-box-6',
    category: 'boxes',
    name: 'Davelle Assortment Box (6 Cookies)',
    basePrice: 19.5,
    image: '/images/cookie-box.jpg',
    description:
      'Nuestra colección completa de 6 galletas recién salidas del horno con tarjeta de notas de cata y guía de calentamiento.',
    notes: ['6 Galletas de Autor', 'Delivery Gratis CCS', 'Tarjeta Incluida'],
    isFixedBox: true,
  },
  {
    id: 'cold-brew-pairing',
    category: 'boxes',
    name: 'Cookie & Cold Brew Takeout Duo',
    basePrice: 7.5,
    image: '/images/hero-cookies.jpg',
    description:
      'Dos galletas recién horneadas a elección acompañadas de nuestro Cold Brew de café venezolano embotellado o leche de avena.',
    notes: ['2 Galletas', '1 Bebida Artesanal', 'Combo Takeout'],
    isFixedBox: true,
  },
];
