USE Cat_Cafe4;

INSERT INTO product(product_name, img_url) 
VALUES ("Café Latte", "https://images.ctfassets.net/0e6jqcgsrcye/53teNK4AvvmFIkFLtEJSEx/4d3751dcad227c87b3cf6bda955b1649/Cafe_au_lait.jpg"),
("Jugo de naranja", "https://www.recetasparaguay.com/base/stock/Recipe/jugo-de-naranja/jugo-de-naranja_web.jpg"),
("Pan dulce mexicano", "https://www.saborearte.com.mx/wp-content/uploads/2023/11/CANASTA-696x522.png"),
("🐱Pescadito", "https://www.patasencasa.com/sites/default/files/styles/gallery_crop/public/2024-01/peixe-para-gato1_0.jpg.webp?itok=DLMR3gVl"),
("Capuccino", "https://www.nespresso.com/coffee-blog/sites/default/files/2024-08/nespresso-recipes-CAPPUCCINO-BANANA-SESAME-SEEDS.jpg"),
("Jugo de manzna", "https://img.freepik.com/foto-gratis/vista-frontal-jugo-manzana-fresco-manzanas-frescas-color-bebida-frutas-coctel-fotos-escritorio-madera-marron_140725-92833.jpg"),
("Croissant", "https://statics.forbesargentina.com/2025/01/679a4054cdcb6.jpg"),
("🐱Huevito", "https://cdn.eldestapeweb.com/eldestape/092025/1756940335614.webp?cw=400&ch=225&extw=jpg"),
("Té de la casa", "https://s2.elespanol.com/2015/03/12/cocinillas/cocinillas_17508326_115880908_1706x1280.jpg"),
("Jugo de mandarina", "https://www.cocinadelirante.com/sites/default/files/images/2020/10/tomar-jugo-de-mandarina.jpg"),
("Mega galletas", "https://media.elgourmet.com/recetas/cover/788f3646f9a8aadb89d5b17acf6bb1a1_3_3_photo.png"),
("🐱Pollito", "https://assets.petscare.com/media/original_images/bengal-cat-shredded-chicken-homemade-meal-68432.webp"),
("Chocolate caliente", "https://i.blogs.es/f42dc6/como-hacer-chocolate-caliente-abuelita-2-/840_560.jpg"),
("Jugo de zanahoria", "https://www.cocinavital.mx/wp-content/uploads/2019/05/jugo-de-zanahoria-pera-y-mandarina.jpg"),
("Pastel de zanahoria", "https://mejorconsalud.as.com/wp-content/uploads/2018/07/tarta-zanahoria.jpg"),
("🐱Pavito", "https://assets.petscare.com/media/original_images/bengal-cat-looking-turkey-meat-bowl-kitchen-14235.webp"),
("Frappé", "https://www.cocinadelirante.com/sites/default/files/images/2024/07/frappe-de-cafe-y-caramelo-como-el-de-starbucks.jpg"),
("Jugo frutal", "https://arc-anglerfish-arc2-prod-dmn.s3.amazonaws.com/public/65DTCTJO4TEKA2G76RZHBMPM3Q.jpg"),
("Brownies", "https://icecreambakery.in/wp-content/uploads/2024/12/Brownie-Recipe-with-Cocoa-Powder-1200x821.jpg"),
("🐱Buffet", "https://cdn.openart.ai/uploads/image_FXhZhr0b_1686609933618_512.webp"),
("Café del Sábado", "https://calidadgourmet.com/wp-content/uploads/2013/07/hacer-dibujos-cafe21.jpg"),
("Jugo de la casa", "https://www.elespectador.com/resizer/v2/I6VSPJ7IV5CGJJQYPY56HLEOMI.jpg?auth=3550349af65a6a7ce1dbe8a11521ba13c9d913901fcc85a3a50466c27f2b0ff4&width=910&height=606&smart=true&quality=70"),
("Pay de mango", "https://www.infobae.com/resizer/v2/6X3UQ5XIY5FKHOSNCNLEKQGATM.jpg?auth=1f6dc4d85e673c7379e4fa0dfda384016c57f8800e2105241b7e24b999d1f8db");
COMMIT;

INSERT INTO day(day_name)
VALUES ("Lunes"),
("Martes"),
("Miércoles"),
("Jueves"),
("Viernes"),
("Sábado");
COMMIT;

INSERT INTO menu_day (id_product, id_day)
VALUES (1,1),
(2,1),
(3,1),
(4,1),
(5,2),
(6,2),
(7,2),
(8,2),
(9,3),
(10,3),
(11,3),
(12,3),
(13,4),
(14,4),
(15,4),
(16,4),
(17,5),
(18,5),
(19,5),
(20,5),
(21,6),
(22,6),
(23,6),
(12,6);
COMMIT;

INSERT INTO cat(cat_name, cat_age, description, img_url)
VALUES ("Tomás", "24", "Un gato con una tranquilidad digna de modelo de fotos de stock.", "https://images.ctfassets.net/denf86kkcx7r/4IPlg4Qazd4sFRuCUHIJ1T/f6c71da7eec727babcd554d843a528b8/gatocomuneuropeo-97?fm=webp&w=612"),
("Luna", "8", "Una gatita bebé, demasiado juguetona.", "https://unamglobal.unam.mx/wp-content/uploads/2025/08/GATO_UNAM-1024x768.jpg"),
("Milón", "36", "Es muy dormilón, nunca se le ha podido fotografiar despierto.", "https://www.rover.com/blog/wp-content/uploads/cat-sleep-on-back-1024x706.jpg" ),
("Nala", "24", "Un gato con un carácter leal, te imitará hasta cansarse (nunca).", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTaph9VkXs9fVy1hEvCo6DE-BKvuK6H1ISzA&s"),
("Gemelos Topo", "2", "Tus amiguitos de aqui hasta siempre, con un caracer muy uwu.", "https://www.zoopinto.es/wp-content/uploads/2020/12/cuidar-gato-recien-nacido.jpg");
COMMIT;

CREATE VIEW menu AS
SELECT day.day_name, product.product_name, product.img_url
FROM menu_day
INNER JOIN product ON menu_day.id_product = product.id_product
INNER JOIN day ON menu_day.id_day = day.id_day;

DELIMITER $$
CREATE PROCEDURE obtain_menu(IN week_day VARCHAR(9))
BEGIN
SELECT menu.product_name, menu.img_url
FROM menu
WHERE menu.day_name = week_day;
END $$
DELIMITER ;

CREATE VIEW cats AS
SELECT cat.cat_name, cat.cat_age, cat.description, cat.img_url 
FROM cat;


