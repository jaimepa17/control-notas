---
name: flujo-realtime-sin-loaders
description: 'Implement and maintain a fluid React Native + Supabase workflow with cache-first rendering, realtime as single source of truth, non-blocking UI updates, strict service-layer validations, and iterative safe delivery. Use when building or refactoring screens to avoid flicker, avoid duplicate-state races, and keep interaction smooth under weak connectivity.'
argument-hint: Which screen or feature should apply the fluid realtime workflow?
---

# Flujo Realtime Sin Loaders

## Objetivo
Aplicar una metodologia reutilizable y escalable para que la app se sienta fluida:
- sin pantallas de carga bloqueantes
- sin parpadeos entre vistas
- con sincronizacion silenciosa en segundo plano
- con reglas de negocio validadas en UI y servicio

## Usar Cuando
- Creas o refactorizas pantallas con listas y CRUD.
- Hay riesgo de duplicados por realtime + setState manual.
- Quieres UX continua con datos cacheados mientras sincroniza.
- Debes implementar reglas fuertes (ej: sumas maximas, tipos unicos, limites).

## Metodologia Paso a Paso
1. Definir la fuente de verdad:
   - Realtime es la fuente final de colecciones.
   - Evita mutar manualmente la lista despues de create/update/delete cuando realtime ya alimenta la UI.

2. Carga inicial sin bloqueo largo:
   - Cargar cache local primero (AsyncStorage).
   - Renderizar contenido de inmediato con datos disponibles.
   - Disparar carga de red en background para refrescar.

3. Sin loaders fullscreen:
   - No bloquear la pantalla completa durante sincronizaciones normales.
   - Mantener el contenido visible y actualizar por partes.

4. Sincronizacion de datos secundarios:
   - Cargar stats/lookups/relaciones en paralelo o por lotes.
   - Si un secundario falla, no tumbar la vista principal.
   - Mostrar fallback por seccion (ej: contadores en 0 o texto simple), no bloqueo global.

5. Reglas de negocio en doble capa:
   - UI: feedback temprano y mensajes claros.
   - Service layer: validacion obligatoria antes de persistir.
   - Nunca depender solo de la validacion visual.

6. Cambios pequenos y seguros:
   - Editar minimo necesario por archivo.
   - Mantener APIs publicas salvo necesidad real.
   - Evitar refactors masivos no solicitados.

7. Verificacion tecnica:
   - Compilar TypeScript: npx tsc --noEmit.
   - Confirmar que no hay imports huerfanos ni componentes muertos.
   - Probar flujo CRUD basico y transiciones de pantallas.

## Decision Points
- Si hay duplicados visuales tras crear/eliminar:
  - Revisar si existe setState manual ademas de realtime.
  - Resolver dejando realtime como unica via de actualizacion de listas.

- Si hay parpadeo al navegar:
  - Revisar gates globales de render (loading/pageReady) que oculten todo.
  - Reemplazar por render inmediato + actualizacion parcial.

- Si la primera carga se siente lenta:
  - Implementar/ajustar cache-first por pantalla.
  - Guardar en cache solo datos utiles para primer paint.

- Si reglas complejas fallan en produccion:
  - Mover/duplicar reglas criticas al servicio.
  - Incluir mensajes accionables (disponible, limite, conflicto).

## Criterios de Calidad (Done)
- No hay loader fullscreen en flujos normales de uso.
- No hay errores de key duplicada por carreras de estado.
- CRUD se refleja correctamente via realtime.
- La UI sigue usable si fallan datos secundarios.
- Reglas de negocio criticas se validan en service layer.
- Compilacion TypeScript limpia.

## Checklist Rapido
- [ ] Realtime configurado para la coleccion correcta.
- [ ] Sin setState manual redundante en handlers CRUD.
- [ ] Cache-first implementado para la pantalla.
- [ ] Sin bloqueo global por loading/pageReady.
- [ ] Validaciones de negocio en UI y servicio.
- [ ] npx tsc --noEmit sin errores.

## Prompts de Ejemplo
- "Aplica flujo-realtime-sin-loaders en la pantalla de asistencias."
- "Refactoriza esta vista para cache-first + realtime sin loaders fullscreen."
- "Implementa CRUD de evaluaciones siguiendo la skill flujo-realtime-sin-loaders."
- "Revisa esta pantalla por flicker y duplicados usando la metodologia de la skill."
