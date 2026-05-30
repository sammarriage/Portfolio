/* ============================================================
   PROJECTS — expand / collapse cards and filter by tag.
   ============================================================ */
(function () {
  "use strict";

  const grid = document.querySelector(".projects-grid");
  if (!grid) return;

  const LABELS = { expanded: "Shrink \u21B1", collapsed: "Expand \u21B2" };

  // Put a card into the collapsed visual state.
  function collapse(card) {
    const panel = card.querySelector(".project-expanded");
    const btn = card.querySelector(".project-expand-btn");
    card.classList.remove("is-expanded");
    if (panel) {
      panel.style.maxHeight = "";
      panel.setAttribute("aria-hidden", "true");
    }
    if (btn) {
      btn.setAttribute("aria-expanded", "false");
      btn.textContent = LABELS.collapsed;
    }
  }

  // Put a card into the expanded visual state.
  function expand(card) {
    const panel = card.querySelector(".project-expanded");
    const btn = card.querySelector(".project-expand-btn");
    card.classList.add("is-expanded");
    if (panel) {
      panel.style.maxHeight = "";
      panel.setAttribute("aria-hidden", "false");
    }
    if (btn) {
      btn.setAttribute("aria-expanded", "true");
      btn.textContent = LABELS.expanded;
    }
  }

  function scrollCardIntoView(card) {
    const offset = 80; // breathing room above the card
    const targetY = window.scrollY + card.getBoundingClientRect().top - offset;
    window.scrollTo({ top: targetY, behavior: "auto" });
  }

  // Expand / collapse (one card open at a time)
  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".project-expand-btn");
    if (!btn) return;

    const card = btn.closest(".project");
    if (!card || !card.querySelector(".project-expanded")) return;

    const wasOpen = card.classList.contains("is-expanded");

    grid.querySelectorAll(".project.is-expanded").forEach((other) => {
      if (other !== card) collapse(other);
    });

    if (wasOpen) {
      collapse(card);
    } else {
      expand(card);
    }
    scrollCardIntoView(card);
  });

  // Filter buttons
  const filterButtons = document.querySelectorAll(".filters [data-filter]");
  const projects = grid.querySelectorAll(".project");
  if (!filterButtons.length || !projects.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter || "all";

      filterButtons.forEach((b) => {
        b.classList.toggle("primary", b === btn);
        b.classList.toggle("is-active", b === btn);
        b.classList.toggle("ghost", b !== btn);
      });

      projects.forEach((project) => {
        const tags = (project.dataset.tags || "").split(" ");
        const show = filter === "all" || tags.includes(filter);
        project.style.display = show ? "" : "none";
      });
    });
  });
})();
