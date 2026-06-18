gsap.registerPlugin(ScrollTrigger);

/* ─── ELEMENTS ───────────────────────────────────────────── */

const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

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


const countDays = document.getElementById("countDays");
const countHours = document.getElementById("countHours");
const countMinutes = document.getElementById("countMinutes");
const countSeconds = document.getElementById("countSeconds");

/* ─── STATE ──────────────────────────────────────────────── */

let introFinished = false;
let currentLang = "ka";
let musicStarted = false;
let ticking = false;
let particles = [];
let particlesActive = false;
let resizeTimer;

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobile = window.matchMedia("(max-width: 768px)").matches;

/* ─── INIT ───────────────────────────────────────────────── */

body.classList.add("lock", "ka");

if (mainContent) {
  gsap.set(mainContent, { opacity: 0 });
}

gsap.set(".hero-after-intro", { opacity: 0 });

/* ─── MUSIC ──────────────────────────────────────────────── */

function updateMusicButton() {
  if (!musicBtn || !bgMusic) return;

  if (bgMusic.paused) {
    musicBtn.classList.remove("is-playing");
    musicBtn.setAttribute("aria-label", "Play music");
  } else {
    musicBtn.classList.add("is-playing");
    musicBtn.setAttribute("aria-label", "Pause music");
  }
}

function playMusic() {
  if (!bgMusic) return Promise.resolve(false);

  bgMusic.volume = 0.45;

  return bgMusic.play()
    .then(() => {
      musicStarted = true;
      updateMusicButton();
      removeMusicUnlockListeners();
      return true;
    })
    .catch((err) => {
      console.log("Music autoplay blocked:", err);
      updateMusicButton();
      return false;
    });
}

function pauseMusic() {
  if (!bgMusic) return;

  bgMusic.pause();
  updateMusicButton();
}

function toggleMusic() {
  if (!bgMusic) return;

  if (bgMusic.paused) {
    playMusic();
  } else {
    pauseMusic();
  }
}

/* 
  მთავარი გამოსწორება:
  მუსიკა არ ვრთავთ ძალით intro-ს დროს.
  intro რომ დასრულდება, პირველივე scroll / wheel / touch / click-ზე ჩაირთვება.
*/

function tryPlayMusicAfterIntro() {
  if (!introFinished || !bgMusic || musicStarted) return;
  playMusic();
}

function addMusicUnlockListeners() {
  window.addEventListener("click", tryPlayMusicAfterIntro, { passive: true });
  window.addEventListener("touchstart", tryPlayMusicAfterIntro, { passive: true });
  window.addEventListener("wheel", tryPlayMusicAfterIntro, { passive: true });
  window.addEventListener("scroll", tryPlayMusicAfterIntro, { passive: true });
  window.addEventListener("keydown", tryPlayMusicAfterIntro);
}

function removeMusicUnlockListeners() {
  window.removeEventListener("click", tryPlayMusicAfterIntro);
  window.removeEventListener("touchstart", tryPlayMusicAfterIntro);
  window.removeEventListener("wheel", tryPlayMusicAfterIntro);
  window.removeEventListener("scroll", tryPlayMusicAfterIntro);
  window.removeEventListener("keydown", tryPlayMusicAfterIntro);
}

if (musicBtn) {
  musicBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMusic();
  });
}

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

  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 120);
}

langBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    setLanguage(btn.dataset.lang);
  });
});

setLanguage("ka");

/* ─── SCROLL STATE ───────────────────────────────────────── */

function onScrollUpdate() {
  const scrollTop = window.scrollY;

  if (progressBar) {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = docHeight > 0 ? `${(scrollTop / docHeight) * 100}%` : "0%";
  }

  if (navBar) {
    navBar.classList.toggle("scrolled", scrollTop > 60);
  }

  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(onScrollUpdate);
    ticking = true;
  }
}, { passive: true });

/* ─── PARTICLES ──────────────────────────────────────────── */

const canvas = document.getElementById("particles");
const ctx = canvas ? canvas.getContext("2d") : null;

function resizeCanvas() {
  if (!canvas) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;

  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
}

function initParticles() {
  if (!canvas) return;

  particles = [];

  const count = isMobile
    ? Math.min(Math.floor(window.innerWidth / 28), 24)
    : Math.min(Math.floor(window.innerWidth / 24), 42);

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 0.8 + 0.2,
      dx: (Math.random() - 0.5) * 0.10,
      dy: (Math.random() - 0.5) * 0.10,
      alpha: Math.random() * 0.24 + 0.04
    });
  }
}

function animateParticles() {
  if (!particlesActive || !ctx || !canvas) return;

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  particles.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(185, 167, 232, ${p.alpha})`;
    ctx.fill();

    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0) p.x = window.innerWidth;
    if (p.x > window.innerWidth) p.x = 0;
    if (p.y < 0) p.y = window.innerHeight;
    if (p.y > window.innerHeight) p.y = 0;
  });

  requestAnimationFrame(animateParticles);
}

function startParticles() {
  if (!canvas || particlesActive || reduceMotion) return;

  particlesActive = true;
  canvas.style.opacity = "0";

  requestAnimationFrame(animateParticles);

  setTimeout(() => {
    canvas.style.opacity = isMobile ? "0.07" : "0.11";
  }, 100);
}

resizeCanvas();
initParticles();

window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);

  resizeTimer = setTimeout(() => {
    resizeCanvas();
    initParticles();
    ScrollTrigger.refresh();
  }, 180);
});

/* ─── FINISH INTRO ───────────────────────────────────────── */

function finishIntro() {
  if (introFinished) return;

  introFinished = true;
  body.classList.remove("lock");

  if (introVideo) {
    introVideo.pause();
  }

  if (intro) {
    gsap.to(intro, {
      opacity: 0,
      duration: reduceMotion ? 0.1 : 1.05,
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
      duration: reduceMotion ? 0.1 : 0.9,
      ease: "power3.out"
    });
  }

  gsap.to(".hero-after-intro", {
    opacity: 1,
    duration: reduceMotion ? 0.1 : 1.15,
    ease: "power3.out"
  });

  gsap.from(".hero-eyebrow", {
    opacity: 0,
    y: 18,
    duration: reduceMotion ? 0.1 : 0.75,
    delay: reduceMotion ? 0 : 0.25,
    ease: "power4.out"
  });

  gsap.from(".hero-headline", {
    opacity: 0,
    y: 42,
    duration: reduceMotion ? 0.1 : 0.95,
    delay: reduceMotion ? 0 : 0.38,
    ease: "power4.out"
  });

  gsap.from(".hero-meta", {
    opacity: 0,
    y: 24,
    duration: reduceMotion ? 0.1 : 0.8,
    delay: reduceMotion ? 0 : 0.55,
    ease: "power4.out"
  });

  gsap.from(".cta-btn", {
    opacity: 0,
    y: 18,
    duration: reduceMotion ? 0.1 : 0.7,
    delay: reduceMotion ? 0 : 0.72,
    ease: "power4.out"
  });

  gsap.from(".scroll-hint", {
    opacity: 0,
    duration: reduceMotion ? 0.1 : 0.55,
    delay: reduceMotion ? 0 : 0.95,
    ease: "power3.out"
  });

  startParticles();

  /* აქ აღარ ვრთავთ პირდაპირ playMusic(); */
  addMusicUnlockListeners();
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

    playMusic();
  });
}

/* ─── SCROLL REVEALS ─────────────────────────────────────── */

gsap.utils.toArray(".reveal").forEach((el) => {
  gsap.from(el, {
    scrollTrigger: {
      trigger: el,
      start: "top 88%",
      once: true
    },
    opacity: 0,
    y: 36,
    duration: reduceMotion ? 0.1 : 0.82,
    ease: "power4.out"
  });
});

/* ─── PARALLAX BACKGROUNDS ───────────────────────────────── */

gsap.utils.toArray(".hero-bg, .chapter-bg, .event-bg").forEach((bg) => {
  gsap.to(bg, {
    yPercent: isMobile ? 2 : 3,
    ease: "none",
    scrollTrigger: {
      trigger: bg.parentElement,
      start: "top bottom",
      end: "bottom top",
      scrub: reduceMotion ? false : 0.75
    }
  });
});

/* ─── HEADINGS ───────────────────────────────────────────── */

gsap.utils.toArray(".chapter-content h2, .split-copy h2, .event-content h2, .rsvp h2, .countdown-title").forEach((title) => {
  gsap.from(title, {
    scrollTrigger: {
      trigger: title,
      start: "top 88%",
      once: true
    },
    opacity: 0,
    y: 32,
    duration: reduceMotion ? 0.1 : 0.78,
    ease: "power4.out"
  });
});

/* ─── SPLIT VISUAL ───────────────────────────────────────── */

if (document.querySelector(".split-visual")) {
  gsap.from(".split-visual", {
    scrollTrigger: {
      trigger: ".route-experience",
      start: "top 78%",
      once: true
    },
    opacity: 0,
    scale: 1.018,
    filter: "brightness(.9)",
    duration: reduceMotion ? 0.1 : 1.05,
    ease: "power4.out"
  });
}

/* ─── ROUTE ITEMS ────────────────────────────────────────── */

gsap.utils.toArray(".route-step").forEach((item, i) => {
  gsap.from(item, {
    scrollTrigger: {
      trigger: item,
      start: "top 91%",
      once: true
    },
    opacity: 0,
    x: 22,
    duration: reduceMotion ? 0.1 : 0.62,
    delay: reduceMotion ? 0 : Math.min(i * 0.05, 0.25),
    ease: "power4.out"
  });
});

/* ─── EVENT TIMELINE ITEMS ───────────────────────────────── */

gsap.utils.toArray(".timeline-item").forEach((row, i) => {
  gsap.from(row, {
    scrollTrigger: {
      trigger: row,
      start: "top 92%",
      once: true
    },
    opacity: 0,
    y: 22,
    duration: reduceMotion ? 0.1 : 0.62,
    delay: reduceMotion ? 0 : Math.min(i * 0.035, 0.24),
    ease: "power4.out"
  });
});

/* ─── COUNTDOWN ANIMATION ────────────────────────────────── */

gsap.utils.toArray(".countdown-item").forEach((item, i) => {
  gsap.from(item, {
    scrollTrigger: {
      trigger: item,
      start: "top 92%",
      once: true
    },
    opacity: 0,
    y: 24,
    duration: reduceMotion ? 0.1 : 0.66,
    delay: reduceMotion ? 0 : i * 0.07,
    ease: "power4.out"
  });
});

/* ─── RSVP TRANSITIONS ───────────────────────────────────── */

function fadeOut(el, cb) {
  if (!el) return;

  gsap.to(el, {
    opacity: 0,
    y: -18,
    filter: "blur(5px)",
    duration: reduceMotion ? 0.1 : 0.48,
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
      y: 24,
      filter: "blur(5px)"
    },
    {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: reduceMotion ? 0.1 : 0.72,
      ease: "power4.out"
    }
  );
}

if (acceptInvite) {
  acceptInvite.addEventListener("click", () => {
    playMusic();

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
    playMusic();

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



/* ─── BUTTON MICRO-INTERACTIONS ──────────────────────────── */

document
  .querySelectorAll(".primary-btn, .secondary-btn, .cta-btn, .rsvp-accept, .rsvp-decline, .submit-btn")
  .forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      gsap.to(btn, {
        y: -2,
        duration: 0.2,
        ease: "power2.out",
        overwrite: true
      });
    });

    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, {
        y: 0,
        duration: 0.2,
        ease: "power2.out",
        overwrite: true
      });
    });

    btn.addEventListener("touchstart", () => {
      gsap.to(btn, {
        scale: 0.98,
        duration: 0.12,
        ease: "power2.out",
        overwrite: true
      });
    }, { passive: true });

    btn.addEventListener("touchend", () => {
      gsap.to(btn, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
        overwrite: true
      });
    }, { passive: true });
  });

/* ─── COUNTDOWN ──────────────────────────────────────────── */

if (countDays && countHours && countMinutes && countSeconds) {
  const eventDate = new Date("2026-06-28T16:00:00+04:00").getTime();

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
  onScrollUpdate();
  setLanguage(currentLang);
  updateMusicButton();

  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 250);
});