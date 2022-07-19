import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CdsModule } from '@cds/angular';
import { ClarityModule } from '@clr/angular';
import { loadCoreIconSet, loadEssentialIconSet } from '@cds/core/icon';
import { AngularAdvancedRowSelectionComponent } from './angular/advanced-row-selection/advanced-row-selection.component';
import { AngularColumnDomPerformanceComponent } from './angular/column-dom-performance/column-dom-performance.component';
import { AngularColumnOrderingComponent } from './angular/column-ordering/column-ordering.component';
import { AngularLazyLoadingRowsComponent } from './angular/lazy-loading-rows/lazy-loading-rows.component';
import { AngularRowDomPerformanceComponent } from './angular/row-dom-performance/row-dom-performance.component';
import { CoreAdvancedRowSelectionComponent } from './core/advanced-row-selection/advanced-row-selection.component';
import { CoreColumnDomPerformanceComponent } from './core/column-dom-performance/column-dom-performance.component';
import { CoreColumnOrderingComponent } from './core/column-ordering/column-ordering.component';
import { CoreLazyLoadingRowsComponent } from './core/lazy-loading-rows/lazy-loading-rows.component';
import { CoreRowDomPerformanceComponent } from './core/row-dom-performance/row-dom-performance.component';
import { HttpClientModule } from '@angular/common/http';

loadCoreIconSet();
loadEssentialIconSet();

const components = [
  AppComponent,
  AngularAdvancedRowSelectionComponent,
  AngularColumnDomPerformanceComponent,
  AngularColumnOrderingComponent,
  AngularLazyLoadingRowsComponent,
  AngularRowDomPerformanceComponent,
  CoreAdvancedRowSelectionComponent,
  CoreColumnDomPerformanceComponent,
  CoreColumnOrderingComponent,
  CoreLazyLoadingRowsComponent,
  CoreRowDomPerformanceComponent,
];

@NgModule({
  declarations: [...components],
  imports: [AppRoutingModule, BrowserModule, HttpClientModule, ClarityModule, CdsModule],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
