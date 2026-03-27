---
name: nativewind-expo
description: 'NativeWind + Tailwind CSS en proyectos Expo (React Native y Web). Usar cuando: configurar NativeWind v4 desde cero, convertir style={{}} a className, agregar dark mode por sistema, clases responsivas para Android y Web, errores de babel-preset-expo o metro config, patrones de componentes con variantes dark:.'
argument-hint: 'Describe qué quieres hacer: setup inicial, dark mode, componente nuevo, error de build...'
---

# NativeWind en Expo (Android + Web)

## Cuándo usar esta skill
- Configurar NativeWind v4 en un proyecto Expo nuevo o existente
- Convertir `style={{}}` inline a `className` de Tailwind
- Implementar dark mode automático según el sistema (Android + Web/PC)
- Crear componentes con estilos responsivos para ambas plataformas
- Diagnosticar errores de build relacionados con Babel, Metro o Tailwind

---

## Setup inicial de NativeWind v4

### 1. Instalar dependencias
```bash
npm install nativewind
npm install --save-dev tailwindcss babel-preset-expo
```

### 2. Crear `babel.config.js`
```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

### 3. Crear `metro.config.js`
```js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);
module.exports = withNativeWind(config, { input: "./global.css" });
```

### 4. Crear `global.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 5. Crear `nativewind-env.d.ts`
```ts
/// <reference types="nativewind/types" />
```

### 6. Actualizar `tailwind.config.js`
```js
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "media",
  theme: { extend: {} },
  plugins: [],
};
```

### 7. Importar el CSS en `App.tsx`
```tsx
import './global.css';
```

### 8. Reiniciar con cache limpio
```bash
npx expo start -c
```

---

## Dark Mode automático por sistema

`darkMode: "media"` hace que NativeWind use `useColorScheme()` de React Native internamente:
- **Android**: lee Configuración → Pantalla → Tema oscuro
- **Web/PC**: lee `prefers-color-scheme` del sistema operativo

No se necesita código extra. Solo agregar variantes `dark:` en los `className`.

### Paleta del Proyecto (OBLIGATORIO)

**IMPORTANTE**: Esta paleta viene de la skill `artistic-style-consistency`. NO usar grises genéricos de Tailwind. El proyecto usa estilo notebook/kraft handmade.

| Elemento | Claro (kraft) | Oscuro |
|---|---|---|
| Fondo de página | kraft brown (warm) | dark brown adaptado |
| Superficie / card | paper cream con rounded corners | dark cream adaptado |
| Bordes | black outlines visibles | dark borders |
| Sombras | offset shadow blocks | offset shadow blocks |
| Textura | grid paper lines (sutil) | grid paper lines (sutil) |
| Texto principal | Según contexto del proyecto | `dark:text-white` |
| Decoración | Cat/plant motifs (sparse) | Cat/plant motifs (sparse) |

**Regla**: Los colores exactos se definen en `artistic-style-consistency`. Esta skill solo gestiona la estructura de NativeWind (className, dark mode, responsive). Los tokens de color se heredan del sistema de diseño del proyecto.

---

## Patrones responsivos Android vs Web

React Native con NativeWind no tiene breakpoints `sm:` / `md:` porque no es CSS real. Usar `Platform.OS` para lógica de layout diferente.

```tsx
import { Platform } from 'react-native';

// Clases base: optimizadas para móvil (touch-first)
// Complementar con Platform.OS para densidad de datos en web
const containerClass = Platform.OS === 'web'
  ? 'max-w-2xl mx-auto px-8'   // web: más ancho, más padding
  : 'px-4';                     // android: pantalla completa
```

### Reglas de diseño por plataforma

| | Android | Web |
|---|---|---|
| Touch targets | Mínimo `py-4 px-6` | `py-2 px-4` |
| Tipografía | `text-base` (16px) | `text-sm` a `text-base` |
| Layout | Full width | `max-w-sm` a `max-w-2xl` centrado |
| Navegación | Botones grandes abajo | Menú lateral o top bar |

---

## Errores comunes y solución

### `Cannot find module 'babel-preset-expo'`
```bash
npm install babel-preset-expo --save-dev
```

### `className` no aplica estilos
- Verificar que `global.css` está importado en `App.tsx`
- Verificar que `metro.config.js` tiene `withNativeWind`
- Reiniciar con `npx expo start -c`

### Clases `dark:` no funcionan
- Verificar `darkMode: "media"` en `tailwind.config.js`
- El preset `nativewind/preset` debe estar en `presets`, no en `plugins`

### `TextInput` no muestra color de texto en Android
- NativeWind no puede inferir el color de placeholder automáticamente
- Siempre pasar `placeholderTextColor` como prop explícito:
```tsx
<TextInput
  className="text-gray-800 dark:text-white"
  placeholderTextColor="#9ca3af"
/>
```

---

## Checklist al crear un componente nuevo

- [ ] **Primero**: buscar en `components/` si ya existe algo reusable (ver `reusable-component-first`)
- [ ] Estilo visual alineado con `artistic-style-consistency` (NO colores grises genéricos)
- [ ] Fondo con variante `dark:`
- [ ] Todos los textos con variante `dark:`
- [ ] Bordes con variante `dark:`
- [ ] `placeholderTextColor` explícito en `TextInput`
- [ ] Touch targets de al menos `py-3` en móvil
- [ ] `max-w-sm` o similar para limitar ancho en web
