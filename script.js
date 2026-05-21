// NAV TOGGLE
const navToggle = document.getElementById("navToggle");
const nav = document.querySelector(".nav");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  // Close menu when a nav link is clicked
  document.querySelectorAll(".nav a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
    });
  });
}

// YEAR
const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// INSTANT QUOTE CALCULATOR
const smallWindowsInput = document.getElementById("smallWindows");
const largeWindowsInput = document.getElementById("largeWindows");
const pressureSqftInput = document.getElementById("pressureSqft");
const detailPackageSelect = document.getElementById("detailPackage");

const windowResult = document.getElementById("windowResult");
const pressureResult = document.getElementById("pressureResult");
const detailResult = document.getElementById("detailResult");

const calcWindowsBtn = document.getElementById("calcWindows");
const calcPressureBtn = document.getElementById("calcPressure");
const calcDetailBtn = document.getElementById("calcDetail");

if (calcWindowsBtn) {
  calcWindowsBtn.addEventListener("click", () => {
    const small = Number(smallWindowsInput.value) || 0;
    const large = Number(largeWindowsInput.value) || 0;
    const total = small * 5 + large * 10;
    windowResult.textContent =
      total > 0
        ? `Estimated exterior window total: $${total.toFixed(2)}`
        : "Enter at least one window.";
  });
}

if (calcPressureBtn) {
  calcPressureBtn.addEventListener("click", () => {
    const sqft = Number(pressureSqftInput.value) || 0;
    const total = sqft * 0.2;
    pressureResult.textContent =
      sqft > 0
        ? `Estimated pressure washing total: $${total.toFixed(2)}`
        : "Enter square footage.";
  });
}

if (calcDetailBtn) {
  calcDetailBtn.addEventListener("click", () => {
    const base = Number(detailPackageSelect.value);
    detailResult.textContent = base
      ? `Estimated detailing starting at: $${base.toFixed(2)}`
      : "Select a detailing package.";
  });
}

// SAVE ESTIMATE TO LOCALSTORAGE
const saveEstimateBtn = document.getElementById("saveEstimate");
const saveEstimateMsg = document.getElementById("saveEstimateMsg");

if (saveEstimateBtn) {
  saveEstimateBtn.addEventListener("click", () => {
    const estimate = {
      windows: windowResult.textContent || "",
      pressure: pressureResult.textContent || "",
      detail: detailResult.textContent || "",
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("kia_estimate", JSON.stringify(estimate));
    saveEstimateMsg.textContent =
      "Estimate saved locally. It will appear in your customer portal.";
    setTimeout(() => {
      saveEstimateMsg.textContent = "";
    }, 3000);
    updatePortal();
  });
}

// BOOKING FORM
const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const serviceType = document.getElementById("serviceType").value;
    const date = document.getElementById("date").value;
    const notes = document.getElementById("notes").value.trim();

    // Validation
    if (!name || !phone || !email || !serviceType || !date) {
      alert("Please fill in all required fields.");
      return;
    }

    const booking = {
      name,
      phone,
      email,
      serviceType,
      date,
      notes,
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem("kia_bookings") || "[]");
    existing.push(booking);
    localStorage.setItem("kia_bookings", JSON.stringify(existing));
    localStorage.setItem("kia_customer", JSON.stringify({ name, phone, email }));

    updatePortal();

    // Build email body
    const subject = encodeURIComponent(`New Booking Request - ${serviceType}`);
    const body = encodeURIComponent(
      `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nService: ${serviceType}\nPreferred Date: ${date}\nNotes: ${notes}\n\nGenerated via K.I.A Home Service website.`
    );

    const mailtoLink = `mailto:homeservicekia@gmail.com?subject=${subject}&body=${body}`;
    const smsBody = encodeURIComponent(
      `New booking request:\n${name}\n${phone}\n${serviceType}\nPreferred date: ${date}`
    );
    const smsLink = `sms:14804829507?body=${smsBody}`;

    // Open email and SMS
    window.location.href = mailtoLink;
    setTimeout(() => {
      window.location.href = smsLink;
    }, 600);

    // Reset form
    bookingForm.reset();
  });
}

// BEFORE/AFTER SLIDER
document.querySelectorAll(".ba-wrapper").forEach((wrapper) => {
  const before = wrapper.querySelector(".ba-before");
  const slider = wrapper.querySelector(".ba-slider");
  if (!before || !slider) return;

  const updateClip = (value) => {
    const percent = Number(value);
    before.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
  };

  slider.addEventListener("input", (e) => updateClip(e.target.value));
  updateClip(slider.value);

  // Keyboard support for slider
  slider.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      slider.value = Math.max(0, Number(slider.value) - 5);
    } else if (e.key === "ArrowRight") {
      slider.value = Math.min(100, Number(slider.value) + 5);
    }
    updateClip(slider.value);
  });
});

// REFERRAL CODE
const referralCodeEl = document.getElementById("referralCode");
const referralMsg = document.getElementById("referralMsg");
const generateReferralBtn = document.getElementById("generateReferral");

function generateReferralCode() {
  const existing = localStorage.getItem("kia_referral_code");
  if (existing) {
    referralCodeEl.textContent = existing;
    referralMsg.textContent = "Your referral code is stored in this browser.";
    return;
  }
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  const code = `KIA-${random}`;
  localStorage.setItem("kia_referral_code", code);
  referralCodeEl.textContent = code;
  referralMsg.textContent = "New referral code generated and saved locally.";
}

if (generateReferralBtn) {
  generateReferralBtn.addEventListener("click", generateReferralCode);
}

// PORTAL
const portalInfo = document.getElementById("portalInfo");
const portalBookings = document.getElementById("portalBookings");
const clearPortalBtn = document.getElementById("clearPortal");

function updatePortal() {
  const customer = JSON.parse(localStorage.getItem("kia_customer") || "null");
  const bookings = JSON.parse(localStorage.getItem("kia_bookings") || "[]");
  const estimate = JSON.parse(localStorage.getItem("kia_estimate") || "null");

  // Info
  if (portalInfo) {
    if (customer) {
      portalInfo.innerHTML = `
        <p><strong>Name:</strong> ${escapeHtml(customer.name)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(customer.phone)}</p>
        <p><strong>Email:</strong> ${escapeHtml(customer.email)}</p>
        ${
          estimate
            ? `<p><strong>Last Estimate:</strong><br>${escapeHtml(estimate.windows)}<br>${escapeHtml(estimate.pressure)}<br>${escapeHtml(estimate.detail)}</p>`
            : ""
        }
      `;
    } else {
      portalInfo.textContent =
        "No saved customer info yet. Submit a booking or save an estimate.";
    }
  }

  // Bookings
  if (portalBookings) {
    portalBookings.innerHTML = "";
    if (bookings.length === 0) {
      const li = document.createElement("li");
      li.textContent = "No bookings saved yet in this browser.";
      portalBookings.appendChild(li);
    } else {
      bookings
        .slice(-5)
        .reverse()
        .forEach((b) => {
          const li = document.createElement("li");
          li.textContent = `${escapeHtml(b.serviceType)} on ${escapeHtml(b.date || "TBD")} — ${escapeHtml(b.name)}`;
          portalBookings.appendChild(li);
        });
    }
  }

  updateAdminDashboard();
}

if (clearPortalBtn) {
  clearPortalBtn.addEventListener("click", () => {
    if (
      confirm(
        "Are you sure you want to clear all saved info? This cannot be undone."
      )
    ) {
      localStorage.removeItem("kia_customer");
      localStorage.removeItem("kia_estimate");
      updatePortal();
    }
  });
}

// ADMIN DASHBOARD
const adminPasswordInput = document.getElementById("adminPassword");
const adminLoginBtn = document.getElementById("adminLogin");
const adminDashboard = document.getElementById("adminDashboard");
const adminTotalBookings = document.getElementById("adminTotalBookings");
const adminRevenue = document.getElementById("adminRevenue");
const adminPopularService = document.getElementById("adminPopularService");

function updateAdminDashboard() {
  const bookings = JSON.parse(localStorage.getItem("kia_bookings") || "[]");
  if (adminTotalBookings) {
    adminTotalBookings.textContent = bookings.length;
  }

  // Rough revenue estimate based on service type
  let revenue = 0;
  const counts = {};
  bookings.forEach((b) => {
    const type = b.serviceType || "Other";
    counts[type] = (counts[type] || 0) + 1;
    if (type.includes("Bronze")) revenue += 59;
    else if (type.includes("Silver")) revenue += 119;
    else if (type.includes("Gold")) revenue += 219;
    else if (type.includes("Window")) revenue += 120;
    else if (type.includes("Pressure")) revenue += 150;
    else if (type.includes("Bundle")) revenue += 250;
    else revenue += 100;
  });

  if (adminRevenue) {
    adminRevenue.textContent = revenue.toFixed(2);
  }

  let popular = "N/A";
  let max = 0;
  Object.entries(counts).forEach(([service, count]) => {
    if (count > max) {
      max = count;
      popular = service;
    }
  });
  if (adminPopularService) {
    adminPopularService.textContent = popular;
  }
}

if (adminLoginBtn) {
  adminLoginBtn.addEventListener("click", () => {
    const value = adminPasswordInput.value.trim();
    if (value === "kiaadmin") {
      if (adminDashboard) {
        adminDashboard.classList.remove("hidden");
      }
      adminPasswordInput.value = "";
    } else {
      alert("Incorrect password.");
      adminPasswordInput.value = "";
    }
  });
}

// UTILITY: Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// INITIAL LOAD
updatePortal();
generateReferralCode();
