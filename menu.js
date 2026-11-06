document.addEventListener("DOMContentLoaded", function () {

    const menuContainer = document.getElementById("menu-container");

    if (!menuContainer) return;

    const menuPath = new URL("/menu.html", window.location.origin);

    fetch(menuPath, { cache: "no-store" })
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error: " + response.status);
            }

            return response.text();
        })
        .then(menuHTML => {

            menuContainer.innerHTML = menuHTML;

            const dropdowns = menuContainer.querySelectorAll(".dropdown");

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

        })
        .catch(error => {

            console.error("Navigation loading failed:", error);

            menuContainer.innerHTML =
                "<p>Navigation could not be loaded.</p>";

        });

});
