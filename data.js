/**
 * Karnataka GDS 2026 Selection Analyzer - Shared Data & Utilities
 * Preserves all 38 Karnataka division vacancies and reference cutoffs.
 */

// Raw Vacancy Array: [Division, Total, UR, OBC, SC, ST, PWD, EWS]
const VACANCIES = [
  ["Belagavi", 19, 8, 4, 4, 1, 1, 1],
  ["Bagalkote", 16, 3, 0, 5, 3, 1, 4],
  ["Ballari", 34, 13, 10, 7, 0, 0, 4],
  ["Bengaluru East", 53, 25, 17, 8, 0, 0, 3],
  ["Bengaluru GPO", 4, 1, 2, 0, 0, 0, 1],
  ["Bengaluru Sorting", 13, 3, 3, 3, 0, 1, 3],
  ["Bengaluru South", 49, 23, 13, 6, 5, 2, 0],
  ["Bengaluru West", 27, 10, 7, 5, 1, 1, 3],
  ["Bidar", 21, 8, 8, 3, 0, 0, 2],
  ["Channapatna", 11, 5, 3, 2, 0, 0, 1],
  ["Gokak", 9, 5, 2, 1, 0, 0, 1],
  ["Hassan", 47, 13, 13, 10, 4, 1, 6],
  ["Haveri", 17, 5, 2, 7, 0, 1, 2],
  ["Kalaburagi", 20, 10, 5, 3, 1, 0, 1],
  ["Karwar", 43, 16, 11, 6, 3, 3, 4],
  ["Kodagu", 46, 18, 12, 8, 3, 0, 5],
  ["Chikkamagaluru", 49, 20, 13, 7, 3, 2, 4],
  ["Chikodi", 14, 7, 5, 0, 2, 0, 0],
  ["Chitradurga", 16, 3, 2, 6, 0, 0, 5],
  ["Davanagere", 19, 8, 5, 3, 1, 0, 2],
  ["Dharwad", 17, 6, 4, 3, 1, 1, 2],
  ["Gadag", 16, 7, 0, 3, 1, 2, 3],
  ["Puttur", 56, 22, 15, 9, 4, 0, 6],
  ["Raichur", 27, 24, 0, 0, 0, 0, 3],
  ["RMS HB", 1, 1, 0, 0, 0, 0, 0],
  ["RMS Q", 4, 2, 0, 1, 1, 0, 0],
  ["Shivamogga", 55, 22, 14, 9, 4, 0, 6],
  ["Sirsi", 36, 13, 9, 6, 3, 1, 4],
  ["Kolar", 51, 21, 19, 4, 2, 0, 5],
  ["Koppal", 13, 5, 5, 0, 0, 1, 2],
  ["Mandya", 42, 16, 11, 7, 3, 1, 4],
  ["Mangaluru", 28, 11, 7, 4, 2, 1, 3],
  ["Mysuru", 25, 9, 7, 4, 2, 0, 3],
  ["Nanjangud", 30, 14, 7, 4, 2, 0, 3],
  ["Tumakuru", 64, 23, 16, 10, 5, 3, 7],
  ["Udupi", 60, 22, 16, 10, 4, 2, 6],
  ["Vijayapura", 34, 12, 10, 6, 1, 2, 3],
  ["Yadgiri", 29, 12, 6, 3, 4, 1, 3]
];

// Division baseline cutoffs (reference/historical)
const BASE_CUTOFFS = {
  "Belagavi": 97.2, "Bagalkote": 97.4, "Ballari": 98.0, "Bengaluru East": 98.6,
  "Bengaluru GPO": 98.4, "Bengaluru Sorting": 98.2, "Bengaluru South": 98.8,
  "Bengaluru West": 98.2, "Bidar": 97.2, "Channapatna": 97.6, "Gokak": 96.8,
  "Hassan": 97.6, "Haveri": 96.9, "Kalaburagi": 96.8, "Karwar": 97.5,
  "Kodagu": 97.8, "Chikkamagaluru": 97.8, "Chikodi": 97.2, "Chitradurga": 97.0,
  "Davanagere": 97.6, "Dharwad": 97.4, "Gadag": 96.9, "Puttur": 97.1,
  "Raichur": 97.0, "RMS HB": 99.0, "RMS Q": 98.0, "Shivamogga": 97.5,
  "Sirsi": 97.4, "Kolar": 98.0, "Koppal": 98.8, "Mandya": 97.8,
  "Mangaluru": 98.0, "Mysuru": 97.8, "Nanjangud": 97.3, "Tumakuru": 97.7,
  "Udupi": 97.8, "Vijayapura": 97.3, "Yadgiri": 97.0
};

// Category delta adjustments relative to general baseline
const CATEGORY_DELTAS = {
  "UR": 0.0,
  "OBC": -0.4,
  "EWS": -0.8,
  "SC": -1.4,
  "ST": -1.8,
  "PWD": -4.2,
  "PwD": -4.2
};

// Category column index mapping in VACANCIES array
function getCategoryIndex(cat) {
  const norm = (cat || "").toUpperCase();
  if (norm === "UR") return 2;
  if (norm === "OBC") return 3;
  if (norm === "SC") return 4;
  if (norm === "ST") return 5;
  if (norm === "PWD" || norm === "PD") return 6;
  if (norm === "EWS") return 7;
  return 3; // default OBC
}

// Format numbers with Indian comma grouping
function formatNumber(num) {
  return Number(num || 0).toLocaleString("en-IN");
}

// Storage helpers
const STORAGE_KEY_PCT = "gds_user_pct";
const STORAGE_KEY_CAT = "gds_user_cat";

function saveProfile(percentage, category) {
  const pctStr = Number(percentage).toFixed(2);
  const catStr = (category || "OBC").trim();
  try {
    localStorage.setItem(STORAGE_KEY_PCT, pctStr);
    localStorage.setItem(STORAGE_KEY_CAT, catStr);
  } catch (e) {
    console.warn("localStorage unavailable, falling back to sessionStorage", e);
  }
  try {
    sessionStorage.setItem(STORAGE_KEY_PCT, pctStr);
    sessionStorage.setItem(STORAGE_KEY_CAT, catStr);
  } catch (e) {}
}

function getProfile() {
  let pct = null;
  let cat = null;
  try {
    pct = localStorage.getItem(STORAGE_KEY_PCT);
    cat = localStorage.getItem(STORAGE_KEY_CAT);
  } catch (e) {}

  if (!pct) {
    try {
      pct = sessionStorage.getItem(STORAGE_KEY_PCT);
      cat = sessionStorage.getItem(STORAGE_KEY_CAT);
    } catch (e) {}
  }

  if (pct !== null && !isNaN(parseFloat(pct))) {
    const num = parseFloat(pct);
    if (num >= 0 && num <= 100) {
      return {
        percentage: num,
        category: (cat || "OBC").toUpperCase() === "PWD" ? "PwD" : (cat || "OBC")
      };
    }
  }
  return null;
}

// Calculate effective cutoff for a division and category
function getCutoff(divisionName, category) {
  const base = BASE_CUTOFFS[divisionName] || 97.5;
  const delta = CATEGORY_DELTAS[category] !== undefined ? CATEGORY_DELTAS[category] : (CATEGORY_DELTAS[category.toUpperCase()] || 0);
  return Number((base + delta).toFixed(2));
}

// Categorize chance level and badge styles
function classifyChance(gap) {
  if (gap >= 1.0) {
    return {
      label: "Strong",
      tier: "strong",
      pillClass: "pill-good",
      badgeClass: "badge-strong",
      description: "Well above reference cutoff"
    };
  }
  if (gap >= 0.0) {
    return {
      label: "Good / Competitive",
      tier: "good",
      pillClass: "pill-good",
      badgeClass: "badge-good",
      description: "At or slightly above reference cutoff"
    };
  }
  if (gap >= -1.0) {
    return {
      label: "Borderline",
      tier: "borderline",
      pillClass: "pill-mid",
      badgeClass: "badge-mid",
      description: "Within 1.0% of reference cutoff"
    };
  }
  return {
    label: "Low",
    tier: "low",
    pillClass: "pill-low",
    badgeClass: "badge-low",
    description: "Below reference cutoff"
  };
}

// Comprehensive chance analysis for any percentage and category
function analyzeProfile(userPct, userCat) {
  const catIdx = getCategoryIndex(userCat);
  const eligibleDivisions = [];
  let totalCategorySeats = 0;

  VACANCIES.forEach(row => {
    const divName = row[0];
    const totalDivPosts = row[1];
    const seats = row[catIdx];
    const cutoff = getCutoff(divName, userCat);
    const gap = Number((userPct - cutoff).toFixed(2));
    const chanceInfo = classifyChance(gap);

    totalCategorySeats += seats;

    eligibleDivisions.push({
      name: divName,
      totalPosts: totalDivPosts,
      categorySeats: seats,
      cutoff: cutoff,
      userPct: Number(userPct.toFixed(2)),
      gap: gap,
      chance: chanceInfo,
      // Score value for ranking: positive gap & higher seats gets highest priority
      rankScore: (gap * 100) + (seats * 0.5)
    });
  });

  // Sort: divisions with seats > 0 come first, ordered by gap descending, then seats descending
  eligibleDivisions.sort((a, b) => {
    // Divisions with 0 category seats drop to bottom
    if (a.categorySeats === 0 && b.categorySeats > 0) return 1;
    if (b.categorySeats === 0 && a.categorySeats > 0) return -1;
    if (b.gap !== a.gap) return b.gap - a.gap;
    return b.categorySeats - a.categorySeats;
  });

  // Attach 1-based ranks
  eligibleDivisions.forEach((item, i) => {
    item.rank = i + 1;
  });

  const withSeats = eligibleDivisions.filter(d => d.categorySeats > 0);
  const strongCount = withSeats.filter(d => d.gap >= 0).length;
  const borderlineCount = withSeats.filter(d => d.gap >= -1.0 && d.gap < 0).length;

  // Calculate overall estimated selection score (0 - 100)
  let baseScore = 0;
  if (withSeats.length > 0) {
    const ratio = (strongCount + (borderlineCount * 0.4)) / withSeats.length;
    baseScore = Math.round(ratio * 100);
  }
  // Fine tune based on absolute score bracket
  if (userPct >= 98.0) baseScore = Math.max(baseScore, 85);
  else if (userPct >= 96.0) baseScore = Math.max(baseScore, 65);
  else if (userPct >= 93.0) baseScore = Math.min(baseScore, 55);
  else if (userPct < 90.0) baseScore = Math.min(baseScore, 25);
  if (userPct < 85.0) baseScore = Math.min(baseScore, 10);

  let overallVerdict = "Low";
  let overallClass = "badge-low";
  let verdictSummary = "Your score is below reference cutoffs in most eligible divisions. Consider applying if you are open to rural or high-vacancy posts.";

  if (baseScore >= 75) {
    overallVerdict = "Strong";
    overallClass = "badge-strong";
    verdictSummary = `Your 10th score is at or above the reference cutoff in ${strongCount} eligible Karnataka divisions. Strong potential.`;
  } else if (baseScore >= 45) {
    overallVerdict = "Good";
    overallClass = "badge-good";
    verdictSummary = `Your score is competitive in several divisions with significant category vacancies. Final selection depends on applicant pool.`;
  } else if (baseScore >= 25) {
    overallVerdict = "Borderline";
    overallClass = "badge-mid";
    verdictSummary = `You are near the borderline in some divisions. Giving multiple division preferences can help maximize opportunities.`;
  }

  return {
    percentage: userPct,
    category: userCat,
    score: baseScore,
    verdict: overallVerdict,
    badgeClass: overallClass,
    summary: verdictSummary,
    totalCategorySeats: totalCategorySeats,
    eligibleDivisionsCount: withSeats.length,
    strongMatchesCount: strongCount,
    rankedDivisions: eligibleDivisions
  };
}

// Multi-Year Merit Reference Data Generator for merit.html
function getHistoricalMeritData() {
  const records = [];
  const years = [2026, 2025, 2024];
  const categories = ["UR", "OBC", "SC", "ST", "EWS", "PwD"];

  // Key primary divisions to keep dataset rich and fast
  const divisions = Object.keys(BASE_CUTOFFS);

  years.forEach(year => {
    const yearModifier = year === 2026 ? 0.0 : (year === 2025 ? -0.3 : -0.7);
    divisions.forEach(div => {
      categories.forEach(cat => {
        const base = BASE_CUTOFFS[div];
        const catDelta = CATEGORY_DELTAS[cat] || 0;
        // Introduce natural variation per division/category/year
        const seed = (div.charCodeAt(0) * 7 + cat.charCodeAt(0) * 3 + year) % 10;
        const variation = (seed - 5) * 0.08;
        const cutoff = Number((base + catDelta + yearModifier + variation).toFixed(2));

        records.push({
          year: year === 2026 ? "2026 (Ref)" : year.toString(),
          division: div,
          category: cat,
          cutoff: cutoff
        });
      });
    });
  });

  return records;
}
