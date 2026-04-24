USE hyperjump;

INSERT INTO Plataforma(id_carta, nombre, composicion, es_autogenerada) 
VALUES (null, "cuadrada", '{"formas": [{"base": 1, "altura": 1, "x": 0, "y": 0}]}', true),
(null, "rect_3:1", '{"formas": [{"base": 3, "altura": 1, "x": 0, "y": 0}]}', true),
(null, "rect_9:2", '{"formas": [{"base": 9, "altura": 2, "x": 0, "y": 0}]}', true),
(null, "rect_12:2", '{"formas": [{"base": 12, "altura": 2, "x": 0, "y": 0}]}', true),
(null, "rect_3:12", '{"formas": [{"base": 3, "altura": 12, "x": 0, "y": 2}]}', true),
(null, "circulo", '{"formas": [{"base": 2, "altura": 2, "x": 0, "y": 0}]}', true),
(null, "ele", '{"formas": [{"base": 3, "altura": 1, "x": 0, "y": 0}, {"base": 1, "altura": 3, "x": 1, "y": -1}]}', true);
COMMIT;

#TRUNCATE TABLE Plataforma;
#SET SQL_SAFE_UPDATES = 0;
#DELETE FROM Plataforma;
#ALTER TABLE Plataforma AUTO_INCREMENT = 1;
#select * from hyperjump.Plataforma;

INSERT INTO Nivel(dificultad, numero_nivel, tiempo_limite_seg)
VALUES (1, 1, null),
(1, 2, null),
(1, 3, null),
(2, 4, null),
(2, 5, null),
(2, 6, null),
(3, 7, null),
(3, 8, null),
(3, 9, null);
COMMIT;

#select * from hyperjump.Nivel;

INSERT INTO ZonaGeneracion (id_nivel, coord_x, coord_y, hostil)
VALUES  (1, 1, 10, false),
(1, 12, 10, false),
(1, 22, 8, TRUE),
(1, 44, 8, false),
(1, 54, 9, TRUE),
(1, 74, 8, false),
(1, 96, 8, TRUE),
(1, 104, 10, false),
(1, 112, 10, false),

(2, 1, 10, false),
(2, 12, 8, false),
(2, 28, 6, false),
(2, 40, 8, True),
(2, 64, 10, TRUE),
(2, 78, 8, false),
(2, 96, 8, TRUE),
(2, 112, 6, false),

(3, 1, 4, false),
(3, 22, 8, True),
(3, 36, 4, false),
(3, 60, 8, false),
(3, 74, 10, TRUE),
(3, 88, 10, True),
(3, 112, 8, false),

(4, 1, 11, false),
(4, 22, 12, True),
(4, 40, 4, false),
(4, 52, 8, True),
(4, 76, 8, true),
(4, 94, 8, true),
(4, 112, 4, false),

(5, 1, 6, false),
(5, 20, 6, true),
(5, 36, 4, false),
(5, 76, 8, true),
(5, 96, 4, TRUE),
(5, 112, 10, false),

(6, 1, 10, false),
(6, 20, 6, false),
(6, 30, 6, true),
(6, 50, 12, true),
(6, 66, 6, false),
(6, 88, 8, true),
(6, 112, 10, true),

(7, 1, 10, false),
(7, 36, 10, true),
(7, 42, 4, TRUE),
(7, 52, 4, false),
(7, 70, 10, TRUE),
(7, 82, 6, false),
(7, 96, 6, TRUE),
(7, 112, 2, false),

(8, 1, 11, false),
(8, 10, 4, false),
(8, 16, 10, TRUE),
(8, 28, 4, true),
(8, 48, 6, false),
(8, 76, 6, true),
(8, 96, 10, TRUE),
(8, 112, 2, false),

(9, 1, 2, false),
(9, 20, 2, false),
(9, 48, 10, TRUE),
(9, 54, 4, true),
(9, 72, 8, TRUE),
(9, 84, 2, true),
(9, 112, 10, true);
COMMIT;

INSERT INTO Carta(descripcion, nivel_maximo, dificultad_requerida) 
VALUES ("Una bomba que explota y daña a los enemigos cercanos", 3, "facil"),
("Aumenta la altura del salto del jugador", 3, "facil"),
("Crea un escudo temporal que protege al jugador de un golpe", 3, "medio"),
("Aumenta la velocidad de movimiento del jugador", 3, "facil"),
("Otorga al jugador un jetpack, el cual permite que desactive la gravedad 5 segundos", 3, "dificil"),
("Permite al jugador generar una plataforma aleatoria", 3, "facil"),
("Otorga al jugador una vida extra", 3, "facil");
COMMIT;

INSERT INTO PowerUp(id_carta, nombre) VALUES
(1, "Bomba"),
(2, "Doble Salto"),
(3, "Escudo"),
(4, "Esprint"),
(5, "Jetpack"),
(6, "Plataforma Random"),
(7, "Vida Extra");
COMMIT;

#select * from hyperjump.ZonaGeneracion;
#SELECT * FROM Plataforma;
#SELECT * FROM Carta;
#SELECT * FROM PowerUp;
#SELECT * FROM Jugador;
#SELECT * FROM Partida;
#TRUNCATE TABLE Plataforma;
#TRUNCATE TABLE Nivel;
#TRUNCATE TABLE ZonaGeneracion;

USE hyperjump;
INSERT INTO Enemigo 
(nombre, tipo, descripcion, vida_base, daño_base, es_inmortal, rango_ataque, rango_deteccion)
VALUES
('Alien', 'simple', 'Más rápido y agresivo al enojarse, pero muere si lo pisas en la cabeza', 100, 20, 0, 0, 60),
('Torreta Alien', 'torreta', 'Dispara en baja cadencia y no se mueve', 150, 15, 1, 1, 120),
('Alien Perro', 'alerta', 'No ataca directamente, pero alerta a otros enemigos', 80, 0, 0, 0, 150), 
('Slime Alien', 'divide', 'Se divide en dos al ser pisado, no muere', 60, 10, 1, 0, 40);

INSERT INTO EnemigoNivel (id_nivel, id_enemigo, cantidad_maxima)
VALUES
(1, 1, 5),
(1, 2, 2), 
(1, 3, 3),
(1, 4, 4);

#SELECT * FROM Enemigo;
#SELECT * FROM EnemigoNivel;
