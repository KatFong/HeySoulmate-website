const progress = document.querySelector(".progress");
const cursor = document.querySelector(".cursor-dot");
const revealItems = document.querySelectorAll(".reveal");
const parallaxItems = document.querySelectorAll("[data-parallax]");

const setProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const percent = max > 0 ? (window.scrollY / max) * 100 : 0;
  progress.style.width = `${percent}%`;
};

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

const updateParallax = () => {
  parallaxItems.forEach((item) => {
    const speed = Number(item.dataset.parallax || 0);
    const rect = item.getBoundingClientRect();
    const offset = (rect.top - window.innerHeight / 2) * speed;
    item.style.transform = `translate3d(0, ${offset}px, 0)`;
  });
};

window.addEventListener("scroll", () => {
  setProgress();
  updateParallax();
});

window.addEventListener("resize", () => {
  setProgress();
  updateParallax();
});

if (cursor && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("pointermove", (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });

  document.querySelectorAll("a, button, summary, .magnetic").forEach((item) => {
    item.addEventListener("mouseenter", () => cursor.classList.add("is-hovering"));
    item.addEventListener("mouseleave", () => cursor.classList.remove("is-hovering"));
  });
}

document.querySelectorAll(".magnetic").forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const rect = item.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.16;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.22;
    item.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });

  item.addEventListener("pointerleave", () => {
    item.style.transform = "";
  });
});

setProgress();
updateParallax();
