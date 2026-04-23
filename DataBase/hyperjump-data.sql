USE hyperjump;

INSERT INTO Plataforma(id_carta, nombre, composicion, es_autogenerada) 
VALUES (null, "cuadrada", '{"formas": [{"base": 1, "altura": 1, "x": 0, "y": 0}]}', true),
(null, "rect_3:1", '{"formas": [{"base": 3, "altura": 1, "x": 0, "y": 0}]}', true),
(null, "rect_9:2", '{"formas": [{"base": 9, "altura": 2, "x": 0, "y": 0}]}', true),
(null, "rect_12:2", '{"formas": [{"base": 12, "altura": 2, "x": 0, "y": 0}]}', true),
(null, "rect_3:12", '{"formas": [{"base": 3, "altura": 12, "x": 0, "y": 1}]}', true),
(null, "circulo", '{"formas": [{"base": 2, "altura": 2, "x": 0, "y": 0}]}', true),
(null, "ele", '{"formas": [{"base": 3, "altura": 1, "x": 0, "y": 0}, {"base": 1, "altura": 3, "x": 1, "y": -1}]}', true);
COMMIT;

#TRUNCATE TABLE Plataforma;
#SET SQL_SAFE_UPDATES = 0;
DELETE FROM Plataforma;
ALTER TABLE Plataforma AUTO_INCREMENT = 1;
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

(2, 1, 500, false),
(2, 12, 400, false),
(2, 28, 300, false),
(2, 40, 400, True),
(2, 3200, 500, TRUE),
(2, 3900, 400, false),
(2, 4800, 400, TRUE),
(2, 112, 300, false),

(3, 1, 200, false),
(3, 22, 400, True),
(3, 1800, 200, false),
(3, 3000, 400, false),
(3, 3700, 500, TRUE),
(3, 4400, 500, True),
(3, 5600, 400, false),

(4, 30, 550, false),
(4, 22, 600, True),
(4, 40, 200, false),
(4, 2600, 400, True),
(4, 3800, 400, true),
(4, 4700, 400, true),
(4, 112, 200, false),

(5, 1, 300, false),
(5, 20, 300, true),
(5, 1800, 200, false),
(5, 3800, 400, true),
(5, 4800, 200, TRUE),
(5, 112, 500, false),

(6, 1, 500, false),
(6, 20, 300, false),
(6, 30, 300, true),
(6, 2500, 600, true),
(6, 3300, 300, false),
(6, 4400, 400, true),
(6, 112, 500, true),

(7, 1, 500, false),
(7, 1800, 500, true),
(7, 2100, 200, TRUE),
(7, 2600, 200, false),
(7, 3500, 500, TRUE),
(7, 4100, 300, false),
(7, 4800, 300, TRUE),
(7, 112, 100, false),

(8, 1, 550, false),
(8, 500, 200, false),
(8, 800, 500, TRUE),
(8, 1400, 200, true),
(8, 2400, 300, false),
(8, 3800, 300, true),
(8, 4800, 500, TRUE),
(8, 112, 100, false),

(9, 1, 100, false),
(9, 20, 100, false),
(9, 2400, 500, TRUE),
(9, 2700, 200, true),
(9, 3600, 400, TRUE),
(9, 4200, 100, true),
(9, 112, 500, true);
COMMIT;
TRUNCATE TABLE ZonaGeneracion;

select * from hyperjump.ZonaGeneracion;
#SELECT * FROM Plataforma;
#TRUNCATE TABLE Plataforma;
#TRUNCATE TABLE Nivel;

