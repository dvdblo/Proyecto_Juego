DROP DATABASE IF EXISTS hyperjump;
CREATE DATABASE hyperjump;
USE hyperjump;

CREATE TABLE Jugador(id_jugador INT AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
	contraseña VARCHAR(15) NOT NULL,
    edad TINYINT UNSIGNED,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_jugador PRIMARY KEY(id_jugador)
    ) ENGINE=InnoDB;

CREATE TABLE Estadisticas(id_estadistica INT AUTO_INCREMENT,
    id_jugador INT NOT NULL UNIQUE,
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
    CONSTRAINT fk_estadisticas_jugador FOREIGN KEY (id_jugador) REFERENCES Jugador(id_jugador)
) ENGINE=InnoDB;

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
    CONSTRAINT fk_partida_jugador FOREIGN KEY (id_jugador) REFERENCES Jugador(id_jugador)
) ENGINE=InnoDB;

CREATE TABLE Nivel(id_nivel INT AUTO_INCREMENT,
    numero_nivel TINYINT UNSIGNED NOT NULL,
    dificultad ENUM('facil', 'medio', 'dificil') NOT NULL,
    tiempo_limite_seg SMALLINT UNSIGNED,
    CONSTRAINT pk_nivel PRIMARY KEY(id_nivel)
) ENGINE=InnoDB;

CREATE TABLE JefeNivel(id_jefe_nivel INT AUTO_INCREMENT,
	id_nivel INT NOT NULL,
    nombre_jefe VARCHAR(50),
    CONSTRAINT pk_JefeNivel PRIMARY KEY(id_jefe_nivel),
    CONSTRAINT fk_JefeNivel_nivel FOREIGN KEY (id_nivel) REFERENCES Nivel(id_nivel)
) ENGINE=InnoDB;

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
    CONSTRAINT fk_NivelPartida_partida FOREIGN KEY (id_partida) REFERENCES Partida(id_partida),
    CONSTRAINT fk_NivelPartida_nivel FOREIGN KEY (id_nivel) REFERENCES Nivel(id_nivel)
) ENGINE=InnoDB;

CREATE TABLE Carta(id_carta INT AUTO_INCREMENT,
    descripcion VARCHAR(100),
    nivel_maximo TINYINT UNSIGNED,
    dificultad_requerida ENUM('facil', 'medio', 'dificil'),
    CONSTRAINT pk_Carta PRIMARY KEY(id_carta)
)ENGINE=InnoDB;

CREATE TABLE CartaJugador(id_carta_jugador INT AUTO_INCREMENT,
    id_jugador INT NOT NULL,
    id_carta INT NOT NULL,
    nivel_actual TINYINT UNSIGNED DEFAULT 1,
    veces_mejorada SMALLINT UNSIGNED DEFAULT 0,
    veces_usada_total MEDIUMINT UNSIGNED DEFAULT 0,
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_CartaJugador PRIMARY KEY(id_carta_jugador),
    CONSTRAINT fk_CartaJugador_jugador FOREIGN KEY (id_jugador) REFERENCES Jugador(id_jugador),
    CONSTRAINT fk_CartaJugador_carta FOREIGN KEY (id_carta) REFERENCES Carta(id_carta)
)ENGINE=InnoDB;

CREATE TABLE CartaPartida(id_carta_partida INT AUTO_INCREMENT,
    id_nivel_partida INT NOT NULL,
    id_carta INT NOT NULL,
    nivel_carta_repartir TINYINT UNSIGNED,
    fue_usada BOOLEAN DEFAULT FALSE,
    fue_almacenada BOOLEAN DEFAULT FALSE,
    veces_usada SMALLINT UNSIGNED DEFAULT 0,
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_CartaPartida PRIMARY KEY(id_carta_partida),
    CONSTRAINT fk_CartaPartida_partida FOREIGN KEY (id_nivel_partida) REFERENCES NivelPartida(id_nivel_partida),
    CONSTRAINT fk_CartaPartida_carta FOREIGN KEY (id_carta) REFERENCES Carta(id_carta)
)ENGINE=InnoDB;

CREATE TABLE Enemigo(id_enemigo INT AUTO_INCREMENT,
    nombre VARCHAR(60) UNIQUE,
    tipo VARCHAR(60),
    descripcion VARCHAR(255),
    vida_base SMALLINT UNSIGNED,
    daño_base SMALLINT UNSIGNED,
    es_inmortal BOOLEAN DEFAULT FALSE,
    rango_ataque BOOLEAN DEFAULT FALSE, 
    rango_deteccion SMALLINT UNSIGNED,
    CONSTRAINT pk_enemigo PRIMARY KEY(id_enemigo)
)ENGINE=InnoDB;

CREATE TABLE EnemigoNivel(id_enemigo_nivel INT AUTO_INCREMENT,
    id_nivel INT NOT NULL,
    id_enemigo INT NOT NULL,
    cantidad_maxima SMALLINT UNSIGNED,
    CONSTRAINT pk_EnemigoNivel PRIMARY KEY(id_enemigo_nivel),
    CONSTRAINT fk_EnemigoNivel_nivel FOREIGN KEY (id_nivel) REFERENCES Nivel(id_nivel),
    CONSTRAINT fk_EnemigoNivel_enemigo FOREIGN KEY (id_enemigo) REFERENCES Enemigo(id_enemigo)
)ENGINE=InnoDB;

CREATE TABLE Plataforma(id_plataforma INT AUTO_INCREMENT,
    id_carta INT,
    nombre VARCHAR(60),
    composicion JSON,
    es_autogenerada BOOLEAN DEFAULT FALSE,
    CONSTRAINT pk_Plataforma PRIMARY KEY(id_plataforma),
    CONSTRAINT fk_Plataforma_carta FOREIGN KEY (id_carta) REFERENCES Carta(id_carta)
)ENGINE=InnoDB;

CREATE TABLE PlataformaNivel(id_plataforma_nivel INT AUTO_INCREMENT,
    id_plataforma INT NOT NULL,
    nivel_plataforma TINYINT UNSIGNED NOT NULL,
    ancho_base DECIMAL(10,2),
    alto_base DECIMAL(10,2),
    duracion SMALLINT UNSIGNED,
    es_destruible BOOLEAN DEFAULT FALSE,
    enemigo_encima BOOLEAN DEFAULT FALSE,
    CONSTRAINT pk_PlataformaNivel PRIMARY KEY(id_plataforma_nivel),
    CONSTRAINT fk_PlataformaNivel_plataforma FOREIGN KEY (id_plataforma) REFERENCES Plataforma(id_plataforma)
)ENGINE=InnoDB;

CREATE TABLE PowerUp(id_powerUp INT AUTO_INCREMENT,
    id_carta INT NOT NULL,
    nombre VARCHAR(60),
    CONSTRAINT pk_PowerUp PRIMARY KEY(id_powerUp),
    CONSTRAINT fk_PowerUp_carta FOREIGN KEY (id_carta) REFERENCES Carta(id_carta)
)ENGINE=InnoDB;

CREATE TABLE PowerUpNivel(id_powerup_nivel INT AUTO_INCREMENT,
    id_powerUp INT NOT NULL,
    nivel_powerUp TINYINT UNSIGNED NOT NULL,
    duracion_base SMALLINT UNSIGNED,
    modificador_velocidad DECIMAL(10,2),
    modificador_salto DECIMAL(10,2),
    da_vida TINYINT,
    rango_actuacion SMALLINT UNSIGNED,
    CONSTRAINT pk_PowerUpNivel PRIMARY KEY(id_powerup_nivel),
    CONSTRAINT fk_PowerUpNivel_powerUp FOREIGN KEY (id_powerUp) REFERENCES PowerUp(id_powerUp)
)ENGINE=InnoDB;

CREATE TABLE ZonaGeneracion(id_zona INT AUTO_INCREMENT,
	id_nivel INT NOT NULL,
    coord_x SMALLINT,
    coord_y SMALLINT,
    hostil BOOL DEFAULT FALSE,
    CONSTRAINT pk_ZonaGeneracion PRIMARY KEY(id_zona),
    CONSTRAINT fk_ZonaGeneracion_nivel FOREIGN KEY (id_nivel) REFERENCES Nivel(id_nivel)
)ENGINE=InnoDB;