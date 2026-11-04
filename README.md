# Delulu Cookies Web (`delulucookies-web`) — Venezuela 🇻🇪

Sitio web informativo y catálogo interactivo de venta de galletas de autor en **Venezuela**, desarrollado en **React + Vite**, con precios en **Dólares ($ USD)** y conversión automática a **Bolívares (Bs.) a tasa oficial del BCV**, más redirección inteligente de pedidos a **WhatsApp**.

---

## ⚙️ 1. Cómo Configurar el Archivo `.env`

El archivo `.env` está ignorado en Git por seguridad y buenas prácticas. Para configurar tu entorno local a partir de la plantilla [`.env.example`](.env.example):

1. **Copia el archivo de ejemplo en la raíz del proyecto:**
   ```bash
   cp .env.example .env
   ```

2. **Edita el archivo `.env` con tus datos reales:**
   ```env
   # Configuración de Contacto y WhatsApp (Venezuela +58 sin el símbolo '+')
   VITE_WHATSAPP_NUMBER=584121234567
   VITE_WHATSAPP_DEFAULT_MESSAGE=¡Hola Delulu Cookies! 🍪 Me gustaría hacer un pedido de galletas recién horneadas.

   # Información de la Marca (Venezuela)
   VITE_BRAND_NAME=DELULU COOKIES
   VITE_BRAND_TAGLINE=Galletas de autor, horneadas en pequeños lotes en Venezuela con mantequilla avellana y chocolate 70% de origen venezolano.
   VITE_BRAND_HANDLE=@delulucookies
   VITE_BRAND_LOCATION=Caracas, Venezuela · Delivery y Pick-up

   # Redes Sociales y Enlaces Externos
   VITE_INSTAGRAM_URL=https://instagram.com/delulucookies
   VITE_TIKTOK_URL=https://tiktok.com/@delulucookies
   VITE_MAPS_URL=https://maps.google.com

   # Promociones, Moneda y Tasa BCV (USD / Bs.)
   VITE_ANNOUNCEMENT_BAR=HORNEADAS HOY EN CARACAS · PRECIOS EN USD ($) O BOLÍVARES (BS.) A TASA BCV DEL DÍA · PEDIDOS POR WHATSAPP
   VITE_CURRENCY_SYMBOL=$
   VITE_BCV_API_URL=https://ve.dolarapi.com/v1/dolares/oficial
   VITE_BCV_FALLBACK_RATE=893.22
   ```

---

## 💱 2. Cómo Ejecutar el Script Diario de la Tasa del BCV (`USD` ↔ `Bs.`)

El proyecto incluye el script [`scripts/update-bcv-rate.mjs`](scripts/update-bcv-rate.mjs), el cual consulta la tasa oficial vigente del **Banco Central de Venezuela (BCV)**, guarda los datos actualizados en [`public/bcv-rate.json`](public/bcv-rate.json) y actualiza automáticamente la variable `VITE_BCV_FALLBACK_RATE` dentro de tu `.env` local.

### Ejecución Manual
Para actualizar la tasa del BCV en cualquier momento, corre en la terminal:
```bash
npm run update-bcv
```

### Ejecución Automática Diaria (Cron Job en macOS / Linux)
Si deseas que el script consulte el BCV automáticamente todos los días (por ejemplo, a las 9:00 AM):
1. Abre tu configuración de cron en la terminal:
   ```bash
   crontab -e
   ```
2. Agrega la siguiente línea (ajustando la ruta a tu carpeta):
   ```cron
   0 9 * * * cd /Users/juliomoreno/work/personal/delulucookies-web && npm run update-bcv >> /tmp/delulu-bcv.log 2>&1
   ```

> **Nota:** Adicionalmente, cuando un usuario abre la página web en su navegador, React consulta automáticamente tanto `/bcv-rate.json` como `VITE_BCV_API_URL` en vivo, permitiendo alternar en tiempo real todos los precios entre **Dólares (`$ USD`)** y **Bolívares (`Bs. BCV`)** desde la barra superior, el Linktree inicial, el Hero o la bolsa de pedidos.

---

## 🎨 3. CSS Maestro (`src/master.css`)

Toda la paleta de colores está centralizada en [`src/master.css`](src/master.css) mediante variables CSS (`:root`) divididas en:
- **Colores Principales (`--color-primary`, `--color-primary-light`, `--color-primary-dark`)**
- **Colores Secundarios (`--color-secondary`, `--color-secondary-light`, `--color-secondary-muted`)**
- **Colores Terciarios / Acentos (`--color-tertiary`, `--color-tertiary-light`, `--color-tertiary-sage`)**

---

## 🚀 4. Instalación y Comandos del Proyecto

```bash
# 1. Instalar dependencias
npm install

# 2. Crear tu archivo .env local desde la plantilla
cp .env.example .env

# 3. Consultar y actualizar la tasa oficial del BCV del día
npm run update-bcv

# 4. Iniciar el servidor de desarrollo
npm run dev

# 5. Compilar para producción
npm run build
```
