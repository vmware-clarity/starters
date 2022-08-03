import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AngularAdvancedRowSelectionComponent } from './angular/advanced-row-selection/advanced-row-selection.component';
import { AngularColumnDomPerformanceComponent } from './angular/column-dom-performance/column-dom-performance.component';
import { AngularColumnOrderingComponent } from './angular/column-ordering/column-ordering.component';
import { AngularFinalDemoComponent } from './angular/final-demo/final-demo.component';
import { AngularLazyLoadingRowsComponent } from './angular/lazy-loading-rows/lazy-loading-rows.component';
import { AngularRowDomPerformanceComponent } from './angular/row-dom-performance/row-dom-performance.component';
import { AngularScreenReaderColumnsComponent } from './angular/screen-reader-columns/screen-reader-columns.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/angular/final-demo',
    pathMatch: 'full',
  },
  {
    path: 'angular',
    children: [
      {
        path: 'final-demo',
        component: AngularFinalDemoComponent,
      },
      {
        path: 'advanced-row-selection',
        component: AngularAdvancedRowSelectionComponent,
      },
      {
        path: 'lazy-loading-rows',
        component: AngularLazyLoadingRowsComponent,
      },
      {
        path: 'column-dom-performance',
        component: AngularColumnDomPerformanceComponent,
      },
      {
        path: 'row-dom-performance',
        component: AngularRowDomPerformanceComponent,
      },
      {
        path: 'column-ordering',
        component: AngularColumnOrderingComponent,
      },
      {
        path: 'screen-reader-columns',
        component: AngularScreenReaderColumnsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
