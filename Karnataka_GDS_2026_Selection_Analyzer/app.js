/**
 * Karnataka GDS 2026 Selection Analyzer - Home Page Logic (app.js)
 * Validates user input, saves to localStorage/sessionStorage, and navigates to result.html
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("analyzerForm");
  const pctInput = document.getElementById("percentage");
  const catSelect = document.getElementById("category");
  const errorAlert = document.getElementById("errorAlert");

  // If user previously analyzed or saved data, prefill input
  const existingProfile = getProfile();
  if (existingProfile) {
    pctInput.value = existingProfile.percentage;
    if (existingProfile.category) {
      // Handle matching value in dropdown
      for (let i = 0; i < catSelect.options.length; i++) {
        if (catSelect.options[i].value.toUpperCase() === existingProfile.category.toUpperCase()) {
          catSelect.selectedIndex = i;
          break;
        }
      }
    }
  }

  function showError(msg) {
    if (errorAlert) {
      errorAlert.textContent = msg;
      errorAlert.style.display = "block";
    }
    pctInput.focus();
  }

  function clearError() {
    if (errorAlert) {
      errorAlert.style.display = "none";
    }
  }

  // Handle form submission
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      clearError();

      const rawPct = pctInput.value.trim();
      const rawCat = catSelect.value.trim();

      // Validate percentage
      if (!rawPct) {
        showError("Please enter your 10th percentage.");
        return;
      }

      const pctNum = parseFloat(rawPct);
      if (isNaN(pctNum) || pctNum < 0 || pctNum > 100) {
        showError("Please enter a valid percentage between 0.00% and 100.00%.");
        return;
      }

      // Validate category
      if (!rawCat) {
        showError("Please select your reservation category.");
        return;
      }

      // Save percentage and category to localStorage / sessionStorage
      saveProfile(pctNum, rawCat);

      // Navigate to result.html as required
      window.location.href = "result.html";
    });
  }

  // Clear error alert on input change
  if (pctInput) {
    pctInput.addEventListener("input", clearError);
  }
});
