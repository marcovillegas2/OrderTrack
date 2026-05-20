const ROLE_ADMIN = "admin";
const ROLE_OPERATOR = ROLE_OPERATOR;

const STATUS_PENDING = "Pendiente";
const STATUS_SENT = "Enviado";
const STATUS_DELIVERED = "Entregado";
const STATUS_CANCELLED = "Cancelado";

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

document.addEventListener("DOMContentLoaded", () => {

    const role = localStorage.getItem("role");

    const roleLabel = document.getElementById("user-role");
    if (roleLabel) {
        roleLabel.innerText = `Rol: ${role}`;
    }

    if (document.getElementById("public-product-list")) {
        loadPublicCatalog();
    }

    if (document.getElementById("product-order-name")) {
        loadPublicProducts();
    }

    if (document.getElementById("product-list")) {
        loadProducts();
    }

    if (document.getElementById("operator-list")) {
        loadOperators();
    }

    if (role !== "admin") {

        const adminUserSection = document.getElementById("admin-user-section");
        adminUserSection?.style.setProperty(
            "display",
            "none"
        );

        const productAdminControls = document.getElementById("product-admin-controls");
        productAdminControls?.style.setProperty(
            "display",
            "none"
        );
    }

    if (role !== ROLE_OPERATOR) {

        const operatorOrdersSection = document.getElementById("operator-orders-section");
        operatorOrdersSection?.style.setProperty(
            "display",
            "none"
        );
    } else {

        if (document.getElementById("operator-order-list")) {
            loadDashboardOrders();
        }
    }
});

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
                quantity: parseInt(quantity),
                address: address
            })
        }
    );

    const message =
        document.getElementById(
            "order-message"
        );

    if (response.ok) {

        message.innerText =
            "Pedido enviado correctamente";

        message.style.color = "green";
    }

    else {

        message.innerText =
            "Error al enviar pedido";

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

window.addEventListener("DOMContentLoaded", () => {
    const role = localStorage.getItem("role");

    if (document.getElementById("product-order-name")) {
        loadPublicProducts();
    }

    if (document.getElementById("product-list")) {
        loadProducts();
    }

    if (document.getElementById("operator-list")) {
        loadOperators();
    }

    if (document.getElementById("admin-order-list") && role === ROLE_OPERATOR) {
        loadDashboardOrders();
    }
});

async function loadDashboardOrders() {

    const response = await fetch(
        "http://127.0.0.1:8000/orders"
    );

    const orders = await response.json();

    const list = document.getElementById("operator-order-list");

    if (!list) return;

    list.innerHTML = "";

    const activeOrders = orders.filter(order =>
        order.status === "Pendiente" ||
        order.status === "Enviado"
    );

    if (activeOrders.length === 0) {

        list.innerHTML = `
            <p>No hay pedidos activos</p>
        `;
        return;
    }

    activeOrders.forEach(order => {

        const item = document.createElement("li");

        const actions = [];

        if (order.status === "Pendiente") {

            actions.push(`
                <button class="status-btn" onclick="changeOrderStatus(${order.id}, 'Enviado')">
                    Enviado
                </button>
            `);

            actions.push(`
                <button class="status-btn" onclick="changeOrderStatus(${order.id}, 'Cancelado')">
                    Cancelar
                </button>
            `);
        }

        if (order.status === "Enviado") {

            actions.push(`
                <button class="status-btn" onclick="changeOrderStatus(${order.id}, 'Entregado')">
                    Entregado
                </button>
            `);
        }

        item.innerHTML = `
            <div class="order-info">
                <strong>Cliente:</strong> ${order.customer_name}
                <strong>Producto:</strong> ${order.product_name}
                <strong>Cantidad:</strong> ${order.quantity}
                <strong>Dirección:</strong> ${order.address}
                <strong>Estado:</strong> ${order.status}
            </div>

            <div class="order-actions">
                ${actions.join("")}
            </div>
        `;

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
            <span><strong>${product.name}</strong></span>
            <span>S/. ${product.price}</span>
        `;

        list.appendChild(item);
    });
}