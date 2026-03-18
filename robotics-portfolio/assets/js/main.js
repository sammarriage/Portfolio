(function () {
  // Set footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const links = document.getElementById("navLinks");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu after clicking a link (mobile)
    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Project card expand / shrink
  const projectsGrid = document.querySelector(".projects-grid");

  if (projectsGrid) {
    projectsGrid.addEventListener("click", (e) => {
      const toggleBtn = e.target.closest(".project-expand-btn");
      if (!toggleBtn) return;

      const card = toggleBtn.closest(".project");
      if (!card) return;

      const expandedEl = card.querySelector(".project-expanded");
      if (!expandedEl) return;

      const isExpanded = card.classList.contains("is-expanded");
      const scrollCardToTop = () => {
        const rect = card.getBoundingClientRect();
        const offset = 80; // pixels above the top of the project
        const targetY = window.scrollY + rect.top - offset;
        window.scrollTo({ top: targetY, behavior: "smooth" });
      };

      // Collapse any other expanded card
      projectsGrid.querySelectorAll(".project.is-expanded").forEach((other) => {
        if (other === card) return;

        const otherExpanded = other.querySelector(".project-expanded");
        const otherToggleBtn = other.querySelector(".project-expand-btn");

        other.classList.remove("is-expanded");

        if (otherExpanded) {
          otherExpanded.style.maxHeight = "0px";
          otherExpanded.setAttribute("aria-hidden", "true");
        }

        if (otherToggleBtn) {
          otherToggleBtn.setAttribute("aria-expanded", "false");
          otherToggleBtn.textContent = "Expand ⇲";
        }
      });

      // Toggle this card
      if (isExpanded) {
        // Collapse
        expandedEl.style.maxHeight = expandedEl.scrollHeight + "px";
        requestAnimationFrame(() => {
          expandedEl.style.maxHeight = "0px";
        });

        card.classList.remove("is-expanded");
        expandedEl.setAttribute("aria-hidden", "true");
        toggleBtn.setAttribute("aria-expanded", "false");
        toggleBtn.textContent = "Expand ⇲";

        scrollCardToTop();

      } else {
        // Expand
        card.classList.add("is-expanded");
        expandedEl.setAttribute("aria-hidden", "false");
        toggleBtn.setAttribute("aria-expanded", "true");
        toggleBtn.textContent = "Shrink ⇱";

        expandedEl.style.maxHeight = expandedEl.scrollHeight + "px";

        scrollCardToTop();
      }
    });
  }

  // Project filters
  const filterButtons = document.querySelectorAll(".filters [data-filter]");
  const projects = document.querySelectorAll(".projects-grid .project");

  if (filterButtons.length && projects.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter || "all";

        // Update button styles
        filterButtons.forEach((b) => {
          b.classList.remove("primary", "is-active");
          b.classList.add("ghost");
        });

        btn.classList.remove("ghost");
        btn.classList.add("primary", "is-active");

        // Show/hide projects
        projects.forEach((project) => {
          const tags = (project.dataset.tags || "").split(" ");
          const show = filter === "all" || tags.includes(filter);
          project.style.display = show ? "" : "none";
        });
      });
    });
  }
})();