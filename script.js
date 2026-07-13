const header = document.querySelector("[data-header]");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav a[href^='#']");
const revealItems = document.querySelectorAll(".reveal");

const workflowStates = [
  {
    image: "assets/workflow-connect.png",
    alt: "Estado de conexion en SELPHY Photo Layout",
  },
  {
    image: "assets/workflow-customize.png",
    alt: "Estado de personalizacion en SELPHY Photo Layout",
  },
  {
    image: "assets/workflow-print.png",
    alt: "Canon SELPHY CP1500 imprimiendo una foto",
  },
];

const colorStates = {
  pink: {
    className: "color-pink",
    image: "assets/modelo-rosa.png",
    mobileImage: "assets/model-mobile-pink-bg.png",
    name: "Rosa",
    description: "Un toque de color para imprimir tus mejores recuerdos.",
    alt: "Canon SELPHY CP1500 color rosa",
  },
  white: {
    className: "color-white",
    image: "assets/modelo-blanco.png",
    mobileImage: "assets/model-mobile-white-bg.png",
    name: "Blanco",
    description: "Pureza y elegancia para integrarse a cualquier ambiente.",
    alt: "Canon SELPHY CP1500 color blanco",
  },
  black: {
    className: "color-black",
    image: "assets/modelo-negro.png",
    mobileImage: "assets/model-mobile-black-bg.png",
    name: "Negro",
    description: "Sobriedad y elegancia para un diseño moderno y distinguido.",
    alt: "Canon SELPHY CP1500 color negro",
  },
};

let colorTransitionTimer;
let colorTextTimer;
let activeColor = "pink";
let activeWorkflowIndex = 0;
const colorOrder = ["pink", "black", "white"];
const mobileColorQuery = window.matchMedia("(max-width: 767px)");

function getColorImage(state) {
  return mobileColorQuery.matches ? state.mobileImage : state.image;
}

function syncColorImageSource() {
  const image = document.querySelector("[data-color-image]");
  const nextImage = document.querySelector("[data-color-next]");
  const state = colorStates[activeColor];
  if (!image || !nextImage || !state) return;
  const colorImage = getColorImage(state);
  image.src = colorImage;
  image.alt = state.alt;
  nextImage.src = colorImage;
}

function setHeaderState() {
  header?.classList.toggle("is-scrolled", window.scrollY > 16);
}

function setActiveNavLink() {
  let activeId = "inicio";
  const offset = window.innerHeight * 0.35;

  navLinks.forEach((link) => {
    const section = document.querySelector(link.getAttribute("href"));
    if (section && section.getBoundingClientRect().top <= offset) {
      activeId = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${activeId}`);
  });
}

function activateWorkflow(index) {
  const visual = document.querySelector(".workflow-visual");
  const image = document.querySelector("[data-workflow-image]");
  const steps = document.querySelectorAll(".workflow-step");
  const segments = document.querySelectorAll("[data-workflow-segment]");
  const progressDots = document.querySelectorAll(".workflow-progress-dot");
  const nextIndex = (index + workflowStates.length) % workflowStates.length;
  const state = workflowStates[nextIndex];

  if (!image || !state) return;
  activeWorkflowIndex = nextIndex;
  visual?.classList.add("is-changing");
  window.setTimeout(() => {
    image.src = state.image;
    image.alt = state.alt;
    steps.forEach((step, stepIndex) => {
      const isActive = stepIndex === nextIndex;
      step.classList.toggle("is-active", isActive);
      step.setAttribute("aria-selected", String(isActive));
    });
    segments.forEach((segment) => {
      segment.classList.toggle("is-active", Number(segment.dataset.workflowSegment) === nextIndex);
    });
    progressDots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === nextIndex);
    });
    visual?.classList.remove("is-changing");
  }, 180);
}

function activateColor(color) {
  const section = document.querySelector("[data-color-section]");
  const image = document.querySelector("[data-color-image]");
  const nextImage = document.querySelector("[data-color-next]");
  const colorInfo = document.querySelector(".color-info");
  const colorName = document.querySelector("[data-color-name]");
  const colorDescription = document.querySelector("[data-color-description]");
  const buttons = document.querySelectorAll("[data-color]");
  const state = colorStates[color];

  if (!section || !image || !nextImage || !state) return;
  if (activeColor === color) return;
  const currentIndex = colorOrder.indexOf(activeColor);
  const nextIndex = colorOrder.indexOf(color);
  const direction = nextIndex >= currentIndex ? 1 : -1;
  activeColor = color;
  section.style.setProperty("--color-enter-x", `${direction * 4}px`);
  section.style.setProperty("--color-exit-x", `${direction * -4}px`);
  section.style.setProperty("--color-text-x", `${direction * -4}px`);
  section.classList.remove("color-pink", "color-white", "color-black");
  section.classList.add(state.className);
  const colorImage = getColorImage(state);
  window.clearTimeout(colorTransitionTimer);
  window.clearTimeout(colorTextTimer);
  image.classList.add("is-resetting");
  nextImage.classList.add("is-resetting");
  image.classList.remove("is-fading");
  nextImage.classList.remove("is-visible");
  void image.offsetWidth;
  image.classList.remove("is-resetting");
  nextImage.classList.remove("is-resetting");
  nextImage.src = colorImage;
  nextImage.alt = state.alt;
  void nextImage.offsetWidth;
  image.classList.add("is-fading");
  nextImage.classList.add("is-visible");
  colorInfo?.classList.add("is-fading");
  buttons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.color === color);
    button.setAttribute("aria-pressed", String(button.dataset.color === color));
  });
  colorTextTimer = window.setTimeout(() => {
    if (colorName) colorName.textContent = state.name;
    if (colorDescription) colorDescription.textContent = state.description;
    colorInfo?.classList.remove("is-fading");
  }, 140);
  colorTransitionTimer = window.setTimeout(() => {
    image.classList.add("is-resetting");
    nextImage.classList.add("is-resetting");
    image.src = colorImage;
    image.alt = state.alt;
    image.classList.remove("is-fading");
    nextImage.classList.remove("is-visible");
    void image.offsetWidth;
    image.classList.remove("is-resetting");
    nextImage.classList.remove("is-resetting");
  }, 260);
}

function activateComponent(index) {
  document.querySelectorAll(".component-dot, .component-card").forEach((item) => {
    item.classList.toggle("is-active", Number(item.dataset.component) === index);
  });
  updateMobileDots(".components", index);
}

function updateMobileDots(sectionSelector, index) {
  document.querySelectorAll(`${sectionSelector} .mobile-dots button`).forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === index);
  });
}

function setupMobileMenu() {
  if (!nav) return;

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      nav.classList.remove("is-open");
      return;
    }
    if (window.matchMedia("(max-width: 767px)").matches) {
      nav.classList.toggle("is-open");
    }
  });

  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target)) nav.classList.remove("is-open");
  });
}

function setupFooterAccordion() {
  const footerNav = document.querySelector(".footer-nav");
  const toggle = document.querySelector(".footer-nav-toggle");
  if (!footerNav || !toggle) return;

  toggle.addEventListener("click", () => {
    if (!window.matchMedia("(max-width: 767px)").matches) return;
    const isOpen = footerNav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function setupSnapCarousel(sectionSelector, trackSelector, itemSelector, itemsPerPage = 1) {
  const section = document.querySelector(sectionSelector);
  const track = document.querySelector(trackSelector);
  const items = Array.from(document.querySelectorAll(itemSelector));
  if (!section || !track || !items.length || section.querySelector(".mobile-carousel-button")) return;

  let activeIndex = 0;
  const isLockedAccessoryCarousel = sectionSelector === ".accessories";
  const pageCount = Math.ceil(items.length / itemsPerPage);
  const previous = document.createElement("button");
  const next = document.createElement("button");
  const dots = document.createElement("div");
  previous.type = "button";
  next.type = "button";
  previous.className = "mobile-carousel-button prev";
  next.className = "mobile-carousel-button next";
  previous.setAttribute("aria-label", "Anterior");
  next.setAttribute("aria-label", "Siguiente");
  dots.className = "mobile-dots";

  Array.from({ length: pageCount }).forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Ver ${index + 1}`);
    dot.addEventListener("click", () => goTo(index));
    dots.appendChild(dot);
  });

  function paintDots(index) {
    activeIndex = index;
    dots.querySelectorAll("button").forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === index);
    });
  }

  function goTo(index) {
    const nextIndex = (index + pageCount) % pageCount;
    if (isLockedAccessoryCarousel) {
      track.scrollTo({ left: track.clientWidth * nextIndex, behavior: "smooth" });
    } else {
      items[nextIndex * itemsPerPage].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    }
    paintDots(nextIndex);
  }

  previous.addEventListener("click", () => goTo(activeIndex - 1));
  next.addEventListener("click", () => goTo(activeIndex + 1));
  track.addEventListener(
    "scroll",
    () => {
      const trackLeft = track.getBoundingClientRect().left;
      const closest = items.reduce(
        (best, item, index) => {
          if (index % itemsPerPage !== 0) return best;
          const rect = item.getBoundingClientRect();
          const distance = Math.abs(rect.left - trackLeft);
          return distance < best.distance ? { index: index / itemsPerPage, distance } : best;
        },
        { index: activeIndex, distance: Infinity }
      );
      paintDots(closest.index);
    },
    { passive: true }
  );

  section.append(previous, next);
  track.after(dots);
  paintDots(0);
}

function setupStateDots(sectionSelector, count, onSelect) {
  const section = document.querySelector(sectionSelector);
  if (!section || section.querySelector(".mobile-dots")) return;
  const dots = document.createElement("div");
  dots.className = "mobile-dots";
  for (let index = 0; index < count; index += 1) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Ver ${index + 1}`);
    dot.addEventListener("click", () => onSelect(index));
    dots.appendChild(dot);
  }

  if (sectionSelector === ".workflow") {
    section.querySelector(".workflow-steps")?.after(dots);
  } else {
    section.querySelector(".component-list")?.after(dots);
  }
  updateMobileDots(sectionSelector, 0);
}

function setupWorkflowControls() {
  const steps = document.querySelector(".workflow-steps");
  if (!steps || steps.querySelector(".workflow-nav")) return;

  const previous = document.createElement("button");
  const next = document.createElement("button");
  previous.type = "button";
  next.type = "button";
  previous.className = "workflow-nav workflow-nav-prev";
  next.className = "workflow-nav workflow-nav-next";
  previous.setAttribute("aria-label", "Paso anterior");
  next.setAttribute("aria-label", "Paso siguiente");
  previous.addEventListener("click", () => activateWorkflow(activeWorkflowIndex - 1));
  next.addEventListener("click", () => activateWorkflow(activeWorkflowIndex + 1));
  steps.append(previous, next);
}

function setupWorkflowProgress() {
  const steps = document.querySelector(".workflow-steps");
  if (!steps || document.querySelector(".workflow-progress")) return;

  const progress = document.createElement("div");
  progress.className = "workflow-progress";
  progress.setAttribute("aria-hidden", "true");

  workflowStates.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.className = "workflow-progress-dot";
    dot.classList.toggle("is-active", index === activeWorkflowIndex);
    progress.appendChild(dot);
  });

  steps.before(progress);
}

function setupAccessoryMotion() {
  const section = document.querySelector(".accessories");
  const cards = document.querySelectorAll(".accessory-card");
  let frame = 0;
  let pointerX = 0.5;
  let pointerY = 0.5;
  let clientX = 0;
  let clientY = 0;

  if (!section || !cards.length || window.matchMedia("(pointer: coarse)").matches) return;

  function render() {
    frame = 0;
    section.style.setProperty("--accessory-bg-x", `${(pointerX - 0.5) * 8}px`);
    section.style.setProperty("--accessory-bg-y", `${(pointerY - 0.5) * 6}px`);

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      const y = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
      card.style.setProperty("--card-glow-x", `${x * 100}%`);
      card.style.setProperty("--card-glow-y", `${y * 100}%`);
      card.style.setProperty("--card-border-alpha", `${0.74 + Math.abs(x - 0.5) * 0.22}`);
    });
  }

  section.addEventListener(
    "pointermove",
    (event) => {
      const rect = section.getBoundingClientRect();
      clientX = event.clientX;
      clientY = event.clientY;
      pointerX = (event.clientX - rect.left) / rect.width;
      pointerY = (event.clientY - rect.top) / rect.height;
      if (!frame) frame = window.requestAnimationFrame(render);
    },
    { passive: true }
  );

  section.addEventListener("pointerleave", () => {
    pointerX = 0.5;
    pointerY = 0.5;
    const rect = section.getBoundingClientRect();
    clientX = rect.left + rect.width / 2;
    clientY = rect.top + rect.height / 2;
    cards.forEach((card) => {
      card.style.setProperty("--card-glow-x", "50%");
      card.style.setProperty("--card-glow-y", "18%");
      card.style.setProperty("--card-border-alpha", "0.72");
    });
    if (!frame) frame = window.requestAnimationFrame(render);
  });
}

window.addEventListener("scroll", () => {
  setHeaderState();
  setActiveNavLink();
}, { passive: true });
setHeaderState();
setActiveNavLink();
setupMobileMenu();
setupFooterAccordion();
setupAccessoryMotion();
setupSnapCarousel(".benefits", ".benefit-grid", ".benefit-card", 2);
setupSnapCarousel(".accessories", ".accessory-grid", ".accessory-card");
setupWorkflowControls();
setupWorkflowProgress();
setupStateDots(".components", 4, activateComponent);
syncColorImageSource();
mobileColorQuery.addEventListener("change", syncColorImageSource);

document.querySelectorAll(".workflow-step").forEach((step) => {
  step.addEventListener("click", () => activateWorkflow(Number(step.dataset.step)));
});

document.querySelectorAll("[data-color]").forEach((button) => {
  button.addEventListener("click", () => activateColor(button.dataset.color));
});

document.querySelectorAll("[data-component]").forEach((button) => {
  button.addEventListener("click", () => activateComponent(Number(button.dataset.component)));
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));
