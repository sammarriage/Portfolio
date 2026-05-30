/* ============================================================
   UI — small site-wide behaviours: footer year + mobile nav.
   ============================================================ */
(function () {
  "use strict";

  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Header: sits in the lead until scrolled past, then pins to the top.
  const header = document.querySelector(".header");
  const anchor = header?.closest(".header-anchor");
  if (header && anchor && "IntersectionObserver" in window) {
    const sentinel = document.createElement("div");
    sentinel.className = "header-sentinel";
    sentinel.setAttribute("aria-hidden", "true");
    header.before(sentinel);

    const setStuck = (stuck) => {
      header.classList.toggle("stuck", stuck);
      anchor.style.height = stuck ? `${header.offsetHeight}px` : "";
    };

    new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { threshold: 0 }
    ).observe(sentinel);
  }

  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  const setOpen = (open) => {
    links.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  toggle.addEventListener("click", () => {
    setOpen(!links.classList.contains("open"));
  });

  const scrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";

  // Smooth scroll to section + close mobile menu
  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", (e) => {
      setOpen(false);

      const href = a.getAttribute("href");
      if (!href?.startsWith("#") || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const offset =
        header?.classList.contains("stuck") ? header.offsetHeight + 12 : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: scrollBehavior });
    });
  });
})();