const FALLBACK_ICON = "/icons/fallback.svg";

let recipes = $state([]);
let buildings = $state([]);
let recipesByOutput = $state({});

let recipeById = $state({});
let recipesByOutputName = $state({});
let buildingsByName = $state({});
let loaded = $state(false);
let error = $state(null);
let dataExtractedDate = $state(null);

function buildMaps() {
  const _recipeById = {};
  const _recipesByOutputName = {};

  for (const r of recipes) {
    _recipeById[r.id] = r;
    const name = r.output.itemName;
    if (!_recipesByOutputName[name]) _recipesByOutputName[name] = [];
    _recipesByOutputName[name].push(r);
  }

  const _buildingsByName = {};
  for (const b of buildings) {
    _buildingsByName[b.name] = b;
  }

  recipeById = _recipeById;
  recipesByOutputName = _recipesByOutputName;
  buildingsByName = _buildingsByName;
}

export async function loadData() {
  try {
    const [recipesRes, buildingsRes, byOutputRes, metaRes] = await Promise.all([
      fetch("/data/recipes.json"),
      fetch("/data/buildings.json"),
      fetch("/data/recipes-by-output.json"),
      fetch("/data/meta.json"),
    ]);
    recipes = await recipesRes.json();
    buildings = await buildingsRes.json();
    recipesByOutput = await byOutputRes.json();
    const meta = await metaRes.json();
    if (meta?.generatedAt) {
      dataExtractedDate = new Date(meta.generatedAt).toLocaleDateString();
    }
    buildMaps();
    loaded = true;
  } catch (e) {
    error = e.message;
    console.error("Failed to load data:", e);
  }
}

export function getRecipeNames() {
  return Object.keys(recipesByOutputName).sort((a, b) => a.localeCompare(b));
}

export function getBuildingNames() {
  return buildings.map((b) => b.name).sort((a, b) => a.localeCompare(b));
}

export function getRecipeVariants(name) {
  return recipesByOutputName[name] || [];
}

export function getRecipeById(id) {
  return recipeById[id] || null;
}

export function getBuildingByName(name) {
  return buildingsByName[name] || null;
}

export function getBuildingById(id) {
  return buildings.find((b) => b.id === id) || null;
}

export function getRecipeSearchItems() {
  return getRecipeNames().map((name) => {
    const variants = getRecipeVariants(name);
    const recipe = variants[0];
    return {
      id: recipe.id,
      name,
      label: name,
      icon: recipe?.output?.itemIcon ?? null,
    };
  });
}

export function getBuildingSearchItems() {
  const nameCounts = new Map();
  for (const b of buildings) {
    nameCounts.set(b.name, (nameCounts.get(b.name) || 0) + 1);
  }

  return buildings
    .map((b) => {
      const duplicate = (nameCounts.get(b.name) || 0) > 1;
      const suffix = b.id.replace(/^VM_/, '').replace(/([a-z])([A-Z])/g, '$1 $2');
      return {
        id: b.id,
        name: b.name,
        label: duplicate ? `${b.name} (${suffix})` : b.name,
        icon: b.icon ?? null,
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function isLoaded() {
  return loaded;
}

export function getError() {
  return error;
}

export function getDataExtractedDate() {
  return dataExtractedDate;
}

export function getIconUrl(iconName) {
  if (!iconName) return FALLBACK_ICON;
  return `/icons/${iconName}.webp`;
}

export { FALLBACK_ICON };
