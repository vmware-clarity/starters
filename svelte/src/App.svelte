<script lang="ts">
  import '@cds/core/button/register.js';
  import '@cds/core/alert/register.js';

  let status = 'success';
  let show = false;

  function setShow(value) {
    show = value;
  }
</script>

<main cds-layout="vertical gap:lg p:lg">
  <h1 cds-text="heading">Clarity + Svelte Starter</h1>

  <div cds-layout="horizontal gap:sm">
    <a cds-text="link" href="https://clarity.design/storybook/core">Clarity Docs</a>
    <a cds-text="link" href="https://svelte.dev/">Svelte Docs</a>
  </div>

  <cds-button action="outline" on:click={() => setShow(!show)}>
    Hello There
  </cds-button>

  <cds-alert-group hidden={!show} status={status}>
    <cds-alert on:closeChange={() => setShow(!show)} closable>
      General Kenobi, you are a bold one...
    </cds-alert>
  </cds-alert-group>
</main>

<style>
  @import 'modern-normalize/modern-normalize.css';
  @import '@cds/core/global.min.css';
  @import '@cds/core/styles/theme.dark.min.css';
  @import '@cds/city/css/bundles/default.min.css';
</style>
