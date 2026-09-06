# Karnataka GDS 2026 Selection Analyzer

A multi-page web application designed for Karnataka Gramin Dak Sevak (GDS) applicants to analyze their 10th Standard merit standing, compare marks against historical division cutoffs, and explore 1,115 vacancies across all 38 Karnataka postal divisions.

## Application Architecture & Pages

- **`index.html` (Page 1 — Home / Input)**:
  - Clean hero interface for entering 10th percentage and reservation category (UR, OBC, SC, ST, EWS, PwD).
  - Validates score (0.00% – 100.00%) and persists candidate profile via `localStorage` and `sessionStorage`.
  - Clicking **"ANALYZE →"** navigates to `result.html` without cluttering the landing page.

- **`result.html` (Page 2 — Result / Analysis Report)**:
  - Displays candidate summary profile banner with 1-click quick score adjustment.
  - Large visual **Estimated Selection Chance** circular gauge and verdict (Strong, Good, Borderline, Low).
  - Prominent disclaimer clarifying that this is an estimated analysis and not an official India Post guarantee.
  - Automatically ranked table of Karnataka divisions from **BEST opportunity to WORST opportunity** for any percentage and category.
  - Built-in search, sorting, and direct navigation buttons to All Posts and Merit Analysis.
  - Fallback prompt (`"Please enter your GDS details first."` with `"GO TO HOME →"`) if accessed directly.

- **`posts.html` (Page 3 — All Karnataka Posts Explorer)**:
  - Official breakdown of all 1,115 vacancies across all 38 divisions.
  - Category filter dropdown with real-time column highlighting and filtered vacancy totals.
  - Real-time search and multi-column sorting (by division name or category seats).

- **`merit.html` (Page 4 — Merit Analysis & Historical Cutoffs)**:
  - Multi-cycle cutoff intelligence (2026 Reference, 2025, 2024 cycles) per division and reservation category.
  - Real-time difference calculation with status indicators:
    - 🟢 Above / Competitive
    - 🟡 Borderline
    - 🔴 Below
  - Filters by cycle year, category, division, status, and min/max percentage range.

- **`data.js`**: Shared data layer containing all 38 divisions, vacancy counts, reference baseline cutoffs, storage helpers, and chance classification algorithms.
- **`styles.css`**: Government portal design system featuring dark postal green (`#0f5132`), clean white backgrounds, elevated cards, and mobile-responsive layouts.

## How to Run

1. **Direct file access**: Open `index.html` in Chrome, Edge, or Firefox. No build step or installation required.
2. **Local HTTP Server**:
   ```powershell
   python -m http.server 8080
   ```
   Open `http://localhost:8080` in your web browser.

## Important Data Note
The vacancy figures are transcribed from available Karnataka notification data (1,115 vacancies across 38 divisions). Merit and cutoff values serve as reference baselines. Always consult the official India Post GDS recruitment portal for definitive selection notifications and lists.
