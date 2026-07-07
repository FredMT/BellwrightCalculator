<script>
  import ItemIcon from './ItemIcon.svelte';
  import { isMaterialChecked, toggleMaterialChecked } from './queue.svelte.js';

  let { material } = $props();

  let checked = $derived(isMaterialChecked(material.itemId));
</script>
<li class="flex items-center justify-between bg-surface-container p-2 border border-outline-variant rounded-sm hover:bg-surface-container-high transition-colors group {checked ? 'opacity-40' : ''}">
  <div class="flex items-center gap-3">
    <div class="w-10 h-10 slot-well iron-border flex items-center justify-center shrink-0">
      <ItemIcon iconName={material.itemIcon} size={32} cssClass="w-8 h-8 opacity-80 group-hover:opacity-100 transition-opacity" />
    </div>
    <span class="text-lg text-on-surface">{material.itemName}</span>
  </div>
  <div class="flex items-center gap-4">
    <div class="font-[var(--font-family-headline)] text-[32px] leading-[40px] font-bold text-tertiary drop-shadow-md">
      {material.totalQty}
    </div>
    <button
      class="w-8 h-8 btn-iron iron-border rounded-sm flex items-center justify-center active:scale-95 cursor-pointer"
      onclick={() => toggleMaterialChecked(material.itemId)}
    >
      <span class="material-symbols-outlined text-sm">
        {checked ? 'check_box' : 'check_box_outline_blank'}
      </span>
    </button>
  </div>
</li>
