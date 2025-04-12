## Metodología de Desarrollo

### Enfoque Adoptado

Para el desarrollo del sistema de mensajería en tiempo real con WebSockets y encriptación de extremo a extremo (E2E), se ha adoptado una **metodología ágil con enfoque iterativo e incremental**, integrando también elementos del **Proceso Unificado Racional (RUP)**.

### Justificación

#### 1. Procesos Ágiles (Adaptativos)
- El sistema requiere **entregas funcionales frecuentes**, validación constante y flexibilidad ante posibles cambios en los requisitos.
- Las metodologías ágiles son ideales para este tipo de proyectos por su naturaleza adaptativa, permitiendo **iteraciones cortas** con objetivos bien definidos.
- Se evita una documentación excesiva sin comprometer la organización, facilitando la **rapidez y eficiencia del desarrollo**.

#### 2. Desarrollo Iterativo e Incremental
- El desarrollo por etapas permite construir **subconjuntos funcionales del sistema**, como:
  - Módulo de comunicación WebSocket.
  - Implementación de cifrado E2E.
  - Interfaz de usuario.
  - Módulo de escalabilidad y pruebas de carga.
- Esto permite **pruebas tempranas y frecuentes**, garantizando la calidad y funcionalidad de cada componente antes de continuar.

#### 3. Proceso Unificado Racional (RUP)
Se incorpora RUP como marco organizador para estructurar el proyecto en fases bien definidas:

- **Fase de Inicio**: Definición de objetivos, análisis de requisitos y actores involucrados.
- **Fase de Elaboración**: Identificación de casos de uso, modelado de arquitectura y selección de tecnologías (WebSockets, AES/RSA).
- **Fase de Construcción**: Desarrollo iterativo e integración de módulos funcionales.
- **Fase de Transición**: Implementación, despliegue y validación en entorno real.

Este marco proporciona un **equilibrio entre formalidad y adaptabilidad**, apoyado en la documentación visual (UML), como diagramas de clases, secuencia y despliegue.

---

### Conclusión

> La metodología seleccionada, basada en un enfoque **ágil e iterativo**, complementado con principios del **Proceso Unificado Racional (RUP)**, permite alcanzar los objetivos del proyecto de manera organizada, flexible y eficiente. Esta elección asegura un desarrollo adaptable, validaciones continuas y una arquitectura bien definida, características esenciales para un sistema seguro, escalable y funcional.
