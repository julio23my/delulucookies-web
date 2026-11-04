# Delulu Cookies Web (`delulucookies-web`) — Venezuela 🇻🇪

Sitio web informativo y catálogo interactivo de venta de galletas de autor en **Venezuela**, desarrollado en **React + Vite**, con precios en **Dólares ($ USD)** y conversión automática a **Bolívares (Bs.) a tasa oficial del BCV**, más redirección inteligente de pedidos a **WhatsApp**.

## 💱 Conversión de Moneda ($ USD ↔ Bs. BCV) y Script Diario
- **Selector de Moneda en toda la web**: Los clientes pueden cambiar en cualquier momento la visualización de los precios entre **Dólares (`$ USD`)** y **Bolívares (`Bs. BCV`)** desde la barra superior, el Linktree inicial, el Hero o la bolsa de pedidos.
- **Consulta en Vivo + Script Diario del BCV**:
  - La aplicación consulta al abrirse tanto `/bcv-rate.json` como la API oficial del BCV (`https://ve.dolarapi.com/v1/dolares/oficial`).
  - Incluye el script [`scripts/update-bcv-rate.mjs`](scripts/update-bcv-rate.mjs) para actualizar diariamente la tasa oficial del BCV y sincronizar `public/bcv-rate.json` y `.env`:
    ```bash
    npm run update-bcv
    ```
  - Si deseas programarlo automáticamente todos los días en tu servidor o Mac (`crontab -e`):
    ```cron
    0 9 * * * cd /Users/juliomoreno/work/personal/delulucookies-web && npm run update-bcv
    ```

## ✨ Inspiración de Diseño
1. **Vista Inicial Tipo Linktree (`LinkHubView.jsx`)**: Hub de bienvenida minimalista con conmutador `$ USD / Bs. BCV` que permite ir directamente al WhatsApp de pedidos, elegir un sabor en 1 clic o adentrarse en el Sitio Principal.
2. **Sitio Principal Editorial (`MainEditorialSite.jsx`)**:
   - **Lavoratti 1938**: Tipografía editorial (`Cormorant Garamond`), numeración de lotes (`N° 01`), cacao venezolano Chuao 70%, sal de Araya y un armador de cofres de regalo personalizados (4, 6 y 12 galletas).
   - **Rhode Skin**: Bordes curvos táctiles (`28px`), superficies limpias en tonos crema y selectores de presentación intuitivos (1 Galleta, Caja x4, Caja x6).
   - **Dear Sunday**: Atmósfera cálida matutina, acentos en pistacho/matcha y ritual lento.
   - **Davelle New York (`#press`)**: Cuadrícula editorial de reseñas gastronómicas en Venezuela.

## 🎨 CSS Maestro (`src/master.css`)
Toda la paleta de colores está centralizada en `src/master.css` mediante variables CSS (`:root`) divididas en:
- **Colores Principales (`--color-primary`, `--color-primary-light`, `--color-primary-dark`)**
- **Colores Secundarios (`--color-secondary`, `--color-secondary-light`, `--color-secondary-muted`)**
- **Colores Terciarios / Acentos (`--color-tertiary`, `--color-tertiary-light`, `--color-tertiary-sage`)**

## ⚙️ Variables de Entorno (`.env`)
Configura el número de WhatsApp (`+58`), la tasa de respaldo del BCV y los datos de la marca en `.env`:
```env
VITE_WHATSAPP_NUMBER=584121234567
VITE_BRAND_LOCATION=Caracas, Venezuela · Delivery y Pick-up
VITE_BCV_API_URL=https://ve.dolarapi.com/v1/dolares/oficial
VITE_BCV_FALLBACK_RATE=893.22
```

## 🚀 Comandos
```bash
npm install
npm run update-bcv   # Consulta y actualiza la tasa oficial del BCV del día
npm run dev          # Inicia el servidor de desarrollo
npm run build        # Compila para producción
```
