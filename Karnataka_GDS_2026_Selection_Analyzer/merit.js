/**
 * Karnataka GDS 2026 Selection Analyzer - Merit Analysis Logic (merit.js)
 * Evaluates user score against multi-year division and category cutoff benchmarks.
 */

document.addEventListener("DOMContentLoaded", () => {
  const userPctDisplay = document.getElementById("userPctDisplay");
  const userCatDisplay = document.getElementById("userCatDisplay");
  const customScoreInput = document.getElementById("customScoreInput");
  const updateScoreBtn = document.getElementById("updateScoreBtn");

  const filterYear = document.getElementById("filterYear");
  const filterCategory = document.getElementById("filterCategory");
  const filterDivision = document.getElementById("filterDivision");
  const filterStatus = document.getElementById("filterStatus");
  const minCutoff = document.getElementById("minCutoff");
  const maxCutoff = document.getElementById("maxCutoff");

  const meritTableBody = document.getElementById("meritTableBody");

  // Determine active user score & category
  const profile = getProfile() || { percentage: 90.56, category: "OBC" };
  let currentPct = profile.percentage;
  let currentCat = profile.category;

  // Populate Division Dropdown options
  const divisionNames = Object.keys(BASE_CUTOFFS).sort();
  divisionNames.forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    filterDivision.appendChild(opt);
  });

  // Pre-select user's category in filter
  if (currentCat && filterCategory) {
    const norm = currentCat.toUpperCase();
    for (let opt of filterCategory.options) {
      if (opt.value.toUpperCase() === norm) {
        opt.selected = true;
        break;
      }
    }
  }

  // Load all historical records from shared dataset
  const allRecords = getHistoricalMeritData();

  function updateActiveProfileHeader() {
    userPctDisplay.textContent = currentPct.toFixed(2) + "%";
    userCatDisplay.textContent = currentCat;
    customScoreInput.value = currentPct.toFixed(2);
  }

  function render() {
    const selYear = filterYear.value;
    const selCat = filterCategory.value;
    const selDiv = filterDivision.value;
    const selStatus = filterStatus.value;
    const minVal = parseFloat(minCutoff.value) || 0;
    const maxVal = parseFloat(maxCutoff.value) || 100;

    let filtered = allRecords.filter(item => {
      if (selYear !== "ALL" && item.year !== selYear) return false;
      if (selCat !== "ALL" && item.category.toUpperCase() !== selCat.toUpperCase()) return false;
      if (selDiv !== "ALL" && item.division !== selDiv) return false;
      if (item.cutoff < minVal || item.cutoff > maxVal) return false;

      // Status computation
      const diff = currentPct - item.cutoff;
      let statusGroup = "BELOW";
      if (diff >= 0) statusGroup = "ABOVE";
      else if (diff >= -1.0) statusGroup = "BORDERLINE";

      if (selStatus !== "ALL" && statusGroup !== selStatus) return false;

      return true;
    });

    if (filtered.length === 0) {
      meritTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
            No merit records match the selected filter combination.
          </td>
        </tr>
      `;
      return;
    }

    meritTableBody.innerHTML = filtered.map(item => {
      const diff = currentPct - item.cutoff;
      const diffSign = diff >= 0 ? "+" : "";
      let statusBadge = "";

      if (diff >= 0) {
        statusBadge = `<span class="pill pill-good">🟢 Above / Competitive</span>`;
      } else if (diff >= -1.0) {
        statusBadge = `<span class="pill pill-mid">🟡 Borderline</span>`;
      } else {
        statusBadge = `<span class="pill pill-low">🔴 Below</span>`;
      }

      const diffPill = diff >= 0 ? "pill-good" : (diff >= -1.0 ? "pill-mid" : "pill-low");

      return `
        <tr>
          <td><b style="color: var(--gov-green-dark);">${escapeHtml(item.year)}</b></td>
          <td><b>${escapeHtml(item.division)}</b></td>
          <td style="text-align: center;"><span class="profile-pill" style="font-size: 11px; padding: 3px 10px;">${escapeHtml(item.category)}</span></td>
          <td style="text-align: center; font-weight: 700;">${item.cutoff.toFixed(2)}%</td>
          <td style="text-align: center; font-weight: 700; color: var(--gov-green-primary);">${currentPct.toFixed(2)}%</td>
          <td style="text-align: center;">
            <span class="pill ${diffPill}">${diffSign}${diff.toFixed(2)}%</span>
          </td>
          <td style="text-align: center;">${statusBadge}</td>
        </tr>
      `;
    }).join("");
  }

  function escapeHtml(str) {
    return (str || "").replace(/[&<>"']/g, m => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[m]);
  }

  // Event Listeners for Filters
  filterYear.addEventListener("change", render);
  filterCategory.addEventListener("change", render);
  filterDivision.addEventListener("change", render);
  filterStatus.addEventListener("change", render);
  minCutoff.addEventListener("input", render);
  maxCutoff.addEventListener("input", render);

  // Update Score button
  updateScoreBtn.addEventListener("click", () => {
    const val = parseFloat(customScoreInput.value);
    if (isNaN(val) || val < 0 || val > 100) {
      alert("Please enter a valid percentage between 0 and 100.");
      return;
    }
    currentPct = val;
    saveProfile(currentPct, currentCat);
    updateActiveProfileHeader();
    render();
  });

  // Initial setup
  updateActiveProfileHeader();
  render();
});
