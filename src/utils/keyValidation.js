/**
 * Key validation helpers.
 * Never log full secret keys — use redactKey() in any output.
 */

export function isTestKey(key) {
  return typeof key === 'string' && key.includes('_test_');
}

export function isLiveKey(key) {
  return typeof key === 'string' && key.includes('_live_');
}

export function isValidPublishableKey(key) {
  return typeof key === 'string' && key.startsWith('pk_') && key.length > 10;
}

export function isValidSecretKey(key) {
  return typeof key === 'string' && key.startsWith('sk_') && key.length > 10;
}

/**
 * Redact a key for display — show prefix and last 4 chars.
 * e.g. sk_test_abc123xyz → sk_test_...xyz
 */
export function redactKey(key) {
  if (!key || key.length < 12) return '***';
  const prefix = key.substring(0, key.indexOf('_', key.indexOf('_') + 1) + 1);
  const last4 = key.slice(-4);
  return `${prefix}...${last4}`;
}
