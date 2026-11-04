// Configuración centralizada leída desde el archivo .env (Localizado para Venezuela)
export const ENV_CONFIG = {
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '584121234567',
  whatsappDefaultMessage:
    import.meta.env.VITE_WHATSAPP_DEFAULT_MESSAGE ||
    '¡Hola Delulu Cookies! Me gustaría hacer un pedido de galletas recién horneadas.',
  brandName: import.meta.env.VITE_BRAND_NAME || 'DELULU COOKIES',
  brandTagline:
    import.meta.env.VITE_BRAND_TAGLINE ||
    'Galletas de autor, horneadas en pequeños lotes en Venezuela con mantequilla avellana y chocolate 70% de origen venezolano.',
  brandHandle: import.meta.env.VITE_BRAND_HANDLE || '@delulucookies',
  brandLocation:
    import.meta.env.VITE_BRAND_LOCATION ||
    'Caracas, Venezuela · Delivery y Pick-up',
  instagramUrl: import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com/delulucookies',
  tiktokUrl: import.meta.env.VITE_TIKTOK_URL || 'https://tiktok.com/@delulucookies',
  mapsUrl: import.meta.env.VITE_MAPS_URL || 'https://maps.google.com',
  announcementBar:
    import.meta.env.VITE_ANNOUNCEMENT_BAR ||
    'HORNEADAS HOY EN CARACAS · PRECIOS EN USD ($) O BOLÍVARES (BS.) A TASA BCV DEL DÍA · PEDIDOS POR WHATSAPP',
  currencySymbol: import.meta.env.VITE_CURRENCY_SYMBOL || '$',
  bcvApiUrl:
    import.meta.env.VITE_BCV_API_URL || 'https://ve.dolarapi.com/v1/dolares/oficial',
  bcvFallbackRate: Number(import.meta.env.VITE_BCV_FALLBACK_RATE) || 893.22,
};

/**
 * Formatea un monto en USD hacia Dólares ($ USD) o Bolívares a tasa BCV (Bs.)
 * @param {number} amountUsd Precio base en dólares
 * @param {'USD' | 'VES'} currencyMode Moneda activa ('USD' o 'VES')
 * @param {number} bcvRate Tasa del BCV vigente (Bs. por 1 USD)
 */
export function formatCookiePrice(amountUsd, currencyMode = 'USD', bcvRate = ENV_CONFIG.bcvFallbackRate) {
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

// Presentaciones disponibles para cada galleta (Precios en USD pensados para Venezuela)
export const PACK_OPTIONS = [
  { id: 'single', label: '1 Galleta', multiplier: 1, discount: 1, tag: 'Individual' },
  { id: 'box4', label: 'Caja x4', multiplier: 4, discount: 0.92, tag: '-8%' },
  { id: 'box6', label: 'Caja x6', multiplier: 6, discount: 0.88, tag: 'Regalo -12%' },
];

// Catálogo de galletas de autor con precios base en USD ($) y cacao de origen venezolano
export const COOKIES_CATALOG = [
  {
    id: 'no1-fleur-cacao-chuao',
    number: 'N° 01 · EDICIÓN CLÁSICA',
    name: 'Fleur de Cacao Chuao 70%',
    category: 'chocolate',
    badge: 'Bestseller',
    weight: '145g',
    basePrice: 3.5,
    image: '/images/cookie-classic.jpg',
    description:
      'Masa reposada 48 horas con mantequilla avellana, trozos fundentes de chocolate oscuro venezolano 70% de Chuao y escamas de sal marina de Araya.',
    notes: ['Cacao Chuao 70%', 'Mantequilla Avellana', 'Sal de Araya'],
  },
  {
    id: 'no2-pistacchio-bronte',
    number: 'N° 02 · COLECCIÓN LAVORATTI',
    name: 'Pistacchio di Sicilia & Matcha',
    category: 'rellenas',
    badge: 'Favorita del Chef',
    weight: '155g',
    basePrice: 4.5,
    image: '/images/cookie-pistachio.jpg',
    description:
      'Galleta aterciopelada con té verde ceremonial, corazón cremoso de praliné de pistacho tostado y trozos de chocolate blanco caramelizado.',
    notes: ['Crema de Pistacho', 'Matcha Ceremonial', 'Chocolate Blanco'],
  },
  {
    id: 'no3-glazed-vanilla-peptide',
    number: 'N° 03 · INSPIRACIÓN RHODE',
    name: 'Brown Butter Glazed Milk',
    category: 'especiales',
    badge: 'Edición Limitada',
    weight: '140g',
    basePrice: 4.0,
    image: '/images/hero-cookies.jpg',
    description:
      'Textura suave y brillante con glaseado translúcido de vainilla natural, leche tostada en polvo y corazón de ganache de caramelo salado.',
    notes: ['Glaseado Vainilla', 'Leche Tostada', 'Caramelo Salado'],
  },
  {
    id: 'no4-sunday-espresso',
    number: 'N° 04 · RITUAL DEAR SUNDAY',
    name: 'Sunday Morning Espresso & Nuez',
    category: 'chocolate',
    badge: 'Recién Horneada',
    weight: '150g',
    basePrice: 3.8,
    image: '/images/cookie-classic.jpg',
    description:
      'Infusionada con café de especialidad venezolano recién extraído, chocolate con leche avellanado (Gianduja) y nueces pecanas tostadas.',
    notes: ['Café Especialidad VE', 'Gianduja Avellana', 'Nuez Pecana'],
  },
  {
    id: 'no5-davelle-berry-toast',
    number: 'N° 05 · TRIBUTO DAVELLE NY',
    name: 'Mascarpone & Frambuesa Silvestre',
    category: 'rellenas',
    badge: 'Nueva',
    weight: '150g',
    basePrice: 4.2,
    image: '/images/cookie-pistachio.jpg',
    description:
      'Inspirada en los cafés íntimos de Nueva York: masa dorada rellena de crema suave de mascarpone con reducción artesanal de frutos rojos.',
    notes: ['Crema Mascarpone', 'Frambuesa Silvestre', 'Vainilla'],
  },
  {
    id: 'no6-lavoratti-gift-box',
    number: 'N° 06 · CAJA DE COLECCIÓN',
    name: 'Cofre Editorial L’Assortimento (6 Pzas)',
    category: 'cajas',
    badge: 'Empaque de Lujo',
    weight: '900g',
    basePrice: 22.0,
    image: '/images/cookie-box.jpg',
    description:
      'Caja rígida forrada en papel texturizado color crema con listón terracota y sello dorado. Incluye nuestras 6 recetas insignia listas para regalar.',
    notes: ['6 Galletas de Autor', 'Papel Texturizado', 'Tarjeta Caligrafiada'],
    isFixedBox: true,
  },
];

// Reseñas editoriales estilo Davelle New York (#press) adaptadas a Venezuela
export const PRESS_QUOTES = [
  {
    outlet: 'EL ESTÍMULO · BIENMESABE',
    quote:
      '“El nuevo objeto de deseo de la repostería en Caracas: galletas con cacao venezolano que se sienten como una pieza de diseño editorial italiano.”',
    date: 'OCTUBRE 2026',
    tag: 'GASTRONOMÍA VENEZOLANA',
  },
  {
    outlet: 'OCEAN DRIVE VENEZUELA',
    quote:
      '“Desde su cofre en papel algodón hasta el corazón fundente de pistacho y cacao de Chuao, Delulu Cookies convierte el postre en un ritual estético.”',
    date: 'SEPTIEMBRE 2026',
    tag: 'ESTILO & SABOR',
  },
  {
    outlet: 'CARACAS CATERING CLUB',
    quote:
      '“La corteza crujiente de mantequilla avellana y el centro tibio de cacao 70% logran el equilibrio exacto entre Nueva York, Turín y Caracas.”',
    date: 'NOVIEMBRE 2026',
    tag: 'LO MEJOR DEL AÑO',
  },
];

// Presets para demostrar cómo el CSS Maestro cambia toda la identidad con 3 variables
export const MASTER_COLOR_PRESETS = [
  {
    id: 'default',
    name: 'Crema & Terracota (Original)',
    primary: '#F7F4EF',
    primaryLight: '#FDFBF7',
    primaryDark: '#EBE5DC',
    secondary: '#231915',
    tertiary: '#C87D55',
    tertiaryLight: '#F3E3D8',
  },
  {
    id: 'rhode-blush',
    name: 'Rhode Glazed Blush',
    primary: '#F9F3F2',
    primaryLight: '#FFFDFC',
    primaryDark: '#EFE4E2',
    secondary: '#2B1E1E',
    tertiary: '#C97A7E',
    tertiaryLight: '#F6E2E3',
  },
  {
    id: 'sunday-matcha',
    name: 'Dear Sunday Matcha',
    primary: '#F3F5F0',
    primaryLight: '#FAFCF8',
    primaryDark: '#E4E9DF',
    secondary: '#1E261D',
    tertiary: '#6E8562',
    tertiaryLight: '#E1E9DC',
  },
  {
    id: 'lavoratti-cacao',
    name: 'Lavoratti Cacao Gold',
    primary: '#F5EFE6',
    primaryLight: '#FCF8F2',
    primaryDark: '#E7DEC8',
    secondary: '#1D1612',
    tertiary: '#B38748',
    tertiaryLight: '#EFE4CE',
  },
];
