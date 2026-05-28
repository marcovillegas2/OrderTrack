async function createOperator() {

    const username =
        getElement(
            "operator-username"
        ).value;

    const password =
        getElement(
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
        getElement("operator-list");

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