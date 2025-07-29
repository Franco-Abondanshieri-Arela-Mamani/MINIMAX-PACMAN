# Pac-Man con Inteligencia Artificial Minimax

## Descripción

Este proyecto implementó el clásico juego Pac-Man utilizando tecnologías web modernas y algoritmos de inteligencia artificial. Se desarrolló un sistema completo que incluye tanto el juego tradicional como una implementación avanzada del algoritmo Minimax con poda Alpha-Beta para crear un Pac-Man inteligente capaz de tomar decisiones óptimas.

## Características Implementadas

### Juego Base
- Laberinto clásico de Pac-Man con paredes, puntos y pastillas de poder
- Sistema de puntuación y vidas
- Cuatro fantasmas con colores distintivos
- Detección de colisiones y mecánicas de juego tradicionales
- Túneles laterales para teletransporte

### Interfaz de Usuario
- Diseño responsivo que se adapta a diferentes tamaños de pantalla
- Controles táctiles para dispositivos móviles
- Panel de estadísticas en tiempo real
- Controles de pausa, reinicio y configuración de sonido
- Interfaz moderna sin bordes con degradados y efectos visuales

### Sistema de Inteligencia Artificial
- Algoritmo Minimax implementado con poda Alpha-Beta
- Tres niveles de dificultad configurables
- Función de evaluación que considera múltiples factores
- Sistema de debug para visualizar decisiones de la IA
- Optimizaciones de rendimiento para mantener fluidez del juego

## Arquitectura del Código

El proyecto se organizó en una arquitectura modular de tres componentes principales:

### gameEngine.js
Contiene la lógica central del juego incluyendo:
- Manejo del estado del juego
- Algoritmos de movimiento y colisiones
- Simulación de estados para la IA
- Gestión del laberinto y entidades

### gameRenderer.js
Responsable de la visualización incluyendo:
- Renderizado del canvas y todos los elementos gráficos
- Efectos visuales y animaciones
- Herramientas de debug para la IA
- Adaptación responsiva del canvas

### gameController.js
Coordina la interacción del usuario y la IA incluyendo:
- Manejo de eventos de teclado y táctiles
- Implementación completa del algoritmo Minimax
- Coordinación entre el motor del juego y el renderizador
- Gestión de la interfaz de usuario

## Algoritmo Minimax

### Funcionamiento
El algoritmo Minimax implementado evalúa recursivamente los posibles movimientos futuros para determinar la jugada óptima. Pac-Man actúa como el jugador maximizador buscando incrementar su puntuación, mientras que los fantasmas funcionan como minimizadores intentando reducir la puntuación de Pac-Man.

### Función de Evaluación
La función de evaluación considera los siguientes factores:
- Puntuación actual del juego
- Distancia a los fantasmas más cercanos
- Cantidad de puntos restantes en el laberinto
- Distancia al punto más cercano
- Número de vidas restantes

### Optimizaciones
- Poda Alpha-Beta para reducir el número de nodos evaluados
- Límites de profundidad configurables según el nivel de dificultad
- Simulación de estados sin modificar el juego real

## Instalación y Uso

### Requisitos
- Navegador web moderno con soporte para HTML5 Canvas
- No requiere instalación de software adicional

### Ejecución
1. Clonar el repositorio
2. Abrir el archivo `index.html` en un navegador web
3. El juego se ejecuta inmediatamente

### Controles
- Flechas del teclado: Movimiento de Pac-Man
- Espacio: Pausa/Reanuda el juego
- Botones táctiles: Control en dispositivos móviles
- Tecla 'A': Activar/Desactivar IA
- Tecla 'D': Mostrar información de debug

## Configuración de IA

### Niveles de Dificultad
- **Easy**: Profundidad 3 - Decisiones rápidas y básicas
- **Medium**: Profundidad 5 - Equilibrio entre velocidad y inteligencia
- **Hard**: Profundidad 7 - Máxima inteligencia, mayor tiempo de procesamiento

### Modificación de Parámetros
Los parámetros de la IA pueden ajustarse modificando las variables en `gameController.js`:
```javascript
this.aiLevel = 'medium'; // 'easy', 'medium', 'hard'
this.showDebugInfo = false; // true para mostrar información de debug
```

## Tecnologías Utilizadas

- **HTML5**: Estructura de la aplicación
- **CSS3**: Estilos modernos con degradados y efectos visuales
- **JavaScript ES6+**: Lógica del juego y algoritmos de IA
- **Canvas API**: Renderizado de gráficos 2D
- **LocalStorage**: Persistencia de mejores puntuaciones
