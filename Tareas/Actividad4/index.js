//ocumento con funciones

$(document).ready(function () {

    // Menús por día
    const menus = {
        Hoy: [],  //Vacío, se requiere para función más abajo.
        Lunes: [
            { nombre: "Café Latte", img: "https://images.ctfassets.net/0e6jqcgsrcye/53teNK4AvvmFIkFLtEJSEx/4d3751dcad227c87b3cf6bda955b1649/Cafe_au_lait.jpg" },
            { nombre: "Jugo de naranja", img: "https://www.recetasparaguay.com/base/stock/Recipe/jugo-de-naranja/jugo-de-naranja_web.jpg" },
            { nombre: "Pan dulce mexicano", img: "https://www.saborearte.com.mx/wp-content/uploads/2023/11/CANASTA-696x522.png" },
            { nombre: "🐱Pescadito", img: "https://www.patasencasa.com/sites/default/files/styles/gallery_crop/public/2024-01/peixe-para-gato1_0.jpg.webp?itok=DLMR3gVl" }
        ],
        Martes: [
            { nombre: "Capuccino", img: "https://www.nespresso.com/coffee-blog/sites/default/files/2024-08/nespresso-recipes-CAPPUCCINO-BANANA-SESAME-SEEDS.jpg" },
            { nombre: "Jugo de manzna", img: "https://img.freepik.com/foto-gratis/vista-frontal-jugo-manzana-fresco-manzanas-frescas-color-bebida-frutas-coctel-fotos-escritorio-madera-marron_140725-92833.jpg" },
            { nombre: "Croissant", img: "https://statics.forbesargentina.com/2025/01/679a4054cdcb6.jpg" },
            { nombre: "🐱Huevito", img: "https://cdn.eldestapeweb.com/eldestape/092025/1756940335614.webp?cw=400&ch=225&extw=jpg" }
        ],
        Miercoles: [
            { nombre: "Té de la casa", img: "https://s2.elespanol.com/2015/03/12/cocinillas/cocinillas_17508326_115880908_1706x1280.jpg" },
            { nombre: "Jugo de mandarina", img: "https://www.cocinadelirante.com/sites/default/files/images/2020/10/tomar-jugo-de-mandarina.jpg" },
            { nombre: "Mega galletas", img: "https://media.elgourmet.com/recetas/cover/788f3646f9a8aadb89d5b17acf6bb1a1_3_3_photo.png" },
            { nombre: "🐱Pollito", img: "https://assets.petscare.com/media/original_images/bengal-cat-shredded-chicken-homemade-meal-68432.webp" }
        ],
        Jueves: [
            { nombre: "Chocolate caliente", img: "https://i.blogs.es/f42dc6/como-hacer-chocolate-caliente-abuelita-2-/840_560.jpg" },
            { nombre: "Jugo de zanahoria", img: "https://www.cocinavital.mx/wp-content/uploads/2019/05/jugo-de-zanahoria-pera-y-mandarina.jpg" },
            { nombre: "Pastel de zanahoria", img: "https://mejorconsalud.as.com/wp-content/uploads/2018/07/tarta-zanahoria.jpg" },
            { nombre: "🐱Pavito", img: "https://assets.petscare.com/media/original_images/bengal-cat-looking-turkey-meat-bowl-kitchen-14235.webp" }
        ],
        Viernes: [
            { nombre: "Frappé", img: "https://www.cocinadelirante.com/sites/default/files/images/2024/07/frappe-de-cafe-y-caramelo-como-el-de-starbucks.jpg" },
            { nombre: "Jugo frutal", img: "https://arc-anglerfish-arc2-prod-dmn.s3.amazonaws.com/public/65DTCTJO4TEKA2G76RZHBMPM3Q.jpg" },
            { nombre: "Brownies", img: "https://icecreambakery.in/wp-content/uploads/2024/12/Brownie-Recipe-with-Cocoa-Powder-1200x821.jpg" },
            { nombre: "🐱Buffet", img: "https://cdn.openart.ai/uploads/image_FXhZhr0b_1686609933618_512.webp" }
        ],
        Sabado: [
            { nombre: "Café del Sábado", img: "https://calidadgourmet.com/wp-content/uploads/2013/07/hacer-dibujos-cafe21.jpg" },
            { nombre: "Jugo de la casa", img: "https://www.elespectador.com/resizer/v2/I6VSPJ7IV5CGJJQYPY56HLEOMI.jpg?auth=3550349af65a6a7ce1dbe8a11521ba13c9d913901fcc85a3a50466c27f2b0ff4&width=910&height=606&smart=true&quality=70" },
            { nombre: "Pay de mango", img: "https://www.infobae.com/resizer/v2/6X3UQ5XIY5FKHOSNCNLEKQGATM.jpg?auth=1f6dc4d85e673c7379e4fa0dfda384016c57f8800e2105241b7e24b999d1f8db" },
            { nombre: "🐱Pollito", img: "https://assets.petscare.com/media/original_images/bengal-cat-shredded-chicken-homemade-meal-68432.webp" }
        ]
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

    //Datos de gatos
    const cats = [
        { nombre: "Tomás", edad: "2 años", caracter: "Un gato con una tranquilidad digna de modelo de fotos de stock.", img: "https://images.ctfassets.net/denf86kkcx7r/4IPlg4Qazd4sFRuCUHIJ1T/f6c71da7eec727babcd554d843a528b8/gatocomuneuropeo-97?fm=webp&w=612" },
        { nombre: "Luna", edad: "8 meses", caracter: "Una gatita bebé, demasiado juguetona.", img: "https://unamglobal.unam.mx/wp-content/uploads/2025/08/GATO_UNAM-1024x768.jpg" },
        { nombre: "Milón", edad: "3 años", caracter: "Es muy dormilón, nunca se le ha podido fotografiar despierto.", img: "https://www.rover.com/blog/wp-content/uploads/cat-sleep-on-back-1024x706.jpg" },
        { nombre: "Nala", edad: "2 años", caracter: "Un gato con un carácter leal, te imitará hasta cansarse (nunca).", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTaph9VkXs9fVy1hEvCo6DE-BKvuK6H1ISzA&s" },
        { nombre: "Gemelos Topo", edad: "2 meses", caracter: "Tus amiguitos de aqui hasta siempre, con un caracer muy uwu.", img: "https://www.zoopinto.es/wp-content/uploads/2020/12/cuidar-gato-recien-nacido.jpg" }
    ];

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