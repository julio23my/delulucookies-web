# Delulu Cookies Web (`delulucookies-web`)

Sitio web informativo y catálogo interactivo de venta de galletas de autor desarrollado en **React + Vite**, con redirección inteligente de pedidos a **WhatsApp**.

## ✨ Inspiración de Diseño
1. **Vista Inicial Tipo Linktree (`LinkHubView.jsx`)**: Hub de bienvenida minimalista que permite ir directamente al WhatsApp de pedidos, elegir un sabor en 1 clic o adentrarse en el Sitio Principal.
2. **Sitio Principal Editorial (`MainEditorialSite.jsx`)**:
   - **Lavoratti 1938**: Tipografía editorial (`Cormorant Garamond`), numeración de lotes (`N° 01`), notas de cata y un armador de cofres de regalo personalizados.
   - **Rhode Skin**: Bordes curvos táctiles (`28px`), superficies limpias en tonos crema y selectores de presentación intuitivos (1 pieza, Caja x4, Caja x6).
   - **Dear Sunday**: Atmósfera cálida matutina, acentos en pistacho/matcha y ritual lento.
   - **Davelle New York (`#press`)**: Cuadrícula editorial de reseñas de prensa y cultura gastronómica.

## 🎨 CSS Maestro (`src/master.css`)
Toda la paleta de colores está centralizada en `src/master.css` mediante variables CSS (`:root`) divididas en:
- **Colores Principales (`--color-primary`, `--color-primary-light`, `--color-primary-dark`)**
- **Colores Secundarios (`--color-secondary`, `--color-secondary-light`, `--color-secondary-muted`)**
- **Colores Terciarios / Acentos (`--color-tertiary`, `--color-tertiary-light`, `--color-tertiary-sage`)**

## ⚙️ Variables de Entorno (`.env`)
Configura el número de WhatsApp, mensajes predeterminados, redes sociales y textos de la marca en el archivo `.env`:
```env
VITE_WHATSAPP_NUMBER=5215512345678
VITE_WHATSAPP_DEFAULT_MESSAGE=¡Hola Delulu Cookies! 🍪 Me gustaría hacer un pedido de galletas recién horneadas.
VITE_BRAND_NAME=DELULU COOKIES
VITE_INSTAGRAM_URL=https://instagram.com/delulucookies
```

## 🚀 Comandos
```bash
npm install
npm run dev
npm run build
```
