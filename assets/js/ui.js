(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const copyLink = document.querySelector("[data-copy]");
  if (copyLink) {
    copyLink.addEventListener("click", () => {
      navigator.clipboard.writeText(copyLink.dataset.copy);
      alert("Email copied to clipboard");
    });
  }

  const header = document.querySelector(".header");
  const anchor = document.querySelector(".header-anchor");
  const toggle = document.querySelector(".nav-toggle");
  const links = document.getElementById("navLinks");
  if (!header || !anchor || !toggle || !links) return;

  const setOpen = (open) => {
    links.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open);
  };

  // Pin the nav to the top once the page has scrolled past the lead.
  // The anchor keeps its height so nothing jumps when the nav leaves the flow.
  const sentinel = document.createElement("div");
  sentinel.className = "header-sentinel";
  sentinel.setAttribute("aria-hidden", "true");
  header.before(sentinel);

  new IntersectionObserver(([entry]) => {
    const stuck = !entry.isIntersecting;
    header.classList.toggle("stuck", stuck);
    anchor.style.height = stuck ? `${header.offsetHeight}px` : "";
    if (!stuck) setOpen(false);
  }).observe(sentinel);

  toggle.addEventListener("click", () => setOpen(!links.classList.contains("open")));

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = window.matchMedia("(max-width: 720px)");

  links.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;
    setOpen(false);

    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    e.preventDefault();

    // On phones the nav is about to pin itself, so leave room for it even
    // if it hasn't pinned yet.
    let offset = 0;
    if (header.classList.contains("stuck")) {
      offset = header.offsetHeight + 12;
    } else if (mobile.matches) {
      header.classList.add("stuck");
      offset = header.offsetHeight + 12;
      header.classList.remove("stuck");
    }

    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  });
})();
