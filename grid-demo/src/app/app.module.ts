import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ClarityModule } from '@clr/angular';
import { loadCoreIconSet, loadEssentialIconSet } from '@cds/core/icon';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { CustomClrAdvancedSelectionDirective } from './angular/advanced-row-selection/custom-clr-advanced-selection.directive';

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

const directives = [CustomClrAdvancedSelectionDirective];

@NgModule({
  declarations: [...components, ...directives],
  imports: [AppRoutingModule, BrowserModule, ClarityModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
