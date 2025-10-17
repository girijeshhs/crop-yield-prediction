GrokChanges: Fix Predict Yield button and UI refinements

Goal
- Improve the "Predict Yield" CTA button so it looks modern, balanced, and consistent with the simplified white + green design. Make it accessible, responsive, and visually prominent without overpowering the page.

Context
- Current site uses Inter font, white backgrounds, and green accents.
- The attached screenshot shows the Predict Yield button currently too wide, gradient-heavy, and visually unbalanced (left side of image). We're targeting a compact, elevated CTA that fits the left column form.

Acceptance criteria
- Button width should match the form column (not full page width) and align with inputs.
- Visual hierarchy: primary green background (#10b981), white text, slight rounded corners (10-12px), subtle shadow, and clear hover/focus states (darken green, small lift).
- Mobile: button full-width within its column; desktop: inline with secondary buttons horizontally.
- Accessibility: text contrast meets AA, button has aria-label, keyboard focus visible (outline or ring).
- Implementation should be simple, using Tailwind classes already present in the project.

Prompts for Grok (highly-focused, actionable)

1) "Redraw Predict Yield CTA to match form column"
- "Inspect `src/components/Hero.jsx` and `src/pages/PredictYield.js`. Replace the current Predict Yield button with a compact primary button using Tailwind: `px-6 py-3 rounded-lg bg-primary text-white font-medium shadow-md hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-primary/50 transition-transform transform-gpu will-change-transform`.
- Ensure button uses a `Link` or `NavLink` to route to `/predict`.
- Keep an adjacent secondary button (white with green border) for `Disease Detection`.
- Provide the exact patch (file, lines) to modify and the final rendered HTML snippet.
- Verify keyboard and contrast accessibility and list testing steps (desktop, tablet, mobile)."

2) "Fix padding and alignment"
- "Adjust the parent container to use `max-w-[620px]` on form column and center CTA within that column; provide exact CSS/Tailwind changes to `Hero.jsx` or page wrapper."

3) "Provide quick visual QA steps"
- "List 5 quick checks to validate the fix: rendering, hover, focus, mobile stacking, keyboard navigation."

4) "If the button is still too wide after applying Tailwind classes, propose alternative class combos and explain why each helps." 

Developer notes
- Keep things minimal and consistent with the project's existing Tailwind tokens: `primary`, `secondary`, `background`, `text`, `accent`.
- Prefer `Link` from `react-router-dom` for client-side routing.
- If the project uses a global component for buttons, prefer reuse; otherwise add the Tailwind classes inline.


Extras (optional)
- Suggest a 1-line micro-interaction (e.g., tiny transform on hover) and a 1-line CSS fallback for environments where Tailwind's JIT isn't available.

---

Use this file as the starting point for Grok (or a human reviewer) to apply a focused change to the CTA button. Keep answers short and include code snippets and exact file locations for edits.