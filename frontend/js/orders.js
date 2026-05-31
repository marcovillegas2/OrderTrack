async function createOrder() {

    const customerName =
        getElement(
            "customer-name"
        ).value;

    const productName =
        getElement(
            "product-order-name"
        ).value;

    const quantity =
        getElement(
            "order-quantity"
        ).value;

    const address =
        getElement(
            "order-address"
        ).value;

    const message =
        getElement(
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
        getElement(
            "order-button"
        );

    button.disabled = true;

    button.innerText =
        "Procesando...";

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

    button.innerText =
        "Confirmar pedido";

    if (response.ok) {

        message.innerText =
            "Pedido enviado correctamente";

        message.className =
            "success-message";

        message.style.color =
            "green";

    } else {

        const data =
            await response.json();

        if (data.detail) {

            message.innerText =
                "Datos inválidos. Verifica cantidad y/o dirección.";

        } else {

            message.innerText =
                "Error al enviar pedido";
        }

        message.className =
            "error-message";

        message.style.color =
            "red";
    }
}

async function loadOrders() {

    const response = await fetch(
        "http://127.0.0.1:8000/orders"
    );

    const orders =
        await response.json();

    const list =
        getElement(
            "order-list"
        );

    if (!list) return;

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

function buildOrderActions(order) {

    const actions = [];

    if (order.status === STATUS_PENDING) {

        actions.push(
        `
        <button
            class="status-btn"
            onclick="changeOrderStatus(
                ${order.id},
                STATUS_SENT
            )">
            Enviado
        </button>
        `,
        `
        <button
            class="status-btn"
            onclick="changeOrderStatus(
                ${order.id},
                STATUS_CANCELLED
            )">
            Cancelar
        </button>
        `
        );
    }

    if (order.status === STATUS_SENT) {

        actions.push(`
            <button
                class="status-btn"
                onclick="changeOrderStatus(
                    ${order.id},
                    STATUS_DELIVERED
                )">

                Entregado

            </button>
        `);
    }

    return actions.join("");
}

async function loadDashboardOrders() {

    const response = await fetch(
        "http://127.0.0.1:8000/orders"
    );

    const orders =
        await response.json();

    const list =
        getElement(
            "operator-order-list"
        );

    if (!list) return;

    list.innerHTML = "";

    const searchInput =
        getElement(
            "search-order"
        );

    const searchText =
        searchInput
            ? searchInput.value.toLowerCase()
            : "";

    const activeOrders =
        orders.filter(order => {

            const activeStatus =
                order.status === STATUS_PENDING ||
                order.status === STATUS_SENT;

            const matchesSearch =
                order.customer_name
                    .toLowerCase()
                    .includes(searchText);

            return (
                activeStatus &&
                matchesSearch
            );
        });

    if (activeOrders.length === 0) {

        list.innerHTML = `
            <p>
                No se encontraron pedidos
            </p>
        `;

        return;
    }

    activeOrders.forEach(order => {

        const item =
            document.createElement("li");

        const actions = buildOrderActions(order);

        item.innerHTML = `
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

        list.appendChild(item);
    });
}

async function changeOrderStatus(
    orderId,
    status
) {

    const response = await fetch(
        `http://127.0.0.1:8000/orders/${orderId}/status`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                status: status
            })
        }
    );

    if (response.ok) {

        loadDashboardOrders();

        loadDashboardStats();

    } else {

        const data =
            await response.json();

        alert(
            data.detail ||
            "No se pudo cambiar el estado"
        );
    }
}