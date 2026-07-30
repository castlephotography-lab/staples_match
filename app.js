const zipInput = document.getElementById("zipInput");
const clearButton = document.getElementById("clearButton");
const resultCard = document.getElementById("resultCard");
const statusText = document.getElementById("statusText");
const idleState = document.getElementById("idleState");
const liveState = document.getElementById("liveState");
const matchState = document.getElementById("matchState");
const notFoundState = document.getElementById("notFoundState");
const liveMatches = document.getElementById("liveMatches");
const matchCount = document.getElementById("matchCount");
const resultZip = document.getElementById("resultZip");
const resultCity = document.getElementById("resultCity");
const resultState = document.getElementById("resultState");
const resultCounty = document.getElementById("resultCounty");
const alternateBlock = document.getElementById("alternateBlock");
const alternateNames = document.getElementById("alternateNames");
const digitBars = [...document.querySelectorAll(".digit-track span")];
const allRecords = Object.values(ZIP_DATA).sort((a, b) => a.zip.localeCompare(b.zip));

function setVisibleState(target) {
  [idleState, liveState, matchState, notFoundState].forEach(panel => panel.classList.remove("state-enter"));
  idleState.classList.toggle("hidden", target !== "idle");
  liveState.classList.toggle("hidden", target !== "live");
  matchState.classList.toggle("hidden", target !== "match");
  notFoundState.classList.toggle("hidden", target !== "error");

  const activePanel = { idle: idleState, live: liveState, match: matchState, error: notFoundState }[target];
  requestAnimationFrame(() => activePanel?.classList.add("state-enter"));
}

function setCardState(state, digitCount = 0) {
  resultCard.className = `result-card state-${state} radar-speed-${digitCount}`;
}

function updateDigitBars(length, confirmed = false) {
  digitBars.forEach((bar, index) => {
    bar.classList.toggle("active", index < length);
    bar.classList.toggle("confirmed", confirmed && index < length);
  });
}

function showIdle() {
  setCardState("idle", 0);
  statusText.textContent = "READY";
  setVisibleState("idle");
}

function matchingRecords(prefix) {
  return allRecords.filter(record => record.zip.startsWith(prefix));
}

function showLive(prefix) {
  const matches = matchingRecords(prefix);
  const preview = matches.slice(0, 5);
  setCardState(matches.length ? "searching" : "error", prefix.length);
  statusText.textContent = matches.length ? "SEARCHING" : "NO CURRENT MATCHES";
  matchCount.textContent = matches.length ? `${matches.length} MATCH${matches.length === 1 ? "" : "ES"}` : "";
  liveMatches.innerHTML = "";

  if (!preview.length) {
    const empty = document.createElement("p");
    empty.className = "live-empty";
    empty.textContent = "Keep typing or correct the ZIP.";
    liveMatches.appendChild(empty);
  } else {
    preview.forEach(record => {
      const row = document.createElement("div");
      row.className = "live-row";
      if (matches.length === 1) row.classList.add("sole-match");

      const matchingPart = record.zip.slice(0, prefix.length);
      const remainingPart = record.zip.slice(prefix.length);
      row.innerHTML = `
        <span class="live-zip"><strong>${matchingPart}</strong><span>${remainingPart}</span></span>
        <span class="live-city">${record.city}</span>
        <span class="live-state-code">${record.state}</span>
      `;
      liveMatches.appendChild(row);
    });
  }
  setVisibleState("live");
}

function showMatch(record) {
  const hasAlternates = Array.isArray(record.alternates) && record.alternates.length > 0;
  resultZip.textContent = record.zip;
  resultCity.textContent = record.city;
  resultState.textContent = record.state;
  const county = record.county || "County unavailable";
  const alreadyQualified = /(county|parish|borough|census area|municipality|district|city and borough)$/i.test(county);
  resultCounty.textContent = alreadyQualified ? county : `${county} County`;
  alternateNames.innerHTML = "";

  if (hasAlternates) {
    record.alternates.forEach(name => {
      const pill = document.createElement("span");
      pill.className = "alt-pill";
      pill.textContent = name;
      alternateNames.appendChild(pill);
    });
  }

  alternateBlock.classList.toggle("hidden", !hasAlternates);
  setCardState("match", 5);
  statusText.textContent = "TARGET LOCKED";
  setVisibleState("match");
  updateDigitBars(5, true);
  if (navigator.vibrate) navigator.vibrate(18);
}

function showNotFound() {
  setCardState("error", 5);
  statusText.textContent = "NO MATCH";
  setVisibleState("error");
  if (navigator.vibrate) navigator.vibrate([28, 35, 28]);
}

function handleInput() {
  const cleaned = zipInput.value.replace(/\D/g, "").slice(0, 5);
  if (zipInput.value !== cleaned) zipInput.value = cleaned;
  updateDigitBars(cleaned.length, false);

  if (!cleaned.length) return showIdle();
  if (cleaned.length < 5) return showLive(cleaned);

  const record = ZIP_DATA[cleaned];
  record ? showMatch(record) : showNotFound();
}

zipInput.addEventListener("input", handleInput);

clearButton.addEventListener("click", () => {
  zipInput.value = "";
  updateDigitBars(0, false);
  showIdle();
  zipInput.focus({ preventScroll: true });
});

window.addEventListener("load", () => {
  setTimeout(() => zipInput.focus({ preventScroll: true }), 150);
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}
