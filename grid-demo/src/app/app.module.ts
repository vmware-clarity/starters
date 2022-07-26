import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserModule } from '@angular/platform-browser';
import { ClarityModule } from '@clr/angular';
import { loadCoreIconSet, loadEssentialIconSet } from '@cds/core/icon';
import { CdsModule } from '@cds/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularAdvancedRowSelectionComponent } from './angular/advanced-row-selection/advanced-row-selection.component';
import { AngularColumnDomPerformanceComponent } from './angular/column-dom-performance/column-dom-performance.component';
import { AngularColumnOrderingComponent } from './angular/column-ordering/column-ordering.component';
import { AngularFinalDemoComponent } from './angular/final-demo/final-demo.component';
import { AngularLazyLoadingRowsComponent } from './angular/lazy-loading-rows/lazy-loading-rows.component';
import { AngularRowDomPerformanceComponent } from './angular/row-dom-performance/row-dom-performance.component';
import { AngularScreenReaderColumnsComponent } from './angular/screen-reader-columns/screen-reader-columns.component';
import { CoreAdvancedRowSelectionComponent } from './core/advanced-row-selection/advanced-row-selection.component';
import { CoreColumnDomPerformanceComponent } from './core/column-dom-performance/column-dom-performance.component';
import { CoreColumnPickerComponent } from './core/column-dom-performance/column-picker.component';
import { CoreColumnOrderingComponent } from './core/column-ordering/column-ordering.component';
import { CoreFinalDemoComponent } from './core/final-demo/final-demo.component';
import { CoreLazyLoadingRowsComponent } from './core/lazy-loading-rows/lazy-loading-rows.component';
import { CoreRowDomPerformanceComponent } from './core/row-dom-performance/row-dom-performance.component';
import { CoreScreenReaderColumnsComponent } from './core/screen-reader-columns/screen-reader-columns.component';
import { CustomClrAdvancedSelectionDirective } from './angular/advanced-row-selection/custom-clr-advanced-selection.directive';
import { CustomClrColumnOrderingColumnDirective } from './angular/column-ordering/custom-clr-column-ordering-column.directive';
import { CustomClrColumnOrderingGridDirective } from './angular/column-ordering/custom-clr-column-ordering-grid.directive';
import { CustomClrVirtualRowsDirective } from './angular/row-dom-performance/custom-clr-virtual-rows.directive';
import { CustomClrScreenReaderColumnsDirective } from './angular/screen-reader-columns/custom-clr-screen-reader-columns.directive';

loadCoreIconSet();
loadEssentialIconSet();

const components = [
  AppComponent,
  AngularAdvancedRowSelectionComponent,
  AngularColumnDomPerformanceComponent,
  AngularColumnOrderingComponent,
  AngularFinalDemoComponent,
  AngularLazyLoadingRowsComponent,
  AngularRowDomPerformanceComponent,
  AngularScreenReaderColumnsComponent,
  CoreAdvancedRowSelectionComponent,
  CoreColumnDomPerformanceComponent,
  CoreColumnOrderingComponent,
  CoreFinalDemoComponent,
  CoreLazyLoadingRowsComponent,
  CoreRowDomPerformanceComponent,
  CoreScreenReaderColumnsComponent,
  CoreColumnPickerComponent,
];

const directives = [
  CustomClrAdvancedSelectionDirective,
  CustomClrColumnOrderingColumnDirective,
  CustomClrColumnOrderingGridDirective,
  CustomClrVirtualRowsDirective,
  CustomClrScreenReaderColumnsDirective,
];

@NgModule({
  declarations: [...components, ...directives],
  imports: [AppRoutingModule, BrowserAnimationsModule, BrowserModule, CdsModule, ClarityModule, DragDropModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
