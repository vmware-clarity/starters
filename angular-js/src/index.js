import './index.css';
import angular from 'angular';
import '@cds/core/alert/register.js';
import '@cds/core/button/register.js';

angular.module('app', []);
angular.element(document).ready(() => angular.bootstrap(document, ['app']));

angular.module('app').component('appRoot', {
  template: `
  <main cds-layout="vertical gap:md p:lg">
    <h1 cds-text="heading">Clarity + AngularJS Starter</h1>

    <div cds-layout="horizontal gap:sm">
      <a cds-text="link" href="https://clarity.design/storybook/core">Clarity Docs</a>
      <a cds-text="link" href="https://angularjs.org/">AngularJS Docs</a>
    </div>

    <cds-button action="outline" ng-click="$ctrl.showAlert = true">hello there</cds-button>

    <cds-alert-group ng-if="$ctrl.showAlert" ng-prop-status="$ctrl.status">
      <cds-alert ng-on-close_change="$ctrl.showAlert = false" closable>
        you are a bold one...
      </cds-alert>
    </cds-alert-group>
  </main>
  `,
  controller: function () {
    this.status = 'info';
    this.showAlert = false;
  },
});
