<script>
  import { getIconUrl, FALLBACK_ICON } from './data.svelte.js';

  let { iconName = null, size = 24, cssClass = '' } = $props();

  function handleError(e) {
    e.target.onerror = null;
    e.target.src = FALLBACK_ICON;
  }
</script>

<img
  src={getIconUrl(iconName)}
  width={size}
  height={size}
  alt=""
  onerror={handleError}
  class="object-cover {cssClass}"
/>
