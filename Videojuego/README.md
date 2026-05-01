# Instrucciones del Juego

## Nombre

HyperJump

## ¿Cómo iniciarlo?

## 1. Requisitos previos

Antes de intentar correr el proyecto, asegúrate de tener instaladas las siguientes herramientas:

| Herramienta | Versión mínima | Descarga                        |
|-------------|----------------|---------------------------------|
| Node.js     | 18 o superior  | https://nodejs.org              |
| MySQL       | 8.0 o superior | https://dev.mysql.com/downloads |
| Git         | Cualquiera     | https://git-scm.com             |

El archivo principal del juego es `Web/hyperjump.html`. No abras ningún otro HTML para iniciar el juego.

Sigue los pasos en el orden exacto en que aparecen. Todos los comandos se ejecutan desde una terminal (Command Prompt, PowerShell, bash o zsh).

1. Descarga el repositorio
git clone <https://github.com/dvdblo/Proyecto_Juego.git>
cd <Proyecto_Juego>
(Si ya tienes el repositorio y quieres asegurarte de tener la versión más reciente:
git reset --hard origin/main
Elimina todos los cambios locales no guardados.
)
2. Crear la base de datos
Abre una terminal e inicia sesión en MySQL:
mysql -u root -p
(Escribe tu contraseña cuando se la pida. Una vez dentro del shell de MySQL, ejecuta los dos archivos SQL en este orden exacto:
SOURCE /ruta/al/repositorio/DataBase/hyperjump.sql;
SOURCE /ruta/al/repositorio/DataBase/hyperjump-data.sql;
ATENCIÓN: Reemplaza `/ruta/al/repositorio` con la ruta absoluta donde clonaste el proyecto.
Ejemplo en macOS/Linux: `/Users/daniel/hyperjump/DataBase/hyperjump.sql`
Ejemplo en Windows: `C:\Users\daniel\hyperjump\DataBase\hyperjump.sql`
)
3. Configurar las credenciales del backend
Abre el archivo `BackEnd/platform.js` con cualquier editor de texto y localiza el bloque de conexión a la base de datos (está cerca del inicio del archivo):
(const pool = mysql.createPool({
    host:     '127.0.0.1',    // Usa 127.0.0.1 para instalación local
    user:     'root',          // Tu usuario de MySQL
    password: 'TU_CONTRASEÑA', // Tu contraseña de MySQL
    database: 'hyperjump'
}).promise();
)
ATENCIÓN: Reemplaza únicamente los valores de `user` y `password` por los tuyos. No cambies `host` ni `database` a menos de que `host` sea diferente a 127.0.0.1, en ese caso, coloca 127.0.0.1 en `host`.

Si no tienes un user, deberás crear uno ejecutando lo siguiente con mysql, y cambiando "usuario" y "contraseña" por lo que quieras usar:

CREATE USER 'usuario'@'localhost'
IDENTIFIED WITH mysql_native_password BY 'contraseña';
GRANT ALL PRIVILEGES ON hyperjump.* TO 'usuario'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;

4. Instalar dependencias del backend
Desde la raíz del repositorio, navega a `BackEnd` e instala los paquetes de Node.js:
(
cd Videojuego/js/BackEnd
npm install
)
ATENCIÓN: Esto instalará Express, mysql2, cors y el resto de dependencias. Deberías ver una carpeta `node_modules` creada dentro de `BackEnd`.
5. Iniciar el servidor backend
Estando dentro de la carpeta `BackEnd`, inicia el servidor API:
(
node platform.js  
)
ATENCIÓN: Si todo está bien configurado verás este mensaje en la terminal: Servidor en http://localhost:3000
ATENCIÓN: Deja esta terminal abierta mientras juegas. El juego hace peticiones a `http://localhost:3000` constantemente. Si cierras esta terminal el juego dejará de funcionar.
6. Iniciar el servidor web
Abre una **segunda terminal** (mantén la del backend abierta) y navega a la carpeta Raiz del repositorio:
(
npx http-server . -p 8080
)
ATENCIÓN: Si `npx` no encuentra el paquete, instálalo globalmente primero:
(
npm install -g http-server
cd Web
http-server . -p 8080
)
ATENCIÓN: Verás un mensaje similar a este: Starting up http-server, serving . Available on: http://127.0.0.1:8080 http://192.168.x.x:8080
7. Abrir el juego
Con ambos servidores corriendo, abre tu navegador y escribe esta dirección exacta: 
(
http://localhost:8080/hyperjump.html
)
ATENCIÓN: Si ves la pantalla principal de HyperJump con el título y el menú de navegación, la instalación fue exitosa.

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
