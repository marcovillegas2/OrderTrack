document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (
            typeof initializeApplication === "function"
        ) {

            initializeApplication();
        }

        if (
            typeof loadPublicCatalog === "function"
        ) {

            loadPublicCatalog();
        }

        if (
            typeof loadPublicProducts === "function"
        ) {

            loadPublicProducts();
        }
    }
);