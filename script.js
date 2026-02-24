document.addEventListener("DOMContentLoaded", () => {
  const links = Array.from(document.querySelectorAll(".side-link"));
  const highlight = document.querySelector(".side-highlight");
  const rail = document.querySelector(".side-rail");

  if (!links.length || !highlight || !rail) return;

  const sections = links
    .map((a) => document.getElementById(a.dataset.target))
    .filter(Boolean);

  function moveIndicatorToLink(linkEl) {
    const nav = linkEl.parentElement;
    const navTop = nav.getBoundingClientRect().top;
    const elTop = linkEl.getBoundingClientRect().top;
    const offset = elTop - navTop;

    highlight.style.transform = `translateY(${offset}px)`;
    rail.style.transform = `translateY(${offset}px)`;
  }

  function setActiveById(id) {
    const link = links.find((a) => a.dataset.target === id);
    if (!link) return;

    links.forEach((a) => a.classList.remove("active"));
    link.classList.add("active");
    moveIndicatorToLink(link);
  }

  let isAutoScrolling = false;
  let autoScrollTimeout = null;

  function lockAutoScroll(ms = 650) {
    isAutoScrolling = true;
    clearTimeout(autoScrollTimeout);
    autoScrollTimeout = setTimeout(() => {
      isAutoScrolling = false;
    }, ms);
  }

  let ticking = false;
  function onScroll() {
    if (isAutoScrolling) return;

    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      ticking = false;

      const readingLine = 140;
      let current = sections[0];

      for (const sec of sections) {
        const top = sec.getBoundingClientRect().top;
        if (top <= readingLine) current = sec;
      }

      setActiveById(current.id);
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const id = link.dataset.target;
      const section = document.getElementById(id);
      if (!section) return;

      setActiveById(id);
      lockAutoScroll(800); 

      section.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Init
  setActiveById(sections[0]?.id || links[0].dataset.target);
  onScroll();
});