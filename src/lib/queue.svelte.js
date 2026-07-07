const STORAGE_KEY = 'bellwright-calc-state';

let nextId = 1;
let persistenceReady = $state(false);

export let craftQueue = $state([]);
export let buildQueue = $state([]);
let checkedMaterials = $state(new Set());

function buildQueueItem(entry, uid, quantity) {
  return {
    uid,
    entryId: entry.id,
    name: entry.output ? entry.output.itemName : entry.name,
    icon: entry.output ? entry.output.itemIcon : entry.icon,
    inputs: entry.inputs || [],
    outputQty: entry.output ? entry.output.quantity || 1 : 1,
    stationName: entry.stationName || entry.category || '',
    quantity,
  };
}

function saveState() {
  if (!persistenceReady) return;

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        nextId,
        craftQueue: craftQueue.map(({ uid, entryId, quantity }) => ({ uid, entryId, quantity })),
        buildQueue: buildQueue.map(({ uid, entryId, quantity }) => ({ uid, entryId, quantity })),
        checkedMaterials: [...checkedMaterials],
      }),
    );
  } catch (e) {
    console.warn('Failed to save calculator state:', e);
  }
}

export function restoreQueues(getRecipeById, getBuildingById) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);

      if (typeof data.nextId === 'number') {
        nextId = data.nextId;
      }

      const restoredCraft = (data.craftQueue || [])
        .map(({ uid, entryId, quantity }) => {
          const recipe = getRecipeById(entryId);
          if (!recipe) return null;
          return buildQueueItem(recipe, uid, quantity);
        })
        .filter(Boolean);

      const restoredBuild = (data.buildQueue || [])
        .map(({ uid, entryId, quantity }) => {
          const building = getBuildingById(entryId);
          if (!building) return null;
          return buildQueueItem(building, uid, quantity);
        })
        .filter(Boolean);

      craftQueue.splice(0, craftQueue.length, ...restoredCraft);
      buildQueue.splice(0, buildQueue.length, ...restoredBuild);

      checkedMaterials = new Set(data.checkedMaterials || []);
    }
  } catch (e) {
    console.warn('Failed to restore calculator state:', e);
  }

  persistenceReady = true;
}

export function addToQueue(queue, entry) {
  const existing = queue.find((q) => q.entryId === entry.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    queue.push(buildQueueItem(entry, nextId++, 1));
  }
  saveState();
}

export function removeFromQueue(queue, uid) {
  const idx = queue.findIndex((q) => q.uid === uid);
  if (idx !== -1) queue.splice(idx, 1);
  saveState();
}

export function incrementQty(item) {
  item.quantity += 1;
  saveState();
}

export function decrementQty(item) {
  if (item.quantity > 1) item.quantity -= 1;
  saveState();
}

export function isMaterialChecked(itemId) {
  return checkedMaterials.has(itemId);
}

export function toggleMaterialChecked(itemId) {
  const next = new Set(checkedMaterials);
  if (next.has(itemId)) {
    next.delete(itemId);
  } else {
    next.add(itemId);
  }
  checkedMaterials = next;
  saveState();
}

export function aggregateMaterials(craftQ, buildQ) {
  const map = new Map();

  function addInputs(inputs, multiplier) {
    for (const inp of inputs) {
      const total = Math.ceil(inp.quantity * multiplier);
      const existing = map.get(inp.itemId);
      if (existing) {
        existing.totalQty += total;
      } else {
        map.set(inp.itemId, {
          itemId: inp.itemId,
          itemName: inp.itemName,
          itemIcon: inp.itemIcon,
          totalQty: total,
        });
      }
    }
  }

  for (const item of craftQ) {
    const multiplier = item.quantity / item.outputQty;
    addInputs(item.inputs, multiplier);
  }

  for (const item of buildQ) {
    addInputs(item.inputs, item.quantity);
  }

  return [...map.values()].sort((a, b) => a.itemName.localeCompare(b.itemName));
}
