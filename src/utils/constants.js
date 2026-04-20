// Storage keys — do not rename without a migration
export const K = {
  cfg: 'moyasar_ui_cfg_v1',
  pid: 'moyasar_last_payment_id',
  tok: 'moyasar_last_token',
  src: 'moyasar_last_source',
  theme: 'rtb_theme_v1',
};

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
    validate_merchant_url: DEFAULT_VALIDATE_URL,
    manual: false,
    save_card: false,
  },
  metadata: {},
};

export const WIZARD_STEPS = [
  { id: 'welcome',        label: 'Welcome' },
  { id: 'api-keys',       label: 'API Keys' },
  { id: 'card-payment',   label: 'Card Payment' },
  { id: 'apple-pay',      label: 'Apple Pay' },
  { id: 'authorize-only', label: 'Authorize Only' },
  { id: 'save-card',      label: 'Save Card & Token Pay' },
  { id: 'samsung-pay',    label: 'Samsung Pay' },
  { id: 'stc-pay',        label: 'STC Pay' },
];

export const TEST_CARDS = [
  { network: 'Mada',       number: '4201320111111010', outcome: 'Paid' },
  { network: 'Visa',       number: '4111114005765430', outcome: 'Paid (3DS)' },
  { network: 'Mastercard', number: '5421080101000000', outcome: 'Paid' },
  { network: 'Amex',       number: '340000000900000',  outcome: 'Paid' },
];
