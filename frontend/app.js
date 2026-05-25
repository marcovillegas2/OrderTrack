const ROLE_ADMIN = "admin";
const ROLE_OPERATOR = "operador";
const STATUS_PENDING = "Pendiente";
const STATUS_SENT = "Enviado";
const STATUS_DELIVERED = "Entregado";
const STATUS_CANCELLED = "Cancelado";
let pieChart = null;
let barChart = null;

async function login() {

    const username =
        document.getElementById("username").value;

    const password =
        document.getElementById("password").value;

    const response = await fetch(
        "http://127.0.0.1:8000/login",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username,
                password
            })
        }
    );

    const data = await response.json();

    if (response.ok) {

        localStorage.setItem(
            "username",
            username
        );

        localStorage.setItem(
            "role",
            data.role
        );

        window.location.href =
            "catalog.html";

    } else {

        document.getElementById(
            "error-message"
        ).innerText = data.detail;
    }
}

async function loadProducts() {

    const response = await fetch(
        "http://127.0.0.1:8000/products"
    );

    const products = await response.json();

    const list =
        document.getElementById("product-list");

    if (!list) return;

    list.innerHTML = "";

    const role =
        localStorage.getItem("role");

    products.forEach(product => {

        const item =
            document.createElement("li");

        if (role === ROLE_ADMIN) {

            item.innerHTML = `
                <span>
                    ${product.name} - S/. ${product.price}
                </span>

                <button
                    class="delete-btn"
                    onclick="deleteProduct(${product.id})">

                    Eliminar
                </button>
            `;
        }

        else {

            item.innerHTML = `
                <span>
                    ${product.name} - S/. ${product.price}
                </span>
            `;
        }

        list.appendChild(item);
    });
}

async function createProduct() {

    const name =
        document.getElementById("product-name").value;

    const price =
        document.getElementById("product-price").value;

    await fetch(
        "http://127.0.0.1:8000/products/create",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
                price: Number.parseFloat(price)
            })
        }
    );

    loadProducts();
}

function setupDashboard(role) {

    const roleLabel =
        document.getElementById(
            "user-role"
        );

    const dashboardTitle =
        document.getElementById(
            "dashboard-title"
        );

    if (dashboardTitle) {

        if (role === ROLE_ADMIN) {

            dashboardTitle.innerText =
                "Panel Administrativo";
        }

        else if (role === ROLE_OPERATOR) {

            dashboardTitle.innerText =
                "Panel Operador";
        }
    }

    if (roleLabel) {

        roleLabel.innerText =
            `Rol: ${role}`;
    }
}

function loadInitialData() {

    if (
        document.getElementById(
            "public-product-list"
        )
    ) {

        loadPublicCatalog();
    }

    if (
        document.getElementById(
            "product-order-name"
        )
    ) {

        loadPublicProducts();
    }

    if (
        document.getElementById(
            "product-list"
        )
    ) {

        loadProducts();
    }

    if (
        document.getElementById(
            "operator-list"
        )
    ) {

        loadOperators();
    }
}

function setupAdminSections(role) {

    if (role !== ROLE_ADMIN) {

        hideElement("admin-user-section");
        hideElement("product-admin-controls");
        hideElement("stats-section");
        hideElement("charts-section");
        hideElement("admin-menu");

        return;
    }

    loadDashboardStats();
    showDashboardSection();
}

function hideElement(elementId) {

    const element =
        document.getElementById(
            elementId
        );

    element?.style.setProperty(
        "display",
        "none"
    );
}

function setupOperatorSection(role) {

    if (role !== ROLE_OPERATOR) {

        hideElement(
            "operator-orders-section"
        );

        return;
    }

    if (
        document.getElementById(
            "operator-order-list"
        )
    ) {

        loadDashboardOrders();
    }
}

document.addEventListener(
    "DOMContentLoaded",
    () => {

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

        setupDashboard(role);

        loadInitialData();

        setupAdminSections(role);

        setupOperatorSection(role);
    }
);

function logout() {

    localStorage.clear();

    window.location.href = "login.html";
}

async function createOperator() {

    const username =
        document.getElementById(
            "operator-username"
        ).value;

    const password =
        document.getElementById(
            "operator-password"
        ).value;

    const response = await fetch(
        "http://127.0.0.1:8000/users/create",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username,
                password,
                role: ROLE_OPERATOR
            })
        }
    );

    if (response.ok) {

        loadOperators();
    }
}

async function loadOperators() {

    const response = await fetch(
        "http://127.0.0.1:8000/operators"
    );

    const operators = await response.json();

    const list =
        document.getElementById("operator-list");

    if (!list) return;

    list.innerHTML = "";

    operators.forEach(operator => {

        const item =
            document.createElement("li");

        item.innerHTML = `
            <span>
                ${operator.username}
            </span>

            <button
                class="delete-btn"
                onclick="deleteOperator(${operator.id})">

                Eliminar
            </button>
        `;

        list.appendChild(item);
    });
}

async function deleteOperator(userId) {

    await fetch(
        `http://127.0.0.1:8000/operators/${userId}`,
        {
            method: "DELETE"
        }
    );

    loadOperators();
}

async function deleteProduct(productId) {

    await fetch(
        `http://127.0.0.1:8000/products/${productId}`,
        {
            method: "DELETE"
        }
    );

    loadProducts();
}

async function createOrder() {

    const customerName =
        document.getElementById(
            "customer-name"
        ).value;

    const productName =
        document.getElementById(
            "product-order-name"
        ).value;

    const quantity =
        document.getElementById(
            "order-quantity"
        ).value;

    const address =
        document.getElementById(
            "order-address"
        ).value;

    const message =
        document.getElementById(
            "order-message"
        );

    if (
        !customerName.trim() ||
        !productName.trim() ||
        !quantity.trim() ||
        !address.trim()
    ) {

        message.innerText =
            "Todos los campos son obligatorios";

        message.className =
            "error-message";

        return;
    }

    const button =
        document.getElementById(
            "order-button"
        );
    button.disabled = true;
    button.innerText = "Procesando...";

    const response = await fetch(
        "http://127.0.0.1:8000/orders/create",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                customer_name: customerName,
                product_name: productName,
                quantity: Number.parseInt(quantity, 10),
                address: address
            })
        }
    );

    button.disabled = false;
    button.innerText = "Confirmar pedido";

    if (response.ok) {

        message.innerText =
            "Pedido enviado correctamente";
        message.className = "success-message";
        message.style.color = "green";
    } else {
        message.innerText = "Error al enviar pedido";
        message.className = "error-message";
        message.style.color = "red";
    }
}


async function loadOrders() {

    const response = await fetch(
        "http://127.0.0.1:8000/orders"
    );

    const orders = await response.json();

    const list =
        document.getElementById("order-list");

    list.innerHTML = "";

    orders.forEach(order => {

        const item =
            document.createElement("li");

        item.innerHTML = `
            <span>
                ${order.customer_name}
                - ${order.product_name}
                - ${order.status}
            </span>
        `;

        list.appendChild(item);
    });
}

async function loadPublicProducts() {
    const response = await fetch("http://127.0.0.1:8000/products");
    const products = await response.json();

    const select = document.getElementById("product-order-name");
    if (!select) return;

    select.innerHTML = "";

    products.forEach(product => {
        const option = document.createElement("option");
        option.value = product.name;
        option.innerText = `${product.name} - S/. ${product.price}`;
        select.appendChild(option);
    });
}

function buildOrderActions(order) {

    const actions = [];

    if (order.status === STATUS_PENDING) {

        actions.push(`
            <button
                class="status-btn"
                onclick="changeOrderStatus(${order.id}, STATUS_SENT)">

                Enviado
            </button>
        `);

        actions.push(`
            <button
                class="status-btn"
                onclick="changeOrderStatus(${order.id}, STATUS_CANCELLED)">

                Cancelar
            </button>
        `);
    }

    if (order.status === STATUS_SENT) {

        actions.push(`
            <button
                class="status-btn"
                onclick="changeOrderStatus(${order.id}, STATUS_DELIVERED)">

                Entregado
            </button>
        `);
    }

    return actions.join("");
}

function renderOrderItem(order) {

    const actions =
        buildOrderActions(order);

    return `
        <div class="order-info">

            <strong>
                Cliente:
            </strong>

            ${order.customer_name}

            <strong>
                Producto:
            </strong>

            ${order.product_name}

            <strong>
                Cantidad:
            </strong>

            ${order.quantity}

            <strong>
                Dirección:
            </strong>

            ${order.address}

            <strong>
                Estado:
            </strong>

            <span class="
                order-status
                ${getStatusClass(order.status)}
            ">
                ${order.status}
            </span>

        </div>

        <div class="order-actions">
            ${actions}
        </div>
    `;
}

async function loadDashboardOrders() {

    const response = await fetch(
        "http://127.0.0.1:8000/orders"
    );

    const orders = await response.json();

    const list =
        document.getElementById(
            "operator-order-list"
        );

    if (!list) return;

    list.innerHTML = "";

    const activeOrders = orders.filter(order =>
        order.status === STATUS_PENDING ||
        order.status === STATUS_SENT
    );

    if (activeOrders.length === 0) {

        list.innerHTML = `
            <p>No hay pedidos activos</p>
        `;

        return;
    }

    activeOrders.forEach(order => {

        const item =
            document.createElement("li");

        item.innerHTML =
            renderOrderItem(order);

        list.appendChild(item);
    });
}

async function changeOrderStatus(orderId, status) {
    const response = await fetch(`http://127.0.0.1:8000/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            status: status
        })
    });

    if (response.ok) {
        loadDashboardOrders();
        loadDashboardStats();
    } else {
        const data = await response.json();
        alert(data.detail || "No se pudo cambiar el estado");
    }
}

async function loadPublicCatalog() {

    const response = await fetch(
        "http://127.0.0.1:8000/products"
    );

    const products = await response.json();

    const list = document.getElementById("public-product-list");

    if (!list) return;

    list.innerHTML = "";

    products.forEach(product => {

        const item = document.createElement("li");

        item.innerHTML = `

            <div>

                <strong>
                    ${product.name}
                </strong>

                <p>
                    Delicioso producto
                    disponible para delivery
                </p>

            </div>

            <div>

                <strong>
                    S/. ${product.price}
                </strong>

            </div>
        `;

        list.appendChild(item);
    });
}

async function loadDashboardStats() {

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/orders/stats"
        );

        const stats = await response.json();

        document.getElementById(
            "total-orders"
        ).textContent = stats.total;

        document.getElementById(
            "pending-orders"
        ).textContent = stats.pending;

        document.getElementById(
            "sent-orders"
        ).textContent = stats.sent;

        document.getElementById(
            "delivered-orders"
        ).textContent = stats.delivered;

        document.getElementById(
            "cancelled-orders"
        ).textContent = stats.cancelled;

        renderCharts(stats);

    } catch (error) {

        console.error(
            "Error cargando estadísticas:",
            error
        );
    }
}

function renderCharts(stats) {

    const pieCtx =
        document.getElementById(
            "ordersPieChart"
        );

    const barCtx =
        document.getElementById(
            "ordersBarChart"
        );

    if (!pieCtx || !barCtx) return;

    if (pieChart) {
        pieChart.destroy();
    }

    if (barChart) {
        barChart.destroy();
    }

    pieChart = new Chart(pieCtx, {

        type: "pie",

        data: {

            labels: [
                "Pendientes",
                "Enviados",
                "Entregados",
                "Cancelados"
            ],

            datasets: [{
                data: [
                    stats.pending,
                    stats.sent,
                    stats.delivered,
                    stats.cancelled
                ],

                backgroundColor: [
                    "#FFFB1F",
                    "#FF8B1F",
                    "#4CAF50",
                    "#FF1F23"
                ]
            }]
        }
    });

    barChart = new Chart(barCtx, {

        type: "bar",

        data: {

            labels: [
                "Pendientes",
                "Enviados",
                "Entregados",
                "Cancelados"
            ],

            datasets: [{

                label: "Pedidos",

                data: [
                    stats.pending,
                    stats.sent,
                    stats.delivered,
                    stats.cancelled
                ],

                backgroundColor: [
                    "#FFFB1F",
                    "#FF8B1F",
                    "#4CAF50",
                    "#FF1F23"
                ]
            }]
        },

        options: {

            responsive: true,

            scales: {

                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function showDashboardSection() {

    const dashboard =
        document.getElementById(
            "dashboard-section"
        );

    const management =
        document.getElementById(
            "management-section"
        );

    dashboard.style.display = "block";

    management.style.display = "none";
}

function showManagementSection() {

    const dashboard =
        document.getElementById(
            "dashboard-section"
        );

    const management =
        document.getElementById(
            "management-section"
        );

    dashboard.style.display = "none";

    management.style.display = "block";
}

function getStatusClass(status) {

    switch (status) {

        case STATUS_PENDING:
            return "status-pending";

        case STATUS_SENT:
            return "status-sent";

        case STATUS_DELIVERED:
            return "status-delivered";

        case STATUS_CANCELLED:
            return "status-cancelled";

        default:
            return "";
    }
}