async function loadDashboardStats() {

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/orders/stats"
        );

        const stats = await response.json();

        getElement(
            "total-orders"
        ).textContent = stats.total;

        getElement(
            "pending-orders"
        ).textContent = stats.pending;

        getElement(
            "sent-orders"
        ).textContent = stats.sent;

        getElement(
            "delivered-orders"
        ).textContent = stats.delivered;

        getElement(
            "cancelled-orders"
        ).textContent = stats.cancelled;

        const total =
            stats.total || 1;

        getElement(
            "pending-percent"
        ).textContent =
            `${Math.round((stats.pending / total) * 100)}% del total`;

        getElement(
            "sent-percent"
        ).textContent =
            `${Math.round((stats.sent / total) * 100)}% del total`;

        getElement(
            "delivered-percent"
        ).textContent =
            `${Math.round((stats.delivered / total) * 100)}% del total`;

        getElement(
            "cancelled-percent"
        ).textContent =
            `${Math.round((stats.cancelled / total) * 100)}% del total`;

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
        getElement(
            "ordersPieChart"
        );

    const barCtx =
        getElement(
            "ordersBarChart"
        );

    if (!pieCtx || !barCtx) {
        return;
    }

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
        getElement(
            "dashboard-section"
        );

    const management =
        getElement(
            "management-section"
        );

    dashboard.style.display =
        "block";

    management.style.display =
        "none";
}

function showManagementSection() {

    const dashboard =
        getElement(
            "dashboard-section"
        );

    const management =
        getElement(
            "management-section"
        );

    dashboard.style.display =
        "none";

    management.style.display =
        "block";
}