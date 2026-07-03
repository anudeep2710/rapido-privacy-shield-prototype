const screens = [
  {
    id: "booking",
    label: "Booking",
    detail: "Privacy notice before ride confirmation",
  },
  {
    id: "captain",
    label: "Captain assigned",
    detail: "Protected contact replaces raw numbers",
  },
  {
    id: "pickup",
    label: "Pickup",
    detail: "Exact location is time-boxed",
  },
  {
    id: "complete",
    label: "Completed",
    detail: "Captain access expires",
  },
  {
    id: "details",
    label: "Privacy details",
    detail: "Shared data, expiry, rights, and recourse",
  },
];

const screenEls = Array.from(document.querySelectorAll(".screen"));
const journeyList = document.querySelector("#journeyList");
const modalBackdrop = document.querySelector("#modalBackdrop");
const bottomSheet = document.querySelector("#bottomSheet");
const sheetContent = document.querySelector("#sheetContent");

let activeScreen = "booking";
let optionalConsent = false;

function renderJourney() {
  journeyList.innerHTML = screens
    .map(
      (screen, index) => `
        <button class="journey-step ${screen.id === activeScreen ? "active" : ""}" type="button" data-goto="${screen.id}">
          <span>${index + 1}</span>
          <div>
            <strong>${screen.label}</strong>
            <small>${screen.detail}</small>
          </div>
        </button>
      `,
    )
    .join("");
}

function showScreen(screenId) {
  activeScreen = screenId;
  screenEls.forEach((screen) => {
    screen.classList.toggle("active", screen.dataset.screen === screenId);
  });
  renderJourney();
  closeSheet();
}

function openSheet(markup) {
  sheetContent.innerHTML = markup;
  modalBackdrop.hidden = false;
  bottomSheet.hidden = false;
}

function closeSheet() {
  modalBackdrop.hidden = true;
  bottomSheet.hidden = true;
  sheetContent.innerHTML = "";
}

function privacySheet() {
  openSheet(`
    <div class="sheet-body">
      <h3>Ride privacy details</h3>
      <p>This ride uses a time-boxed data lease. The Captain can use protected contact and pickup guidance only for this trip.</p>
      <ul class="sheet-list">
        <li>Raw phone number: hidden in-app</li>
        <li>Exact pickup: active until pickup is complete</li>
        <li>Post-ride Captain view: generalized trip area only</li>
      </ul>
    </div>
  `);
}

function consentSheet() {
  openSheet(`
    <div class="sheet-body">
      <h3>Optional data use</h3>
      <p>Ride-essential data is required to book and complete this ride. Optional personalization can be declined without blocking the ride.</p>
      <div class="toggle-row">
        <div>
          <strong>Offers and personalization</strong>
          <p>${optionalConsent ? "Allowed for this account." : "Off for this account."}</p>
        </div>
        <button class="toggle ${optionalConsent ? "on" : ""}" type="button" data-action="toggle-consent" aria-label="Toggle optional consent"></button>
      </div>
    </div>
  `);
}

function callSheet() {
  openSheet(`
    <div class="sheet-body">
      <h3>Connecting through Rapido</h3>
      <p>Your call is routed through a proxy number. Ravi can coordinate pickup but cannot see your raw phone number.</p>
      <ul class="sheet-list">
        <li>Relay active for this ride</li>
        <li>Call logs linked to trip ID RP-4182</li>
        <li>Access expires after ride completion</li>
      </ul>
    </div>
  `);
}

function chatSheet() {
  openSheet(`
    <div class="sheet-body">
      <h3>In-app chat</h3>
      <p>Suggested pickup messages avoid personal numbers and keep coordination inside Rapido.</p>
      <ul class="sheet-list">
        <li>I am near Gate B.</li>
        <li>Please wait near the metro exit.</li>
        <li>I am wearing a blue backpack.</li>
      </ul>
    </div>
  `);
}

function pickupSheet() {
  openSheet(`
    <div class="sheet-body">
      <h3>Change pickup</h3>
      <p>Updating pickup refreshes the Captain's data lease. The previous exact pin is replaced, not retained in Captain history.</p>
      <ul class="sheet-list">
        <li>New exact pin shared until pickup</li>
        <li>Old exact pin removed from Captain view</li>
      </ul>
    </div>
  `);
}

function reportSheet() {
  openSheet(`
    <div class="sheet-body">
      <h3>Report post-ride misuse</h3>
      <p>Rapido attaches the trip ID, protected contact logs, and expiry record so support can investigate without asking the rider to repeat everything.</p>
      <ul class="sheet-list">
        <li>Reason: post-ride call or message</li>
        <li>Evidence: relay logs and ride timestamp</li>
        <li>Next step: support review within 24 hours</li>
      </ul>
    </div>
  `);
}

function deletionSheet() {
  openSheet(`
    <div class="sheet-body">
      <h3>Deletion request submitted</h3>
      <p>Rapido will delete non-required ride data and retain only records needed for fraud, dispute, tax, or safety obligations.</p>
      <ul class="sheet-list">
        <li>Masked contact relay: delete now</li>
        <li>Exact pickup pin: already expired from Captain view</li>
        <li>Fare proof: retained with reason and expiry date</li>
      </ul>
    </div>
  `);
}

function summarySheet() {
  openSheet(`
    <div class="sheet-body">
      <h3>Access summary ready</h3>
      <p>Your ride privacy summary includes what was shared, who received it, the purpose, and the expiry status.</p>
      <ul class="sheet-list">
        <li>Trip ID RP-4182</li>
        <li>Captain: Ravi K.</li>
        <li>All ride coordination data leases closed</li>
      </ul>
    </div>
  `);
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("button");
  if (!target) return;

  const next = target.dataset.next;
  const goto = target.dataset.goto;
  const action = target.dataset.action;

  if (next) showScreen(next);
  if (goto) showScreen(goto);

  if (action === "close-sheet") closeSheet();
  if (action === "open-privacy") privacySheet();
  if (action === "manage-consent") consentSheet();
  if (action === "toggle-consent") {
    optionalConsent = !optionalConsent;
    consentSheet();
  }
  if (action === "call-captain") callSheet();
  if (action === "chat-captain") chatSheet();
  if (action === "change-pickup") pickupSheet();
  if (action === "report-misuse") reportSheet();
  if (action === "request-deletion") deletionSheet();
  if (action === "download-summary") summarySheet();
});

modalBackdrop.addEventListener("click", closeSheet);
renderJourney();
