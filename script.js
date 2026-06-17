gsap.registerPlugin(ScrollTrigger);

/* ─── ELEMENTS ───────────────────────────────────────────── */
const body = document.body;
const intro = document.getElementById("intro");
const mainContent = document.getElementById("mainContent");
const skipIntro = document.getElementById("skipIntro");
const progressBar = document.getElementById("progressBar");
const navBar = document.getElementById("navBar");

const introVideo = document.querySelector(".intro-video");
const introAccentLine = document.getElementById("introGoldLine");

const langBtns = document.querySelectorAll(".lang");
const acceptInvite = document.getElementById("acceptInvite");
const declineInvite = document.getElementById("declineInvite");
const rsvpStart = document.getElementById("rsvpStart");
const form = document.getElementById("rsvpForm");
const successMessage = document.getElementById("successMessage");
const declineMessage = document.getElementById("declineMessage");

let introFinished = false;
let currentLang = "ka";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
const musicIcon = document.getElementById("musicIcon");

let musicPlaying = false;
/* ─── INIT ───────────────────────────────────────────────── */
body.classList.add("lock", "ka");

if (mainContent) gsap.set(mainContent, { opacity: 0 });
gsap.set(".hero-after-intro", { opacity: 0 });

/* ─── LANGUAGE ───────────────────────────────────────────── */
function setLanguage(lang) {
  currentLang = lang;
  body.classList.toggle("ka", lang === "ka");

  document.querySelectorAll("[data-ka][data-en]").forEach((el) => {
    const value = el.getAttribute(`data-${lang}`);
    if (value) el.textContent = value;
  });

  document.querySelectorAll("[data-placeholder-ka][data-placeholder-en]").forEach((el) => {
    const value = el.getAttribute(`data-placeholder-${lang}`);
    if (value) el.placeholder = value;
  });

  langBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  ScrollTrigger.refresh();
}

langBtns.forEach((btn) => {
  btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
});

setLanguage("ka");

/* ─── PROGRESS BAR ───────────────────────────────────────── */
function updateProgress() {
  if (!progressBar) return;

  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;

  progressBar.style.width = docHeight > 0 ? `${(scrollTop / docHeight) * 100}%` : "0%";
}

window.addEventListener("scroll", updateProgress, { passive: true });

/* ─── NAV SCROLL STATE ───────────────────────────────────── */
window.addEventListener("scroll", () => {
  if (!navBar) return;
  navBar.classList.toggle("scrolled", window.scrollY > 60);
}, { passive: true });

/* ─── PARTICLES ──────────────────────────────────────────── */
const canvas = document.getElementById("particles");
const ctx = canvas ? canvas.getContext("2d") : null;

let particles = [];
let particlesActive = false;

function resizeCanvas() {
  if (!canvas) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function initParticles() {
  if (!canvas) return;

  particles = [];
  const count = Math.min(Math.floor(window.innerWidth / 18), 55);

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 0.9 + 0.2,
      dx: (Math.random() - 0.5) * 0.14,
      dy: (Math.random() - 0.5) * 0.14,
      alpha: Math.random() * 0.32 + 0.06
    });
  }
}

function animateParticles() {
  if (!particlesActive || !ctx || !canvas) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(185, 167, 232, ${p.alpha})`;
    ctx.fill();

    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
  });

  requestAnimationFrame(animateParticles);
}

function startParticles() {
  if (!canvas || particlesActive) return;

  particlesActive = true;
  canvas.style.opacity = "0";

  requestAnimationFrame(animateParticles);

  setTimeout(() => {
    canvas.style.opacity = "0.18";
  }, 100);
}

resizeCanvas();
initParticles();

window.addEventListener("resize", () => {
  resizeCanvas();
  initParticles();
  ScrollTrigger.refresh();
});

/* ─── FINISH INTRO ───────────────────────────────────────── */
function finishIntro() {
  if (introFinished) return;

  introFinished = true;
  body.classList.remove("lock");

  if (introVideo) introVideo.pause();

  if (intro) {
    gsap.to(intro, {
      opacity: 0,
      duration: reduceMotion ? 0.1 : 1.1,
      ease: "power3.inOut",
      onComplete: () => {
        intro.style.display = "none";
        ScrollTrigger.refresh();
      }
    });
  }

  if (mainContent) {
    gsap.to(mainContent, {
      opacity: 1,
      duration: reduceMotion ? 0.1 : 1.0,
      ease: "power3.out"
    });
  }

  gsap.to(".hero-after-intro", {
    opacity: 1,
    duration: reduceMotion ? 0.1 : 1.3,
    ease: "power3.out"
  });

  gsap.from(".hero-eyebrow", {
    opacity: 0,
    y: 20,
    duration: reduceMotion ? 0.1 : 0.9,
    delay: reduceMotion ? 0 : 0.3,
    ease: "power4.out"
  });

  gsap.from(".hero-headline", {
    opacity: 0,
    y: 52,
    filter: "blur(6px)",
    duration: reduceMotion ? 0.1 : 1.1,
    delay: reduceMotion ? 0 : 0.44,
    ease: "power4.out"
  });

  gsap.from(".hero-meta", {
    opacity: 0,
    y: 28,
    duration: reduceMotion ? 0.1 : 0.9,
    delay: reduceMotion ? 0 : 0.62,
    ease: "power4.out"
  });

  gsap.from(".cta-btn", {
    opacity: 0,
    y: 20,
    duration: reduceMotion ? 0.1 : 0.8,
    delay: reduceMotion ? 0 : 0.78,
    ease: "power4.out"
  });

  gsap.from(".scroll-hint", {
    opacity: 0,
    duration: reduceMotion ? 0.1 : 0.6,
    delay: reduceMotion ? 0 : 1.1,
    ease: "power3.out"
  });

  startParticles();
}
if (musicBtn) {
  musicBtn.classList.add("visible");
}

if (bgMusic) {
  bgMusic.volume = 0.45;

  bgMusic.play().then(() => {
    musicPlaying = true;
    if (musicIcon) musicIcon.textContent = "Ⅱ";
  }).catch(() => {
    musicPlaying = false;
    if (musicIcon) musicIcon.textContent = "♪";
  });
}
/* ─── INTRO TIMELINE ─────────────────────────────────────── */
gsap.set(".intro-line", {
  opacity: 0,
  y: 48,
  filter: "blur(14px)"
});

if (introVideo) {
  gsap.set(introVideo, {
    scale: 1.05,
    filter: "brightness(.8)"
  });
}

if (introAccentLine) {
  gsap.set(introAccentLine, {
    width: 0,
    opacity: 0
  });
}

const introTl = gsap.timeline({
  defaults: { ease: "power4.out" },
  onComplete: finishIntro
});

if (reduceMotion) {
  introTl
    .to(".line-1", {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.1
    })
    .to({}, { duration: 0.3 });
} else {
  introTl
    .to(introVideo, {
      scale: 1,
      filter: "brightness(1)",
      duration: 15,
      ease: "none"
    }, 0)

    .to(".line-1", {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 1.1
    }, 1.2)

    .to(".line-1", {
      opacity: 0,
      y: -28,
      filter: "blur(10px)",
      duration: 0.72
    }, 4.8)

    .to(".line-2", {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 1.1
    }, 5.55)

    .to(".line-2", {
      opacity: 0,
      y: -28,
      filter: "blur(10px)",
      duration: 0.72
    }, 9.2)

    .to(introAccentLine, {
      width: "240px",
      opacity: 0.9,
      duration: 0.85,
      ease: "power3.out"
    }, 9.7)

    .to(".line-3", {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 1.1
    }, 10.2)

    .to(".line-3", {
      opacity: 0,
      y: -24,
      filter: "blur(10px)",
      duration: 0.72
    }, 13.5)

    .to(introAccentLine, {
      opacity: 0,
      duration: 0.4
    }, 13.65);
}

if (introVideo) {
  introVideo.addEventListener("ended", finishIntro);
}

if (skipIntro) {
  skipIntro.addEventListener("click", () => {
    if (!introFinished) {
      introTl.progress(1);
      finishIntro();
    }
  });
}

/* ─── SCROLL REVEALS ─────────────────────────────────────── */
gsap.utils.toArray(".reveal").forEach((el) => {
  gsap.from(el, {
    scrollTrigger: {
      trigger: el,
      start: "top 86%"
    },
    opacity: 0,
    y: 52,
    filter: "blur(7px)",
    duration: reduceMotion ? 0.1 : 1.0,
    ease: "power4.out"
  });
});

/* ─── PARALLAX BACKGROUNDS ───────────────────────────────── */
gsap.utils.toArray(".hero-bg, .chapter-bg, .event-bg").forEach((bg) => {
  gsap.to(bg, {
    yPercent: 4,
    ease: "none",
    scrollTrigger: {
      trigger: bg.parentElement,
      start: "top bottom",
      end: "bottom top",
      scrub: reduceMotion ? false : 1.4
    }
  });
});

/* ─── HEADINGS ───────────────────────────────────────────── */
gsap.utils.toArray(".chapter-content h2, .split-copy h2, .event-content h2, .rsvp h2, .countdown-title").forEach((title) => {
  gsap.from(title, {
    scrollTrigger: {
      trigger: title,
      start: "top 88%"
    },
    opacity: 0,
    y: 40,
    filter: "blur(6px)",
    duration: reduceMotion ? 0.1 : 0.92,
    ease: "power4.out"
  });
});

/* ─── SPLIT VISUAL ───────────────────────────────────────── */
if (document.querySelector(".split-visual")) {
  gsap.from(".split-visual", {
    scrollTrigger: {
      trigger: ".route-experience",
      start: "top 78%"
    },
    opacity: 0,
    scale: 1.025,
    filter: "brightness(.84)",
    duration: reduceMotion ? 0.1 : 1.3,
    ease: "power4.out"
  });
}

/* ─── ROUTE ITEMS ────────────────────────────────────────── */
gsap.utils.toArray(".route-step").forEach((item, i) => {
  gsap.from(item, {
    scrollTrigger: {
      trigger: item,
      start: "top 91%"
    },
    opacity: 0,
    x: 28,
    duration: reduceMotion ? 0.1 : 0.7,
    delay: reduceMotion ? 0 : i * 0.07,
    ease: "power4.out"
  });
});

/* ─── EVENT TIMELINE ITEMS ───────────────────────────────── */
gsap.utils.toArray(".timeline-item").forEach((row, i) => {
  gsap.from(row, {
    scrollTrigger: {
      trigger: row,
      start: "top 92%"
    },
    opacity: 0,
    y: 24,
    duration: reduceMotion ? 0.1 : 0.7,
    delay: reduceMotion ? 0 : Math.min(i * 0.04, 0.32),
    ease: "power4.out"
  });
});

/* ─── COUNTDOWN ANIMATION ────────────────────────────────── */
gsap.utils.toArray(".countdown-item").forEach((item, i) => {
  gsap.from(item, {
    scrollTrigger: {
      trigger: item,
      start: "top 92%"
    },
    opacity: 0,
    y: 26,
    filter: "blur(5px)",
    duration: reduceMotion ? 0.1 : 0.72,
    delay: reduceMotion ? 0 : i * 0.08,
    ease: "power4.out"
  });
});



/* ─── RSVP TRANSITIONS ───────────────────────────────────── */
function fadeOut(el, cb) {
  if (!el) return;

  gsap.to(el, {
    opacity: 0,
    y: -20,
    filter: "blur(7px)",
    duration: reduceMotion ? 0.1 : 0.52,
    ease: "power3.inOut",
    onComplete: cb
  });
}

function fadeIn(el) {
  if (!el) return;

  gsap.fromTo(
    el,
    {
      opacity: 0,
      y: 28,
      filter: "blur(7px)"
    },
    {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: reduceMotion ? 0.1 : 0.8,
      ease: "power4.out"
    }
  );
}

if (acceptInvite) {
  acceptInvite.addEventListener("click", () => {
    fadeOut(rsvpStart, () => {
      if (rsvpStart) rsvpStart.style.display = "none";

      if (form) {
        form.classList.add("active");
        form.style.display = "block";
        fadeIn(form);
      }
    });
  });
}

if (declineInvite) {
  declineInvite.addEventListener("click", () => {
    fadeOut(rsvpStart, () => {
      if (rsvpStart) rsvpStart.style.display = "none";

      if (declineMessage) {
        declineMessage.style.display = "block";
        fadeIn(declineMessage);
      }
    });
  });
}

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = form.querySelector('input[type="text"]');
    const nameVal = nameInput ? nameInput.value : "";
    const refSuffix = nameVal.slice(0, 4).toUpperCase().replace(/[^A-Zა-ჰ0-9]/g, "") || "GUEST";
    const refCode = document.getElementById("refCode");

    if (refCode) {
      refCode.textContent = `JETOUR·${refSuffix}·2026`;
    }

    fadeOut(form, () => {
      form.classList.remove("active");
      form.style.display = "none";

      if (successMessage) {
        successMessage.style.display = "block";
        fadeIn(successMessage);
      }
    });
  });
}

/* ─── ADD TO CALENDAR ────────────────────────────────────── */
const addCalBtn = document.getElementById("addCalBtn");

if (addCalBtn) {
  addCalBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const title = encodeURIComponent("Jetour Club — Exclusive Journey");
    const details = encodeURIComponent("Jetour Club exclusive gathering: convoy route, new model presentation, gastronomy and music.");
    const start = "20260628T150000";
    const end = "20260628T210000";
    const loc = encodeURIComponent("E-MOTORS Showroom, Akaki Beliashvili St. #131, Tbilisi");

    window.open(
      `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${loc}`,
      "_blank"
    );
  });
}

/* ─── BUTTON MICRO-INTERACTIONS ──────────────────────────── */
document.querySelectorAll(".primary-btn, .secondary-btn, .cta-btn, .rsvp-accept, .rsvp-decline, .submit-btn").forEach((btn) => {
  btn.addEventListener("mouseenter", () => {
    gsap.to(btn, {
      y: -2,
      duration: 0.22,
      ease: "power2.out"
    });
  });

  btn.addEventListener("mouseleave", () => {
    gsap.to(btn, {
      y: 0,
      duration: 0.22,
      ease: "power2.out"
    });
  });

  btn.addEventListener("touchstart", () => {
    gsap.to(btn, {
      scale: 0.97,
      duration: 0.14,
      ease: "power2.out"
    });
  }, { passive: true });

  btn.addEventListener("touchend", () => {
    gsap.to(btn, {
      scale: 1,
      duration: 0.22,
      ease: "power2.out"
    });
  }, { passive: true });
});

/* ─── COUNTDOWN ──────────────────────────────────────────── */
const countDays = document.getElementById("countDays");
const countHours = document.getElementById("countHours");
const countMinutes = document.getElementById("countMinutes");
const countSeconds = document.getElementById("countSeconds");

if (countDays && countHours && countMinutes && countSeconds) {
  const eventDate = new Date("2026-06-28T15:00:00+04:00").getTime();

  function updateCountdown() {
    const now = Date.now();
    const distance = eventDate - now;

    if (distance <= 0) {
      countDays.textContent = "00";
      countHours.textContent = "00";
      countMinutes.textContent = "00";
      countSeconds.textContent = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    countDays.textContent = String(days).padStart(2, "0");
    countHours.textContent = String(hours).padStart(2, "0");
    countMinutes.textContent = String(minutes).padStart(2, "0");
    countSeconds.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/* ─── FINAL INIT ─────────────────────────────────────────── */
window.addEventListener("load", () => {
  updateProgress();
  setLanguage(currentLang);
  ScrollTrigger.refresh();
});
if (musicBtn && bgMusic) {
  musicBtn.addEventListener("click", () => {
    if (bgMusic.paused) {
      bgMusic.play();
      musicPlaying = true;
      if (musicIcon) musicIcon.textContent = "Ⅱ";
    } else {
      bgMusic.pause();
      musicPlaying = false;
      if (musicIcon) musicIcon.textContent = "♪";
    }
  });
}