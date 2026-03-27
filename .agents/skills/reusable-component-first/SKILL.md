---
name: reusable-component-first
description: "Use when reusing existing UI components is preferable to creating new patterns: alert/confirm dialogs, forms, cards, lists, and feedback flows in React Native/Expo. Trigger on requests like 'usa el componente reutilizable', 'no uses Alert', 'ya existe un modal para esto'."
argument-hint: Which screen/flow should be refactored to use existing reusable components first?
---

# Reusable Component First

## Objetivo
Evitar soluciones ad-hoc cuando ya existe un componente reutilizable en el proyecto.
Priorizar consistencia visual, UX uniforme y menor deuda tecnica.

## Usar Cuando
- Hay `Alert.alert`, `window.confirm`, o UI inline que duplica un modal existente.
- Se implementan confirmaciones destructivas (eliminar, reset, desasignar).
- Se agregan mensajes de error/exito/advertencia en formularios o CRUD.
- El usuario pide explicitamente: "usa el componente reutilizable".

## Regla Principal
Antes de introducir UI nueva, buscar componentes reutilizables ya existentes y usarlos.

## Flujo Obligatorio
1. Buscar componente existente:
   - Revisar `components/` y buscar usos en `screens/`.
   - Priorizar componentes ya usados en pantallas productivas.

2. Elegir el componente correcto:
   - Feedback de exito/error/info: `AlertModal`.
   - Confirmacion destructiva: `ConfirmActionModal`.
   - Formularios complejos: modales o formularios compartidos existentes.

3. Reemplazar patrones duplicados:
   - Evitar `Alert.alert` si existe `AlertModal`.
   - Evitar `window.confirm` si existe `ConfirmActionModal`.
   - Evitar estilos aislados para mensajes cuando ya hay componente global.

4. Mantener API clara:
   - Exponer callbacks semanticos (`onFeedback`, `onConfirmDelete`, etc.).
   - No acoplar servicios al modal; separar logica de negocio y UI.

5. Verificar UX:
   - La accion debe informar exito y error de forma visible.
   - Confirmaciones solo para acciones destructivas.
   - Nada de fallos silenciosos.

6. Validar tecnicamente:
   - Ejecutar `npx tsc --noEmit`.

## Checklist Rapido
- [ ] Se busco en `components/` antes de crear UI nueva.
- [ ] Se reemplazo `Alert.alert`/`window.confirm` por componentes reutilizables.
- [ ] Errores y exitos se muestran con feedback consistente.
- [ ] No hay acciones destructivas sin confirmacion.
- [ ] TypeScript compila sin errores.

## Patrones Recomendados
- Estado de feedback en pantalla:
  - `feedbackModal.visible`
  - `feedbackModal.payload`
  - `showFeedback(type, title, message)`
  - `closeFeedback()`

- Confirmacion de eliminar:
  - estado `pendingDelete` o `confirmVisible`
  - `ConfirmActionModal` con `loading`
  - callback `onConfirm` async con manejo de errores

## Anti-Patrones
- Usar `Alert.alert` por costumbre cuando ya existe `AlertModal`.
- Mezclar multiples estilos de feedback en la misma pantalla.
- Silenciar errores de guardado/eliminacion.
- Duplicar componentes visualmente equivalentes.

## Ejemplos de Trigger
- "usa el modal reutilizable"
- "no uses Alert"
- "ya hay un componente para confirmar"
- "hazlo consistente con el resto de pantallas"
