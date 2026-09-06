/**
 * Karnataka GDS 2026 Selection Analyzer - Posts Directory Logic (posts.js)
 * Displays all 38 Karnataka divisions, handles search, column sorting, and category filters.
 */

document.addEventListener("DOMContentLoaded", () => {
  const postSearch = document.getElementById("postSearch");
  const categoryFilter = document.getElementById("categoryFilter");
  const postSort = document.getElementById("postSort");
  const postsTableBody = document.getElementById("postsTableBody");
  const postsTableFoot = document.getElementById("postsTableFoot");

  const statTotalPosts = document.getElementById("statTotalPosts");
  const statUR = document.getElementById("statUR");
  const statOBC = document.getElementById("statOBC");
  const statSCST = document.getElementById("statSCST");
  const statEWSPWD = document.getElementById("statEWSPWD");

  const activeFilterBadge = document.getElementById("activeFilterBadge");
  const activeFilterName = document.getElementById("activeFilterName");
  const activeFilterCount = document.getElementById("activeFilterCount");

  // Format VACANCIES array into objects for easier manipulation
  // Format: [Division, Total, UR, OBC, SC, ST, PWD, EWS]
  const rows = VACANCIES.map(r => ({
    name: r[0],
    total: r[1],
    ur: r[2],
    obc: r[3],
    sc: r[4],
    st: r[5],
    pwd: r[6],
    ews: r[7]
  }));

  // Calculate overall circle totals
  const overallTotals = rows.reduce((acc, cur) => {
    acc.total += cur.total;
    acc.ur += cur.ur;
    acc.obc += cur.obc;
    acc.sc += cur.sc;
    acc.st += cur.st;
    acc.pwd += cur.pwd;
    acc.ews += cur.ews;
    return acc;
  }, { total: 0, ur: 0, obc: 0, sc: 0, st: 0, pwd: 0, ews: 0 });

  // Update summary stat cards
  if (statTotalPosts) statTotalPosts.textContent = formatNumber(overallTotals.total);
  if (statUR) statUR.textContent = formatNumber(overallTotals.ur);
  if (statOBC) statOBC.textContent = formatNumber(overallTotals.obc);
  if (statSCST) statSCST.textContent = formatNumber(overallTotals.sc + overallTotals.st);
  if (statEWSPWD) statEWSPWD.textContent = formatNumber(overallTotals.ews + overallTotals.pwd);

  // If user has saved profile, pre-select that category filter
  const profile = getProfile();
  if (profile && profile.category && categoryFilter) {
    const pCat = profile.category.toUpperCase();
    for (let opt of categoryFilter.options) {
      if (opt.value.toUpperCase() === pCat) {
        opt.selected = true;
        break;
      }
    }
  }

  function render() {
    const q = (postSearch.value || "").trim().toLowerCase();
    const cat = (categoryFilter.value || "ALL").toUpperCase();
    const sort = postSort.value;

    let filtered = rows.filter(r => {
      const matchesSearch = r.name.toLowerCase().includes(q);
      if (!matchesSearch) return false;

      if (cat === "ALL") return true;
      if (cat === "UR") return r.ur > 0;
      if (cat === "OBC") return r.obc > 0;
      if (cat === "SC") return r.sc > 0;
      if (cat === "ST") return r.st > 0;
      if (cat === "EWS") return r.ews > 0;
      if (cat === "PWD") return r.pwd > 0;
      return true;
    });

    // Sort rows
    filtered.sort((a, b) => {
      switch (sort) {
        case "total_desc": return b.total - a.total;
        case "total_asc": return a.total - b.total;
        case "ur_desc": return b.ur - a.ur;
        case "obc_desc": return b.obc - a.obc;
        case "sc_desc": return b.sc - a.sc;
        case "st_desc": return b.st - a.st;
        case "ews_desc": return b.ews - a.ews;
        case "pwd_desc": return b.pwd - a.pwd;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    // Update active filter badge
    if (cat !== "ALL") {
      activeFilterBadge.style.display = "block";
      activeFilterName.textContent = cat;
      const catKey = cat.toLowerCase();
      const totalCatSeats = filtered.reduce((sum, r) => sum + (r[catKey] || 0), 0);
      activeFilterCount.textContent = formatNumber(totalCatSeats) + " seats in " + filtered.length + " divisions";
    } else {
      activeFilterBadge.style.display = "none";
    }

    // Render body
    if (filtered.length === 0) {
      postsTableBody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; padding: 40px; color: var(--text-muted);">
            No Karnataka divisions matched your search/filter criteria.
          </td>
        </tr>
      `;
      postsTableFoot.innerHTML = "";
      return;
    }

    postsTableBody.innerHTML = filtered.map((r, i) => {
      const isUrActive = cat === "UR" ? "background: var(--gov-green-light);" : "";
      const isObcActive = cat === "OBC" ? "background: var(--gov-green-light);" : "";
      const isScActive = cat === "SC" ? "background: var(--gov-green-light);" : "";
      const isStActive = cat === "ST" ? "background: var(--gov-green-light);" : "";
      const isPwdActive = cat === "PWD" ? "background: var(--gov-green-light);" : "";
      const isEwsActive = cat === "EWS" ? "background: var(--gov-green-light);" : "";

      return `
        <tr>
          <td><span style="color: var(--text-light); font-size: 12px;">${i + 1}</span></td>
          <td><b style="color: var(--gov-green-dark);">${escapeHtml(r.name)}</b></td>
          <td style="text-align: center; font-weight: 700;">${r.total}</td>
          <td style="text-align: center; ${isUrActive}">${r.ur}</td>
          <td style="text-align: center; ${isObcActive}">${r.obc}</td>
          <td style="text-align: center; ${isScActive}">${r.sc}</td>
          <td style="text-align: center; ${isStActive}">${r.st}</td>
          <td style="text-align: center; ${isPwdActive}">${r.pwd}</td>
          <td style="text-align: center; ${isEwsActive}">${r.ews}</td>
        </tr>
      `;
    }).join("");

    // Render table footer sums
    const fSum = filtered.reduce((acc, c) => ({
      total: acc.total + c.total,
      ur: acc.ur + c.ur,
      obc: acc.obc + c.obc,
      sc: acc.sc + c.sc,
      st: acc.st + c.st,
      pwd: acc.pwd + c.pwd,
      ews: acc.ews + c.ews
    }), { total: 0, ur: 0, obc: 0, sc: 0, st: 0, pwd: 0, ews: 0 });

    postsTableFoot.innerHTML = `
      <tr>
        <td colspan="2">Filtered Total (${filtered.length} Divisions)</td>
        <td style="text-align: center; color: var(--gov-green-dark); font-size: 14px;">${formatNumber(fSum.total)}</td>
        <td style="text-align: center;">${formatNumber(fSum.ur)}</td>
        <td style="text-align: center;">${formatNumber(fSum.obc)}</td>
        <td style="text-align: center;">${formatNumber(fSum.sc)}</td>
        <td style="text-align: center;">${formatNumber(fSum.st)}</td>
        <td style="text-align: center;">${formatNumber(fSum.pwd)}</td>
        <td style="text-align: center;">${formatNumber(fSum.ews)}</td>
      </tr>
    `;
  }

  function escapeHtml(str) {
    return (str || "").replace(/[&<>"']/g, m => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[m]);
  }

  postSearch.addEventListener("input", render);
  categoryFilter.addEventListener("change", render);
  postSort.addEventListener("change", render);

  render();
});
