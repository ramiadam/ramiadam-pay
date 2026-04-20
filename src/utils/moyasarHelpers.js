import { DEFAULT_VALIDATE_URL } from './constants.js';

export function safeJsonParse(str, fallback) {
  try { return JSON.parse(str); } catch { return fallback; }
}

/**
 * Format halalas as a human-readable string.
 * e.g. 10000 → "100.00 SAR"
 */
export function formatAmount(halalas, currency = 'SAR') {
  if (typeof halalas !== 'number') return '—';
  return `${(halalas / 100).toFixed(2)} ${currency}`;
}

/**
 * Format halalas showing both raw and human values.
 * e.g. 10000 → "10000 (≈ 100.00 SAR)"
 */
export function formatAmountHalalas(halalas, currency = 'SAR') {
  if (typeof halalas !== 'number') return '—';
  return `${halalas} (≈ ${formatAmount(halalas, currency)})`;
}

/**
 * Extract response_code / response_message from a payment or error object.
 */
export function decodePayment(p) {
  const src = p?.source ?? p?.payment?.source ?? p?.data?.source ?? null;
  const code = src?.response_code ?? p?.response_code ?? p?.responseCode ?? null;
  const msg  = src?.response_message ?? p?.response_message ?? p?.responseMessage ?? null;
  if (!code && !msg) return null;
  return { response_code: code ?? null, response_message: msg ?? null };
}

/**
 * Build the Moyasar.init() config object from our internal cfg shape.
 * callbackUrl must be an absolute URL.
 */
export function buildMoyasarConfig(cfg, callbackUrl) {
  const globalSaveCard =
    typeof cfg.save_card === 'boolean' ? cfg.save_card : !!cfg.apple_pay?.save_card;

  return {
    element: '#moyasar-form-mount',
    fixed_width: false,
    amount: cfg.amount,
    currency: cfg.currency,
    description: cfg.description,
    publishable_api_key: cfg.publishable_key,
    callback_url: callbackUrl,
    methods: cfg.methods,
    manual: cfg.manual,
    supported_networks: cfg.supported_networks,
    credit_card: {
      save_card: globalSaveCard,
      manual: cfg.manual,
    },
    applepay: {
      country: cfg.apple_pay?.country ?? 'SA',
      label: cfg.apple_pay?.label ?? 'My Store',
      merchant_validation_url: cfg.apple_pay?.merchant_validation_url ?? DEFAULT_VALIDATE_URL,
      manual: cfg.apple_pay?.manual ?? cfg.manual,
      save_card: globalSaveCard,
    },
    samsungpay: {
      country: 'SA',
      label: 'My Store',
    },
    metadata: cfg.metadata ?? {},
    language: 'en',
  };
}

/**
 * Pick the payments array from various API response shapes.
 */
export function pickPaymentsArray(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.payments)) return data.payments;
  if (Array.isArray(data.data)) return data.data;
  return [];
}
