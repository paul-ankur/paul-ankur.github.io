
(function () {

    function initialiseMenu() {

        const menuContainer = document.getElementById("menu-container");

        if (!menuContainer) {
            console.error("menu-container not found.");
            return;
        }

        fetch(new URL("/menu.html", window.location.origin), {
            cache: "no-store"
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Could not load menu.html: " + response.status);
            }
            return response.text();
        })
        .then(menuHTML => {

            menuContainer.innerHTML = menuHTML;

            const nav = menuContainer.querySelector("#main-nav");
            const navLinks = menuContainer.querySelector("#nav-links");
            const menuToggle = menuContainer.querySelector("#menu-toggle");
            const menuOverlay = menuContainer.querySelector("#menu-overlay");

            if (!nav || !navLinks || !menuToggle || !menuOverlay) {
                console.error("Navigation elements are missing.");
                return;
            }

            menuToggle.setAttribute("type", "button");
            menuToggle.setAttribute("aria-expanded", "false");

            function openMenu() {
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

            document.addEventListener("click", function (event) {

                const clickedToggle = event.target.closest("#menu-toggle");

                if (clickedToggle && nav.contains(clickedToggle)) {
                    event.preventDefault();
                    event.stopPropagation();

                    if (nav.classList.contains("menu-open")) {
                        closeMenu();
                    } else {
                        openMenu();
                    }

                    return;
                }

                if (event.target.closest("#menu-overlay") === menuOverlay) {
                    closeMenu();
                    return;
                }

                const clickedLink = event.target.closest("#nav-links a");

                if (clickedLink && navLinks.contains(clickedLink)) {

                    const dropdown = clickedLink.parentElement;

                    if (
                        dropdown.classList.contains("dropdown") &&
                        window.innerWidth <= 850 &&
                        !dropdown.classList.contains("active")
                    ) {
                        event.preventDefault();

                        navLinks.querySelectorAll(".dropdown").forEach(item => {
                            item.classList.remove("active");
                        });

                        dropdown.classList.add("active");
                        return;
                    }

                    if (!dropdown.classList.contains("dropdown")) {
                        closeMenu();
                    }
                }

            }, true);

            document.addEventListener("keydown", function (event) {
                if (event.key === "Escape") {
                    closeMenu();
                }
            });

            window.addEventListener("resize", function () {
                if (window.innerWidth > 850) {
                    closeMenu();
                }
            });

            console.log("Navigation initialised successfully.");

        })
        .catch(error => {
            console.error("Navigation loading failed:", error);
            menuContainer.innerHTML = "<p>Navigation could not be loaded.</p>";
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialiseMenu);
    } else {
        initialiseMenu();
    }

})();
