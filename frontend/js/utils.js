const ROLE_ADMIN = "admin";

const ROLE_OPERATOR = "operador";

const STATUS_PENDING = "Pendiente";

const STATUS_SENT = "Enviado";

const STATUS_DELIVERED = "Entregado";

const STATUS_CANCELLED = "Cancelado";

function getElement(id) {

    return document.getElementById(id);
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

function isAdmin(role) {

    return role === ROLE_ADMIN;
}

function isOperator(role) {

    return role === ROLE_OPERATOR;
}