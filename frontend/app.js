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

    list.innerHTML = "";

    products.forEach(product => {

        const item =
            document.createElement("li");

        item.innerText =
            ${product.name} - S/. ${product.price};

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

window.onload = () => {
    const role = localStorage.getItem("role");

    const roleLabel = document.getElementById("user-role");
    if (roleLabel) {
        roleLabel.innerText = Rol: ${role};
    }

    if (role !== "admin") {
        const adminUserSection = document.getElementById("admin-user-section");
        const adminProductSection = document.getElementById("admin-product-section");

        if (adminUserSection) adminUserSection.style.display = "none";
        if (adminProductSection) adminProductSection.style.display = "none";
    }

    if (document.getElementById("product-list")) {
        loadProducts();
    }
};

document.addEventListener("DOMContentLoaded", () => {

    const role =
        localStorage.getItem("role");

    if (document.getElementById("user-role")) {

        document.getElementById(
            "user-role"
        ).innerText = Rol: ${role};
    }
});

function logout() {

    localStorage.clear();

    window.location.href = "login.html";
}

async function createOperator() {
    const username = document.getElementById("operator-username").value;
    const password = document.getElementById("operator-password").value;

    const response = await fetch("http://127.0.0.1:8000/users/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            password,
            role: "operador"
        })
    });

    if (response.ok) {
        alert("Operador creado correctamente");
    } else {
        const data = await response.json();
        alert(data.detail || "Error al crear operador");
    }
}
