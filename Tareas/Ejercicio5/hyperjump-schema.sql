-- CREACION DE BASE DE DATOS
DROP DATABASE IF EXISTS hyperjump;
CREATE DATABASE hyperjump;
USE hyperjump;

-- Tabla de jugadores del juego
CREATE TABLE Jugador(id_jugador INT AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
	contraseña VARCHAR(15) NOT NULL,
    edad TINYINT UNSIGNED,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_jugador PRIMARY KEY(id_jugador),
    CONSTRAINT uq_jugador_username UNIQUE (username)
    ) ENGINE=InnoDB;

-- Tabla de estadísticas de cada jugador
CREATE TABLE Estadisticas(id_estadistica INT AUTO_INCREMENT,
    id_jugador INT NOT NULL,
    enemigos_eliminados MEDIUMINT UNSIGNED DEFAULT 0,
    cartas_usadas MEDIUMINT UNSIGNED DEFAULT 0,
    cartas_mejoradas SMALLINT UNSIGNED DEFAULT 0,
    victorias SMALLINT UNSIGNED DEFAULT 0,
    derrotas SMALLINT UNSIGNED DEFAULT 0,
    tiempo_jugado INT UNSIGNED DEFAULT 0,
    nivel_maximo_alcanzado TINYINT UNSIGNED DEFAULT 0,
    puntuacion_maxima INT UNSIGNED DEFAULT 0,
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_estadisticas PRIMARY KEY(id_estadistica),
    CONSTRAINT uq_estadisticas_id_jugador UNIQUE (id_jugador),
    CONSTRAINT fk_estadisticas_jugador FOREIGN KEY (id_jugador) REFERENCES Jugador(id_jugador) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de partidas jugadas
CREATE TABLE Partida(id_partida INT AUTO_INCREMENT,
    id_jugador INT NOT NULL,
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP NULL,
    tiempo_total_seg INT UNSIGNED DEFAULT 0,
    puntaje_total INT UNSIGNED DEFAULT 0,
    niveles_completados TINYINT UNSIGNED DEFAULT 0,
    enemigos_total SMALLINT UNSIGNED DEFAULT 0,
    vidas_restantes TINYINT UNSIGNED DEFAULT 3,
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_partida PRIMARY KEY(id_partida),
    CONSTRAINT fk_partida_jugador FOREIGN KEY (id_jugador) REFERENCES Jugador(id_jugador) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de niveles del juego
CREATE TABLE Nivel(id_nivel INT AUTO_INCREMENT,
    numero_nivel TINYINT UNSIGNED NOT NULL,
    dificultad ENUM('facil', 'medio', 'dificil') NOT NULL,
    tiempo_limite_seg SMALLINT UNSIGNED,
    CONSTRAINT pk_nivel PRIMARY KEY(id_nivel)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de jefes por nivel
CREATE TABLE JefeNivel(id_jefe_nivel INT AUTO_INCREMENT,
	id_nivel INT NOT NULL,
    nombre_jefe VARCHAR(50) NOT NULL,
    CONSTRAINT pk_JefeNivel PRIMARY KEY(id_jefe_nivel),
    CONSTRAINT fk_JefeNivel_nivel FOREIGN KEY (id_nivel) REFERENCES Nivel(id_nivel) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de relación entre nivel y partida
CREATE TABLE NivelPartida(id_nivel_partida INT AUTO_INCREMENT,
    id_partida INT NOT NULL,
    id_nivel INT NOT NULL,
    puntaje_nivel INT UNSIGNED DEFAULT 0,
    tiempo_segundos SMALLINT UNSIGNED DEFAULT 0,
    enemigos_eliminados SMALLINT UNSIGNED DEFAULT 0,
    cartas_usadas SMALLINT UNSIGNED DEFAULT 0,
    cartas_no_usadas SMALLINT UNSIGNED DEFAULT 0,
    multiplicador_tiempo DECIMAL(5,2) DEFAULT 1.00,
    completado BOOLEAN DEFAULT FALSE,
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_NivelPartida PRIMARY KEY(id_nivel_partida),
    CONSTRAINT fk_NivelPartida_partida FOREIGN KEY (id_partida) REFERENCES Partida(id_partida) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_NivelPartida_nivel FOREIGN KEY (id_nivel) REFERENCES Nivel(id_nivel) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de cartas disponibles en el juego
CREATE TABLE Carta(id_carta INT AUTO_INCREMENT,
    descripcion VARCHAR(100) NOT NULL,
    nivel_maximo TINYINT UNSIGNED NOT NULL,
    dificultad_requerida ENUM('facil', 'medio', 'dificil') NOT NULL,
    CONSTRAINT pk_Carta PRIMARY KEY(id_carta)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de cartas asignadas a jugadores
CREATE TABLE CartaJugador(id_carta_jugador INT AUTO_INCREMENT,
    id_jugador INT NOT NULL,
    id_carta INT NOT NULL,
    nivel_actual TINYINT UNSIGNED DEFAULT 1,
    veces_mejorada SMALLINT UNSIGNED DEFAULT 0,
    veces_usada_total MEDIUMINT UNSIGNED DEFAULT 0,
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_CartaJugador PRIMARY KEY(id_carta_jugador),
    CONSTRAINT fk_CartaJugador_jugador FOREIGN KEY (id_jugador) REFERENCES Jugador(id_jugador) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_CartaJugador_carta FOREIGN KEY (id_carta) REFERENCES Carta(id_carta) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT uq_carta_jugador UNIQUE (id_jugador, id_carta)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de cartas utilizadas en partidas
CREATE TABLE CartaPartida(id_carta_partida INT AUTO_INCREMENT,
    id_nivel_partida INT NOT NULL,
    id_carta INT NOT NULL,
    nivel_carta_repartir TINYINT UNSIGNED,
    fue_usada BOOLEAN DEFAULT FALSE,
    fue_almacenada BOOLEAN DEFAULT FALSE,
    veces_usada SMALLINT UNSIGNED DEFAULT 0,
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_CartaPartida PRIMARY KEY(id_carta_partida),
    CONSTRAINT fk_CartaPartida_partida FOREIGN KEY (id_nivel_partida) REFERENCES NivelPartida(id_nivel_partida) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_CartaPartida_carta FOREIGN KEY (id_carta) REFERENCES Carta(id_carta) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de enemigos del juego
CREATE TABLE Enemigo(id_enemigo INT AUTO_INCREMENT,
    nombre VARCHAR(60) NOT NULL,
    tipo VARCHAR(60) NOT NULL,
    descripcion VARCHAR(255),
    vida_base SMALLINT UNSIGNED NOT NULL,
    daño_base SMALLINT UNSIGNED NOT NULL,
    es_inmortal BOOLEAN DEFAULT FALSE,
    rango_ataque BOOLEAN DEFAULT FALSE, 
    rango_deteccion SMALLINT UNSIGNED,
    CONSTRAINT pk_enemigo PRIMARY KEY(id_enemigo),
    CONSTRAINT uq_enemigo_nombre UNIQUE (nombre)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de enemigos por nivel
CREATE TABLE EnemigoNivel(id_enemigo_nivel INT AUTO_INCREMENT,
    id_nivel INT NOT NULL,
    id_enemigo INT NOT NULL,
    cantidad_maxima SMALLINT UNSIGNED NOT NULL,
    CONSTRAINT pk_EnemigoNivel PRIMARY KEY(id_enemigo_nivel),
    CONSTRAINT fk_EnemigoNivel_nivel FOREIGN KEY (id_nivel) REFERENCES Nivel(id_nivel) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_EnemigoNivel_enemigo FOREIGN KEY (id_enemigo) REFERENCES Enemigo(id_enemigo) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT uq_enemigo_nivel UNIQUE (id_nivel, id_enemigo)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de plataformas del juego
CREATE TABLE Plataforma(id_plataforma INT AUTO_INCREMENT,
    id_carta INT,
    nombre VARCHAR(60) NOT NULL,
    composicion JSON,
    es_autogenerada BOOLEAN DEFAULT FALSE,
    CONSTRAINT pk_Plataforma PRIMARY KEY(id_plataforma),
    CONSTRAINT fk_Plataforma_carta FOREIGN KEY (id_carta) REFERENCES Carta(id_carta) ON DELETE SET NULL ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de niveles de plataformas
CREATE TABLE PlataformaNivel(id_plataforma_nivel INT AUTO_INCREMENT,
    id_plataforma INT NOT NULL,
    nivel_plataforma TINYINT UNSIGNED NOT NULL,
    ancho_base DECIMAL(10,2),
    alto_base DECIMAL(10,2),
    duracion SMALLINT UNSIGNED,
    es_destruible BOOLEAN DEFAULT FALSE,
    enemigo_encima BOOLEAN DEFAULT FALSE,
    CONSTRAINT pk_PlataformaNivel PRIMARY KEY(id_plataforma_nivel),
    CONSTRAINT fk_PlataformaNivel_plataforma FOREIGN KEY (id_plataforma) REFERENCES Plataforma(id_plataforma) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT uq_plataforma_nivel UNIQUE (id_plataforma, nivel_plataforma)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de power-ups
CREATE TABLE PowerUp(id_powerUp INT AUTO_INCREMENT,
    id_carta INT NOT NULL,
    nombre VARCHAR(60) NOT NULL,
    CONSTRAINT pk_PowerUp PRIMARY KEY(id_powerUp),
    CONSTRAINT fk_PowerUp_carta FOREIGN KEY (id_carta) REFERENCES Carta(id_carta) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de niveles de power-ups
CREATE TABLE PowerUpNivel(id_powerup_nivel INT AUTO_INCREMENT,
    id_powerUp INT NOT NULL,
    nivel_powerUp TINYINT UNSIGNED NOT NULL,
    duracion_base SMALLINT UNSIGNED,
    modificador_velocidad DECIMAL(10,2),
    modificador_salto DECIMAL(10,2),
    da_vida TINYINT,
    rango_actuacion SMALLINT UNSIGNED,
    CONSTRAINT pk_PowerUpNivel PRIMARY KEY(id_powerup_nivel),
    CONSTRAINT fk_PowerUpNivel_powerUp FOREIGN KEY (id_powerUp) REFERENCES PowerUp(id_powerUp) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT uq_powerup_nivel UNIQUE (id_powerUp, nivel_powerUp)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de zonas de generación
CREATE TABLE ZonaGeneracion(id_zona INT AUTO_INCREMENT,
	id_nivel INT NOT NULL,
    coord_x SMALLINT,
    coord_y SMALLINT,
    hostil BOOL DEFAULT FALSE,
    CONSTRAINT pk_ZonaGeneracion PRIMARY KEY(id_zona),
    CONSTRAINT fk_ZonaGeneracion_nivel FOREIGN KEY (id_nivel) REFERENCES Nivel(id_nivel) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- VIEWS

-- Vista que muestra jugadores junto con sus estadísticas
CREATE VIEW jugadores_estadisticas AS
SELECT A.id_jugador, A.username, A.edad, A.fecha_registro, B.enemigos_eliminados, B.cartas_usadas, B.cartas_mejoradas, B.victorias, B.derrotas, B.tiempo_jugado, B.nivel_maximo_alcanzado, B.puntuacion_maxima
FROM Jugador AS A INNER JOIN Estadisticas AS B ON A.id_jugador = B.id_jugador;

-- Vista que muestra partidas junto con su jugador
CREATE VIEW partidas_jugador AS
SELECT A.id_partida, B.id_jugador, B.username, A.fecha_inicio, A.fecha_fin, A.tiempo_total_seg, A.puntaje_total, A.niveles_completados, A.enemigos_total, A.vidas_restantes
FROM Partida AS A INNER JOIN Jugador AS B ON A.id_jugador = B.id_jugador;

-- Vista que muestra detalle de niveles jugados en cada partida
CREATE VIEW niveles_partida AS
SELECT A.id_nivel_partida, A.id_partida, B.id_nivel, B.numero_nivel, B.dificultad, A.puntaje_nivel, A.tiempo_segundos, A.enemigos_eliminados, A.cartas_usadas, A.cartas_no_usadas, A.multiplicador_tiempo, A.completado
FROM NivelPartida AS A INNER JOIN Nivel AS B ON A.id_nivel = B.id_nivel;

-- Vista que muestra cartas que tiene cada jugador
CREATE VIEW cartas_jugador AS
SELECT A.id_carta_jugador, B.id_jugador, B.username, C.id_carta, C.descripcion, C.nivel_maximo, C.dificultad_requerida, A.nivel_actual, A.veces_mejorada, A.veces_usada_total
FROM CartaJugador AS A INNER JOIN Jugador AS B ON A.id_jugador = B.id_jugador INNER JOIN Carta AS C ON A.id_carta = C.id_carta;

-- Vista que muestra cartas usadas en partidas
CREATE VIEW cartas_partida AS
SELECT A.id_carta_partida, A.id_nivel_partida, A.id_carta, B.descripcion, A.nivel_carta_repartir, A.fue_usada, A.fue_almacenada, A.veces_usada
FROM CartaPartida AS A INNER JOIN Carta AS B ON A.id_carta = B.id_carta;

-- Vista que muestra enemigos asignados a cada nivel
CREATE VIEW enemigos_nivel AS
SELECT A.id_enemigo_nivel, B.id_nivel, B.numero_nivel, B.dificultad, C.id_enemigo, C.nombre, C.tipo, C.vida_base, C.daño_base, A.cantidad_maxima
FROM EnemigoNivel AS A INNER JOIN Nivel AS B ON A.id_nivel = B.id_nivel INNER JOIN Enemigo AS C ON A.id_enemigo = C.id_enemigo;

-- Vista que muestra jefes por nivel
CREATE VIEW jefes_nivel AS
SELECT A.id_jefe_nivel, B.id_nivel, B.numero_nivel, B.dificultad, A.nombre_jefe
FROM JefeNivel AS A INNER JOIN Nivel AS B ON A.id_nivel = B.id_nivel;

-- Vista que muestra plataformas asociadas a cartas
CREATE VIEW plataformas_carta AS
SELECT A.id_plataforma, A.nombre, A.es_autogenerada, B.id_carta, B.descripcion
FROM Plataforma AS A INNER JOIN Carta AS B ON A.id_carta = B.id_carta;

-- Vista que muestra detalle de plataformas por nivel
CREATE VIEW plataformas_nivel AS
SELECT A.id_plataforma_nivel, B.id_plataforma, B.nombre, A.nivel_plataforma, A.ancho_base, A.alto_base, A.duracion, A.es_destruible, A.enemigo_encima
FROM PlataformaNivel AS A INNER JOIN Plataforma AS B ON A.id_plataforma = B.id_plataforma;

-- Vista que muestra power-ups y sus niveles
CREATE VIEW powerups AS
SELECT A.id_powerUp, A.nombre, B.id_carta, B.descripcion, C.id_powerup_nivel, C.nivel_powerUp, C.duracion_base, C.modificador_velocidad, C.modificador_salto, C.da_vida, C.rango_actuacion
FROM PowerUp AS A INNER JOIN Carta AS B ON A.id_carta = B.id_carta INNER JOIN PowerUpNivel AS C ON A.id_powerUp = C.id_powerUp;

-- Vista que muestra zonas de generación por nivel
CREATE VIEW zonas_generacion AS
SELECT A.id_zona, B.id_nivel, B.numero_nivel, B.dificultad, A.coord_x, A.coord_y, A.hostil
FROM ZonaGeneracion AS A INNER JOIN Nivel AS B ON A.id_nivel = B.id_nivel;


-- TRIGGERS

-- Trigger que crea automáticamente estadísticas al registrar un jugador
DELIMITER $$
CREATE TRIGGER asignar_jugador_estadisticas
AFTER INSERT ON Jugador
FOR EACH ROW
BEGIN
    INSERT INTO Estadisticas(id_jugador)
    VALUES (NEW.id_jugador);
END $$
DELIMITER ;

-- Trigger que valida que el nivel de carta sea mínimo 1
DELIMITER $$
CREATE TRIGGER validar_nivel_carta_jugador
BEFORE INSERT ON CartaJugador
FOR EACH ROW
BEGIN
    IF NEW.nivel_actual IS NULL OR NEW.nivel_actual < 1 THEN
        SET NEW.nivel_actual = 1;
    END IF;
END $$
DELIMITER ;

-- Trigger que actualiza el número de mejoras de una carta
DELIMITER $$
CREATE TRIGGER actualizar_mejoras_carta
BEFORE UPDATE ON CartaJugador
FOR EACH ROW
BEGIN
    IF NEW.nivel_actual > OLD.nivel_actual THEN
        SET NEW.veces_mejorada = OLD.veces_mejorada + (NEW.nivel_actual - OLD.nivel_actual);
    END IF;
END $$
DELIMITER ;

-- Trigger que incrementa el uso de una carta al utilizarla en partida
DELIMITER $$
CREATE TRIGGER aumentar_uso_carta
AFTER INSERT ON CartaPartida
FOR EACH ROW
BEGIN
    IF NEW.fue_usada = TRUE THEN
        UPDATE CartaJugador
        SET veces_usada_total = veces_usada_total + 1
        WHERE id_carta = NEW.id_carta;
    END IF;
END $$
DELIMITER ;


-- STORED PROCEDURES

-- Procedimiento para agregar enemigos a un nivel
DELIMITER $$
CREATE PROCEDURE agregar_enemigo_nivel(IN p_id_nivel INT, IN p_id_enemigo INT, IN p_cantidad SMALLINT)
BEGIN
    INSERT INTO EnemigoNivel(id_nivel, id_enemigo, cantidad_maxima)
    VALUES (p_id_nivel, p_id_enemigo, p_cantidad);
END $$
DELIMITER ;

-- Procedimiento para asignar una carta a un jugador
DELIMITER $$
CREATE PROCEDURE asignar_carta_jugador(IN p_id_jugador INT,IN p_id_carta INT)
BEGIN
    INSERT INTO CartaJugador(id_jugador, id_carta, nivel_actual)
    VALUES (p_id_jugador, p_id_carta, 1);
END $$
DELIMITER ;

-- Procedimiento para resetear estadísticas de un jugador
DELIMITER $$
CREATE PROCEDURE resetear_estadisticas_jugador(IN p_id_jugador INT)
BEGIN
    UPDATE Estadisticas SET enemigos_eliminados = 0, cartas_usadas = 0, cartas_mejoradas = 0, victorias = 0, derrotas = 0, tiempo_jugado = 0, nivel_maximo_alcanzado = 0,puntuacion_maxima = 0 WHERE id_jugador = p_id_jugador;
END $$
DELIMITER ;

-- Procedimiento para aumentar enemigos en un nivel
DELIMITER $$
CREATE PROCEDURE aumentar_enemigos_nivel(IN p_id_nivel INT, IN p_id_enemigo INT, IN p_incremento SMALLINT)
BEGIN
    UPDATE EnemigoNivel SET cantidad_maxima = cantidad_maxima + p_incremento WHERE id_nivel = p_id_nivel AND id_enemigo = p_id_enemigo;
END $$
DELIMITER ;