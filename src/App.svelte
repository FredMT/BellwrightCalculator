<script>
  import { onMount } from 'svelte';
  import {
    loadData,
    isLoaded,
    getError,
    getDataExtractedDate,
    getRecipeSearchItems,
    getBuildingSearchItems,
    getRecipeById,
    getBuildingById,
  } from './lib/data.svelte.js';
  import {
    craftQueue,
    buildQueue,
    addToQueue,
    removeFromQueue,
    aggregateMaterials,
    restoreQueues,
  } from './lib/queue.svelte.js';
  import SearchInput from './lib/SearchInput.svelte';
  import QueueItem from './lib/QueueItem.svelte';
  import MaterialRow from './lib/MaterialRow.svelte';
  import Footer from './lib/Footer.svelte';
  import SwordCrossIcon from '@iconify-svelte/mdi/sword-cross';
  import OfficeBuildingIcon from '@iconify-svelte/mdi/office-building';
  import ClipboardListIcon from '@iconify-svelte/mdi/clipboard-list';

  let recipeItems = $derived(getRecipeSearchItems());
  let buildingItems = $derived(getBuildingSearchItems());
  let materials = $derived(aggregateMaterials(craftQueue, buildQueue));
  let extractedDate = $derived(getDataExtractedDate());

  function handleAddRecipe(id) {
    const recipe = getRecipeById(id);
    if (recipe) {
      addToQueue(craftQueue, recipe);
    }
  }

  function handleAddBuilding(id) {
    const building = getBuildingById(id);
    if (building) {
      addToQueue(buildQueue, building);
    }
  }

  function handleRemoveCraft(uid) {
    removeFromQueue(craftQueue, uid);
  }

  function handleRemoveBuild(uid) {
    removeFromQueue(buildQueue, uid);
  }

  onMount(async () => {
    await loadData();
    restoreQueues(getRecipeById, getBuildingById);
  });
</script>

<div class="h-full min-h-0 flex flex-col">
  <header class="bg-surface border-b-2 border-outline-variant shadow-sm flex justify-between items-center px-6 w-full h-16 shrink-0 z-50">
    <div class="items-center gap-4">
      <h1 class="font-[var(--font-family-headline)] text-[32px] leading-[40px] font-bold text-primary uppercase tracking-wider">Bellwright Calculator</h1>
    </div>
  </header>

  <div class="flex-1 min-h-0 flex flex-col overflow-hidden">
    {#if getError()}
      <div class="flex-1 min-h-0 overflow-y-auto p-8 text-center text-error">
        Failed to load data: {getError()}
      </div>
    {:else if !isLoaded()}
      <div class="flex-1 min-h-0 flex items-center justify-center text-on-surface-variant text-lg">
        Loading data...
      </div>
    {:else}
      <main class="flex-1 min-h-0 flex flex-col md:flex-row p-6 gap-6 overflow-hidden">
        <!-- Left Column: Queue -->
        <section class="flex-1 min-h-0 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          <!-- Items to Craft -->
          <div class="panel-parchment iron-border rounded-sm p-5 flex flex-col gap-4">
            <div class="flex items-center justify-between border-b border-parchment-dark pb-2">
              <h3 class="font-[var(--font-family-headline)] text-[24px] leading-[32px] font-semibold text-on-parchment">Items to Craft</h3>
              <span class="text-on-parchment-muted"><SwordCrossIcon height="1em" aria-hidden="true" /></span>
            </div>
            <div class="flex gap-2">
              <SearchInput
                items={recipeItems}
                onadd={handleAddRecipe}
                placeholder="Search items (e.g., Copper Nails)"
              />
            </div>
            {#if craftQueue.length > 0}
              <ul class="flex flex-col gap-3 mt-2">
                {#each craftQueue as item (item.uid)}
                  <QueueItem {item} onremove={handleRemoveCraft} />
                {/each}
              </ul>
            {:else}
              <p class="text-on-parchment-muted text-sm text-center py-3 opacity-70">
                Search and add items to calculate materials.
              </p>
            {/if}
          </div>

          <!-- Buildings to Process -->
          <div class="panel-parchment iron-border rounded-sm p-5 flex flex-col gap-4">
            <div class="flex items-center justify-between border-b border-parchment-dark pb-2">
              <h3 class="font-[var(--font-family-headline)] text-[24px] leading-[32px] font-semibold text-on-parchment">Buildings to Process</h3>
              <span class="text-on-parchment-muted"><OfficeBuildingIcon height="1em" aria-hidden="true" /></span>
            </div>
            <div class="flex gap-2">
              <SearchInput
                items={buildingItems}
                onadd={handleAddBuilding}
                placeholder="Add buildings (e.g., Smelter)"
              />
            </div>
            {#if buildQueue.length > 0}
              <ul class="flex flex-col gap-3 mt-2">
                {#each buildQueue as item (item.uid)}
                  <QueueItem {item} onremove={handleRemoveBuild} />
                {/each}
              </ul>
            {:else}
              <p class="text-on-parchment-muted text-sm text-center py-3 opacity-70">
                Search and add buildings to calculate materials.
              </p>
            {/if}
          </div>
        </section>

        <!-- Right Column: Material Summary -->
        <aside class="w-full md:w-80 lg:w-96 shrink-0 flex flex-col min-h-0">
          <div class="bg-surface-container-high iron-border rounded-sm flex flex-col flex-1 min-h-0 overflow-hidden">
            <div class="bg-surface-container-highest p-4 border-b-2 border-outline-variant flex items-center justify-between shrink-0">
              <h2 class="font-[var(--font-family-headline)] text-[24px] leading-[32px] font-semibold text-primary">Required Materials</h2>
              <span class="text-tertiary"><ClipboardListIcon height="1em" aria-hidden="true" /></span>
            </div>
            <div class="flex-1 min-h-0 overflow-y-auto p-4 custom-scrollbar bg-surface-dim">
              {#if materials.length > 0}
                <ul class="flex flex-col gap-3">
                  {#each materials as mat (mat.itemId)}
                    <MaterialRow material={mat} />
                  {/each}
                </ul>
              {:else}
                <p class="text-on-surface-variant text-sm text-center py-8">
                  Add items or buildings to see aggregated materials.
                </p>
              {/if}
            </div>
          </div>
        </aside>
      </main>
    {/if}
  </div>

  <Footer extractedDate={extractedDate} />
</div>
