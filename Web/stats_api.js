/*
 * API: functions to interconnect front with back and DB
 *
 * Daniel José Armas Azar A01786896
 * Guillermo Patricio González Martínez A01787393
 * David Blanco Ortiz A01786713
 */

//Function to read and translate generation zones from DB to game
//They are async functions so they can work properly with the connections (also async)

async function get_top_players() {
    const top_players = await fetch(`http://localhost:3000/stats/top`);
    const data = await top_players.json();

    $("#top_players").empty();

    $("#top_players").append(`
        <tr>
            <th>Jugador</th>
            <th>Puntaje</th>
        </tr>
    `);

    for (const row of data) {
        $("#top_players").append(`
            <tr>
                <td>${row.username}</td>
                <td>${row.puntuacion_maxima}</td>
            </tr>
        `);

    }
}

async function get_user_stats(username) {

    if (username) {
        const res = await fetch(`http://localhost:3000/stats/user?username=${encodeURIComponent(username)}`);
        const data = await res.json();

        $("#user_stats").empty();

        $("#user_stats").append(`
            <tr>
                <th>Estadística</th>
                <th>Valor</th>
            </tr>
        `);

        const stats = data[0][0];

        Object.entries(stats).forEach(([key, stat]) => {
            $("#user_stats").append(`
                <tr>
                    <td>${key}</td>
                    <td>${stat}</td>
                </tr>
            `);
        });
        
    } else {
        alert("Necesitas iniciar sesión primero");
    }
}

Chart.defaults.color = '#e0e0e0';
Chart.defaults.font.family = 'Orbitron, sans-serif'; // estilo gamer
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.pointStyle = 'circle';
const glowPlugin = {
    id: 'glowEffect',
    beforeDraw: (chart) => {
        const ctx = chart.ctx;
        ctx.save();
        ctx.shadowColor = '#00ffcc';
        ctx.shadowBlur = 15;
    },
    afterDraw: (chart) => {
        chart.ctx.restore();
    }
};

async function validate_admin(username, contraseña) {
    const val = await fetch('http://localhost:3000/stats/user/validation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, contraseña })
    });
    const comp = await val.json();
    if (comp.success && username === "admin") {
        alert("You are admin");
        
        const general = await fetch(`http://localhost:3000/stats/admin/general`);
        const data = await general.json();

        $("#admin_stats").empty();

        $("#admin_stats").append(`
            <h1>Estadísticas Globales</h1>
            <br>
            <table class="tab" id="general_stats"></table>
        `);

        $("#general_stats").append(`
            <tr>
                <th>Estadística</th>
                <th>Total</th>
            </tr>
        `);

        console.log(data);
        data.forEach(stat => {
            const key = Object.keys(stat)[0];
            const value = stat[key];

            $("#general_stats").append(`
                <tr>
                    <td>${key}</td>
                    <td>${value}</td>
                </tr>
            `);
        });

        const graphics_stats = await fetch(`http://localhost:3000/stats/admin/graphics`);
        const data_graph = await graphics_stats.json();
        console.log(data_graph);

        $("#admin_graphics").append(`
            <h1>Gráficas Globales</h1>
            <br>

            <div class="container">
            <div class="row g-3">

                <div class="col-md-6">
                    <div class="graph-container">
                        <canvas id="graph_runs_days"></canvas>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="graph-container">
                        <canvas id="graph_victory_fail"></canvas>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="graph-container">
                        <canvas id="graph_started_ended"></canvas>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="graph-container">
                        <canvas id="graph_cards_dealt_used"></canvas>
                    </div>
                </div>

            </div>
        </div>
        `);

        let labs = [];
        let vals = [];

        data_graph[0].run_day.forEach(stat => {
            labs.push(stat.month + stat.day);
            vals.push(stat.runs);
        });
        
        let ctx;
        ctx = document.getElementById('graph_runs_days').getContext('2d');
        const graph_runs_days = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labs,
                datasets: [{
                    label: 'Partidas por Día',
                    data: vals,
                    fill: true,
                    backgroundColor: 'rgba(43, 255, 0, 0.1)',
                    borderColor: 'rgb(43, 255, 0)',
                    borderWidth: 3,
                    pointBackgroundColor: '#00ffcc',
                    pointBorderColor: '#000',
                    pointRadius: 5,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#fff' }
                    },
                    tooltip: {
                        backgroundColor: '#111',
                        titleColor: '#00ffcc',
                        bodyColor: '#fff'
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    },
                    y: {
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    }
                }
            },
            plugins: [glowPlugin]
        });


        ctx = document.getElementById('graph_victory_fail').getContext('2d');
        const graph_victory_fail = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Victorias', 'Derrotas'],
                datasets: [{
                    label: 'Resultado',
                    data: [data[4].victorias, data[5].derrotas],
                    backgroundColor: [
                        'rgba(0, 255, 150, 0.7)',
                        'rgba(255, 50, 50, 0.7)'
                    ],
                    borderRadius: 10,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                }
            },
            plugins: [glowPlugin]
        });


        const s_e = data_graph[1].start_end[0];   

        ctx = document.getElementById('graph_started_ended').getContext('2d');
        const graph_started_ended = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Iniciadas', 'Terminadas'],
                datasets: [{
                    label: 'Flujo de partidas',
                    data: [s_e.iniciadas, s_e.terminadas],
                    backgroundColor: [
                        'rgba(255, 200, 0, 0.7)',
                        'rgba(0, 200, 255, 0.7)'
                    ],
                    borderRadius: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                }
            },
            plugins: [glowPlugin]
        });

        $("#admin_graphics").append(`
            <div class="displays">
                <table class="tab">
                    <tr>
                        <th>Promedio de partidas por usuario</th>
                    </tr>
                    <tr>
                        <td>${data_graph[2].avg_runs[0].promedio_partidas}</td>
                    </tr>
                </table>
            </div>
        `);

        $("#admin_graphics").append(`
            <div class="displays">
                <table class="tab">
                    <tr>
                        <th>Promedio de tiempo de finalización</th>
                    </tr>
                    <tr>
                        <td>${data_graph[3].avg_time[0].promedio_tiempo}</td>
                    </tr>
                </table>
            </div>
        `);

        labs = [];
        vals = [];
        let vals2 = [];
        data_graph[4].card_dealt_used.forEach(stat => {
            labs.push(stat.nombre);
            vals.push(stat.repartida);
            vals2.push(stat.usada)
        });
        
        ctx = document.getElementById('graph_cards_dealt_used').getContext('2d');
        const graph_cards_dealt_used = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labs,
                datasets: [
                {
                    label: 'Repartidas',
                    data: vals,
                    backgroundColor: 'rgba(43, 255, 0, 0.6)',
                    borderRadius: 8
                },
                {
                    label: 'Usadas',
                    data: vals2,
                    backgroundColor: 'rgba(0, 229, 255, 0.6)',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#fff' }
                    }
                },
                scales: {
                    x: {
                        stacked: false,
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    },
                    y: {
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    }
                }
            },
            plugins: [glowPlugin]
        });


        
    } else {
        alert("Credenciales de administrador incorrectas");
    }
}

async function actualizarEstadisticas(victoria) {
    await fetch('http://localhost:3000/stats/actualizar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id_jugador: gameConfig.id_jugador,
            enemigos: gameConfig.totalEnemiesKilled ?? 0,
            cartas_usadas: gameConfig.totalCardsUsed ?? 0,
            cartas_mejoradas: gameConfig.totalCardsUpgraded ?? 0,
            victoria: victoria,
            tiempo_seg: gameConfig.totalTime ?? 0,
            nivel_alcanzado:  gameConfig.actualLevel ?? 1,
            puntuacion: gameConfig.totalScore ?? 0
        })
    });
}