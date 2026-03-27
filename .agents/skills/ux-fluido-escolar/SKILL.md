---
name: ux-fluido-escolar
description: 'Design and implement fluid UX for this school app in React Native/Expo. Use when creating or refactoring screens, forms, navigation, and feedback flows to improve clarity, speed, accessibility, and consistency with the notebook/kawaii visual style.'
argument-hint: Which screen or flow should be improved with UX-first criteria?
---

# UX Fluido Escolar

## Objetivo
Aplicar una metodologia UX reutilizable para que cada pantalla sea:
- clara para docentes
- rapida en interacciones frecuentes
- consistente con el estilo visual del proyecto
- robusta bajo conectividad inestable

## Usar Cuando
- Se crea una pantalla nueva (listas, formularios, configuraciones, registro de notas).
- Se mejora un flujo existente con friccion o pasos innecesarios.
- Hay errores de usabilidad: confusion, taps repetidos, feedback tardio o ambiguo.
- Se detecta inconsistencia visual entre pantallas.

## Principios UX del Proyecto
- Priorizar continuidad: evitar bloqueos visuales innecesarios.
- Mostrar contenido util lo antes posible (cache-first cuando aplique).
- Feedback inmediato en cada accion (exito, warning, error).
- Jerarquia visual clara para tareas del docente (crear, editar, eliminar, navegar).
- Estilo consistente: libreta/kraft, bordes marcados, estructura legible.
- Accesibilidad practica: targets grandes, textos claros, labels comprensibles.

## Flujo de Trabajo
1. Definir objetivo de la pantalla:
   - Que tarea principal resuelve.
   - Cual es la accion primaria y cuales son secundarias.

2. Mapear estados UX:
   - Sin datos.
   - Con datos.
   - Error recuperable.
   - Guardando/actualizando.
   - Eliminando/confirmando.

3. Diseñar estructura de interaccion:
   - Header con contexto y navegacion de regreso.
   - Accion primaria visible y estable.
   - Lista o formulario con jerarquia por bloques.
   - Confirmaciones solo en acciones destructivas.

4. Definir feedback:
   - Mensajes directos y accionables.
   - Evitar mensajes tecnicos para usuario final.
   - En validaciones, indicar exactamente que corregir.

5. Optimizar friccion:
   - Reducir pasos para tareas repetidas.
   - Minimizar cambios bruscos de layout.
   - Mantener estado visible al sincronizar datos.

6. Alinear estilo visual:
   - Reutilizar patrones de color, bordes, radios y espaciado del proyecto.
   - Evitar introducir componentes que rompan la identidad grafica.

7. Verificar calidad:
   - Probar flujo feliz y casos limite.
   - Ejecutar validacion tecnica (TypeScript).
   - Confirmar que no se degradan interacciones existentes.

## Decision Points
- Si hay demasiados taps para una tarea comun:
  - Fusionar pasos o mover accion primaria a zona visible.

- Si el usuario no entiende el error:
  - Reescribir mensaje con lenguaje simple + accion concreta.

- Si el layout salta o parpadea:
  - Evitar bloqueos globales; usar actualizacion progresiva.

- Si el estilo se ve distinto al resto:
  - Reusar primitives visuales del proyecto antes de crear variantes nuevas.

- Si mobile y web se comportan distinto:
  - Mantener la misma logica UX, ajustando densidad y control de foco por plataforma.

## Scroll y Layout Consistente
Cuando se implemente scroll en una pantalla:
- Usar `ScrollView` con `ref` para control programático.
- Configurar `contentContainerStyle` con:
  - `paddingHorizontal: 20` para margen lateral consistente.
  - `paddingTop: 16` para espaciado superior.
  - `paddingBottom: 180` para evitar que el contenido quede oculto bajo navegación.
  - `minHeight: '100%'` para forzar scroll cuando el contenido es corto.
- Agregar `showsVerticalScrollIndicator={false}` para ocultar indicador en móvil.
- Mantener consistencia con otros módulos (Anios, Asignaturas, Grupos, etc.).

## Criterios de Calidad (Definition of Done)
- La tarea principal se completa en pocos pasos y sin ambiguedad.
- Existe feedback claro para exito, error y validacion.
- El estado vacio guia al usuario a la siguiente accion.
- No hay regresiones de fluidez en navegacion o render.
- El estilo visual mantiene coherencia con el sistema del proyecto.
- TypeScript compila sin errores.

## Checklist Rapido
- [ ] Accion primaria visible desde el primer scroll.
- [ ] Estado vacio con CTA claro.
- [ ] Errores con mensaje accionable.
- [ ] Confirmacion solo para acciones destructivas.
- [ ] Consistencia visual con pantallas existentes.
- [ ] Scroll configurado con paddingBottom 180 y minHeight 100%.
- [ ] npx tsc --noEmit sin errores.

## Prompts de Ejemplo
- "Aplica ux-fluido-escolar a la pantalla de registro de notas por estudiante."
- "Refactoriza este formulario para reducir friccion y mejorar claridad de validaciones."
- "Haz una mejora UX completa de esta lista sin cambiar la logica de negocio."
- "Revisa esta pantalla con ux-fluido-escolar y dame mejoras priorizadas."
