<template>
  <main cds-layout="vertical gap:md p:lg">
    <h1 cds-text="heading">Clarity + Vue</h1>

    <cds-alert status="danger">
      Currently this demo must use refs to listen to the <code cds-text="code">closeChange</code> event due to Vue 3 not supporting native HTML events which are case sensitive. <a cds-text="link" href="https://custom-elements-everywhere.com">Compatibility Issues</a>
    </cds-alert>

    <div cds-layout="horizontal gap:sm">
      <a cds-text="link" href="https://clarity.design/storybook/core">Clarity Docs</a>
      <a cds-text="link" href="https://v3.vuejs.org/">Vue</a>
    </div>

    <cds-button action="outline" @click="showAlert = !showAlert">Hello There</cds-button>

    <cds-alert-group status="info" :hidden="!showAlert" @closeChange="showAlert = false">
      <cds-alert ref="alert" closable>
        you are a bold one...
      </cds-alert>
    </cds-alert-group>
  </main>
</template>

<script>
import '@cds/core/alert/register.js';
import '@cds/core/button/register.js';

export default {
  name: 'App',
  data: () => ({
    showAlert: false
  }),
  mounted: function() {
    // ref is needed due to Vue not supporting standard Custom Events which are case sensitive
    // https://github.com/vuejs/vue-next/issues/2460
    this.$refs.alert.addEventListener('closeChange', () => this.showAlert = false);
  },
  methods: {
    closeAlert() {
      this.showAlert = false;
    }
  }
}
</script>

<style>
  @import 'modern-normalize/modern-normalize.css';
  @import '@cds/core/global.min.css';
  @import '@cds/core/styles/theme.dark.min.css';
  @import '@cds/city/css/bundles/default.min.css';
</style>
