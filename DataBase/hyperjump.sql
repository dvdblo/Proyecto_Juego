DROP DATABASE IF EXISTS hyperjump;
CREATE DATABASE hyperjump;
USE hyperjump;


-- ==========================================
-- 1. DEFINICIÓN DE TABLAS
-- ==========================================


CREATE TABLE Jugador (
    id_jugador INT AUTO_INCREMENT PRIMARY KEY,
    contraseña VARCHAR(15) NOT NULL,
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    edad INT NOT NULL,
    ultima_conexion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Estadisticas (
    id_estadistica INT AUTO_INCREMENT PRIMARY KEY,
    id_jugador INT NOT NULL,
    enemigos_eliminados INT DEFAULT 0,
    cartas_usadas INT DEFAULT 0,
    cartas_mejoradas INT DEFAULT 0,
    victorias INT DEFAULT 0,
    derrotas INT DEFAULT 0,
    tiempo_jugado INT DEFAULT 0,
    nivel_maximo_alcanzado INT DEFAULT 0,
    puntuacion_maxima INT DEFAULT 0
);


CREATE TABLE Partida (
    id_partida INT AUTO_INCREMENT PRIMARY KEY,
    id_jugador INT NOT NULL,
    fecha_inicio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_fin DATETIME DEFAULT NULL,
    puntaje_total INT DEFAULT 0,
    tiempo_total_seg INT DEFAULT 0,
    niveles_completados INT DEFAULT 0,
    enemigos_total INT DEFAULT 0,
    vidas_restantes INT DEFAULT 0
);


CREATE TABLE Nivel (
    id_nivel INT AUTO_INCREMENT PRIMARY KEY,
    dificultad INT NOT NULL,
    numero_nivel INT NOT NULL,
    tiempo_limite_seg INT,
    tiene_jefe BOOLEAN,
    tiene_jefe2 BOOLEAN
);


CREATE TABLE NivelPartida (
    id_nivel_partida INT AUTO_INCREMENT PRIMARY KEY,
    id_partida INT NOT NULL,
    id_nivel INT NOT NULL,
    puntaje_nivel INT DEFAULT 0,
    tiempo_segundos INT,
    enemigos_eliminados INT DEFAULT 0,
    cartas_usadas INT DEFAULT 0,
    cartas_no_usadas INT DEFAULT 0,
    multiplicador_tiempo DECIMAL(5,2),
    completado BOOLEAN
);


CREATE TABLE Carta (
    id_carta INT AUTO_INCREMENT PRIMARY KEY,
    nombre_carta VARCHAR(60) UNIQUE,
    descripcion VARCHAR(200),
    nivel_maximo INT,
    dificultad_requerida VARCHAR(40)
);


CREATE TABLE CartaJugador (
    id_carta_jugador INT AUTO_INCREMENT PRIMARY KEY,
    id_jugador INT NOT NULL,
    id_carta INT NOT NULL,
    nivel_actual INT DEFAULT 1,
    veces_mejorada INT DEFAULT 0,
    veces_usada_total INT DEFAULT 0
);


CREATE TABLE CartaPartida (
    id_carta_partida INT AUTO_INCREMENT PRIMARY KEY,
    id_nivel_partida INT NOT NULL,
    id_carta INT NOT NULL,
    nivel_carta_repartir INT,
    fue_usada BOOLEAN,
    fue_almacenada BOOLEAN,
    veces_usada INT DEFAULT 0
);


CREATE TABLE Enemigo (
    id_enemigo INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(60) UNIQUE,
    tipo VARCHAR(60) UNIQUE,
    descripcion VARCHAR(255),
    vida_base INT,
    daño_base INT,
    es_inmortal BOOLEAN,
    rango_ataque BOOLEAN,
    rango_deteccion INT
);


CREATE TABLE EnemigoNivel (
    id_enemigo_nivel INT AUTO_INCREMENT PRIMARY KEY,
    id_nivel INT NOT NULL,
    id_enemigo INT NOT NULL,
    cantidad_maxima INT
);


CREATE TABLE Plataforma (
    id_plataforma INT AUTO_INCREMENT PRIMARY KEY,
    id_carta INT,
    nombre VARCHAR(60),
    composicion JSON,
    es_autogenerada BOOLEAN
);


CREATE TABLE PlataformaNivel (
    id_plataforma_nivel INT AUTO_INCREMENT PRIMARY KEY,
    id_plataforma INT NOT NULL,
    nivel INT NOT NULL,
    ancho_base DECIMAL(10,2),
    alto_base DECIMAL(10,2),
    duracion INT,
    es_destruible BOOLEAN,
    enemigo_encima BOOLEAN
);


CREATE TABLE PowerUp (
    id_powerUp INT AUTO_INCREMENT PRIMARY KEY,
    id_carta INT NOT NULL,
    nombre VARCHAR(60)
);


CREATE TABLE PowerUpNivel (
    id_powerup_nivel INT AUTO_INCREMENT PRIMARY KEY,
    id_powerUp INT NOT NULL,
    nivel INT NOT NULL,
    duracion_base INT,
    modificador_velocidad DECIMAL(10,2),
    modificador_salto DECIMAL(10,2),
    da_vida INT,
    rango_actuacion INT
);


CREATE TABLE ZonaGeneracion (
    id_zona INT AUTO_INCREMENT PRIMARY KEY,
    id_nivel INT,
    coord_x INT,
    coord_y INT,
    hostil BOOL
);


-- ==========================================
-- 2. DEFINICIÓN DE LLAVES FORÁNEAS (ALTER)
-- ==========================================


-- Estadisticas -> Jugador
ALTER TABLE Estadisticas
ADD CONSTRAINT fk_estadisticas_jugador
FOREIGN KEY (id_jugador) REFERENCES Jugador(id_jugador);


-- Partida -> Jugador
ALTER TABLE Partida
ADD CONSTRAINT fk_partida_jugador
FOREIGN KEY (id_jugador) REFERENCES Jugador(id_jugador);


-- NivelPartida -> Partida y Nivel
ALTER TABLE NivelPartida
ADD CONSTRAINT fk_nivelpartida_partida FOREIGN KEY (id_partida) REFERENCES Partida(id_partida),
ADD CONSTRAINT fk_nivelpartida_nivel FOREIGN KEY (id_nivel) REFERENCES Nivel(id_nivel);


-- CartaJugador -> Jugador y Carta
ALTER TABLE CartaJugador
ADD CONSTRAINT fk_cartajugador_jugador FOREIGN KEY (id_jugador) REFERENCES Jugador(id_jugador),
ADD CONSTRAINT fk_cartajugador_carta FOREIGN KEY (id_carta) REFERENCES Carta(id_carta);


-- CartaPartida -> NivelPartida y Carta
ALTER TABLE CartaPartida
ADD CONSTRAINT fk_cartapartida_nivelpartida FOREIGN KEY (id_nivel_partida) REFERENCES NivelPartida(id_nivel_partida),
ADD CONSTRAINT fk_cartapartida_carta FOREIGN KEY (id_carta) REFERENCES Carta(id_carta);


-- EnemigoNivel -> Nivel y Enemigo
ALTER TABLE EnemigoNivel
ADD CONSTRAINT fk_enemigonivel_nivel FOREIGN KEY (id_nivel) REFERENCES Nivel(id_nivel),
ADD CONSTRAINT fk_enemigonivel_enemigo FOREIGN KEY (id_enemigo) REFERENCES Enemigo(id_enemigo);


-- Plataforma -> Carta
ALTER TABLE Plataforma
ADD CONSTRAINT fk_plataforma_carta
FOREIGN KEY (id_carta) REFERENCES Carta(id_carta);


-- PlataformaNivel -> Plataforma
ALTER TABLE PlataformaNivel
ADD CONSTRAINT fk_plataformanivel_plataforma
FOREIGN KEY (id_plataforma) REFERENCES Plataforma(id_plataforma);


-- PowerUp -> Carta
ALTER TABLE PowerUp
ADD CONSTRAINT fk_powerup_carta
FOREIGN KEY (id_carta) REFERENCES Carta(id_carta);


-- PowerUpNivel -> PowerUp
ALTER TABLE PowerUpNivel
ADD CONSTRAINT fk_powerupnivel_powerup
FOREIGN KEY (id_powerUp) REFERENCES PowerUp(id_powerUp);


-- ZonaGeneracion -> Nivel
ALTER TABLE ZonaGeneracion
ADD CONSTRAINT fk_zonageneracion_nivel
FOREIGN KEY (id_nivel) REFERENCES Nivel(id_nivel);