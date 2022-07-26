import { Component } from '@angular/core';
import '@cds/core/checkbox/register.js';
import '@cds/core/dropdown/register.js';
import '@cds/core/button-action/register.js';

@Component({
  selector: 'custom-column-picker',
  template: `
    <cds-button-action
      id="column-visibility-button"
      popup="column-visibility"
      aria-label="filter column"
      shape="view-columns"
      (click)="columnSelectorClick($event)"
    >
    </cds-button-action>
    <cds-dropdown
      closable
      orientation="top"
      id="column-visibility"
      [hidden]="!popupAnchor"
      (anchor)="(popupAnchor)"
      (closeChange)="popupClose()"
    >
      <div cds-layout="p:sm" style="min-width: 150px">
        <ng-content></ng-content>
      </div>
    </cds-dropdown>
  `,
})
export class CoreColumnPickerComponent {
  popupAnchor: HTMLElement | null = null;

  columnSelectorClick(e: any) {
    this.popupAnchor = e.target;
  }

  popupClose() {
    this.popupAnchor = null;
  }
}
