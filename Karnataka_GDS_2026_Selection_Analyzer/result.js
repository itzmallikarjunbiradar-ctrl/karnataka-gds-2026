/**
 * Karnataka GDS 2026 Selection Analyzer - Result Page Logic (result.js)
 * Reads profile from storage, evaluates chances dynamically, and renders ranked division opportunities.
 */

document.addEventListener("DOMContentLoaded", () => {
  const noDataFallback = document.getElementById("noDataFallback");
  const resultsContainer = document.getElementById("resultsContainer");

  // Read stored user profile
  const profile = getProfile();

  if (!profile) {
    if (noDataFallback) noDataFallback.style.display = "block";
    if (resultsContainer) resultsContainer.style.display = "none";
    return;
  }

  // Profile exists -> show results
  if (noDataFallback) noDataFallback.style.display = "none";
  if (resultsContainer) resultsContainer.style.display = "block";

  // Elements
  const profilePctEl = document.getElementById("profilePct");
  const profileCatEl = document.getElementById("profileCat");
  const profileSeatsEl = document.getElementById("profileSeats");

  const gaugeCircle = document.getElementById("gaugeCircle");
  const chanceScoreDisplay = document.getElementById("chanceScoreDisplay");
  const chanceHeading = document.getElementById("chanceHeading");
  const chanceBadge = document.getElementById("chanceBadge");
  const chanceSummary = document.getElementById("chanceSummary");

  const statTotalSeats = document.getElementById("statTotalSeats");
  const statEligibleDivs = document.getElementById("statEligibleDivs");
  const statStrongMatches = document.getElementById("statStrongMatches");
  const statTopDiv = document.getElementById("statTopDiv");

  const rankedTableBody = document.getElementById("rankedTableBody");
  const divisionSearch = document.getElementById("divisionSearch");
  const divisionSort = document.getElementById("divisionSort");

  // Quick Edit elements
  const editProfileBtn = document.getElementById("editProfileBtn");
  const quickEditCard = document.getElementById("quickEditCard");
  const closeEditBtn = document.getElementById("closeEditBtn");
  const editPctInput = document.getElementById("editPct");
  const editCatSelect = document.getElementById("editCat");
  const applyEditBtn = document.getElementById("applyEditBtn");

  let currentProfile = { ...profile };
  let currentAnalysis = null;

  function renderView() {
    currentAnalysis = analyzeProfile(currentProfile.percentage, currentProfile.category);

    // 1. Profile Banner
    profilePctEl.textContent = currentProfile.percentage.toFixed(2) + "%";
    profileCatEl.textContent = currentProfile.category;
    profileSeatsEl.textContent = formatNumber(currentAnalysis.totalCategorySeats) + " Posts";

    // 2. Chance Hero Gauge
    const scoreVal = currentAnalysis.score;
    chanceScoreDisplay.textContent = scoreVal + "%";
    if (gaugeCircle) {
      gaugeCircle.style.setProperty("--chance-pct", scoreVal);
    }

    chanceHeading.textContent = currentAnalysis.verdict + " Chance";
    chanceBadge.className = `chance-verdict-badge ${currentAnalysis.badgeClass}`;
    chanceBadge.textContent = currentAnalysis.verdict + " Opportunity";
    chanceSummary.textContent = currentAnalysis.summary;

    // 3. Stats Grid
    statTotalSeats.textContent = formatNumber(currentAnalysis.totalCategorySeats);
    statEligibleDivs.textContent = currentAnalysis.eligibleDivisionsCount;
    statStrongMatches.textContent = currentAnalysis.strongMatchesCount;
    statTopDiv.textContent = currentAnalysis.rankedDivisions.length > 0 ? currentAnalysis.rankedDivisions[0].name : "N/A";

    // 4. Render Table
    filterAndRenderTable();
  }

  function filterAndRenderTable() {
    if (!currentAnalysis) return;

    const searchTerm = (divisionSearch.value || "").trim().toLowerCase();
    const sortMode = divisionSort.value;

    let items = [...currentAnalysis.rankedDivisions];

    // Filter by search query
    if (searchTerm) {
      items = items.filter(d => d.name.toLowerCase().includes(searchTerm));
    }

    // Sort order
    if (sortMode === "seats") {
      items.sort((a, b) => b.categorySeats - a.categorySeats || b.gap - a.gap);
    } else if (sortMode === "cutoff") {
      items.sort((a, b) => a.cutoff - b.cutoff || b.categorySeats - a.categorySeats);
    } else if (sortMode === "alpha") {
      items.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Default: best opportunity (already sorted in analysis)
      items.sort((a, b) => {
        if (a.categorySeats === 0 && b.categorySeats > 0) return 1;
        if (b.categorySeats === 0 && a.categorySeats > 0) return -1;
        if (b.gap !== a.gap) return b.gap - a.gap;
        return b.categorySeats - a.categorySeats;
      });
    }

    if (items.length === 0) {
      rankedTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 36px; color: var(--text-muted);">
            No Karnataka divisions match the search "<b>${escapeHtml(searchTerm)}</b>".
          </td>
        </tr>
      `;
      return;
    }

    rankedTableBody.innerHTML = items.map((item, idx) => {
      const displayRank = idx + 1;
      const rankBadgeClass = displayRank <= 3 ? "rank-badge rank-top" : "rank-badge";
      const diffSign = item.gap >= 0 ? "+" : "";
      const diffPillClass = item.gap >= 0 ? "pill-good" : (item.gap >= -1.0 ? "pill-mid" : "pill-low");
      
      const categorySeatsDisplay = item.categorySeats > 0
        ? `<span style="font-weight: 700; color: var(--gov-green-dark);">${item.categorySeats}</span> <span style="font-size: 11px; color: var(--text-muted);">posts</span>`
        : `<span class="pill pill-low" style="font-size: 11px;">0 seats</span>`;

      return `
        <tr>
          <td><span class="${rankBadgeClass}">${displayRank}</span></td>
          <td>
            <b style="font-size: 14.5px; color: var(--gov-green-dark);">${escapeHtml(item.name)}</b>
            <div style="font-size: 11.5px; color: var(--text-muted);">${item.totalPosts} total division vacancies</div>
          </td>
          <td style="text-align: center;">${categorySeatsDisplay}</td>
          <td style="text-align: center; font-weight: 600;">${item.cutoff.toFixed(2)}%</td>
          <td style="text-align: center; font-weight: 700; color: var(--gov-green-primary);">${item.userPct.toFixed(2)}%</td>
          <td style="text-align: center;">
            <span class="pill ${diffPillClass}">${diffSign}${item.gap.toFixed(2)}%</span>
          </td>
          <td style="text-align: center;">
            <span class="pill ${item.chance.pillClass}">${item.chance.label}</span>
          </td>
        </tr>
      `;
    }).join("");
  }

  function escapeHtml(str) {
    return (str || "").replace(/[&<>"']/g, m => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[m]);
  }

  // Search and Sort listeners
  divisionSearch.addEventListener("input", filterAndRenderTable);
  divisionSort.addEventListener("change", filterAndRenderTable);

  // Quick Edit Drawer handlers
  editProfileBtn.addEventListener("click", () => {
    quickEditCard.style.display = quickEditCard.style.display === "none" ? "block" : "none";
    if (quickEditCard.style.display === "block") {
      editPctInput.value = currentProfile.percentage;
      editCatSelect.value = currentProfile.category;
      editPctInput.focus();
    }
  });

  closeEditBtn.addEventListener("click", () => {
    quickEditCard.style.display = "none";
  });

  applyEditBtn.addEventListener("click", () => {
    const rawPct = parseFloat(editPctInput.value);
    const rawCat = editCatSelect.value;
    if (isNaN(rawPct) || rawPct < 0 || rawPct > 100) {
      alert("Please enter a valid percentage between 0 and 100.");
      return;
    }
    currentProfile = { percentage: rawPct, category: rawCat };
    saveProfile(rawPct, rawCat);
    quickEditCard.style.display = "none";
    renderView();
  });

  // Initial render
  renderView();
});
