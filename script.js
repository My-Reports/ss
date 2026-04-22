import { users, verifyPasswordPBKDF2 } from './auth.js';

/* ================================================================
   DARA HEALTH CO — script.js
   Professional UI/UX Enhancement
   ================================================================ */

/* ----------------------------------------------------------------
   STATE
---------------------------------------------------------------- */
let selectedDepartment = "";
let currentReportUrl   = "";
let currentReportKey   = "";
let currentUser        = ""; // Added for Welcome Message

/* ----------------------------------------------------------------
   i18n
---------------------------------------------------------------- */
const i18n = {
  ar: {
    appName:         "Dara Health Co",
    selectDept:      "اختر القسم",
    selectDeptDesc:  "حدد القسم للوصول للتقارير الخاصة به",
    salesDept:       "قسم المبيعات",
    financeDept:     "قسم المالية",
    busdevDept:      "قسم تطوير الاعمال",
    loginTitle:      "تسجيل الدخول",
    loginDesc:       "أدخل بياناتك للوصول إلى التقارير",
    usernameLabel:   "اسم المستخدم",
    passwordLabel:   "كلمة المرور",
    rememberUsername:"تذكّر اسم المستخدم",
    loginBtn:        "دخول",
    changeDept:      "تغيير القسم",
    chooseCompany:   "اختر الشركة لفتح التقرير",
    logout:          "تسجيل خروج",
    backToReports:   "التقارير الرئيسية",
    reportsMenu:     "قائمة التقارير",
    fastNav:         "التنقل السريع بين التقارير",
    loadingTitle:    "جارِ تحميل التقرير…",
    loadingSub:      "قد يستغرق ثوانٍ حسب الاتصال",
    salesReports:    "تقارير المبيعات",
    financeReports:  "تقارير المالية",
    busdevReports:   "تقارير البحث والتطوير",
    capsHint:        "تنبيه: Caps Lock مفعّل",
    accessDenied:    "❌ لا يوجد صلاحية لهذا المستخدم ضمن هذا القسم",
    deptBannerSales: "📊 قسم المبيعات",
    deptBannerFinance:"💰 قسم المالية",
    deptBannerBusdev:"🚀 قسم البحث والتطوير",
    usernamePh:      "مثال: user1",
    passwordPh:      "كلمة المرور",
    tooltipLang:     "اللغة",
    searchPh:        "بحث عن شركة…",
    orText:          "أو",
    welcomeBack:     "مرحباً بك 👋",
    reportOpened:    "جارِ فتح التقرير…",
    loggedOut:       "تم تسجيل الخروج",
    welcomeUserText: "مرحباً", // Added for Welcome Message
    companies: { dara:"دار الدواء (Dara)", salutem:"Salutem", joswe:"Joswe", AMS:"AMS", salutem_roadmap:"Salutem Roadmap" }
  },
  en: {
    appName:         "Dara Health Co",
    selectDept:      "Select Department",
    selectDeptDesc:  "Choose a department to access its reports",
    salesDept:       "Sales Department",
    financeDept:     "Finance Department",
    busdevDept:      "Business Development",
    loginTitle:      "Sign in",
    loginDesc:       "Enter your credentials to access reports",
    usernameLabel:   "Username",
    passwordLabel:   "Password",
    rememberUsername:"Remember username",
    loginBtn:        "Login",
    changeDept:      "Change Department",
    chooseCompany:   "Select a company to open the report",
    logout:          "Logout",
    backToReports:   "Main Reports",
    reportsMenu:     "Reports Menu",
    fastNav:         "Quick Navigation",
    loadingTitle:    "Loading report…",
    loadingSub:      "This may take a few seconds depending on your connection",
    salesReports:    "Sales Reports",
    financeReports:  "Finance Reports",
    busdevReports:   "R&D Reports",
    capsHint:        "Caps Lock is ON",
    accessDenied:    "❌ Access denied for this department",
    deptBannerSales: "📊 Sales Department",
    deptBannerFinance:"💰 Finance Department",
    deptBannerBusdev:"🚀 R&D Department",
    usernamePh:      "e.g. user1",
    passwordPh:      "Password",
    tooltipLang:     "Language",
    searchPh:        "Search company…",
    orText:          "or",
    welcomeBack:     "Welcome back 👋",
    reportOpened:    "Opening report…",
    loggedOut:       "Logged out",
    welcomeUserText: "Welcome", // Added for Welcome Message
    companies: { dara:"Dar Al Dawa (Dara)", salutem:"Salutem", joswe:"Joswe", AMS:"AMS", salutem_roadmap:"Salutem Roadmap" }
  }
};
let currentLang = localStorage.getItem("lang") || "ar";

const reports = {
  sales: {
    dara:   "https://app.powerbi.com/view?r=eyJrIjoiOGZkY2VlMGEtZTNlMy00MjY2LWFjOWQtZmU1YjI5MDg5ZGQwIiwidCI6IjQ5MTMxMjY0LWUzYWMtNDczNi04MzgxLTVmYzM4Y2EzYTgyZSIsImMiOjl9",
    salutem:"https://app.powerbi.com/view?r=eyJrIjoiNzlhZWYzMTItOGYxMC00MjkyLTk0ZWYtYzRjZDVmOGEzMmM5IiwidCI6IjQ5MTMxMjY0LWUzYWMtNDczNi04MzgxLTVmYzM4Y2EzYTgyZSIsImMiOjl9",
    joswe:  "https://app.powerbi.com/view?r=eyJrIjoiYWFiN2VjZDgtZWY0Yi00MDc1LWE3ZDQtMDFlZTJmNzAxYjBiIiwidCI6IjQ5MTMxMjY0LWUzYWMtNDczNi04MzgxLTVmYzM4Y2EzYTgyZSIsImMiOjl9",
    AMS:    "https://app.powerbi.com/view?r=eyJrIjoiZjAxMzRlZTItM2QyNS00Yzc4LWFmOWUtN2FlMDZmODE5ODdkIiwidCI6IjQ5MTMxMjY0LWUzYWMtNDczNi04MzgxLTVmYzM4Y2EzYTgyZSIsImMiOjl9"
  },
  finance: {
    dara:   "https://app.powerbi.com/view?r=eyJrIjoiZjhhNjUwN2MtYjhiMC00MzI4LWIyZmYtZGM3YzM5MzFmOTI0IiwidCI6IjQ5MTMxMjY0LWUzYWMtNDczNi04MzgxLTVmYzM4Y2EzYTgyZSIsImMiOjl9",
    salutem:"https://app.powerbi.com/view?r=eyJrIjoiNzE3MTZhYWQtMzA5ZS00MzFhLTg0NWUtODBlMzg0NDEyZGRlIiwidCI6IjQ5MTMxMjY0LWUzYWMtNDczNi04MzgxLTVmYzM4Y2EzYTgyZSIsImMiOjl9",
    joswe:  "https://app.powerbi.com/view?r=eyJrIjoiNzZjYjhkYWEtZDQ5My00MmM2LWEwYzAtNzZhZjc4NTBjYmYyIiwidCI6IjQ5MTMxMjY0LWUzYWMtNDczNi04MzgxLTVmYzM4Y2EzYTgyZSIsImMiOjl9"
  },
  busdev: {
    salutem_roadmap: "https://my-reports.github.io/Raodmap/"
  }
};

const companies = [
  { key: "dara",    logo: "Assets/dara.png" },
  { key: "salutem", logo: "Assets/salutem.png" },
  { key: "joswe",   logo: "Assets/joswe.png" },
  { key: "AMS",     logo: "Assets/AMS.png" },
  { key: "salutem_roadmap", logo: "Assets/salutem.png" } 
];

/* ----------------------------------------------------------------
   DOM REFS
---------------------------------------------------------------- */
const $ = id => document.getElementById(id);
const deptBox        = $("deptBox");
const loginBox       = $("loginBox");
const menuBox        = $("menuBox");
const reportContainer= $("reportContainer");
const bgLogos        = $("bgLogos");
const deptBanner     = $("deptBanner");
const usernameEl     = $("username");
const passwordEl     = $("password");
const errorEl        = $("error");
const loginForm      = $("loginForm");
const togglePassBtn  = $("togglePassBtn");
const capsHint       = $("capsHint");
const menuTitle      = $("menuTitle");
const reportsGrid    = $("reportsGrid");
const backDeptBtn    = $("backDeptBtn");
const changeDeptFromMenu = $("changeDeptFromMenu");
const logoutBtn      = $("logoutBtn");
const reportFrame    = $("reportFrame");
const reportLoading  = $("reportLoading");
const reloadReportBtn= $("reloadReportBtn");
const openNewTabBtn  = $("openNewTabBtn");
const toggleThemeBtn = $("toggleThemeBtn");
const langToggle     = $("langToggle");
const langDropdown   = $("langDropdown");
const langItems      = Array.from(document.querySelectorAll(".lang-item"));
const toastContainer = $("toastContainer");
const topProgressBar = $("topProgressBar");
const reportTitleLabel = $("reportTitleLabel");
const reportSearch   = $("reportSearch");
const loginBtnText   = $("loginBtnText");
const loginBtnSpinner= $("loginBtnSpinner");
const particleCanvas = $("particleCanvas");

// Welcome Message Ref
const userWelcome      = $("userWelcome");
const userWelcomeText  = $("userWelcomeText");

// Floating Menu Elements
const floatingMenuWrap    = $("floatingMenuWrap");
const floatingMenuToggle  = $("floatingMenuToggle");
const floatingDropdownList= $("floatingDropdownList");
const floatBackMain       = $("floatBackMain");
const floatLogout         = $("floatLogout");

/* ----------------------------------------------------------------
   HELPERS
---------------------------------------------------------------- */
function scrollTopNow() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}
function setError(msg = "") { errorEl.textContent = msg; }
function sanitizeUsername(u) { return (u || "").trim(); }

function showScreen(screenId) {
  [deptBox, loginBox, menuBox, reportContainer].forEach(el => {
    el.classList.toggle("is-active", el.id === screenId);
  });
  
  floatingMenuWrap.style.display = (screenId === "reportContainer") ? "block" : "none";
  floatingMenuWrap.classList.remove("is-open");

  bgLogos && (bgLogos.style.display = screenId === "reportContainer" ? "none" : "block");
  if (screenId !== "deptBox") document.body.classList.remove("logos-reveal");
  scrollTopNow();
}

function setThemeByDept(dept) {
  document.body.classList.remove("theme-default","theme-sales","theme-finance","theme-busdev");
  const map = { sales:"theme-sales", finance:"theme-finance", busdev:"theme-busdev" };
  document.body.classList.add(map[dept] || "theme-default");
}

/* ----------------------------------------------------------------
   WELCOME MESSAGE UPDATE
---------------------------------------------------------------- */
function updateWelcomeMessage() {
  if (currentUser && userWelcome && userWelcomeText) {
    userWelcome.hidden = false;
    let fullName = currentUser.split('.').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    userWelcomeText.textContent = `${i18n[currentLang].welcomeUserText}، ${fullName}`;
  } else if (userWelcome) {
    userWelcome.hidden = true;
  }
}

/* ----------------------------------------------------------------
   TOAST NOTIFICATIONS
---------------------------------------------------------------- */
function showToast(message, type = "info", duration = 3000) {
  const icons = { success:"✅", error:"❌", info:"💡" };
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${icons[type] || "💬"}</span><span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("toast-out");
    setTimeout(() => toast.remove(), 320);
  }, duration);
}

/* ----------------------------------------------------------------
   TOP PROGRESS BAR
---------------------------------------------------------------- */
let progressInterval = null;
function startProgress() {
  topProgressBar.classList.add("is-active");
  const fill = topProgressBar.querySelector(".top-progress-fill");
  fill.style.width = "0%";
  let w = 0;
  clearInterval(progressInterval);
  progressInterval = setInterval(() => {
    w += w < 70 ? Math.random() * 12 : Math.random() * 2;
    if (w > 90) w = 90;
    fill.style.width = w + "%";
  }, 200);
}
function finishProgress() {
  clearInterval(progressInterval);
  const fill = topProgressBar.querySelector(".top-progress-fill");
  fill.style.width = "100%";
  setTimeout(() => {
    topProgressBar.classList.remove("is-active");
    fill.style.width = "0%";
  }, 500);
}

/* ----------------------------------------------------------------
   RIPPLE EFFECT
---------------------------------------------------------------- */
function addRipple(el) {
  el.addEventListener("pointerdown", e => {
    const rect  = el.getBoundingClientRect();
    const size  = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top  - size / 2;

    const ripple = document.createElement("span");
    ripple.className = "ripple-effect";
    Object.assign(ripple.style, {
      width: size + "px", height: size + "px",
      left: x + "px", top: y + "px"
    });
    el.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  });
}
document.querySelectorAll(".ripple").forEach(addRipple);

/* ----------------------------------------------------------------
   PARTICLE SYSTEM
---------------------------------------------------------------- */
(function initParticles() {
  if (!particleCanvas) return;
  const ctx = particleCanvas.getContext("2d");
  let W, H, particles = [];
  const COUNT = 55;

  function resize() {
    W = particleCanvas.width  = window.innerWidth;
    H = particleCanvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  function getAccent() {
    return getComputedStyle(document.documentElement)
      .getPropertyValue("--accent").trim() || "#21D4FD";
  }

  function createParticle() {
    return { x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.8 + .4, dx: (Math.random() - .5) * .45, dy: (Math.random() - .5) * .45, alpha: Math.random() * .5 + .15 };
  }
  for (let i = 0; i < COUNT; i++) particles.push(createParticle());

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const accent = getAccent();
    particles.forEach(p => {
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = accent; ctx.globalAlpha = p.alpha; ctx.fill();
    });
    ctx.globalAlpha = 1;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = accent; ctx.globalAlpha = (1 - dist / 120) * .10; ctx.lineWidth = .8; ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ----------------------------------------------------------------
   THEME TOGGLE
---------------------------------------------------------------- */
function applyMode(mode) {
  document.body.classList.toggle("mode-light", mode === "light");
  document.body.classList.toggle("mode-dark",  mode !== "light");
  localStorage.setItem("ui_mode", mode === "light" ? "light" : "dark");
}
function initMode() { applyMode(localStorage.getItem("ui_mode") === "light" ? "light" : "dark"); }

toggleThemeBtn.addEventListener("click", () => {
  const light = document.body.classList.contains("mode-light");
  applyMode(light ? "dark" : "light");
});

/* ----------------------------------------------------------------
   LANGUAGE DROPDOWN
---------------------------------------------------------------- */
function setLangDropdown(open) {
  langDropdown.classList.toggle("open", !!open);
  langToggle.setAttribute("aria-expanded", open ? "true" : "false");
  document.body.classList.toggle("lang-open", !!open);
}
langToggle.addEventListener("click", e => { e.stopPropagation(); setLangDropdown(!langDropdown.classList.contains("open")); });
document.addEventListener("click", e => { if (!e.target.closest(".lang-menu")) setLangDropdown(false); });
document.addEventListener("keydown", e => { if (e.key === "Escape") setLangDropdown(false); });

function updateLangUI() {
  langToggle.dataset.tooltip = i18n[currentLang].tooltipLang;
  langItems.forEach(btn => {
    const sel = btn.dataset.lang === currentLang;
    btn.classList.toggle("is-selected", sel);
    btn.setAttribute("aria-checked", sel ? "true" : "false");
  });
}

function refreshDynamicTexts() {
  if (capsHint) capsHint.textContent = i18n[currentLang].capsHint;
  if (selectedDepartment) {
    const bannerMap = { sales: "deptBannerSales", finance: "deptBannerFinance", busdev: "deptBannerBusdev" };
    const menuMap   = { sales: "salesReports", finance: "financeReports", busdev: "busdevReports" };
    if (deptBanner) deptBanner.textContent = i18n[currentLang][bannerMap[selectedDepartment]];
    if (menuTitle)  menuTitle.textContent  = i18n[currentLang][menuMap[selectedDepartment]];
  }
}

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;
  document.documentElement.dir  = lang === "ar" ? "rtl" : "ltr";

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const v = i18n[lang]?.[el.getAttribute("data-i18n")];
    if (typeof v === "string") el.textContent = v;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const v = i18n[lang]?.[el.getAttribute("data-i18n-placeholder")];
    if (typeof v === "string") el.setAttribute("placeholder", v);
  });

  refreshDynamicTexts();
  updateWelcomeMessage(); // Update welcome translation
  if (menuBox.classList.contains("is-active") && selectedDepartment) buildReportsMenu();
  updateTimes();
  updateLangUI();
}

langItems.forEach(btn => {
  btn.addEventListener("click", () => { applyLanguage(btn.dataset.lang); setLangDropdown(false); });
});

/* ----------------------------------------------------------------
   DATE & TIME
---------------------------------------------------------------- */
function updateTimes() {
  const now    = new Date();
  const locale = currentLang === "ar" ? "ar" : "en-GB";
  const opts   = { weekday:"short", year:"numeric", month:"short", day:"2-digit", hour:"2-digit", minute:"2-digit", second:"2-digit" };
  const elJO   = $("time-jo"), elIQ = $("time-iq");
  if (elJO) elJO.textContent = `🇯🇴 ${new Intl.DateTimeFormat(locale,{...opts,timeZone:"Asia/Amman"}).format(now)}`;
  if (elIQ) elIQ.textContent = `🇮🇶 ${new Intl.DateTimeFormat(locale,{...opts,timeZone:"Asia/Baghdad"}).format(now)}`;
}
setInterval(updateTimes, 1000);

/* ----------------------------------------------------------------
   LOGO REVEAL (hover dept buttons)
---------------------------------------------------------------- */
function setupDeptReveal() {
  const btns   = document.querySelectorAll(".dept-btn");
  const enable = () => { if (document.body.classList.contains("screen-dept")) document.body.classList.add("logos-reveal"); };
  const disable= () => document.body.classList.remove("logos-reveal");

  btns.forEach(btn => {
    btn.addEventListener("mouseenter", enable);
    btn.addEventListener("mouseleave", disable);
    btn.addEventListener("focus",      enable);
    btn.addEventListener("blur",       disable);
  });
}

/* ----------------------------------------------------------------
   DEPARTMENT SELECTION
---------------------------------------------------------------- */
function selectDepartment(dept) {
  selectedDepartment = dept;
  setThemeByDept(dept);
  passwordEl.value = "";
  setError("");
  refreshDynamicTexts();

  const remembered = localStorage.getItem("rememberedUser_" + dept);
  if (remembered && $("rememberUsername")?.checked === false) {
    usernameEl.value = remembered;
    const chk = $("rememberUsername");
    if (chk) chk.checked = true;
  }

  showScreen("loginBox");
  setTimeout(() => usernameEl.focus(), 60);
}
document.querySelectorAll(".dept-btn").forEach(btn => {
  btn.addEventListener("click", () => selectDepartment(btn.dataset.dept));
});

/* ----------------------------------------------------------------
   LOGIN
---------------------------------------------------------------- */
loginForm.addEventListener("submit", async e => {
  e.preventDefault();

  const loginBtn = $("loginBtn");
  loginBtnText.hidden   = true;
  loginBtnSpinner.hidden = false;
  loginBtn.disabled = true;

  await delay(500);

  const enteredUsername = sanitizeUsername(usernameEl.value).toLowerCase();
  const deptUsers  = users[selectedDepartment] || {};
  const matchedKey = Object.keys(deptUsers).find(u => u.toLowerCase() === enteredUsername);

  let passwordOk = false;
  if (matchedKey) {
    const cred = deptUsers[matchedKey];
    passwordOk = await verifyPasswordPBKDF2(passwordEl.value, cred.salt, cred.hash);
  }

  loginBtnText.hidden    = false;
  loginBtnSpinner.hidden = true;
  loginBtn.disabled = false;

  if (matchedKey && passwordOk) {
    const remChk = $("rememberUsername");
    if (remChk?.checked) {
      localStorage.setItem("rememberedUser_" + selectedDepartment, matchedKey);
    } else {
      localStorage.removeItem("rememberedUser_" + selectedDepartment);
    }
    setError("");
    passwordEl.value = "";
    
    // Set Current User and update welcome
    currentUser = matchedKey;
    updateWelcomeMessage();

    buildReportsMenu();
    refreshDynamicTexts();
    showScreen("menuBox");
    showToast(i18n[currentLang].welcomeBack, "success");
  } else {
    setError(i18n[currentLang].accessDenied);
    loginBox.querySelector(".card")?.classList.remove("shake");
    void loginBox.querySelector(".card")?.offsetWidth; // trigger reflow
    loginBox.querySelector(".card")?.classList.add("shake");
  }
});

const shakeStyle = document.createElement("style");
shakeStyle.textContent = `.card.shake { animation: cardShake 360ms cubic-bezier(.34,1.56,.64,1); } @keyframes cardShake { 0%,100%{ transform: translateX(0); } 20%{ transform: translateX(-8px) rotate(-.5deg); } 40%{ transform: translateX(8px) rotate(.5deg); } 60%{ transform: translateX(-6px); } 80%{ transform: translateX(6px); } }`;
document.head.appendChild(shakeStyle);

togglePassBtn.addEventListener("click", () => {
  const isPass = passwordEl.type === "password";
  passwordEl.type = isPass ? "text" : "password";
  togglePassBtn.textContent = isPass ? "🙈" : "👁️";
  passwordEl.focus();
});
passwordEl.addEventListener("keyup", e => {
  const caps = e.getModifierState?.("CapsLock");
  if (capsHint) capsHint.hidden = !caps;
});

/* ----------------------------------------------------------------
   NAVIGATION
---------------------------------------------------------------- */
function backToDepartments() {
  selectedDepartment = "";
  setThemeByDept("");
  usernameEl.value = "";
  passwordEl.value = "";
  setError("");
  
  // Clear Current User when going back to departments (Soft Logout)
  currentUser = "";
  updateWelcomeMessage();
  
  showScreen("deptBox");
}
backDeptBtn.addEventListener("click", backToDepartments);
changeDeptFromMenu.addEventListener("click", backToDepartments);
logoutBtn.addEventListener("click", () => {
  showToast(i18n[currentLang].loggedOut, "info");
  currentUser = "";
  setTimeout(() => location.reload(), 800);
});

/* ----------------------------------------------------------------
   BUILD REPORTS MENU & FLOATING LIST
---------------------------------------------------------------- */
function buildReportsMenu() {
  reportsGrid.innerHTML = "";
  floatingDropdownList.innerHTML = ""; // Clear floating menu

  const deptReports = reports[selectedDepartment] || {};
  
  Object.keys(deptReports).forEach(companyKey => {
    const c = companies.find(comp => comp.key === companyKey);
    if (!c) return;

    const url = deptReports[companyKey];
    const name = i18n[currentLang].companies[companyKey] || companyKey;

    // Build Main Menu Button
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "report-btn ripple";
    btn.dataset.key  = c.key;
    btn.dataset.name = name;
    btn.innerHTML = `<img src="${c.logo}" class="report-logo" alt="" /><div class="report-name">${name}</div>`;
    btn.addEventListener("click", () => openReport(c.key, url));
    addRipple(btn);
    reportsGrid.appendChild(btn);

    // Build Floating Dropdown Item
    const floatBtn = document.createElement("button");
    floatBtn.type = "button";
    floatBtn.className = "floating-item";
    floatBtn.innerHTML = `<img src="${c.logo}" class="float-item-logo" alt=""> <span>${name}</span>`;
    floatBtn.addEventListener("click", () => {
      openReport(c.key, url);
      floatingMenuWrap.classList.remove("is-open");
    });
    floatingDropdownList.appendChild(floatBtn);
  });
}

/* ----------------------------------------------------------------
   REPORT SEARCH FILTER
---------------------------------------------------------------- */
reportSearch?.addEventListener("input", () => {
  const q = reportSearch.value.trim().toLowerCase();
  document.querySelectorAll(".report-btn").forEach(btn => {
    const name = (btn.dataset.name || "").toLowerCase();
    const show = !q || name.includes(q);
    btn.style.display = show ? "" : "none";
  });
});

/* ----------------------------------------------------------------
   REPORT VIEWER & FLOATING LOGIC
---------------------------------------------------------------- */
function openReport(key, url) {
  if (!url) return;
  currentReportUrl = url;
  currentReportKey = key;

  if (reportTitleLabel) {
    reportTitleLabel.textContent = i18n[currentLang].companies[key] || key;
  }

  showScreen("reportContainer");
  reportLoading.style.display = "flex";
  startProgress();
  scrollTopNow();
  reportFrame.src = url;

  showToast(i18n[currentLang].reportOpened, "info", 2000);
}

function backToMenu() {
  reportFrame.src = "";
  currentReportUrl = "";
  currentReportKey = "";
  reportLoading.style.display = "none";
  finishProgress();
  showScreen("menuBox");
}

// Floating Menu Interactions
floatingMenuToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  floatingMenuWrap.classList.toggle("is-open");
});
document.addEventListener("click", (e) => {
  if (!e.target.closest(".floating-menu-wrap")) {
    floatingMenuWrap.classList.remove("is-open");
  }
});

floatBackMain.addEventListener("click", () => {
  floatingMenuWrap.classList.remove("is-open");
  backToMenu();
});
floatLogout.addEventListener("click", () => {
  showToast(i18n[currentLang].loggedOut, "info");
  currentUser = "";
  setTimeout(() => location.reload(), 800);
});

reportFrame.addEventListener("load", () => {
  reportLoading.style.display = "none";
  finishProgress();
  scrollTopNow();
});

reloadReportBtn.addEventListener("click", () => {
  if (!currentReportUrl) return;
  reportLoading.style.display = "flex";
  startProgress();
  scrollTopNow();
  reportFrame.src = currentReportUrl;
});

openNewTabBtn.addEventListener("click", () => {
  if (!currentReportUrl) return;
  window.open(currentReportUrl, "_blank", "noopener");
});

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ----------------------------------------------------------------
   INIT
---------------------------------------------------------------- */
initMode();
applyLanguage(currentLang);
updateTimes();
updateLangUI();
updateWelcomeMessage();
showScreen("deptBox");
setThemeByDept("");
setupDeptReveal();