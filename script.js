const preloader = document.getElementById("preloader");
const preloaderParticles = document.getElementById("preloaderParticles");
const sparkleField = document.getElementById("sparkleField");
const scrollProgress = document.getElementById("scrollProgress");
const revealItems = document.querySelectorAll(".reveal");
const tiltCards = document.querySelectorAll(".tilt-card");
const navLinks = document.querySelectorAll(".mobile-nav__link");
const countdownMessage = document.getElementById("countdownMessage");
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function createPreloaderParticle() {
  const particle = document.createElement("span");
  particle.className = "preloader__particle";
  particle.textContent = Math.random() > 0.5 ? "♡" : "✦";
  particle.style.left = `${Math.random() * 100}%`;
  particle.style.top = `${-8 - Math.random() * 10}%`;
  particle.style.fontSize = `${12 + Math.random() * 12}px`;
  particle.style.opacity = `${0.45 + Math.random() * 0.4}`;
  particle.style.setProperty("--drift", `${-40 + Math.random() * 80}px`);
  particle.style.animation = `preloader-fall ${4 + Math.random() * 3}s linear forwards`;

  preloaderParticles.appendChild(particle);
  setTimeout(() => particle.remove(), 7500);
}

function createSparkle() {
  const sparkle = document.createElement("span");
  sparkle.className = "sparkle";
  sparkle.textContent = Math.random() > 0.58 ? "✦" : "♡";
  sparkle.style.left = `${Math.random() * 100}%`;
  sparkle.style.fontSize = `${10 + Math.random() * 14}px`;
  sparkle.style.opacity = `${0.22 + Math.random() * 0.35}`;
  sparkle.style.animationDuration = `${7 + Math.random() * 7}s`;
  sparkle.style.setProperty("--drift", `${-26 + Math.random() * 52}px`);
  sparkleField.appendChild(sparkle);

  setTimeout(() => sparkle.remove(), 16000);
}

window.addEventListener("load", () => {
  if (!prefersReducedMotion) {
    for (let i = 0; i < 12; i += 1) {
      setTimeout(createPreloaderParticle, i * 150);
    }
    for (let i = 0; i < 10; i += 1) {
      setTimeout(createSparkle, i * 200);
    }
    setInterval(createSparkle, 1000);
  }

  setTimeout(() => {
    preloader.classList.add("is-hidden");
    document.body.classList.add("is-ready");
  }, prefersReducedMotion ? 100 : 1700);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
);

revealItems.forEach((item) => revealObserver.observe(item));

function getNextBirthday() {
  const now = new Date();
  const year = now.getFullYear();
  let next = new Date(year, 3, 23, 0, 0, 0, 0); // April is 3
  if (now > next) next = new Date(year + 1, 3, 23, 0, 0, 0, 0);
  return next;
}

function updateCountdown() {
  const now = new Date();
  const nextBirthday = getNextBirthday();
  const diff = nextBirthday - now;

  if (diff <= 0) {
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    countdownMessage.textContent = "Happy Birthday, Puru. Today is entirely yours.";
    return;
  }

  const day = 1000 * 60 * 60 * 24;
  const hour = 1000 * 60 * 60;
  const minute = 1000 * 60;

  const days = Math.floor(diff / day);
  const hours = Math.floor((diff % day) / hour);
  const minutes = Math.floor((diff % hour) / minute);
  const seconds = Math.floor((diff % minute) / 1000);

  daysEl.textContent = String(days).padStart(2, "0");
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");

  const prettyDate = nextBirthday.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  countdownMessage.textContent = `Every second brings us closer to ${prettyDate} — another soft, beautiful birthday for Puru.`;
}

updateCountdown();
setInterval(updateCountdown, 1000);

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
}

document.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start"
    });
  });
});

const sections = [...document.querySelectorAll("main section[id]")];
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = `#${entry.target.id}`;
      navLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === id));
    });
  },
  { threshold: 0.5 }
);

sections.forEach((section) => sectionObserver.observe(section));

tiltCards.forEach((card) => {
  if (prefersReducedMotion) return;

  card.addEventListener("pointermove", (event) => {
    if (window.innerWidth < 768) return;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 8;
    const rotateX = ((y / rect.height) - 0.5) * -8;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});
