<script>
  import ItemIcon from './ItemIcon.svelte';

  /** @type {{ id: string, name: string, label?: string, icon: string|null }[]} */
  let { items = [], onadd = () => {}, placeholder = 'Search items...' } = $props();

  let query = $state('');
  let open = $state(false);
  let highlightIndex = $state(-1);
  let inputEl = $state(null);
  let dropdownStyle = $state('');

  let filtered = $derived.by(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return items.filter((item) => {
      const label = item.label ?? item.name;
      return label.toLowerCase().includes(q) || item.name.toLowerCase().includes(q);
    }).slice(0, 40);
  });
  const DROPDOWN_MAX_HEIGHT = 208;

  function updateDropdownPosition() {
    if (!inputEl || !open || filtered.length === 0) {
      dropdownStyle = '';
      return;
    }

    const rect = inputEl.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    if (spaceBelow < DROPDOWN_MAX_HEIGHT && spaceAbove > spaceBelow) {
      dropdownStyle = `position:fixed;left:${rect.left}px;width:${rect.width}px;bottom:${window.innerHeight - rect.top + 2}px;max-height:${Math.min(DROPDOWN_MAX_HEIGHT, spaceAbove - 8)}px;`;
    } else {
      dropdownStyle = `position:fixed;left:${rect.left}px;width:${rect.width}px;top:${rect.bottom + 2}px;max-height:${Math.min(DROPDOWN_MAX_HEIGHT, spaceBelow - 8)}px;`;
    }
  }

  $effect(() => {
    if (open && filtered.length > 0) {
      updateDropdownPosition();
      window.addEventListener('scroll', updateDropdownPosition, true);
      window.addEventListener('resize', updateDropdownPosition);
      return () => {
        window.removeEventListener('scroll', updateDropdownPosition, true);
        window.removeEventListener('resize', updateDropdownPosition);
      };
    }
    dropdownStyle = '';
  });

  function select(id) {
    query = '';
    open = false;
    highlightIndex = -1;
    onadd(id);
  }

  function handleKeydown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open && query) open = true;
      highlightIndex = Math.min(highlightIndex + 1, filtered.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      highlightIndex = Math.max(highlightIndex - 1, 0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightIndex >= 0 && filtered[highlightIndex]) {
        select(filtered[highlightIndex].id);
      }
    } else if (e.key === 'Escape') {
      open = false;
    }
  }

  function handleInput() {
    open = query.trim().length > 0;
    highlightIndex = -1;
  }

  function handleFocus() {
    if (query.trim().length > 0) open = true;
  }

  function handleBlur() {
    setTimeout(() => { open = false; }, 150);
  }
</script>

<div class="relative flex-1">
  <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-parchment-muted pointer-events-none">search</span>
  <input
    bind:this={inputEl}
    bind:value={query}
    oninput={handleInput}
    onfocus={handleFocus}
    onblur={handleBlur}
    onkeydown={handleKeydown}
    {placeholder}
    type="text"
    autocomplete="off"
    class="w-full input-parchment iron-border-inset rounded-sm py-2 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-on-parchment font-[var(--font-family-body)] text-on-parchment"
  />
</div>

{#if open && filtered.length > 0 && dropdownStyle}
  <ul
    style={dropdownStyle}
    class="z-50 overflow-y-auto bg-parchment iron-border rounded-sm shadow-lg custom-scrollbar"
  >
    {#each filtered as item, i (item.id)}
      <li>
        <button
          type="button"
          class="w-full text-left px-3 py-1.5 text-sm cursor-pointer text-on-parchment hover:bg-parchment-dark/20 transition-colors flex items-center gap-2 {i === highlightIndex ? 'bg-parchment-dark/20 font-semibold' : ''}"
          onmousedown={() => select(item.id)}
        >
          <ItemIcon iconName={item.icon} size={20} cssClass="w-5 h-5 shrink-0" />
          <span class="truncate">{item.label ?? item.name}</span>
        </button>
      </li>
    {/each}  </ul>
{/if}
