<script>
  import GithubIcon from '@iconify-svelte/mdi/github';

  let { extractedDate = null, githubUrl = 'https://github.com/FredMT/BellwrightCalculator' } = $props();
</script>

<footer class="panel-parchment iron-border border-t-0 px-6 flex flex-col items-center gap-6 shrink-0 mt-auto py-3">
  <div class="flex flex-wrap items-center justify-center gap-4 text-on-parchment-muted text-[13px] font-semibold tracking-wide uppercase w-full">
    <span class="text-on-parchment font-bold normal-case">Not an official Bellwright tool</span>
    <span class="opacity-30" aria-hidden="true">|</span>
    {#if extractedDate}
      <span>Data extracted: {extractedDate}</span>
      <span class="opacity-30" aria-hidden="true">|</span>
    {/if}
    <a
      href={githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      class="flex items-center gap-1 hover:text-primary transition-colors"
    >
      <GithubIcon height="1em" aria-hidden="true" />
      <span>GitHub</span>
    </a>
  </div>
</footer>
