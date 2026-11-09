
(function () {

    function initialiseMenu() {

        const menuContainer = document.getElementById("menu-container");

        if (!menuContainer) {
            console.error("menu-container not found.");
            return;
        }

        const menuPath = new URL("/menu.html", window.location.origin);

        fetch(menuPath, { cache: "no-store" })

            .then(response => {

                if (!response.ok) {
                    throw new Error("Could not load menu.html: " + response.status);
                }

                return response.text();

            })

            .then(menuHTML => {

                menuContainer.innerHTML = menuHTML;

                const nav = menuContainer.querySelector("#main-nav");
                const menuToggle = menuContainer.querySelector("#menu-toggle");
                const menuOverlay = menuContainer.querySelector("#menu-overlay");
                const navLinks = menuContainer.querySelector("#nav-links");

                if (!nav || !menuToggle || !menuOverlay || !navLinks) {
                    console.error("One or more navigation elements are missing.");
                    return;
                }

                function openMenu() {

                    nav.classList.add("menu-open");
                    document.body.classList.add("menu-active");

                    menuToggle.setAttribute("aria-expanded", "true");

                }

                function closeMenu() {

                    nav.classList.remove("menu-open");
                    document.body.classList.remove("menu-active");

                    menuToggle.setAttribute("aria-expanded", "false");

                    navLinks.querySelectorAll(".dropdown").forEach(item => {
                        item.classList.remove("active");
                    });

                }

                /* HAMBURGER BUTTON */

                menuToggle.addEventListener("click", function (event) {

                    event.preventDefault();
                    event.stopPropagation();

                    if (nav.classList.contains("menu-open")) {
                        closeMenu();
                    } else {
                        openMenu();
                    }

                });

                /* OVERLAY */

                menuOverlay.addEventListener("click", closeMenu);

                /* ESCAPE KEY */

                document.addEventListener("keydown", function (event) {

                    if (event.key === "Escape") {
                        closeMenu();
                    }

                });

                /* MOBILE DROPDOWNS */

                const dropdowns = navLinks.querySelectorAll(".dropdown");

                dropdowns.forEach(dropdown => {

                    const link = dropdown.querySelector(":scope > a");

                    if (!link) return;

                    link.addEventListener("click", function (event) {

                        if (window.innerWidth <= 850) {

                            if (!dropdown.classList.contains("active")) {

                                event.preventDefault();

                                dropdowns.forEach(item => {
                                    item.classList.remove("active");
                                });

                                dropdown.classList.add("active");

                            }

                        }

                    });

                });

                /* NORMAL NAVIGATION LINKS */

                const regularLinks = navLinks.querySelectorAll("li:not(.dropdown) > a");

                regularLinks.forEach(link => {
                    link.addEventListener("click", closeMenu);
                });

                /* WINDOW RESIZE */

                window.addEventListener("resize", function () {

                    if (window.innerWidth > 850) {
                        closeMenu();
                    }

                });

                console.log("Navigation initialised successfully.");

            })

            .catch(error => {

                console.error("Navigation loading failed:", error);

                menuContainer.innerHTML =
                    "<p>Navigation could not be loaded.</p>";

            });

    }

    /* WORK WHETHER DOMCONTENTLOADED HAS FIRED OR NOT */

    if (document.readyState === "loading") {

        document.addEventListener("DOMContentLoaded", initialiseMenu);

    } else {

        initialiseMenu();

    }

})();
