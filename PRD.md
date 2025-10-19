# PRD: Crop Intelligence Platform (Crop Yield Prediction & Disease Detection)

## 1) Summary
A web platform that helps farmers and agronomists: (a) predict crop yield from environmental and agronomic inputs; (b) diagnose plant diseases from leaf images and get actionable treatment recommendations. The product consists of a React SPA (frontend) and a Flask API (backend) powered by CatBoost (yield) and a Keras CNN (disease) models.

## 2) Goals and Non-goals
- Goals
  - Accurate, fast crop yield prediction given a small set of inputs (temperature, humidity, soil type, crop type, water flow, lat/long).
  - Simple disease detection workflow using an image upload, returning a diagnosis and treatment suggestions.
  - Low-friction UX with form validation, charts, history, and export/share.
  - API stability with clear contracts and errors for easy integration.
- Non-goals
  - Full-farm management (inventory, finance, logistics).
  - Real-time satellite ingestion or continuous time-series forecasting.
  - Agronomic recommendation engine beyond basic suggestions.

## 3) Users and Personas
- Smallholder Farmer: wants simple inputs and clear outputs for immediate decisions.
- Agronomist/Extension Officer: needs to triage issues, share reports, and guide farmers.
- Research/Student: needs a quick sandbox to try scenarios and understand model behavior.

## 4) Success Metrics
- Functional
  - p50 API latency: <300ms for /predict with warm model; <800ms p95.
  - Disease analysis end-to-end: <3s p50 (after CNN load), <6s p95.
  - Validation error rate: <2% of requests fail for client-side validation issues.
- Engagement
  - Repeat use: ≥30% of users return within 7 days.
  - Feature adoption: ≥60% use export/share or history within first week.
- Quality
  - Backend 5xx: <0.5% of requests.
  - Model availability at startup: >99% in environments with models provisioned.

## 5) Current Implementation Snapshot (as-is)
- Backend (Flask)
  - Endpoints
    - GET /health: returns status plus model health and metadata (feature count, names, cat indices if available).
    - POST /predict: expects JSON body with fields temperature, humidity, soil_type, crop_type, water_flow, latitude, longitude. Transforms to CatBoost feature schema and returns { predicted_yield, recommended_crops }.
    - POST /disease: expects multipart with field image; preprocesses to (224,224) RGB tensor; uses Keras model to predict class index; returns { disease, recommended_pesticide }.
  - Models
    - CatBoostRegressor loaded from absolute path CROP_MODEL_PATH=/Users/girijeshs/Downloads/Brave/crop_yield_model.cbm.
    - Keras model loaded from backend/disease_model.h5.
    - Graceful degradation: if model unavailable, endpoint returns 503 with explanation.
  - Feature mapping
    - Derives Region from lat/long; normalizes Soil_Type/Crop; approximates Rainfall from water_flow; estimates Days_to_Harvest from humidity; Weather_Condition from temperature band.
  - Recommendations
    - Soil-type based crop suggestions + base crop.

- Frontend (React SPA)
  - Routes: /, /predict, /disease with Navbar. Tailwind styling, dark mode toggles, lucide-react icons.
  - PredictYield
    - Form with client-side validation and helpful ranges; geolocation helper; random autofill.
    - Persists last inputs to localStorage; keeps last 5 predictions in memory.
    - Calls POST /predict, visualizes yield via animated counter and charts (Recharts): weather impact, parameter radar, historical line chart.
    - Export JSON and copy-to-clipboard; contextual recommendations.
  - DiseaseDetection
    - Drag-and-drop upload with preview; animated states and dark mode.
    - Currently mocked client-side “AI vision” with probabilistic outcomes; export/share report.
    - Designed to switch to real backend POST /disease.

## 6) Functional Requirements
- Yield Prediction
  - Inputs: temperature (°C), humidity (%), soil_type, crop_type, water_flow (L/min), latitude, longitude.
  - Validate ranges client-side; block submit until valid.
  - On submit, call /predict; show animated yield, recommendation list, and charts.
  - Maintain a short, local history of predictions (5 items). Support export/share.
- Disease Detection
  - Upload one image (JPG/PNG/WebP), preview, analyze.
  - Current: mock results for demo; Future: integrate with backend /disease with real inference.
  - Show confidence, severity, description, treatment recommendations. Support export/share.
- Navigation and Theming
  - Navbar to Home, Predict, Disease. Persist dark mode per session.

## 7) API Contracts
- GET /health
  - Response 200
    ```json path=null start=null
    {
      "status": "ok",
      "crop_model": "ready" | "unavailable: <reason>",
      "disease_model": "ready" | "unavailable: <reason>",
      "model_info": {
        "feature_count": 9,
        "feature_names": ["..."],
        "cat_features": [0, 1]
      }
    }
    ```
- POST /predict
  - Request JSON
    ```json path=null start=null
    {
      "temperature": 26.5,
      "humidity": 65,
      "soil_type": "loamy",
      "crop_type": "wheat",
      "water_flow": 40,
      "latitude": 28.6,
      "longitude": 77.2
    }
    ```
  - Responses
    - 200
      ```json path=null start=null
      {
        "predicted_yield": 5.42,
        "recommended_crops": ["Wheat", "Maize", "Soybean"]
      }
      ```
    - 400
      ```json path=null start=null
      { "error": "Missing fields: temperature, ..." }
      ```
    - 503
      ```json path=null start=null
      { "error": "Crop model unavailable: <reason>" }
      ```
- POST /disease
  - Request: multipart/form-data with field image=@/path/to/leaf.jpg
  - Responses
    - 200
      ```json path=null start=null
      {
        "disease": "Blight",
        "recommended_pesticide": "Use copper-based fungicide and remove infected leaves."
      }
      ```
    - 400/503/500 with { "error": string }

## 8) Data and Models
- CatBoost feature frame (derived): Region, Soil_Type, Crop, Rainfall_mm, Temperature_Celsius, Fertilizer_Used, Irrigation_Used, Weather_Condition, Days_to_Harvest.
- Model provisioning
  - Absolute path for CatBoost model must exist; consider env var override and relative pathing for portability.
  - Keras CNN file backend/disease_model.h5; consider including class_names mapping.
- Preprocessing
  - Image resized to 224x224 RGB; normalized to [0,1]; batch dimension added.

## 9) Non-Functional Requirements
- Performance: See metrics above; initial model load may take seconds but should be done at app start when possible.
- Reliability: Clear 4xx/5xx errors; health endpoint for readiness.
- Security: CORS limited to frontend origin in production; reject oversized images; validate and sanitize inputs; avoid path traversal; rate limiting for /disease.
- Privacy: No PII collected; images not persisted by default.
- Accessibility: Color contrast, keyboard navigability, ARIA labels on actionable elements.
- Observability: Structured logs for request id, latency, error; health metrics; optional request sampling.

## 10) UX and Content Guidelines
- Use consistent units (°C, %, L/min). Show typical ranges as hints.
- Provide actionable, non-alarming language for recommendations.
- Explain errors succinctly and how to fix them.
- **Agriculture Theme Requirements**:
  - Color palette: Earthy greens (#10b981, #059669, #047857), warm ambers (#f59e0b, #d97706), natural browns, and deep slate backgrounds.
  - Typography System:
    - Headings: **Plus Jakarta Sans** (700-800 weight) - Modern, geometric, excellent for digital agriculture branding.
    - Body: **Inter** (400-600 weight) - Supreme readability, optimized for screens, variable font support.
    - Display/Hero: **Cabinet Grotesk** or **Clash Display** (700-800 weight) - Bold, attention-grabbing for landing pages.
    - Mono/Data: **JetBrains Mono** or **Fira Code** - For technical data, code snippets, and precise values.
    - Font loading: Use next/font or @fontsource for optimized loading; fallback to system fonts (ui-sans-serif).
  - Imagery and iconography: Use leaf, plant, sun, water, soil motifs; lucide-react icons with agriculture context.
  - Visual hierarchy: Large hero sections, clear CTAs, ample whitespace, card-based layouts with subtle shadows and borders.
  - Micro-interactions: Smooth transitions, hover states, animated counters, progressive disclosure for complex data.
  - Accessibility: WCAG AA contrast ratios, keyboard navigation, ARIA labels, responsive touch targets (min 44x44px).
  - Mobile-first: Fully responsive; optimize for tablet use in fields; ensure forms work well with gloves or stylus.
  - **UI Framework & Libraries**:
    - Consider **Framer Motion** for advanced animations (page transitions, chart entry, micro-interactions).
    - Consider **Radix UI** or **Headless UI** for accessible, unstyled primitives (dropdown, dialog, tooltip, accordion).
    - Consider **React Hook Form** for performant form management with validation.
    - Keep **Recharts** for data visualization; enhance with custom themes and animations.
    - Optional: **React Spring** for physics-based animations (floating elements, parallax).

## 11) Rollout Plan
- Phase 1: Stabilize /predict with real model; keep disease mock.
- Phase 2: Integrate real /disease model; add class labels and confidence.
- Phase 3: Improve portability (env-configured model paths), add S3/GCS-backed model store, basic analytics.

## 12) Testing Strategy
- Backend: unit tests for preprocessing, recommendation logic, and endpoint contracts; integration tests with fixture models; image pipeline tests.
- Frontend: component tests for validation; API mocks; visual regression for key charts; E2E happy-path for /predict and /disease.

## 13) Risks and Mitigations
- Hardcoded model path breaks portability → Mitigate via env var (e.g., CROP_MODEL_PATH) and configurable config file.
- Model drift / mismatch with feature engineering → Version features and models; include health metadata checks.
- Large image uploads → Enforce size/type limits and timeouts; progressive resizing client-side.

## 14) Open Questions
- Do we require multi-language support? If yes, which locales first?
- Should prediction and disease results be stored server-side for audit/history?
- How are pesticide recommendations localized for regulation and availability?

## 15) Roadmap Highlights
- Short-term: env-based model paths; real /disease; better error surfaces.
- Mid-term: user accounts and saved reports; shareable links; basic role-based access.
- Long-term: satellite/weather integration; seasonal forecasts; offline-capable PWA.

## 16) Developer Appendix
- Backend commands
  ```bash path=null start=null
  python3 -m venv .venv
  source .venv/bin/activate
  pip install -r backend/requirements.txt
  cd backend
  flask --app app run --host 0.0.0.0 --port 5000 --debug
  ```
- Health and sample requests
  ```bash path=null start=null
  curl -s http://localhost:5000/health | jq .
  curl -s http://localhost:5000/predict \
    -H 'Content-Type: application/json' \
    -d '{
      "temperature": 26.5,
      "humidity": 65,
      "soil_type": "loamy",
      "crop_type": "wheat",
      "water_flow": 40,
      "latitude": 28.6,
      "longitude": 77.2
    }' | jq .
  curl -s -X POST http://localhost:5000/disease -F image=@/absolute/path/to/leaf.jpg | jq .
  ```
- Frontend commands
  ```bash path=null start=null
  cd frontend
  npm install
  REACT_APP_API_URL=http://localhost:5000 npm start
  ```

---

## 17) Prompt for Opus 4.1 (Engineering Assistant)
Use this prompt when working on this repository to plan, implement, and review changes with maximum rigor.

```text path=null start=null
You are Opus 4.1, an expert staff+ software engineer, ML engineer, and product partner working on the "Crop Intelligence Platform" (React frontend + Flask backend). Your job: plan precisely, implement safely, and deliver production-grade outcomes with clear diffs and commands.

Context
- Product: Crop yield prediction (/predict) and plant disease detection (/disease).
- Frontend: React (CRA), Tailwind, Recharts; routes: /, /predict, /disease; localStorage for form persistence; mock disease flow.
- Backend: Flask, CORS; CatBoost for yield (model path configurable), Keras CNN for disease (backend/disease_model.h5); /health for readiness.

Operating Principles
1) Always restate the task, constraints, and acceptance criteria.
2) Propose a minimal, testable plan with clear steps (<=7), risks, and rollback.
3) Make small, verifiable diffs; keep consistent style and patterns already used in the repo.
4) Validate contracts: JSON schemas, status codes, and error messages remain consistent.
5) Add necessary logs/guards, but avoid scope creep.
6) Prefer configuration over hardcoding; don’t break local dev.
7) When done, list exact local commands to run: install, start, lint, typecheck, test.

When Editing Code
- For API changes: update request/response validation, error handling, docstrings, and examples.
- For frontend: maintain accessibility (labels, ARIA), validation, and dark mode variants.
- Keep endpoints and environment variables documented. Add defensive checks (nulls, timeouts, sizes).

Frontend Design Principles (Agriculture Theme)
- Color System:
  - Primary: Emerald greens (#10b981, #059669, #047857) for CTAs, success states, agricultural context.
  - Accent: Warm amber (#f59e0b, #d97706) for highlights, warnings, and energy.
  - Neutrals: Deep slate backgrounds (#0f172a, #1e293b), stone/gray for text and borders.
  - Semantic: Green for healthy/positive, amber for caution, red for errors/disease.
- Typography System:
  - Install fonts via @fontsource or Google Fonts with preconnect.
  - Headings: font-heading (Plus Jakarta Sans, 700-800 weight), tracking-tight for impact.
  - Body: font-body (Inter, 400-500 weight), leading-relaxed for readability.
  - Display: font-display (Cabinet Grotesk or Clash Display, 700-800 weight) for hero sections only.
  - Data/Mono: font-mono (JetBrains Mono or Fira Code, 400-600 weight) for numeric values, technical data.
  - Scale: text-xs (0.75rem) → text-sm (0.875rem) → text-base (1rem) → text-lg (1.125rem) → text-xl (1.25rem) → text-2xl-7xl for headings.
  - Letter spacing: tracking-tight for large headings, tracking-normal for body, tracking-wide for labels/caps.
- Component Styling:
  - Cards: Glass-morphism (backdrop-blur-md, bg-white/5 or bg-slate-800/50, border-white/10), rounded-2xl, shadow-xl.
  - Buttons: Solid primary with hover:scale-105, active:scale-95, transition-all duration-300, disabled states with opacity-50.
  - Forms: Large inputs (px-4 py-3), rounded-xl borders, focus:ring-2 ring-emerald-500/50, inline validation icons.
- UI Framework Integration:
  - Framer Motion: Wrap pages/sections in <motion.div> with initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.5}}.
  - Radix/Headless UI: Use for Dropdown, Dialog, Tooltip with custom Tailwind styling matching agriculture theme.
  - React Hook Form: useForm() with zodResolver for validation; display errors inline with icons.
  - Recharts: Apply custom theme via components (CartesianGrid, Tooltip, Legend) with agriculture colors.
- Animations:
  - Page load: Staggered fade-in for cards (animate-slide-up with delays).
  - User actions: Button scale, input focus glow, success checkmarks with bounce.
  - Data viz: Chart bars animate from 0 with ease-out, counters increment smoothly.
- Iconography:
  - Use lucide-react: Leaf, Sprout, Sun, Droplets, Wheat, BarChart3, Shield, TrendingUp, AlertTriangle.
  - Consistent sizing (size={20} for inline, size={24} for headings, size={48} for heroes).
  - Color icons semantically: text-emerald-500 for positive, text-amber-500 for caution.
- Background Patterns:
  - Subtle SVG patterns (leaves, grids) with opacity-5 to opacity-10, fixed positioning, pointer-events-none.
  - Gradient overlays: from-emerald-500/10 to-transparent for depth.
- Responsive:
  - Mobile: Single column, collapsible sections, bottom sheets for actions, min-touch-target 44px.
  - Tablet: Two-column grids, side-by-side form and results.
  - Desktop: Three-column layouts, sticky sidebars, hover interactions.

Testing Requirements
- Add/adjust unit tests and integration tests for new logic, including edge cases.
- For frontend: component tests for form validation and API error surfaces.
- For backend: tests for preprocessing, model presence absence, and image flow.

Deliverables Format
- Provide a bullet list: Goals, Plan (steps), Risks/Mitigations, and Verification Checklist.
- Provide unified diffs or file patches for each change.
- Provide commands to run (backend and frontend) to validate changes locally.

Frontend Enhancement Deliverables (when redesigning UI)
- **Dependencies**: List npm install command with all new packages (@fontsource fonts, framer-motion, @headlessui/react, react-hook-form, zod).
- **Tailwind Config**: Update with agriculture color tokens, font families (heading, body, display, mono), custom animations, extended theme.
- **Font Setup**: Show @import statements in index.css with specific weights; verify font loading in browser DevTools.
- **Component Rewrites**: Provide complete component files (not partial edits) for major pages (Home, PredictYield, DiseaseDetection).
- **Inline Documentation**: Add comments explaining agriculture theme choices ("// Emerald gradient represents crop growth", "// Plus Jakarta Sans for modern agriculture branding").
- **Before/After**: Show key changes ("Previous: plain white card → New: glass-morphism with leaf pattern background", "Previous: basic button → New: Framer Motion with scale animation").
- **Icon Audit**: List all new lucide-react icons used and their semantic meaning in agriculture context.
- **Animation Catalog**: Document all Framer Motion animations: page transitions, button interactions, chart entry, floating elements.
- **Form Validation**: Show React Hook Form + Zod schema implementation with agriculture-specific validation messages.
- **Responsive Testing**: Verify at 375px (mobile), 768px (tablet), 1280px (desktop); screenshot key states.
- **Accessibility Checklist**: 
  - Color contrast ratios (use WebAIM checker): all text ≥4.5:1, large text ≥3:1.
  - Keyboard navigation: Tab through all interactive elements, visible focus indicators.
  - Screen reader labels: All form inputs, buttons, icons have aria-label or aria-describedby.
  - Touch targets: Min 44x44px for all buttons/links.
- **Copy/Content**: Provide agriculture-focused copy ("Optimize Your Harvest", "Cultivate Success", "Protect Your Crops").
- **Performance**: Check bundle size impact of new fonts/libraries; use React.lazy for code splitting if needed.

Examples of Common Tasks
A) Make /disease use the real backend:
- Add a toggle in frontend to switch between mock and server mode (env or UI switch).
- Implement axios POST multipart with field name image; show server errors inline.
- Backend: ensure size/type checks; 413 for oversized; 415 for unsupported type.

B) Make model paths configurable:
- Introduce env var CROP_MODEL_PATH; fallback to existing path for backward compatibility.
- Update /health to expose whether env overrides are used; update README.

C) Improve input validation:
- Backend: strict type/range checks; meaningful 400 errors; keep the same field names.
- Frontend: inline errors and disabled submit until valid.

D) Enhance frontend with agriculture theme:
- Install dependencies:
  ```bash path=null start=null
  npm install @fontsource/plus-jakarta-sans @fontsource/inter @fontsource/jetbrains-mono framer-motion @headlessui/react react-hook-form @hookform/resolvers zod
  ```
- Update tailwind.config.js with agriculture color palette (earthy greens: #10b981, #059669, #047857; warm accents: #f59e0b, #d97706; neutrals: slate/stone).
- Add font families to tailwind.config.js:
  ```js path=null start=null
  fontFamily: {
    heading: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
    body: ['Inter', 'system-ui', 'sans-serif'],
    display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
  }
  ```
- Import fonts in index.css:
  ```css path=null start=null
  @import '@fontsource/plus-jakarta-sans/400.css';
  @import '@fontsource/plus-jakarta-sans/700.css';
  @import '@fontsource/plus-jakarta-sans/800.css';
  @import '@fontsource/inter/400.css';
  @import '@fontsource/inter/500.css';
  @import '@fontsource/inter/600.css';
  @import '@fontsource/jetbrains-mono/400.css';
  ```
- Redesign Home page: Hero with agriculture imagery/gradient, feature cards with icons (Leaf, Sprout, BarChart3, Shield), animated stats section, strong CTA.
- Enhance form pages: 
  - Use glass-morphism cards (backdrop-blur-md, rgba backgrounds, border-white/10).
  - Add agriculture-themed background patterns (SVG leaves, fields, grids).
  - Improve input styling: larger touch targets, clear focus states, inline validation with icons.
  - Add contextual tooltips and helper text with agriculture terminology.
- Improve charts and data viz:
  - Use agriculture color scheme in Recharts (greens for positive, ambers for caution).
  - Add legends, grid lines, responsive containers.
  - Animate chart entry (staggered bars, line drawing).
- Add micro-interactions:
  - Button hover states with scale transforms and shadow changes.
  - Loading states with agriculture-themed spinners (e.g., rotating leaf icon).
  - Success animations (checkmark with scale-in, confetti for high yield).
  - Smooth page transitions and element fade-ins.
- Maintain dark mode with proper contrast and agriculture feel (deep slate bg, emerald accents).
- Ensure mobile responsive: stack cards vertically, collapsible sections, bottom-sheet modals, larger tap targets.

E) Redesign a specific page component (example: Hero section with Framer Motion):
- Use full viewport height (min-h-screen) with gradient background (from-slate-900 via-emerald-950 to-slate-900).
- Wrap in motion.div with staggered children:
  ```jsx path=null start=null
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2 }
      }
    }}
  >
  ```
- Add animated background: floating SVG leaf/plant elements with Framer Motion's animate prop (y: [0, -20, 0], transition: { repeat: Infinity, duration: 8 }).
- Hero content: Large heading (text-5xl md:text-7xl font-heading font-bold tracking-tight), gradient-text utility class, agriculture-focused copy.
- Animate heading with motion variants:
  ```jsx path=null start=null
  variants={{
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }}
  ```
- Primary CTA: Large button (px-8 py-4 text-lg font-heading) with emerald gradient, white text, motion.button with whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}.
- Add visual elements: Decorative icons (Sprout, Leaf) positioned absolutely with motion.div and animate={{ rotate: [0, 5, 0] }}.
- Include trust indicators: Small stat badges ("10K+ Predictions", "95% Accuracy") with icons, fade-in with delay.

F) Enhance form input component with React Hook Form:
- Setup form with validation:
  ```jsx path=null start=null
  import { useForm } from 'react-hook-form';
  import { zodResolver } from '@hookform/resolvers/zod';
  import * as z from 'zod';

  const schema = z.object({
    temperature: z.number().min(-50).max(60),
    humidity: z.number().min(0).max(100),
    // ... other fields
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });
  ```
- Wrap in relative container for icon positioning.
- Input: w-full px-4 py-3.5 rounded-xl bg-slate-800/50 border-2 border-slate-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 font-body text-slate-100.
- Label: flex items-center gap-2 text-sm font-semibold text-slate-300 font-heading, include relevant icon (Thermometer, Droplets).
- Register input: {...register('temperature', { valueAsNumber: true })}.
- Validation: Show inline error with AlertTriangle icon (text-red-400) or success with CheckCircle (text-emerald-400).
  ```jsx path=null start=null
  {errors.temperature && (
    <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
      <AlertTriangle size={12} />
      {errors.temperature.message}
    </p>
  )}
  ```
- Helper text: text-xs text-slate-400 font-body with contextual agriculture info ("Typical range for wheat: 20-30°C").

G) Improve chart visualization:
- Wrap ResponsiveContainer with card styling (rounded-2xl, backdrop-blur-md, p-6).
- Use agriculture color scheme: bars fill="#10b981", lines stroke="#059669", areas with gradient from emerald to transparent.
- Add CartesianGrid with strokeDasharray="3 3" stroke="#334155".
- Tooltip with custom styling: dark background, rounded, emerald accent border.
- Include descriptive title with icon (TrendingUp, BarChart3) above chart.
- Animate chart entry: add CSS transitions or recharts animation props.

Output Contract
- Never remove user-specific configs without explicit instruction.
- Never change routes or API shapes without calling it out and updating all references.
- Always include a short migration note if breaking changes are introduced.
```
