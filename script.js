(function () {
    "use strict";

    const progressBar = document.getElementById("progressBar");
    const backToTop = document.getElementById("backToTop");
    const tocLinks = document.querySelectorAll(".toc-link");
    const sections = document.querySelectorAll(".policy-section");
    const tocToggle = document.getElementById("tocToggle");
    const sidebar = document.getElementById("sidebar");

    /* Read nav height from the CSS custom property */
    const navHeight =
        parseInt(
            getComputedStyle(document.documentElement).getPropertyValue(
                "--nav-height"
            )
        ) || 60;

    /* ── Combined scroll handler ───────────────────────── */
    function handleScroll() {
        const scrollY = window.scrollY;
        const docH = document.documentElement.scrollHeight;
        const winH = window.innerHeight;

        /* 1. Scroll progress bar */
        progressBar.style.width =
            docH > winH
                ? (scrollY / (docH - winH)) * 100 + "%"
                : "0%";

        /* 2. Back-to-top visibility */
        backToTop.classList.toggle("visible", scrollY > 400);

        /* 3. Active TOC link — find the last section whose top edge
              has scrolled past the nav + a small look-ahead offset  */
        let activeId = sections.length > 0 ? sections[0].id : "";
        sections.forEach(function (section) {
            if (scrollY >= section.offsetTop - navHeight - 24) {
                activeId = section.id;
            }
        });

        tocLinks.forEach(function (link) {
            link.classList.toggle(
                "active",
                link.getAttribute("href") === "#" + activeId
            );
        });
    }

    /* ── Back-to-top click ─────────────────────────────── */
    backToTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    /* ── TOC toggle (mobile) ───────────────────────────── */
    tocToggle.addEventListener("click", function () {
        const isOpen = sidebar.classList.toggle("open");
        tocToggle.classList.toggle("active", isOpen);
    });

    /* ── Close sidebar when a TOC link is clicked ─────── */
    tocLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            if (sidebar.classList.contains("open")) {
                sidebar.classList.remove("open");
                tocToggle.classList.remove("active");
            }
        });
    });

    /* ── Close sidebar when clicking outside on mobile ── */
    document.addEventListener("click", function (e) {
        if (
            sidebar.classList.contains("open") &&
            !sidebar.contains(e.target) &&
            !tocToggle.contains(e.target)
        ) {
            sidebar.classList.remove("open");
            tocToggle.classList.remove("active");
        }
    });

    /* ── Single passive scroll listener ───────────────── */
    window.addEventListener("scroll", handleScroll, { passive: true });

    /* ── Initial update on page load ───────────────────── */
    handleScroll();
})();
