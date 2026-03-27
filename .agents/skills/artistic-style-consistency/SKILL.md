---
name: artistic-style-consistency
description: 'Preserve and apply consistent artistic UI style across React Native/Expo components. Use when recreating a reference design, extending existing screens, or preventing visual drift in new components (colors, borders, spacing, decorations, and motifs).'
argument-hint: Which screen or component should be styled consistently?
---

# Artistic Style Consistency

## Goal
Maintain the same artistic visual language across the app so new or edited components match existing style references.

## Use When
- You need to recreate a visual style from an image/mockup in a new screen.
- You are editing a screen and must avoid visual drift from the current design language.
- You want Auth, Home, and future components to feel like one coherent art direction.

## Artistic Direction (Current Project)
- Theme: notebook/kraft handmade aesthetic.
- Background tone: warm kraft brown.
- Surfaces: light paper cream with rounded corners.
- Structure: visible black outlines with offset shadow blocks.
- Texture: subtle paper grid lines inside notebook-like panels.
- Decor: sparse cat/plant motifs only where they support composition.

## Procedure
1. Identify style anchors from existing screens.
2. Extract reusable tokens before coding:
   - colors (background, paper, accents)
   - border thickness and radius
   - grid density and opacity
   - spacing rhythm and button/input proportions
3. Build or reuse a frame primitive first:
   - notebook panel container
   - grid background layer
   - border + shadow treatment
4. Apply the same primitives to the target component.
5. Add decorative elements only if composition needs balance.
6. Run a consistency pass comparing old vs new screen.
7. Validate TypeScript/errors after edits.

## Decision Rules
- If a decorative element competes with readability, remove it.
- If top bars/stickers feel disconnected from the main panel, simplify.
- If two screens diverge in border/radius/spacing, align to the established tokens.
- If style consistency conflicts with usability, prioritize usability.

## Quality Checklist
- The screen reads as the same art style as Auth/Home.
- Outline, radius, shadow offset, and grid treatment are consistent.
- Inputs and buttons follow the same visual hierarchy.
- Decorations do not overlap critical content.
- No TypeScript/runtime regressions introduced.

## Output Expectations
When using this skill, provide:
- A short style delta summary (what changed and why).
- Exact files updated.
- Any style tokens introduced or standardized.
- Validation status (errors/lint/tests if available).

## Example Prompts
- "Apply notebook kawaii style to the grades detail screen with the same visual system as Auth."
- "Refactor this component to match our paper-grid style without changing behavior."
- "Normalize border radius, outline, and accent colors in Home and Settings to avoid drift."
