async function login() {

    const username =
        getElement("username").value;

    const password =
        getElement("password").value;

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

        globalThis.location.href =
            "catalog.html";

    } else {

        getElement(
            "error-message"
        ).innerText = data.detail;
    }
}

function logout() {

    localStorage.clear();

    globalThis.location.href =
        "login.html";
}