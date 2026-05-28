function initializeApplication() {

    const role =
        localStorage.getItem(
            "role"
        );

    const username =
        localStorage.getItem(
            "username"
        );

    const currentPage =
        window.location.pathname;

    const isCatalogPage =
        currentPage.includes(
            "catalog.html"
        );

    if (
        isCatalogPage &&
        (!role || !username)
    ) {

        window.location.href =
            "login.html";

        return;
    }

    initializeRoleUI(role);

    initializePublicPage();

    initializeAdminPage(role);

    initializeOperatorPage(role);

    console.log(role);
}