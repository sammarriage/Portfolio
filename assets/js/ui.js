/* ============================================================
   UI — small site-wide behaviours: footer year + mobile nav.
   ============================================================ */
(function () {
  "use strict";

  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const header = document.querySelector(".header");
  const anchor = header?.closest(".header-anchor");
  const toggle = document.querySelector(".nav-toggle");
  const links = document.getElementById("navLinks");

  // Header: in the lead until scrolled past, then pins to the top
  if (header && anchor && "IntersectionObserver" in window) {
    const sentinel = document.createElement("div");
    sentinel.className = "header-sentinel";
    sentinel.setAttribute("aria-hidden", "true");
    header.before(sentinel);

    const setStuck = (stuck) => {
      header.classList.toggle("stuck", stuck);
      anchor.style.height = stuck ? `${header.offsetHeight}px` : "";
      if (!stuck && links && toggle) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    };

    new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { threshold: 0 }
    ).observe(sentinel);
  }

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

      // The header pins to the top once you scroll below the lead, so on
      // mobile we must offset by its *stuck* height — even if it isn't stuck
      // yet at tap time — otherwise the pinned bar lands over the title.
      const onMobile = window.matchMedia("(max-width: 720px)").matches;
      let offset = 0;
      if (header?.classList.contains("stuck")) {
        offset = header.offsetHeight + 12;
      } else if (onMobile) {
        header?.classList.add("stuck");
        offset = (header?.offsetHeight || 0) + 12;
        header?.classList.remove("stuck");
      }

      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: scrollBehavior });
    });
  });
})();