# ramiadam-pay

A Moyasar payments test bench. A web-based sandbox where merchants enter their own Moyasar test API keys and exercise payment flows end-to-end — card payments, Apple Pay, tokenization, refunds, captures, voids — before committing to a full integration.

**Who uses it:**
- Merchants evaluating Moyasar pre-signup
- Merchants already signed up, testing before production
- Moyasar's internal team for QA and demos

**The value prop:** exercise the full Moyasar payment surface without building an integration first. Reduces "integrate first, discover limitations later" friction.

---

## Current state (as of this writing)

This is a **zero-build, single-file vanilla JavaScript app**. Everything runs in the browser. No package.json, no build step, no framework, no backend.

### Stack

- **Language:** Vanilla JavaScript (ES2020+). No TypeScript, no transpiler.
- **Framework:** None.
- **Styling:** Custom CSS in a `<style>` block inside `index.html`. CSS custom properties drive dark/light th.
- **External dependencies (CDN only):**
  - `moyasar-payment-form@2.2.6` via jsDelivr (UMD, exposed as `window.Moyasar`)
- **State:** Lives in DOM inputs, `localStorage`, and `sessionStorage`. No state library.
- **Tests:** None yet.
- **Dev server:** `python3 -m http.server 8080`

### Folder structure
/
├── index.html          # The entire app: CSS, HTML, ~630 lines of JS
├── thanks.html         # Callback/return page for redirect-flow payments
├── .well-known/        # Apple Pay domain verification blob
├── .claude/            # Claude Code permissions config
└── favicon-*.png, apple-touch-icon.png
`index.html` is the app. Sections within it:
- **1–18:** `<head>`, CDN imports
- **19–357:** Full CSS (themes, components, Moyasar Payment Form overrides)
- **360–605:** HTML body — two-column grid (Config card left, Runner card right)
- **607–636:** JS constants (`K` storage keys, `SK_KEY`, `MOYASAR_API`, `$` alias)
- **637–667:** DOM refs
- **669–738:** Utilities
- **745–823:** Config persistence
- **826–926:** `initForm(cfg)` — core function; remounts and calls `Moyasar.init()`
- **929–992:** Secret key helpers + `adminCall` authenticated API wrapper
- **995–1044:** Admin button handlers (Fetch / Capture / Refund / Void / Token Pay)
- **1047–1153:** Recent payments list
- **1156–1175:** Theme system
- **1178–1233:** Boot IIFE

### What works today

- Credit card payments (via Moyasar Payment Form)
- Apple Pay payments (via Moyasar Payment Form)
- `manual` (authorize-only) flag
- `save_card` / tokenization
- Supported networks selector (mada, visa, mastercard, amex)
- `on_completed` / `on_failure` callbacks — store payment ID, source, token
- Admin actions direct to Moyasar API: Fetch, Capture, Refund, Void, Token Pay
- Recent payments list (last 5) via secret key
- Per-payment Fetch and Use-ID buttons
- Error decode panel (`response_code` / `response_message`)
- Dark/light theme toggle (persisted)
- Config persistence (`localStorage`)
- Secret key session persistence (`sessionStorage`)
- Apple Pay availability detection pills
- Two metadata key/value pairs
- Callback return page (`thanks.html`)
- Apple Pay domain verification file in `.well-known/`

### Partial / hardcoded

- Currency hardcoded to `"SAR"` — no UI selector
- Country hardcoded to `"SA"` — no UI control
- Metadata capped at exactly 2 pairs — no add/remove
- Token Pay has `3ds: true`, `manual: false` hardcoded — no UI toggles

### Missing (goals for v2+)

- **Webhook inspector / simulator** — capture inbound webhooks from Moyasar and display them in-UI
- **Payment log / history** with CSV and JSON export
- **STC Pay** method
- **Samsung Pay** method
- **SADAD** method
- **Redirect / hosted payment flow**
- **3DS outcome simulation controls**
- Test suite (any)
- README

---

## How agents should work in this repo

### Respect the constraints that make the project what it is

This app is deliberately **zero-build, single-file, framework-free**. That's a feature, not an oversight. Merchants can drop it behind `python3 -m http.server 8080` or any static host and have it running in seconds. **Do not introduce** any of the following without explicit user approval:

- A build step (Vite, webpack, Next.js, etc.)
- A framework (React, Vue, Svelte, etc.)
- A package manager / `package.json`
- TypeScript
- A CSS framework (Tailwind, etc.)
- A bundler, transpiler, or dev server beyond the current Python one
- A backend service

If a task seems to require any of the above, **stop and flag it for the user first.** The tradeoffs (simplicity, portability, zero-install) may be more valuable than what the tool would buy. If the user approves a major stack shift, that's a separate conversation — not something to slip into a feature PR.

### Coding conventions (observed from existing code)

- **camelCase** for JS identifiers.
- **`El` suffix** for output element refs (`resultEl`, `decodeEl`, `adminOut`).
- **`btn` prefix** on button references.
- `const $ = (id) => document.getElementById(id)` — use this alias consistently.
- Optional chaining (`?.`) and nullish coalescing (`??`) throughout.
- `async/await` everywhere — no `.then()` chains.
- Single inline `<script>`, everything in global scope. No ES modules.
- Inline error handling via `setAdminOut("❌ …")` — no centralized handler (yet).

### Config object shape

Agents modifying config logic must preserve this shape unless explicitly expanding it:

```js
{
  publishable_key, amount, currency, description,
  methods: ["applepay" | "creditcard"],
  supported_networks: ["mada", "visa", "mastercard", "amex"],
  manual, save_card,
  apple_pay: { country, label, validate_merchant_url, manual, save_card },
  metadata: { [key]: value }
}
```

Fields marked "fragile" below have known sync issues — address them thoughtfully:
- `apple_pay.manual` duplicates top-level `manual` (both from the same checkbox)
- `save_card` is triple-stored: `cfg.save_card`, `cfg.apple_pay.save_card`, and passed to `Moyasar.init`

### Storage keys (don't rename without a migration)

`localStorage` (the `K` object):
- `moyasar_ui_cfg_v1` — full config (includes publishable key)
- `moyasar_last_payment_id`
- `moyasar_last_token`
- `moyasar_last_source` — JSON of `payment.source`
- `rtb_theme_v1` — `"dark"` or `"light"`

`sessionStorage`:
- `moyasar_sk` — secret key; survives refresh, cleared on tab close

---

## Commands

```bash
# Dev server
python3 -m http.server 8080

# Then open
http://localhost:8080
```

That's the entire toolchain. No build, no test, no lint.

---

## Moyasar domain — what agents need to know

**Always consult [Moyasar's official docs](https://docs.moyasar.com/) as authoritative.** Don't rely on memory for API shapes, endpoints, or test card behavior.

Key concepts agents should understand before touching payment code:

- **Publishable key (`pk_test_...`, `pk_live_...`)** — client-safe, used by the payment form.
- **Secret key (`sk_test_...`, `sk_live_...`)** — server-grade, used for fetch/capture/refund/void/token-pay. In this app, it lives in `sessionStorage` and is sent directly from the browser — see "Security posture" below.
- **Test mode only.** This bench is never for live keys. If a user pastes a `pk_live_` or `sk_live_` key, warn them clearly and refuse to proceed with admin operations.
- **Amounts are integers in the smallest currency unit** (halalas for SAR). Never use floats for money. The UI must display human-readable amounts but send/receive integer minor units.
- **Currency is always explicit.** Currently hardcoded to SAR — when making it configurable, every amount-handling code path must read currency from config, not assume.
- **Idempotency** — Moyasar supports idempotency keys on mutating operations. Any new admin action or webhook-handler work should use them.
- **Payment Form (MPF)** — the `moyasar-payment-form` CDN script renders the card/Apple Pay form. Communicates via `on_completed` / `on_failure` callbacks.
- **3D Secure** — test cards behave differently for 3DS success vs. failure. When building 3DS simulation controls, consult the Moyasar docs for the current test card list.
- **Webhooks** — Moyasar sends POST requests with signed payloads. Signature verification is mandatory once we build the inspector. Never trust webhook bodies without verifying the signature.

Useful docs pages (verify live URLs before linking in UI):
- Testing and test cards: `docs.moyasar.com/testing`
- Payment methods: `docs.moyasar.com/payment-methods`
- Webhooks: `docs.moyasar.com/webhooks`
- API reference: `docs.moyasar.com/api`

---

## Security posture

This is a **merchant's own test bench running in their own browser**. Security model accordingly:

### What's acceptable (by design)

- Publishable keys in `localStorage` — they're designed to be client-exposed.
- Secret keys in `sessionStorage` — tab-scoped, cleared on close. The user consciously enters them to test admin flows.
- Direct browser-to-`api.moyasar.com` calls — Moyasar's CORS config allows this; it's the whole point of the bench.

### Non-negotiables

1. **Never log full secret keys.** Redact to `sk_test_...****` or similar in any console output, UI display, or (future) export.
2. **Never commit secrets.** No test keys in source, even as placeholders. Use `pk_test_xxx` / `sk_test_xxx` in examples.
3. **Warn on live keys.** If a user pastes `pk_live_` or `sk_live_`, the UI must warn prominently and refuse admin operations. This bench is test-only.
4. **Webhook signature verification** will be mandatory once the inspector ships. Never mark a webhook as "received" in the UI without signature verification.
5. **Don't render untrusted values via `innerHTML`.** The recent-payments list currently uses `innerHTML` with interpolated API values (id, status, codes). This is a low practical risk but should be migrated to `textContent` or explicit element construction as we touch that code. Flag and fix when nearby.
6. **When a backend is added** (webhook capture will require one), flag the change for `security` review without exception. A public POST endpoint receiving arbitrary bodies is a new attack surface — rate limits, body size caps, signature verification, and log hygiene all need to be designed in, not retrofitted.

### Known issues to clean up when touching relevant code

- `renderRecentPayments()` uses `innerHTML` with interpolated API values — low risk but should be escaped.
- `thanks.html` line 26 has a leftover AI artifact (`:contentReference[oaicite:8]{index=8}`) in a comment — delete on next touch.
- `Token Pay` endpoint: code calls `POST /payments/token` — verify against current Moyasar API docs; standard pattern may be `POST /payments` with `source.type = "token"`.
- Stale comment on line 1046 says "last 5 via worker" — the worker proxy was removed. Update when nearby.

---

## UX principles

This is a **developer tool**, not a consumer checkout. Design accordingly:

- **Information density is a virtue.** Developers want to see the request, the response, the raw JSON, the IDs. Don't hide it.
- **Keyboard-friendly.** Common actions should be reachable without the mouse.
- **Copy-paste everywhere.** Every ID, token, and JSON blob should be one click to copy.
- **Honest error surfaces.** Show the full Moyasar error response, not a prettified "Something went wrong." Developers are debugging — they need the real signal.
- **No fake loading.** If an operation is instant, don't add spinners. If it's slow, show actual progress.
- **Dark mode is a first-class citizen**, not an afterthought. It's already implemented — keep parity.
- **Accessibility still matters.** Keyboard focus, visible focus states, labeled inputs, sufficient contrast in both themes. Developer tool ≠ permission to skip a11y.

---

## Scope ladder

Releases are iterative. Rough tiers:

### Tier 1 — polish and fill gaps in what exists
- Currency selector (not just SAR)
- Country selector
- Unlimited metadata pairs
- Token Pay: UI toggles for `3ds` and `manual`
- Fix `save_card` triple-storage fragility
- Fix `apple_pay.manual` / top-level `manual` sync issue
- Escape interpolated values in `renderRecentPayments`
- Delete AI artifact in `thanks.html`
- Add a README

### Tier 2 — new payment methods
- STC Pay
- Samsung Pay
- SADAD
- Redirect / hosted payment flow
- 3DS outcome simulation controls

### Tier 3 — the developer simulator
- Payment log / history view with filtering
- CSV + JSON export
- Request / response inspector (show raw API calls)
- Code snippets in multiple languages (curl, JS, Python, PHP)

### Tier 4 — webhook inspector (requires a backend)
- Per-session webhook capture URL
- Inbound webhook viewer with signature verification
- Replay / forward captured webhooks
- **Decision point:** this is the first feature that requires a backend. When we get here, have an explicit conversation about stack choice (a minimal serverless function? a Node service? what's the hosting target?). Do not silently introduce one.

### Tier 5 — niceties
- Saved configurations (multiple merchant profiles)
- Share-a-test-case links (signed, no keys in URL)
- Embeddable widget version

When planning a feature, the `architect` agent should confirm which tier it belongs to and flag any scope creep.

---

## Agent team — how to invoke them

A user-level team of coding agents lives in `~/.claude/agents/`:

- **`architect`** — plans before code exists. Use for any non-trivial feature.
- **`frontend`** — UI implementation. The primary writer for this project given it's frontend-heavy.
- **`backend`** — server-side implementation. Not used yet; will be used when Tier 4 (webhook inspector) requires a backend.
- **`qa`** — writes and runs tests. Project has no tests yet; introducing a test framework is a conscious choice that should be discussed before first use.
- **`reviewer`** — code review for correctness, clarity, conventions.
- **`design`** — UI/UX review for accessibility, state coverage, polish.
- **`security`** — mandatory for anything touching payment flows, secrets, webhook handlers, or user-supplied URLs.
- **`debugger`** — diagnoses failures. Use when something breaks and the cause isn't obvious.

Typical flow for a feature:
architect → frontend → reviewer → design → security (if payment-adjacent)
For payment-adjacent work (which is most work in this repo), `security` review is mandatory, not optional.