# Historias de Usuario

Guillermo González A01787393  
Daniel Armas A01786896  
David Blanco A01786713

# Bases de datos

**01 Yo como** usuario **quiero** poder crear un cuenta dónde almacenar mi información de juego **para poder** acceder a él en momentos separados.

**Validación:**

* Dar de alta mi cuenta  
* Poder revisar mi progreso  
* Poder acceder desde múltiples dispositivos

**Prioridad:** Alta  
**Estimación:** 18h

**02 Yo como** usuario **quiero** poder guardar el estado de mi juego **para retomarlo** en otro momento.

**Validación:**

* Existe guardado  
* Existe carga  
* Datos persisten al cerrar

**Prioridad**: Alta  
**Estimación**: 6h

**03 Yo como** administrador de base de datos **quiero** tener múltiples tablas **para guardar** información de manera optimizada y con funciones CRUD.

**Validación**:

* Existen tablas separadas  
* CRUD funciona en cada tabla  
* No hay redundancia de datos  
* Se cumple normalización básica

**Prioridad**: Alta  
**Estimación**: 8h

**04 Yo como** administrador de base de datos **quiero** tener vistas sobre las tablas **para añadir** una capa de protección.

**Validación**:

* Las vistas existen  
* Las vistas limitan columnas sensibles  
* Las consultas funcionan desde vistas

**Prioridad**: Media  
**Estimación**: 4h

**05 Yo como** administrador de base de datos **quiero** tener llaves primarias, foráneas y de indexación **para estructurar** el sistema.

**Validación**:

* PK en cada tabla  
* FK correctas  
* Índices creados

**Prioridad**: Alta  
**Estimación**: 5h

**06 Yo como** administrador de base de datos **quiero** tener un API **para permitir** la interconexión entre el videojuego y la base de datos.

**Validación**:

* API responde  
* API conecta con BD  
* API recibe datos del juego

**Prioridad**: Alta  
**Estimación**: 8h

# Web

**07 Yo como** usuario **quiero** poder ver mis estadísticas **para** ver mi progreso y mis áreas de oportunidad

**Validación:**

* Acceder a mis estadísticas  
* Que se actualicen constantemente

**Prioridad:** Media  
**Estimación:** 7h

**08 Yo como** usuario **quiero** tener una página web con múltiples secciones **para acceder** a la página web sin tener que entrar al videojuego.

**Validación**:

* La página contiene varias secciones navegables  
* La página carga sin entrar al juego  
* Los enlaces funcionan correctamente

**Prioridad**: Alta  
**Estimación**: 6h

**09 Yo como** usuario **quiero** tener múltiples secciones **para acceder** al inicio, tutorial, personajes y estadísticas.

**Validación**:

* Existe sección inicio  
* Existe sección tutorial  
* Existe sección personajes  
* Existe sección estadísticas  
* Navegación funcional entre secciones

**Prioridad**: Alta  
**Estimación**: 4h

**10 Yo como** administrador de la página web **quiero** tener un usuario y login **para poder acceder** al videojuego.

**Validación**:

* Existe formulario login  
* Usuario se valida en BD  
* Acceso solo con credenciales correctas

**Prioridad**: Alta  
**Estimación**: 5h

**11 Yo como** administrador de la página web **quiero** que los usuarios puedan acceder al juego en un servidor local o http **para permitir** su ejecución en distintos entornos.

**Validación**:

* Funciona en localhost o http

**Prioridad**: Media  
**Estimación**: 6h

# Videojuego

**12 Yo como** usuario **quiero** poder iniciar una partida nueva **para** poder jugar múltiples veces el juego y mejorar mi récord

**Validación:**

* Iniciar partida  
* Reiniciar partida ya empezada

**Prioridad:** Alta  
**Estimación:** 5h

**13 Yo como** usuario **quiero** poder jugar múltiples veces el juego sin que se sienta repetitivo **para poder** jugar por horas sin aburrirme

**Validación:**

* Que se generen plataformas al azar  
* Que las cartas repartidas sean distintas  
* Que los enemigos varíen  
* Que los niveles sean diferentes pero mantengan una dificultad constante

**Prioridad:** Media  
**Estimación:** 14h

**14 Yo como** usuario **quiero** poder entender las mecánicas del juego **para poder** jugarlo de mejor manera.

**Validación:**

* Poder ver un tutorial con las mecánicas  
* Que el tutorial sea entendible

**Prioridad:** Media  
**Estimación:** 6h

**15 Yo como** usuario **quiero** entender el funcionamiento de las cartas **para poder** combinarlas y utilizarlas de la mejor manera posible

**Validación:**

* Que las cartas tengan una descripción clara  
* Que el funcionamiento de las cartas sea simple  
* Que los usos de las cartas sean intuitivos

**Prioridad:** Media  
**Estimación:** 6h

**16 Yo como** usuario **quiero** ser capaz de mejorar mis cartas **para poder** facilitar mi progreso por los niveles del juego

**Validación:**

* Que las cartas sean mejorables  
* Poder elegir la carta a mejorar  
* Que las mejoras de las cartas se conserven

**Prioridad:** Alta  
**Estimación:** 10h

**17 Yo como** usuario **quiero** que el juego tenga una dificultad progresiva **para poder** mejorar constantemente y no quedarme atascado en una sección específica

**Validación:**

* Distintos niveles con distintas dificultades  
* Distintos enemigos por nivel  
* Mejoras constantes

**Prioridad:** Alta  
**Estimación:** 9h

**18 Yo como** usuario **quiero** que el juego sea visualmente atractivo **para poder** disfrutar al máximo mi experiencia con el juego

**Validación:**

* Temática coherente  
* Fácil distinción entre elementos interactivos y estáticos  
* Distintos elementos visuales por nivel

**Prioridad:** Baja  
**Estimación:** 8h

**19 Yo como** usuario **quiero** tener un sistema de pausa y configuración **para cambiar** la música, efectos de audio y visualización.

**Validación**:

* Botón pausa funciona  
* Configuración cambia audio  
* Configuración cambia resolución de pantalla

**Prioridad**: Media  
**Estimación**: 8h

**20 Yo como** usuario **quiero** tener música inmersiva **para que mi experiencia sea** lo más placentera posible.

**Validación**:

* Música se reproduce  
* Música cambia según escena  
* Volumen configurable

**Prioridad**: Baja  
**Estimación**: 6h

**21 Yo como** usuario **quiero** tener elementos retadores en el juego **para hacer** mi experiencia más entretenida.

**Validación**:

* Sistema de daño  
* Sistema de vidas  
* Sistema de tiempo  
* Sistema de puntuación

**Prioridad**: Media  
**Estimación**: 8h

**22 Yo como** usuario **quiero** tener al menos un jefe final **para hacer** más inmersiva la experiencia.

**Validación**:

* Existe jefe  
* Tiene mecánicas propias  
* Puede ser derrotado

**Prioridad**: Media  
**Estimación**: 7h

**23 Yo como** usuario **quiero** tener una cinemática de inicio **para ayudarme** a entender de qué trata el juego.

**Validación**:

* Cinemática se reproduce  
* Puede saltarse  
* Explica historia

**Prioridad**: Baja  
**Estimación**: 4h

**24 Yo como** usuario **quiero** tener una cinemática final **para ayudarme** a entender cómo termina el juego.

**Validación**:

* Se reproduce al terminar  
* Explica final

**Prioridad**: Baja  
**Estimación**: 4h

**25 Yo como** usuario **quiero** que haya cartas en el juego **para interactuar** con ellas a lo largo de los niveles.

**Validación**:

* Cartas existen  
* Cartas se pueden usar  
* Cartas afectan juego

**Prioridad**: Alta  
**Estimación**: 12h

**26 Yo como** usuario **quiero** que los niveles sean reconfigurables y al menos haya dos **para ampliar** mi tiempo de juego.

**Validación**:

* Existen al menos 2 niveles  
* Se cargan correctamente

**Prioridad**: Alta  
**Estimación**: 10h

**27 Yo como** administrador de la página web **quiero** que el estilo visual sea similar **para mantener** coherencia entre página y juego.

**Validación**:

* Misma paleta de colores  
* Tipografía similar  
* UI consistente

**Prioridad**: Media  
**Estimación**: 4h

**28 Yo como** administrador de la página web **quiero** que la página esté estructurada de manera coherente **para que sea** entendible su navegación.

**Validación**:

* Menú claro  
* Secciones ordenadas  
* Navegación intuitiva

**Prioridad**: Media  
**Estimación**: 4h

# Otros

**29 Yo como** administrador **quiero** tener una sección de estadísticas con múltiples visualizaciones interactivas **para facilitar** la toma de decisiones sobre el juego.

**Validación**:

* Se muestran gráficas  
* Datos se cargan desde BD  
* Visualizaciones son interactivas

**Prioridad**: Media  
**Estimación**: 8h

**30 Yo como** profesor **quiero** que se desarrolle todo el código sin herramientas generativas **para asegurar un aprendizaje** óptimo.

**Validación**:

* Código revisado  
* Sin IA generativa  
* Entregas justificadas

**Prioridad**: Alta  
**Estimación**: –

**31 Yo como** profesor **quiero** que los integrantes trabajen en igual proporción **para desarrollar** habilidades en todas las áreas.

**Validación**:

* Tareas repartidas  
* Todos participan  
* Evidencia en commits

**Prioridad**: Alta  
**Estimación**: –

**32 Yo como** profesor **quiero** que haya un SCRUM master rotativo **para que todos experimenten** el rol.

**Validación**:

* Hay SCRUM por sprint  
* Se rota rol  
* Se registra

**Prioridad**: Alta  
**Estimación**: –

**33 Yo como** profesor **quiero** que todas las tareas se entreguen de forma específica **para tener** seguimiento completo.

**Validación**:

* Issues claros  
* Entregas detalladas  
* Evidencia incluida

**Prioridad**: Alta  
**Estimación**: –

**34 Yo como** profesor **quiero** que exista un SCRUM Master **para aprobar** todos los issues.

**Validación**:

* Issues revisados  
* Issues aprobados  
* Registro de aprobación

**Prioridad**: Alta  
**Estimación**: –

Issue es ligero y sale de historia de usuario

Un issue puede llevar a otros sub issues

