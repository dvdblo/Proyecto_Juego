USE hyperjump;

INSERT INTO Plataforma(id_carta, nombre, composicion, es_autogenerada) 
VALUES (null, "cuadrada", '{"formas": [{"base": 1, "altura": 1, "x": 0, "y": 0}]}', true),
(null, "rect_3:1", '{"formas": [{"base": 3, "altura": 1, "x": 0, "y": 0}]}', true),
(null, "rect_9:2", '{"formas": [{"base": 9, "altura": 2, "x": 0, "y": 0}]}', true),
(null, "rect_12:2", '{"formas": [{"base": 12, "altura": 2, "x": 0, "y": 0}]}', true),
(null, "rect_3:12", '{"formas": [{"base": 3, "altura": 12, "x": 0, "y": 0}]}', true),
(null, "circulo", '{"formas": [{"base": 2, "altura": 2, "x": 0, "y": 0}]}', true),
(null, "ele", '{"formas": [{"base": 3, "altura": 1, "x": 0, "y": 0}, {"base": 1, "altura": 3, "x": 1, "y": -1}]}', true);
COMMIT;

select * from hyperjump.Plataforma;

INSERT INTO Nivel(dificultad, numero_nivel, tiempo_limite_seg, tiene_jefe, tiene_jefe2)
VALUES (1, 1, null, false, false),
(1, 2, null, false, false),
(1, 3, null, false, false),
(2, 4, null, false, false),
(2, 5, null, false, false),
(2, 6, null, false, false),
(3, 7, null, false, false),
(3, 8, null, false, false),
(3, 9, null, false, false),
(4, 10, null, true, false);
COMMIT;

select * from hyperjump.Nivel;

INSERT INTO ZonaGeneracion (id_nivel, coord_x, coord_y, hostil)
VALUES  (1, 30, 500, false),
(1, 600, 500, TRUE),
(1, 1100, 400, TRUE),
(1, 1700, 400, TRUE),
(1, 2200, 300, TRUE),
(1, 2700, 450, TRUE),
(1, 3200, 300, TRUE),
(1, 3700, 400, TRUE),
(1, 4100, 300, false);
COMMIT;

INSERT INTO Carta(nombre_carta, descripcion, nivel_maximo, dificultad_requerida) 
VALUES ("Bomba", "Una bomba que explota y daña a los enemigos cercanos", 3, "Baja"),
("Doble Salto", "Aumenta la altura del salto del jugador", 3, "Baja"),
("Escudo", "Crea un escudo temporal que protege al jugador de un golpe", 3, "Media"),
("Esprint", "Aumenta la velocidad de movimiento del jugador", 3, "Baja"),
("Jetpack", "Otorga al jugador un jetpack, el cual permite que desactive la gravedad 5 segundos", 3, "Alta"),
("Plataforma Random", "Permite al jugador generar una plataforma aleatoria", 3, "Baja"),
("Vida Extra", "Otorga al jugador una vida extra", 3, "Baja");
COMMIT;

select * from hyperjump.ZonaGeneracion;
SELECT * FROM Plataforma;
SELECT * FROM Carta;
#TRUNCATE TABLE Plataforma;
#TRUNCATE TABLE Nivel;
#TRUNCATE TABLE ZonaGeneracion;
