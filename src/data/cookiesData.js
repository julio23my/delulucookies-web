// Configuración centralizada leída desde el archivo .env
export const ENV_CONFIG = {
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '5215512345678',
  whatsappDefaultMessage:
    import.meta.env.VITE_WHATSAPP_DEFAULT_MESSAGE ||
    '¡Hola Delulu Cookies! 🍪 Me gustaría hacer un pedido de galletas recién horneadas.',
  brandName: import.meta.env.VITE_BRAND_NAME || 'DELULU COOKIES',
  brandTagline:
    import.meta.env.VITE_BRAND_TAGLINE ||
    'Galletas de autor, horneadas en pequeños lotes con mantequilla avellana y chocolate de origen.',
  brandHandle: import.meta.env.VITE_BRAND_HANDLE || '@delulucookies',
  brandLocation:
    import.meta.env.VITE_BRAND_LOCATION ||
    'Ciudad de México · Entregas a domicilio y Pick-up',
  instagramUrl: import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com/delulucookies',
  tiktokUrl: import.meta.env.VITE_TIKTOK_URL || 'https://tiktok.com/@delulucookies',
  mapsUrl: import.meta.env.VITE_MAPS_URL || 'https://maps.google.com',
  announcementBar:
    import.meta.env.VITE_ANNOUNCEMENT_BAR ||
    'HORNEADAS HOY · ENVÍO GRATIS EN CAJAS DE 6 Y 12 GALLETAS · PEDIDOS DIRECTOS POR WHATSAPP',
  currencySymbol: import.meta.env.VITE_CURRENCY_SYMBOL || '$',
};

/**
 * Construye el enlace oficial de WhatsApp (wa.me) con el mensaje codificado
 */
export function buildWhatsAppUrl(customMessage) {
  const cleanPhone = String(ENV_CONFIG.whatsappNumber).replace(/[^\d]/g, '');
  const message = customMessage || ENV_CONFIG.whatsappDefaultMessage;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

// Presentaciones disponibles para cada galleta
export const PACK_OPTIONS = [
  { id: 'single', label: '1 Pieza', multiplier: 1, discount: 1, tag: 'Individual' },
  { id: 'box4', label: 'Caja x4', multiplier: 4, discount: 0.94, tag: '-6%' },
  { id: 'box6', label: 'Caja x6', multiplier: 6, discount: 0.9, tag: 'Regalo -10%' },
];

// Catálogo de galletas de autor (Inspirado en Lavoratti 1938, Rhode Skin, Dear Sunday y Davelle NY)
export const COOKIES_CATALOG = [
  {
    id: 'no1-fleur-cacao',
    number: 'N° 01 · EDICIÓN CLÁSICA',
    name: 'Fleur de Cacao 70%',
    category: 'chocolate',
    badge: 'Bestseller',
    weight: '145g',
    basePrice: 85,
    image: '/images/cookie-classic.jpg',
    description:
      'Masa reposada 48 horas con mantequilla avellana francesa, trozos fundentes de chocolate oscuro 70% de origen único y escamas de sal de mar Maldon.',
    notes: ['Mantequilla Avellana', 'Cacao 70% Ecuador', 'Sal Maldon'],
  },
  {
    id: 'no2-pistacchio-bronte',
    number: 'N° 02 · COLECCIÓN LAVORATTI',
    name: 'Pistacchio di Sicilia & Matcha',
    category: 'rellenas',
    badge: 'Favorita del Chef',
    weight: '155g',
    basePrice: 98,
    image: '/images/cookie-pistachio.jpg',
    description:
      'Galleta aterciopelada con té verde ceremonial de Uji, corazón cremoso de praliné de pistacho tostado y chocolate blanco caramelizado.',
    notes: ['Crema de Pistacho', 'Matcha Ceremonial', 'Chocolate Blanco'],
  },
  {
    id: 'no3-glazed-vanilla-peptide',
    number: 'N° 03 · INSPIRACIÓN RHODE',
    name: 'Brown Butter Glazed Milk',
    category: 'especiales',
    badge: 'Edición Limitada',
    weight: '140g',
    basePrice: 92,
    image: '/images/hero-cookies.jpg',
    description:
      'Textura suave y brillante con glaseado translúcido de vainilla de Papantla, leche tostada en polvo y corazón de ganache de caramelo salado.',
    notes: ['Glaseado Vainilla', 'Leche Tostada', 'Caramelo Salado'],
  },
  {
    id: 'no4-sunday-espresso',
    number: 'N° 04 · RITUAL DEAR SUNDAY',
    name: 'Sunday Morning Espresso & Nuez',
    category: 'chocolate',
    badge: 'Recién Horneada',
    weight: '150g',
    basePrice: 90,
    image: '/images/cookie-classic.jpg',
    description:
      'Infusionada con espresso recién extraído, chocolate con leche avellanado (Gianduja) y nueces pecanas tostadas lentamente al horno.',
    notes: ['Gianduja Italiana', 'Espresso Tostado', 'Nuez Pecana'],
  },
  {
    id: 'no5-davelle-berry-toast',
    number: 'N° 05 · TRIBUTO DAVELLE NY',
    name: 'Mascarpone & Frambuesa Liofilizada',
    category: 'rellenas',
    badge: 'Nueva',
    weight: '150g',
    basePrice: 95,
    image: '/images/cookie-pistachio.jpg',
    description:
      'Inspirada en los cafés íntimos de Nueva York: masa dorada rellena de crema suave de mascarpone con reducción ácida de frambuesas y rubí.',
    notes: ['Crema Mascarpone', 'Frambuesa Silvestre', 'Vainilla Bourbon'],
  },
  {
    id: 'no6-lavoratti-gift-box',
    number: 'N° 06 · CAJA DE COLECCIÓN',
    name: 'Cofre Editorial L’Assortimento (6 Pzas)',
    category: 'cajas',
    badge: 'Empaque de Lujo',
    weight: '900g',
    basePrice: 495,
    image: '/images/cookie-box.jpg',
    description:
      'Caja rígida forrada en papel texturizado color crema con listón terracota y sello dorado. Incluye nuestras 6 recetas insignia listas para regalar.',
    notes: ['6 Galletas de Autor', 'Papel Texturizado', 'Tarjeta Caligrafiada'],
    isFixedBox: true,
  },
];

// Reseñas editoriales estilo Davelle New York (#press)
export const PRESS_QUOTES = [
  {
    outlet: 'VOGUE MÉXICO',
    quote:
      '“El nuevo objeto de deseo de la repostería contemporánea: galletas que se sienten como una pieza de diseño editorial italiano.”',
    date: 'OCTUBRE 2026',
    tag: 'GASTRONOMÍA & ESTILO',
  },
  {
    outlet: 'AD MAGAZINE',
    quote:
      '“Desde su caja en papel algodón hasta el corazón fundente de pistacho siciliano, Delulu Cookies convierte el postre en un ritual estético.”',
    date: 'SEPTIEMBRE 2026',
    tag: 'DISEÑO CULINARIO',
  },
  {
    outlet: 'BON APPÉTIT CLUB',
    quote:
      '“La corteza crujiente de mantequilla avellana y el centro tibio de cacao 70% logran el equilibrio exacto entre Nueva York y Turín.”',
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
