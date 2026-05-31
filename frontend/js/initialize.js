function initializeApplication() {

    const role =
        localStorage.getItem(
            "role"
        );

    const username =
        localStorage.getItem(
            "username"
        );

    const currentPage = globalThis.location.pathname;

    const isCatalogPage =
        currentPage.includes(
            "catalog.html"
        );

    if (
        isCatalogPage &&
        (!role || !username)
    ) {

        globalThis.location.href =
            "login.html";

        return;
    }

    initializeRoleUI(role);

    initializePublicPage();

    initializeAdminPage(role);

    initializeOperatorPage(role);

    console.log(role);
}