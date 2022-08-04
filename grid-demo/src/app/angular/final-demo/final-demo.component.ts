import { ListRange } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Vm, columns } from './../../data/vm.generator';
import { LazyLoadService } from './../lazy-loading-rows/lazy-load.service';

@Component({
  templateUrl: './final-demo.component.html',
  styleUrls: ['./final-demo.component.scss'],
  providers: [LazyLoadService],
})
export class AngularFinalDemoComponent {
  readonly data: Observable<{ vms: Vm[]; totalResults: number; loadedCount: number }>;
  columns = columns;
  firstVisibleColumn = columns[0];

  constructor(private readonly lazyLoadService: LazyLoadService, changeDetectorRef: ChangeDetectorRef) {
    this.data = this.lazyLoadService.getVms().pipe(
      tap(() => {
        changeDetectorRef.detectChanges();
      })
    );
  }

  updateColumnVisibility(column: { hidden: boolean }, hidden: boolean) {
    column.hidden = hidden;
    this.firstVisibleColumn = this.columns.find(column => !column.hidden)!;
  }

  renderRangeChange($event: ListRange) {
    this.lazyLoadService.updateRange($event);
  }
}
