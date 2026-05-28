function initializeRoleUI(role) {

    const roleLabel =
        getElement("user-role");

    const dashboardTitle =
        getElement("dashboard-title");

    if (roleLabel) {

        roleLabel.innerText =
            `Rol: ${role}`;
    }

    if (dashboardTitle) {

        if (isAdmin(role)) {isOperator(role)

            dashboardTitle.innerText =
                "Panel Administrativo";
        }

        else if (isOperator(role)) {

            dashboardTitle.innerText =
                "Panel Operador";
        }
    }
}

function initializePublicPage() {

    if (
        getElement("public-product-list")
    ) {

        loadPublicCatalog();
    }

    if (
        getElement("product-order-name")
    ) {

        loadPublicProducts();
    }
}

function initializeAdminPage(role) {

    const adminMenu =
        getElement("admin-menu");

    const dashboardSection =
        getElement("dashboard-section");

    const managementSection =
        getElement("management-section");

    const operatorSection =
        getElement("operator-orders-section");

    if (isAdmin(role)) {

        if (adminMenu) {

            adminMenu.style.display =
                "flex";
        }

        if (dashboardSection) {

            dashboardSection.style.display =
                "block";
        }

        if (managementSection) {

            managementSection.style.display =
                "none";
        }

        if (operatorSection) {

            operatorSection.style.display =
                "none";
        }

        loadProducts();

        loadOperators();

        loadDashboardStats();

        renderCharts();

        return;
    }

    if (adminMenu) {

        adminMenu.style.display =
            "none";
    }

    if (dashboardSection) {

        dashboardSection.style.display =
            "none";
    }

    if (managementSection) {

        managementSection.style.display =
            "none";
    }
}

function initializeOperatorPage(role) {

    const operatorSection =
        getElement(
            "operator-orders-section"
        );

    if (isOperator(role)) {

        if (operatorSection) {

            operatorSection.style.display =
                "block";
        }

        loadDashboardOrders();

        return;
    }

    if (operatorSection) {

        operatorSection.style.display =
            "none";
    }
}