//Documento con funciones

$(document).ready(async function () {

    // Menús por día
    const menus = {
        Hoy: [],  //Vacío, se requiere para función más abajo.
        Lunes: await readMenu('Lunes'),  //Se lee el menu del día con una función del api
        Martes: await readMenu('Martes'),
        Miercoles: await readMenu('Miércoles'),
        Jueves: await readMenu('Jueves'),
        Viernes: await readMenu('Viernes'),
        Sabado: await readMenu('Sábado')
    };

    //Carga el menú del día seleccionao al html
    function renderMenu(day) {
        $("#menu").empty();

        //Si la selección es "Hoy", carga el menú del día de la semana del dispositivo del usuario
        if(day == "Hoy") {
            menus[nombreDia].forEach(item => {
            $("#menu").append(`
                <div class="col-md-3">
                     <div class="menu-item" data-img="${item.img}">
                        <b>${item.nombre}</b>
                    </div>
                </div>
            `);
        });   
        //Carga el menú seleccionado
        } else {
            menus[day].forEach(item => {
                $("#menu").append(`
                    <div class="col-md-3">
                        <div class="menu-item" data-img="${item.img}">
                            <b>${item.nombre}</b>
                        </div>
                    </div>
                `);
            });
        }
    }

    //Cambiar menú según día seleccionado
    $("#selector").change(function () {
        let day = $(this).val();
        renderMenu(day);
    });

    //Hover para mostrar imagen
    $(document).on("mouseenter", ".menu-item", function () {
        let img = $(this).data("img");

        $("#imagenes")
            .attr("src", img)
            .addClass("visible");
    });

    $(document).on("mouseleave", ".menu-item", function () {
        $("#imagenes")
        .removeClass("visible");
    });

    //Datos de gatos (leidos de DB)
    const cats = await readCats();

    //Muestra las tarjetas de los gatos
    function renderCats() {
        cats.forEach(cat => {
            $("#cats").append(`
                <div class="col-md-3 mb-4">
                    <div class="card cat-card">
                        <img src="${cat.img}" class="card-img">
                        <div class="card-body">
                            <h5>${cat.nombre}</h5>
                            <p>Edad: ${cat.edad}</p>
                            <p>${cat.caracter}</p>
                        </div>
                    </div>
                </div>
            `);
        });
    }

    //Inicializa las funciones en su estado base
    //Obtención de día de la semana actual
    const dias = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
    const fecha = new Date();
    let nombreDia = dias[fecha.getDay()];
    if(nombreDia == "Domingo") nombreDia = "Lunes"; //Si es domingo, carga el menú del lunes

    renderMenu(nombreDia); //Carga el menú del día actual al entrar
    renderCats();
});