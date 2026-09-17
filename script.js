const header = document.querySelector("[data-header]");
const ticker = document.querySelector(".ticker div");
const form = document.querySelector("[data-contact-form]");
const formNote = document.querySelector("[data-form-note]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

document.documentElement.classList.add("is-ready");
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if (ticker) {
  const originalTickerContent = ticker.innerHTML.trim();

  const setupTicker = () => {
    ticker.innerHTML = originalTickerContent;

    const originalWidth = ticker.scrollWidth;

    if (!originalWidth) {
      return;
    }

    let copies = Math.ceil((window.innerWidth * 2) / originalWidth);
    copies = Math.max(4, copies % 2 === 0 ? copies : copies + 1);

    ticker.innerHTML = Array.from({ length: copies }, () => originalTickerContent).join("");

    const travelDistance = ticker.scrollWidth / 2;
    const duration = Math.max(18, travelDistance / 58);
    ticker.style.setProperty("--ticker-duration", `${duration.toFixed(2)}s`);
  };

  setupTicker();
  window.addEventListener("resize", setupTicker);
}

const revealElements = document.querySelectorAll(
  ".intro-text, .section-heading h2, .service-card, .showcase-copy, .showcase-image, .portfolio-tile, .proof-item, .contact-copy, .contact-form"
);

revealElements.forEach((element, index) => {
  element.setAttribute("data-reveal", "");
  element.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 90}ms`);
});

if (prefersReducedMotion) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

if (!prefersReducedMotion) {
  const heroBg = document.querySelector(".hero-bg");
  const introMark = document.querySelector(".intro-mark");
  const showcaseImage = document.querySelector(".showcase-image");
  let ticking = false;

  const updateMotion = () => {
    const scrollY = window.scrollY;

    heroBg?.style.setProperty("--hero-parallax", `${Math.min(scrollY * 0.12, 72)}px`);
    introMark?.style.setProperty("--mark-parallax", `${Math.max(-80, (scrollY - 520) * -0.035)}px`);

    if (showcaseImage) {
      const rect = showcaseImage.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const distance = rect.top + rect.height / 2 - viewportCenter;
      showcaseImage.style.setProperty("--image-parallax", `${Math.max(-28, Math.min(28, distance * -0.035))}px`);
    }

    ticking = false;
  };

  const requestMotionUpdate = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateMotion);
      ticking = true;
    }
  };

  updateMotion();
  window.addEventListener("scroll", requestMotionUpdate, { passive: true });
  window.addEventListener("resize", requestMotionUpdate);

  document.querySelectorAll(".portfolio-tile").forEach((tile) => {
    tile.addEventListener("pointermove", (event) => {
      const rect = tile.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      tile.style.setProperty("--tilt-x", `${(-y * 5).toFixed(2)}deg`);
      tile.style.setProperty("--tilt-y", `${(x * 5).toFixed(2)}deg`);
    });

    tile.addEventListener("pointerleave", () => {
      tile.style.setProperty("--tilt-x", "0deg");
      tile.style.setProperty("--tilt-y", "0deg");
    });
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

