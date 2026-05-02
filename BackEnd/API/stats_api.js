/*
 * API: functions to interconnect front with back and DB
 *
 * Daniel José Armas Azar A01786896
 * Guillermo Patricio González Martínez A01787393
 * David Blanco Ortiz A01786713
 * 
 * Use of AI: AI was used to solve some problems with the connection between backend and the API
 *              Also, it was used for the style of the graphics (not for its creation), for the creation we used official documentation.
 */

//Function to get the ranking of the 10 top players based on their maximum score
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

//Function to obtain the stats for an specific user, only if there is an active session, or if you are accessing from admin panel
async function get_user_stats(username) {

    if (username) {
        const res = await fetch(`http://localhost:3000/stats/user?username=${encodeURIComponent(username)}`);
        const data = await res.json();

        if(data[0].length > 0) {
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
            alert("Información de usuario inválida");
        }
        
    } else {
        alert("Necesitas iniciar sesión primero");
    }
}

//General style for the graphics (obtained with AI)
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

//Function to validate the admin credentials, and to displays the statistics for the admin
async function validate_admin(username, contraseña) {
    //Validates admin
    const val = await fetch('http://localhost:3000/stats/user/validation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, contraseña })
    });
    const comp = await val.json();
    if (comp.success && username === "admin") {
        alert("Sesión de administrador iniciada con éxito");
        
        //Gets the general game stats
        const general = await fetch(`http://localhost:3000/stats/admin/general`);
        const data = await general.json();

        //Table with general stats
        $("#admin_stats").empty();

        $("#admin_stats").append(`
            <h1  class="backText">Estadísticas Globales</h1>
            <br>
            <table class="tab" id="general_stats"></table>
        `);

        $("#general_stats").append(`
            <tr>
                <th>Estadística</th>
                <th>Total</th>
            </tr>
        `);

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

        //Gets the data needed for the graphics
        const graphics_stats = await fetch(`http://localhost:3000/stats/admin/graphics`);
        const data_graph = await graphics_stats.json();

        //HTML structure for the graphics
        $("#admin_graphics").append(`
            <h1 class="backText">Gráficas Globales</h1>
            <br>

            <div class="container">
                <div class="row g-3">

                    <div class="col-md-6">
                        <div class="graph-container">
                            <canvas id="graph_runs_days"></canvas>
                        </div>
                        <h2 class="backText">Partidas por Día</h2>
                    </div>

                    <div class="col-md-6">
                        <div class="graph-container">
                            <canvas id="graph_victory_fail"></canvas>
                        </div>
                        <h2 class="backText">Victorias vs Derrotas</h2>
                    </div>

                    <div class="col-md-6">
                        <div class="graph-container">
                            <canvas id="graph_started_ended"></canvas>
                        </div>
                        <h2 class="backText">Partidas Terminadas</h2>
                    </div>

                    <div class="col-md-6">
                        <div class="graph-container">
                            <canvas id="graph_cards_dealt_used"></canvas>
                        </div>
                        <h2 class="backText">Repartición de Cartas vs Uso</h2>
                    </div>

                </div>
            </div>
            <br>

            <h1 class="backText">Consulta estadísticas de un usuario</h1>
            <br>
            <ul class="displays">
                <input type="text" id="usernameS" class="displays" placeholder="Usuario">
            </ul>
            <ul>
                <li class = "displays"><button class="bt" onclick="get_user_stats(document.getElementById('usernameS').value)">Consultar</button></li>
            </ul>

            <div class="displays">
                <table class="tab" id="user_stats"></table>
            </div>
            <br>
        `);

        //Variebles to separate specifc data
        let labs = [];
        let vals = [];

        //GRAPHIC 1
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


        //GRAPHIC 2
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


        //GRAPHIC 3
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

        //SOME OTHER STATS
        $("#admin_stats").append(`
            <br>
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

        $("#admin_stats").append(`
            <br>
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

        //GRAPHIC 4
        labs = [];
        vals = [];
        let vals2 = [];
        data_graph[4].card_dealt_used[0].forEach(stat => {
            labs.push(stat.nombre);
            vals.push(stat.repartida);
            vals2.push(stat.usada)
        });

        data_graph[4].card_dealt_used[1].forEach(stat => {
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
//Function to update users stats when wins, loses or completes a level
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

//Function to create a new run in the NivelPartida table of DB, maintains a register of the run´s levels
async function crearNivelPartida() {
    try {
        const response = await fetch('http://localhost:3000/partida/nivelpartida', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id_partida: gameConfig.id_partida,
                id_nivel: gameConfig.actualLevel
            })
        });
    } catch (error) {
        console.error('Error al crear partida:', error);
    }
}

//Funtion to update the level data of a run
async function actualizarNivelPartida(completado) {
    await fetch('http://localhost:3000/stats/actualizar/nivelpartida', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            puntaje: gameConfig.score,
            tiempo: gameConfig.elapsedTime,
            enemigos: gameConfig.enemiesKilled,
            cartas_usadas: gameConfig.cardsUsed,
            multiplicador: gameConfig.elapsedTime <= 30 ? 2 : gameConfig.elapsedTime <= 60 ? 1.5 : 1,
            completado: completado,
            id_partida: gameConfig.id_partida,
            id_nivel: gameConfig.actualLevel
        })
    });
}

//Function to insert and maintain a register of the dealt cards in a run/level
async function crearCartaPartida(cartas) {
    try {
        const response = await fetch('http://localhost:3000/cartapartida/repartida', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                cartas: cartas,
                id_partida: gameConfig.id_partida,
                id_nivel: gameConfig.actualLevel
            })
        });
    } catch (error) {
        console.error('Error al crear carta partida:', error);
    }
}

//Updates the register of a dealt card when used. It is called after the level ends
async function usarCartaPartida(cartas_id) {
    try {
        const response = await fetch('http://localhost:3000/cartapartida/usada', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                cartas_id: cartas_id,
                id_partida: gameConfig.id_partida,
                id_nivel: gameConfig.actualLevel
            })
        });
    } catch (error) {
        console.error('Error al usar carta partida:', error);
    }
}