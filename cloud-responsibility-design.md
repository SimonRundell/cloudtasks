# Cloud Responsibility Grid: Design Specification

Brief for Claude Code. Build a front-end-only React app from this document.

## 1. Purpose

A classroom activity for 16-19 year old students on NCFE Level 2, BTec Level 3 and T-Level Level 3 courses. It covers the shared responsibility model across four service models: On-premises (private cloud), Infrastructure as a Service (IaaS), Platform as a Service (PaaS) and Software as a Service (SaaS).

The student sees a grid of 32 grey tiles (4 columns by 8 layers). They click each tile to decide who manages that layer: **You** (green) or the **Cloud provider** (blue). When every tile has an answer, a Submit button unlocks. Submitting checks the answers and marks any mistakes. A Reset button restarts the activity.

The look follows the supplied reference graphic: a dark panel, a black first column, lime green and bright blue tiles, bold condensed-feeling column headings with a smaller subtitle, and a legend underneath.

## 2. Scope and constraints

- Front end only. No backend, no database, no login, no API calls, no Axios.
- React + Vite + JavaScript (no TypeScript). Scaffold with `npm create vite@latest` (react template) so the structure matches the standard Vite layout. React code sits in the project root, not in a subfolder.
- One stylesheet only: `src/index.css`. Delete `App.css`. No inline `style` attributes and no CSS-in-JS. Dynamic appearance is driven by `data-*` attributes and class names.
- Every function, component, hook and module gets JSDoc comments.
- No state persistence. A page refresh starts a fresh attempt. This is deliberate and keeps the activity simple.
- Build with plain HTML elements and CSS Grid, not a single SVG. Real `<button>` elements give keyboard support and screen reader support for free. Use small inline SVG only for icons (tick, cross, legend dots).
- After scaffolding, run the pre-approved command: `npx -y react-doctor@latest install`.
- Local testing: if port 5173 is already in use, the Laragon-managed instance is running. Test against it. Do not kill the process or start another dev server.

## 3. The answer key

Layers, top to bottom, with ids in brackets:

1. Data & access (`data`)
2. Applications (`applications`)
3. Runtime (`runtime`)
4. Operating system (`os`)
5. Virtual machine (`vm`)
6. Compute (`compute`)
7. Networking (`networking`)
8. Storage (`storage`)

Correct owner per column. Y = you (green), P = cloud provider (blue).

| Layer | On-premises | IaaS | PaaS | SaaS |
|---|---|---|---|---|
| Data & access | Y | Y | Y | Y |
| Applications | Y | Y | Y | P |
| Runtime | Y | Y | P | P |
| Operating system | Y | Y | P | P |
| Virtual machine | Y | Y | P | P |
| Compute | Y | P | P | P |
| Networking | Y | P | P | P |
| Storage | Y | P | P | P |

The pattern is simple: each column hands one more band of layers to the provider. On-premises hands over none, IaaS hands over the bottom 3, PaaS the bottom 6, SaaS the bottom 7. Store this as a count of "you" layers per model (8, 5, 2, 1) and derive the full key from it. This lets the teacher change the key by editing one number.

Note for the teacher: the key follows the supplied graphic, which puts the virtual machine layer with the customer in IaaS. Some textbooks differ. It is a one-number change if the course materials say otherwise.

## 4. Data module: `src/data/serviceModels.js`

Single source of truth for layers, models, explanations and the key.

```js
/**
 * @typedef {'you' | 'provider'} Owner
 * @typedef {{ id: string, label: string }} Layer
 * @typedef {{
 *   id: string,
 *   title: string,
 *   subtitle: string,
 *   youLayers: number,
 *   explanation: string,
 *   examples: string
 * }} ServiceModel
 */

/** @type {Layer[]} Layers in display order, top to bottom. */
export const LAYERS = [
  { id: 'data', label: 'Data & access' },
  { id: 'applications', label: 'Applications' },
  { id: 'runtime', label: 'Runtime' },
  { id: 'os', label: 'Operating system' },
  { id: 'vm', label: 'Virtual machine' },
  { id: 'compute', label: 'Compute' },
  { id: 'networking', label: 'Networking' },
  { id: 'storage', label: 'Storage' },
];

/** @type {ServiceModel[]} Columns in display order, left to right. */
export const MODELS = [
  {
    id: 'onprem',
    title: 'On-premises',
    subtitle: 'Private cloud',
    youLayers: 8,
    explanation:
      'Everything sits in your own building, so your team looks after every layer, from the hardware up to the data.',
    examples: 'A college server room, a company data centre.',
  },
  {
    id: 'iaas',
    title: 'Infrastructure',
    subtitle: 'as a service',
    youLayers: 5,
    explanation:
      'The provider supplies the physical servers, storage and network. You look after the virtual machine, the operating system and everything above it.',
    examples: 'Amazon EC2, Azure Virtual Machines.',
  },
  {
    id: 'paas',
    title: 'Platform',
    subtitle: 'as a service',
    youLayers: 2,
    explanation:
      'The provider also runs the virtual machines, operating system and runtime. You deploy your own application and manage your data.',
    examples: 'Azure App Service, Heroku.',
  },
  {
    id: 'saas',
    title: 'Software',
    subtitle: 'as a service',
    youLayers: 1,
    explanation:
      'You only look after your own data and who can get at it. The provider runs the application and everything beneath it.',
    examples: 'Microsoft 365, Google Workspace.',
  },
];

/**
 * Derive the correct owner of a layer in a model.
 * @param {ServiceModel} model
 * @param {number} layerIndex Zero-based index into LAYERS.
 * @returns {Owner}
 */
export function correctOwner(model, layerIndex) {
  return layerIndex < model.youLayers ? 'you' : 'provider';
}
```

A cell key is the string `${modelId}.${layerId}`, for example `iaas.runtime`. Provide a `cellKey(modelId, layerId)` helper in `src/lib/cells.js`.

## 5. State design

Use one `useReducer` in a custom hook, `src/hooks/useActivity.js`. Keep the reducer a pure, exported function so it can be unit tested.

State shape:

```js
/**
 * @typedef {{
 *   answers: Record<string, Owner>,   // missing key = grey / unanswered
 *   phase: 'editing' | 'checked',
 *   revealed: boolean                 // show correct answers on wrong tiles
 * }} ActivityState
 */
const initialState = { answers: {}, phase: 'editing', revealed: false };
```

Actions:

| Action | Effect |
|---|---|
| `CYCLE { key }` | Only in `editing`. Moves the tile grey → green (`you`) → blue (`provider`) → grey. |
| `SUBMIT` | Only valid when all 32 tiles are answered. Sets `phase: 'checked'`. |
| `RETRY` | Sets `phase: 'editing'`, `revealed: false`. Keeps all answers so the student can fix their mistakes. |
| `TOGGLE_REVEAL` | Only in `checked`. Flips `revealed`. |
| `RESET` | Returns to `initialState`. Available at all times. |

Derived values (selectors in `src/lib/scoring.js`, all pure and JSDoc'd):

- `answeredCount(answers)` returns 0 to 32.
- `isComplete(answers)` returns true when the count is 32.
- `cellResult(model, layerIndex, answers)` returns `'correct' | 'wrong' | 'unanswered'`.
- `scoreByModel(answers)` returns an object of correct counts per model, each out of 8.
- `totalScore(answers)` returns 0 to 32.

## 6. Component tree

```
App
├─ Header                 title, one-line instruction
├─ Instructions           short how-to (collapsible, open by default)
├─ ProgressBar            "12 of 32 answered" with a native <progress>
├─ ServiceModelGrid       the dark panel, 4 columns
│   └─ ModelColumn ×4     heading, subtitle, 8 tiles, column score after submit
│       └─ LayerTile ×8   a <button>
├─ Legend                 grey / green / blue key
├─ ControlBar             Submit, Reset, then Try again + Show answers after checking
├─ ResultSummary          score, message, per-model explanations (after submit)
├─ LiveRegion             visually hidden aria-live="polite" announcements
└─ Footer                 licence line
```

Props are small and plain. Examples:

- `LayerTile`: `{ modelTitle, layerLabel, value, result, locked, revealedOwner, onCycle }`
- `ModelColumn`: `{ model, answers, phase, revealed, onCycle }`
- `ControlBar`: `{ canSubmit, phase, revealed, onSubmit, onReset, onRetry, onToggleReveal }`

Place components in `src/components/`, one file per component, default exports, JSDoc on each.

## 7. Behaviour in detail

### 7.1 Tiles

- Initial state: every tile grey, label centred, no tag.
- Click, Enter or Space cycles grey → green → blue → grey.
- Each coloured tile shows a small text tag beside the label: **You** on green, **Provider** on blue. Colour must never be the only signal.
- Tiles are `<button type="button">`. Use `data-state="unanswered|you|provider"` on each button and style from that attribute.
- Accessible name pattern: `"{Model title} {subtitle}, {layer label}: {state}"`, for example `"Platform as a service, Runtime: provider manages"`. Use `aria-label`. Do not use `aria-pressed`, because there are three states.
- Minimum touch target 44px high. Tile height about 64px on desktop.

### 7.2 Submit

- Disabled until all 32 tiles are answered. While disabled, show helper text: "Answer every tile to submit (20 to go)".
- Use `aria-disabled` plus a visible disabled style. Keep it focusable so the helper text can be associated via `aria-describedby`.
- On submit the grid locks (tiles get `aria-disabled="true"` and ignore clicks).

### 7.3 Checking and feedback

After submit, every tile gets `data-result="correct|wrong"`.

- Correct tile: keeps its colour, shows a tick icon in the corner.
- Wrong tile: keeps the student's colour, gets a thick red outline (`--c-error`) and a cross icon. A short hatch pattern behind the label helps colour-blind students.
- Each column heading shows a score badge, for example `7 / 8`.
- `ResultSummary` shows the total, for example "You got 29 of 32 correct", with a short message:
  - 32: "Perfect. Every layer is in the right place."
  - 24 to 31: "Nearly there. Check the red tiles and try again."
  - Under 24: "Have another go. Read the notes below, then retry the red tiles."
- Below the total, show the four model cards with `explanation` and `examples` from the data file, so the feedback teaches as well as marks.
- Buttons after checking:
  - **Try again** (primary): clears the red marks, unlocks the grid, keeps the answers.
  - **Show correct answers** (secondary, toggles): wrong tiles show a small line "Should be: You" or "Should be: Provider". Label flips to "Hide correct answers".
  - **Reset**: wipes everything.
- If the score is 32 of 32, hide Try again and the reveal toggle.

### 7.4 Reset

Always visible. Immediate action, no confirmation dialog. Moves focus to the first tile and announces "Activity reset" in the live region.

### 7.5 Focus and announcements

- After Submit, move focus to the `ResultSummary` heading (`tabIndex={-1}`) and announce the score.
- After Try again, move focus to the first wrong tile.
- The live region announces: tile changes ("Runtime set to You manage"), progress at 8, 16, 24 and 32, and results.

## 8. Layout and visual design

### 8.1 Tokens (top of `src/index.css`)

```css
:root {
  --c-page: #f4f5f7;
  --c-panel: #2f3033;
  --c-panel-first: #000000;
  --c-text: #111111;
  --c-text-on-panel: #ffffff;
  --c-text-muted-on-panel: #cfd2d6;

  --c-unanswered: #6b7078;   /* grey tile, white text, about 5:1 contrast */
  --c-you: #8ee000;          /* lime green, dark text */
  --c-provider: #0066e0;     /* blue, white text, about 5.3:1 contrast */
  --c-error: #ff3b30;

  --font-ui: 'Trebuchet MS', 'Segoe UI', sans-serif;
  --radius: 2px;
  --tile-h: 4rem;
  --gap: 0.6rem;
  --focus: 3px solid #ffd60a;
}
```

Blue is slightly deeper than the reference graphic so white text passes AA. Keep lime as in the reference.

### 8.2 Panel

- Outer `.panel`: dark grey `--c-panel`, soft drop shadow, padding about 1.5rem.
- First column (`On-premises`) sits on a black strip, full height, as in the reference.
- Column headings: uppercase, bold, letter-spacing slightly tight, about 1.6rem. Subtitle uppercase, lighter weight, about 0.9rem, wide letter-spacing.
- Grid: `display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--gap)` for the columns, each column a vertical stack of tiles with the same gap.

### 8.3 Tile states

- Unanswered: `--c-unanswered`, white text, label centred.
- You: `--c-you`, dark text, bold.
- Provider: `--c-provider`, white text, bold.
- Hover: lift brightness 8 percent. Active: slight press (scale 0.98). Wrap transitions in `@media (prefers-reduced-motion: no-preference)`.
- Focus-visible: `outline: var(--focus); outline-offset: 2px`.

### 8.4 Responsive

- 900px and wider: four columns in a row.
- 560px to 899px: two columns by two rows of columns.
- Under 560px: one column, each model a stacked card with its own heading.
- Page content max width about 1100px, centred.

### 8.5 Legend

Under the panel, right-aligned on desktop: grey dot "Not chosen yet", green dot "You manage", blue dot "Cloud provider manages". Dots are inline SVG circles coloured via CSS classes using `fill: var(--c-you)` and so on.

## 9. Content text (UK English)

- Title: "Who manages what? Cloud responsibility grid"
- Instruction: "Click each tile to decide who is responsible for that layer. Click once for green (you), twice for blue (the cloud provider), three times to clear it. Answer all 32 tiles, then press Submit."
- Teacher-facing note for the On-premises column, shown as a tooltip or small caption: "With a private cloud there is no outside provider, so every layer is yours." This stops students asking why a blue tile is wrong there.

## 10. File structure

```
cloud-responsibility/
├─ index.html
├─ package.json
├─ vite.config.js
├─ eslint.config.js
├─ README.md
├─ LICENSE.md                 CC BY-NC-SA 4.0 precis and link
├─ public/
│   └─ .htaccess              copied to dist on build
└─ src/
    ├─ main.jsx
    ├─ App.jsx
    ├─ index.css              the only stylesheet
    ├─ data/serviceModels.js
    ├─ lib/cells.js
    ├─ lib/scoring.js
    ├─ hooks/useActivity.js
    └─ components/
        Header.jsx  Instructions.jsx  ProgressBar.jsx  ServiceModelGrid.jsx
        ModelColumn.jsx  LayerTile.jsx  Legend.jsx  ControlBar.jsx
        ResultSummary.jsx  LiveRegion.jsx  Footer.jsx  Icons.jsx
```

Set `base: './'` in `vite.config.js` so the build works from a sub-folder on Hostinger or Dreamhost. Remove unused Vite template assets and `App.css`.

## 11. Deployment files

`public/.htaccess` (use exactly this, plus the config block):

```apache
RewriteEngine On

# Let real files/directories (including /api/*) resolve normally.
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# Everything else falls back to index.html so React Router can handle
# client-side routes (e.g. a hard refresh).
RewriteRule ^ index.html [L]

# Never expose the config file to the browser.
<FilesMatch "^\.config\.json$">
    Require all denied
</FilesMatch>
```

This app has no `.config.json`, but the block stays in as a standing safeguard. After `npm run build`, confirm `dist/.htaccess` exists.

## 12. Licence and documentation

- Release under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International.
- `README.md` and `LICENSE.md` must each include a short precis: you may share and adapt the work for non-commercial purposes, you must give credit and note any changes, and adaptations must be shared under the same licence. Link to the full terms: https://creativecommons.org/licenses/by-nc-sa/4.0/
- The in-app footer carries one line: "Licensed CC BY-NC-SA 4.0" linking to the same URL.
- README sections: what it is, how to run (`npm install`, `npm run dev`, `npm run build`), how to edit the answer key (the `youLayers` numbers), the licence precis.
- Author line: Simon Rundell, Exeter College. Do not mention any private company.

## 13. Testing

Add Vitest and React Testing Library as dev dependencies.

Unit tests:
- Reducer: cycle order, no cycling while checked, submit blocked when incomplete, retry keeps answers, reset clears all.
- Scoring: all-correct returns 32, all-wrong returns 0 for an inverted set, per-model counts, `correctOwner` for each model boundary (8, 5, 2, 1).

Component tests:
- Submit is disabled with 31 answers and enabled with 32.
- Submitting a deliberately wrong tile marks it `data-result="wrong"` and shows the cross.
- Reset returns every tile to `data-state="unanswered"`.

Also run `npm run lint` and the react-doctor checks. Fix everything raised.

## 14. Acceptance checklist

- [ ] All 32 tiles start grey.
- [ ] Click cycles grey, green, blue, grey. Tag text shows You or Provider.
- [ ] Keyboard only operation works, with a clear focus ring.
- [ ] Submit disabled until 32 answers, with a helper count.
- [ ] Submit marks wrong tiles in red with a cross, correct tiles with a tick.
- [ ] Column scores and total score display correctly against the key in section 3.
- [ ] Try again keeps answers; Show correct answers reveals the right owner; Reset clears everything.
- [ ] Layout holds at 1280px, 768px and 375px widths.
- [ ] No inline styles, one CSS file, JSDoc on every function and component.
- [ ] Contrast meets WCAG 2.1 AA, and colour is never the only cue.
- [ ] `.htaccess` is present in `dist` and blocks `.config.json`.
- [ ] README and LICENSE.md carry the CC BY-NC-SA 4.0 precis and link.
- [ ] react-doctor installed and clean.

## 15. Suggested build order for Claude Code

1. Scaffold with `npm create vite@latest`, choose React and JavaScript, then run the react-doctor install command.
2. Strip template files, create the folder structure, add `public/.htaccess`.
3. Write `serviceModels.js`, `cells.js`, `scoring.js` and the reducer hook, with tests.
4. Build `LayerTile`, `ModelColumn` and `ServiceModelGrid` with the CSS tokens and tile states.
5. Add `ControlBar`, `ProgressBar`, `Legend` and the submit and reset flow.
6. Add `ResultSummary`, feedback marks, Try again and reveal.
7. Add `LiveRegion`, focus management and the responsive breakpoints.
8. Write README and LICENSE.md, run lint, tests and build, then check the acceptance list.
