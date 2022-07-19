import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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

const routes: Routes = [
  {
    path: '',
    redirectTo: '/angular/advanced-row-selection',
    pathMatch: 'full',
  },
  {
    path: 'angular',
    children: [
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
    ],
  },
  {
    path: 'core',
    children: [
      {
        path: 'advanced-row-selection',
        component: CoreAdvancedRowSelectionComponent,
      },
      {
        path: 'lazy-loading-rows',
        component: CoreLazyLoadingRowsComponent,
      },
      {
        path: 'column-dom-performance',
        component: CoreColumnDomPerformanceComponent,
      },
      {
        path: 'row-dom-performance',
        component: CoreRowDomPerformanceComponent,
      },
      {
        path: 'column-ordering',
        component: CoreColumnOrderingComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
