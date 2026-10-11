(function () {
  const grid = document.querySelector(".projects-grid");
  if (!grid) return;

  const projects = grid.querySelectorAll(".project");

  function setExpanded(card, open) {
    const panel = card.querySelector(".project-expanded");
    const btn = card.querySelector(".project-expand-btn");
    card.classList.toggle("is-expanded", open);
    panel.setAttribute("aria-hidden", !open);
    btn.setAttribute("aria-expanded", open);
    btn.textContent = open ? "Shrink ↱" : "Expand ↲";
  }

  // Only one card is open at a time
  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".project-expand-btn");
    if (!btn) return;

    const card = btn.closest(".project");
    const open = !card.classList.contains("is-expanded");
    projects.forEach((p) => setExpanded(p, p === card && open));

    window.scrollTo({ top: window.scrollY + card.getBoundingClientRect().top - 80 });
  });

  const filterButtons = document.querySelectorAll(".filters [data-filter]");
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      filterButtons.forEach((b) => b.classList.toggle("primary", b === btn));

      projects.forEach((p) => {
        const show = filter === "all" || p.dataset.tags.split(" ").includes(filter);
        p.style.display = show ? "" : "none";
      });
    });
  });
})();
