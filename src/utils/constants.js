// Storage keys — do not rename without a migration
export const K = {
  cfg: 'moyasar_ui_cfg_v1',
  pid: 'moyasar_last_payment_id',
  tok: 'moyasar_last_token',
  src: 'moyasar_last_source',
  theme: 'rtb_theme_v1',
  returnStep: 'moyasar_return_step',
};

export function stepModeKey(stepIndex) {
  return `rtb_step_${stepIndex}_mode`;
}

export const SK_KEY = 'moyasar_sk';
export const MOYASAR_API = 'https://api.moyasar.com/v1';

export const DEFAULT_VALIDATE_URL = 'https://api.moyasar.com/v1/applepay/initiate';

export const DEFAULT_CONFIG = {
  publishable_key: '',
  amount: 10000,
  currency: 'SAR',
  description: 'Test Payment',
  methods: ['creditcard'],
  supported_networks: ['mada', 'visa', 'mastercard', 'amex'],
  manual: false,
  save_card: false,
  apple_pay: {
    country: 'SA',
    label: 'My Store',
    merchant_validation_url: DEFAULT_VALIDATE_URL,
    manual: false,
    save_card: false,
  },
  metadata: {},
};

export const WIZARD_STEPS = [
  { id: 'welcome',         label: 'Welcome' },
  { id: 'api-keys',        label: 'API Keys' },
  { id: 'card-payment',    label: 'Card Payment' },
  { id: 'save-card-token', label: 'Save Card & Token' },
  { id: 'authorize-only',  label: 'Authorize + Capture' },
  { id: 'apple-pay',       label: 'Apple Pay' },
  { id: 'samsung-pay',     label: 'Samsung Pay' },
  { id: 'stc-pay',         label: 'STC Pay' },
  { id: 'done',            label: 'Done' },
];

export const TEST_CARDS = [
  { network: 'Mada',       number: '4201320111111010', outcome: 'Paid',                   group: 'success' },
  { network: 'Visa',       number: '4111114005765430', outcome: 'Paid (3DS frictionless)', group: 'success' },
  { network: 'Visa',       number: '4111111111111111', outcome: 'Paid (no 3DS)',            group: 'success' },
  { network: 'Mastercard', number: '5421080101000000', outcome: 'Paid',                   group: 'success' },
  { network: 'Amex',       number: '340000000900000',  outcome: 'Paid',                   group: 'success' },
  { network: 'Visa',       number: '4111118250252531', outcome: '3DS unavailable',         group: '3ds' },
  { network: 'Visa',       number: '4111115784228433', outcome: '3DS auth rejected',       group: '3ds' },
  { network: 'Mada',       number: '4201320000013020', outcome: 'Unspecified failure',     group: 'failure' },
  { network: 'Mada',       number: '4201320000311101', outcome: 'Insufficient funds',      group: 'failure' },
  { network: 'Visa',       number: '4123120001090000', outcome: 'Insufficient funds',      group: 'failure' },
  { network: 'Visa',       number: '4123120001090109', outcome: 'Declined',               group: 'failure' },
  { network: 'Mastercard', number: '5105105105105100', outcome: 'Unspecified failure',     group: 'failure' },
];
