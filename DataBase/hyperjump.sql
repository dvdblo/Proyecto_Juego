CREATE DATABASE hyperjump;
USE hyperjump;

CREATE TABLE Jugador(id_jugador INT AUTO_INCREMENT PRIMARY KEY, 
	contraseña VARCHAR(255) NOT NULL, 
    fecha_registro DATETIME NOT NULL);

CREATE TABLE Estadisticas(id_estadistica INT AUTO_INCREMENT PRIMARY KEY,
    id_jugador INT NOT NULL,
    enemigos_eliminados INT DEFAULT 0,
    cartas_usadas INT DEFAULT 0,
    cartas_mejoradas INT DEFAULT 0,
    victorias INT DEFAULT 0,
    derrotas INT DEFAULT 0,
    tiempo_jugado INT DEFAULT 0,
    nivel_maximo_alcanzado INT DEFAULT 0,
    puntuacion_maxima INT DEFAULT 0,
    FOREIGN KEY (id_jugador) REFERENCES Jugador(id_jugador)
);

CREATE TABLE Partida(id_partida INT AUTO_INCREMENT PRIMARY KEY,
    id_jugador INT NOT NULL,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME,
    puntaje_total INT DEFAULT 0,
    niveles_completados INT DEFAULT 0,
    enemigos_total INT DEFAULT 0,
    vidas_restantes INT DEFAULT 0,
    FOREIGN KEY (id_jugador) REFERENCES Jugador(id_jugador)
);

CREATE TABLE Nivel(id_nivel INT AUTO_INCREMENT PRIMARY KEY,
    dificultad INT NOT NULL,
    numero_nivel INT NOT NULL,
    tiempo_limite_seg INT,
    tiene_jefe BOOLEAN,
    tiene_jefe2 BOOLEAN
);

CREATE TABLE NivelPartida(id_nivel_partida INT AUTO_INCREMENT PRIMARY KEY,
    id_partida INT NOT NULL,
    id_nivel INT NOT NULL,
    puntaje_nivel INT DEFAULT 0,
    tiempo_segundos INT,
    enemigos_eliminados INT DEFAULT 0,
    cartas_usadas INT DEFAULT 0,
    cartas_no_usadas INT DEFAULT 0,
    multiplicador_tiempo DECIMAL(5,2),
    completado BOOLEAN,
    FOREIGN KEY (id_partida) REFERENCES Partida(id_partida),
    FOREIGN KEY (id_nivel) REFERENCES Nivel(id_nivel)
);

CREATE TABLE Carta(id_carta INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(60),
    nivel_maximo INT,
    dificultad_requerida VARCHAR(40) UNIQUE
);

CREATE TABLE CartaJugador(id_carta_jugador INT AUTO_INCREMENT PRIMARY KEY,
    id_jugador INT NOT NULL,
    id_carta INT NOT NULL,
    nivel_actual INT DEFAULT 1,
    veces_mejorada INT DEFAULT 0,
    veces_usada_total INT DEFAULT 0,
    FOREIGN KEY (id_jugador) REFERENCES Jugador(id_jugador),
    FOREIGN KEY (id_carta) REFERENCES Carta(id_carta)
);

CREATE TABLE CartaPartida(id_carta_partida INT AUTO_INCREMENT PRIMARY KEY,
    id_nivel_partida INT NOT NULL,
    id_carta INT NOT NULL,
    nivel_carta_repartir INT,
    fue_usada BOOLEAN,
    fue_almacenada BOOLEAN,
    veces_usada INT DEFAULT 0,
    FOREIGN KEY (id_nivel_partida) REFERENCES NivelPartida(id_nivel_partida),
    FOREIGN KEY (id_carta) REFERENCES Carta(id_carta)
);

CREATE TABLE Enemigo(id_enemigo INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(60) UNIQUE,
    tipo VARCHAR(60) UNIQUE,
    vida_base INT,
    daño_base INT,
    es_inmortal BOOLEAN,
    rango_ataque BOOLEAN,
    rango_deteccion INT
);

CREATE TABLE EnemigoNivel(id_enemigo_nivel INT AUTO_INCREMENT PRIMARY KEY,
    id_nivel INT NOT NULL,
    id_enemigo INT NOT NULL,
    cantidad_maxima INT,
    FOREIGN KEY (id_nivel) REFERENCES Nivel(id_nivel),
    FOREIGN KEY (id_enemigo) REFERENCES Enemigo(id_enemigo)
);

CREATE TABLE Plataforma(id_plataforma INT AUTO_INCREMENT PRIMARY KEY,
    id_carta INT NOT NULL,
    nombre VARCHAR(60),
    es_autogenerada BOOLEAN,
    FOREIGN KEY (id_carta) REFERENCES Carta(id_carta)
);

CREATE TABLE PlataformaNivel(id_plataforma_nivel INT AUTO_INCREMENT PRIMARY KEY,
    id_plataforma INT NOT NULL,
    nivel INT NOT NULL,
    ancho_base DECIMAL(10,2),
    alto_base DECIMAL(10,2),
    duracion INT,
    es_destruible BOOLEAN,
    enemigo_encima BOOLEAN,
    FOREIGN KEY (id_plataforma) REFERENCES Plataforma(id_plataforma)
);

CREATE TABLE PowerUp(id_powerUp INT AUTO_INCREMENT PRIMARY KEY,
    id_carta INT NOT NULL,
    nombre VARCHAR(60),
    FOREIGN KEY (id_carta) REFERENCES Carta(id_carta)
);

CREATE TABLE PowerUpNivel(id_powerup_nivel INT AUTO_INCREMENT PRIMARY KEY,
    id_powerUp INT NOT NULL,
    nivel INT NOT NULL,
    duracion_base INT,
    modificador_velocidad DECIMAL(10,2),
    modificador_salto DECIMAL(10,2),
    da_vida INT,
    rango_actuacion INT,
    FOREIGN KEY (id_powerUp) REFERENCES PowerUp(id_powerUp)
);

