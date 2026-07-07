<script>
  import ItemIcon from './ItemIcon.svelte';
  import { incrementQty, decrementQty } from './queue.svelte.js';

  let { item, onremove = () => {} } = $props();
</script>

<li class="bg-[rgba(255,255,255,0.4)] iron-border-inset p-2 flex items-center justify-between gap-2">
  <div class="flex items-center gap-3 flex-1 min-w-0">
    <div class="w-12 h-12 slot-well iron-border flex items-center justify-center shrink-0">
      <ItemIcon iconName={item.icon} size={40} cssClass="w-10 h-10" />
    </div>
    <div class="flex flex-col min-w-0">
      <span class="font-[var(--font-family-headline)] font-semibold text-on-parchment text-lg leading-tight truncate">
        {item.name}
      </span>
      {#if item.inputs.length > 0}
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 opacity-70 text-[13px] font-semibold tracking-wide text-on-parchment-muted">
          {#each item.inputs as inp (inp.itemId)}
            <div class="flex items-center gap-1 shrink-0">
              <ItemIcon iconName={inp.itemIcon} size={16} cssClass="w-4 h-4" />
              <span>{inp.quantity}x {inp.itemName}</span>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <div class="flex items-center gap-2 bg-parchment-accent iron-border-inset p-1 rounded-sm shrink-0">
    <button
      class="w-6 h-6 flex items-center justify-center hover:bg-[#c49d8c] text-on-parchment cursor-pointer"
      onclick={() => decrementQty(item)}
    >
      <span class="material-symbols-outlined text-sm">remove</span>
    </button>
    <span class="text-on-parchment w-8 text-center font-bold">{item.quantity}</span>
    <button
      class="w-6 h-6 flex items-center justify-center hover:bg-[#c49d8c] text-on-parchment cursor-pointer"
      onclick={() => incrementQty(item)}
    >
      <span class="material-symbols-outlined text-sm">add</span>
    </button>
  </div>

  <button
    class="text-error hover:text-error-container p-1 cursor-pointer shrink-0"
    onclick={() => onremove(item.uid)}
  >
    <span class="material-symbols-outlined">delete</span>
  </button>
</li>
