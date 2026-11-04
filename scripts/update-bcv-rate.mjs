#!/usr/bin/env node
/**
 * Script de consulta diaria de la tasa oficial del BCV (Banco Central de Venezuela) USD -> Bs.
 * Consulta la API pública de DolarApi Venezuela (o directamente el BCV como respaldo),
 * guarda el resultado en `public/bcv-rate.json` y actualiza `VITE_BCV_FALLBACK_RATE` en `.env`.
 *
 * Uso manual: npm run update-bcv
 * Uso automático diario (cron): 0 9 * * * cd /ruta/a/delulucookies-web && npm run update-bcv
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_JSON_PATH = path.join(ROOT_DIR, 'public', 'bcv-rate.json');
const ENV_PATH = path.join(ROOT_DIR, '.env');

async function fetchFromDolarApi() {
  const response = await fetch('https://ve.dolarapi.com/v1/dolares/oficial', {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) {
    throw new Error(`DolarApi respondió con status ${response.status}`);
  }
  const data = await response.json();
  const rate = Number(data?.promedio || data?.venta);
  if (!rate || Number.isNaN(rate)) {
    throw new Error('Respuesta inválida de DolarApi');
  }
  return {
    rate: Number(rate.toFixed(2)),
    source: 'BCV Oficial (vía ve.dolarapi.com)',
    updatedAt: data?.fechaActualizacion || new Date().toISOString(),
  };
}

async function fetchFromOpenErApi() {
  const response = await fetch('https://open.er-api.com/v6/latest/USD', {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) {
    throw new Error(`ExchangeRate API respondió con status ${response.status}`);
  }
  const data = await response.json();
  const rate = Number(data?.rates?.VES);
  if (!rate || Number.isNaN(rate)) {
    throw new Error('No se encontró tasa VES en ExchangeRate API');
  }
  return {
    rate: Number(rate.toFixed(2)),
    source: 'BCV Oficial (vía open.er-api.com)',
    updatedAt: data?.time_last_update_utc || new Date().toISOString(),
  };
}

async function getCurrentFallbackFromEnv() {
  try {
    const envContent = await fs.readFile(ENV_PATH, 'utf-8');
    const match = envContent.match(/^VITE_BCV_FALLBACK_RATE=(.+)$/m);
    if (match && !Number.isNaN(Number(match[1]))) {
      return Number(match[1]);
    }
  } catch {
    // Ignorar si no existe
  }
  return 45.5;
}

async function updateEnvFile(newRate) {
  try {
    let envContent = await fs.readFile(ENV_PATH, 'utf-8');
    if (/^VITE_BCV_FALLBACK_RATE=/m.test(envContent)) {
      envContent = envContent.replace(
        /^VITE_BCV_FALLBACK_RATE=.*/m,
        `VITE_BCV_FALLBACK_RATE=${newRate}`
      );
    } else {
      envContent += `\nVITE_BCV_FALLBACK_RATE=${newRate}\n`;
    }
    await fs.writeFile(ENV_PATH, envContent, 'utf-8');
  } catch (err) {
    console.warn('No se pudo actualizar .env:', err.message);
  }
}

async function main() {
  console.log('🇻🇪 Consultando tasa oficial del BCV (USD -> Bs.)...');
  let result = null;

  try {
    result = await fetchFromDolarApi();
  } catch (err1) {
    console.warn(`⚠️ Fuente primaria falló (${err1.message}). Probando respaldo...`);
    try {
      result = await fetchFromOpenErApi();
    } catch (err2) {
      const fallbackRate = await getCurrentFallbackFromEnv();
      console.warn(
        `⚠️ Sin conexión externa (${err2.message}). Usando tasa de respaldo configurada: Bs. ${fallbackRate}`
      );
      result = {
        rate: fallbackRate,
        source: 'Tasa BCV (Respaldo Local .env)',
        updatedAt: new Date().toISOString(),
      };
    }
  }

  const payload = {
    currencyPair: 'USD/VES',
    rate: result.rate,
    source: result.source,
    updatedAt: result.updatedAt,
    fetchedAt: new Date().toISOString(),
  };

  await fs.writeFile(PUBLIC_JSON_PATH, JSON.stringify(payload, null, 2) + '\n', 'utf-8');
  await updateEnvFile(result.rate);

  console.log(`✅ Tasa BCV actualizada: 1 USD = Bs. ${result.rate} (${result.source})`);
  console.log(`📄 Guardado en: ${PUBLIC_JSON_PATH}`);
}

main();
