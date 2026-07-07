# Bellwright Crafting Calculator

An unofficial, crafting calculator for [Bellwright](https://store.steampowered.com/app/1812450/Bellwright/). Plan what to craft and build, queue multiple items, and see aggregated material requirements in one place.

**Not an official Bellwright tool.**

## Features

- **Craft queue** — search and add craftable items (576 recipes), adjust quantities, and see per-item inputs
- **Building queue** — search and add settlement buildings (222 buildings) with the same workflow
- **Material summary** — totals all required resources across both queues; check off materials as you gather them
- **Search with icons** — filter by name with inline item icons in the dropdown
- **Persistent state** — queues and checked materials are saved to `localStorage` and restored when you reopen the tab
- **Fully client-side** — no backend; game data is loaded as static JSON

## Tech stack

- [Svelte 5](https://svelte.dev/) + [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- Static JSON data in `public/data/`

## Getting started

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### Build for production

```bash
npm run build
npm run preview
```

The output is in `dist/`.

## Game data

Crafting and building requirements come from processed Bellwright export data:

| File | Contents |
|------|----------|
| `recipes.json` | 576 craft recipes (inputs, outputs, stations) |
| `buildings.json` | 222 settlement buildings and their build costs |
| `recipes-by-output.json` | Index for recipes that share the same output item |
| `meta.json` | Extraction timestamp and file counts |

Material totals use **direct inputs only** — craftable sub-components are not broken down into raw materials.

## Icons

Item icons use texture names from the game data (`T_Rope_D1`, etc.); missing icons fall back to `public/icons/fallback.svg`.

## License

Unofficial fan tool. Bellwright and related assets are property of their respective owners.
