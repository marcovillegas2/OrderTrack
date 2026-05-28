async function loadProducts() {

    const response = await fetch(
        "http://127.0.0.1:8000/products"
    );

    const products = await response.json();

    const list =
        getElement("product-list");

    if (!list) return;

    list.innerHTML = "";

    const role =
        localStorage.getItem("role");

    products.forEach(product => {

        const item =
            document.createElement("li");

        if (isAdmin(role)) {

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
        getElement("product-name").value;

    const price =
        getElement("product-price").value;

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

async function deleteProduct(productId) {

    await fetch(
        `http://127.0.0.1:8000/products/${productId}`,
        {
            method: "DELETE"
        }
    );

    loadProducts();
}

async function loadPublicProducts() {

    const response = await fetch(
        "http://127.0.0.1:8000/products"
    );

    const products = await response.json();

    const select =
        getElement("product-order-name");

    if (!select) return;

    select.innerHTML = "";

    products.forEach(product => {

        const option =
            document.createElement("option");

        option.value =
            product.name;

        option.innerText =
            `${product.name} - S/. ${product.price}`;

        select.appendChild(option);
    });
}

async function loadPublicCatalog() {

    const response = await fetch(
        "http://127.0.0.1:8000/products"
    );

    const products = await response.json();

    const list =
        getElement("public-product-list");

    if (!list) return;

    list.innerHTML = "";

    products.forEach(product => {

        const item =
            document.createElement("li");

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