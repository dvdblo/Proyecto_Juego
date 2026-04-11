# Instrucciones del Juego

## Nombre

HyperJump

## ¿Cómo iniciarlo?

1. Descarga el repositorio
2. Crea la base de datos de la carpeta "DataBase" y carga los datos del juego
3. En el archivo "platform.js", ubicado en Videojuego/js/BackEnd, reemplaza el contenido de las variables host, user y pass por los datos correspondientes a tu IP y contraseña de la conexión a la base de datos.
4. Estando en la carpeta anterior, inicializa el archivo "platform.js" con node, desde la terminal.
5. Inicia un servidor con el botón "Go Live", de la extensión "Live server" en VS code.
6. Abre el servidor en tu explorador, y ubica la carpeta "html", dentro de la carpeta "Videojuego".
7. Abre la carpeta "html" o el archivo "index.html"

## ¿Cómo jugar?

El prototipo consta de un único nivel, compuesto de plataformas aleatorias colocadas en el layout establecido.

El personaje cuenta con movimiento lateral y salto. 

Se tienen cartas de plataforma, las cuales colocan una plataforma en una posición predeterminada en el nivel. Se tienen cartas de power-up, las cuales dan un efecto temporal al jugador. La descripción de cada carta se puede ver en la imagen de la misma.

Los controles de movimiento lateral son: izquierda(a / Flecha izquierda), derecha(d / flecha derecha).

Para el salto: w / flecha arriba / espacio.

Para la utilización de carta de power-up: número "0".

Para la utilización de carta de plataforma: número "9".

Para ganar tienes que llegar al final del nivel.
Cuentas con tres vidas, si un enemigo te golpea, podrías perder una vida.
SI caes al vacío pierdes inmediatamente.

## Escenas

Las escenas con las que cuenta el prototipo son:

1. Menú de inicio (se inicia en esta escena).
2. Pantallas de historia.
3. Nivel de prueba.
4. Pantalla de victoria.
5. Pantallas de derrota.

## Funcionalidades

Para este prototipo, se encuntra terminada la funcionalidad del sistema de escenas, implementada con Phaser. Aún no se cuenta con todas las escenas.

Las mecánicas de cartas de plataformas y power-ups, siguen en desarrollo.

El sistema de generación de platafromas autogeneradas esta completo, pero el diseño de los niveles aún está en desarrollo.

Los sistemas de vidas, daño, tiempo y puntaje estan implementados de forma básica para este prototipo.