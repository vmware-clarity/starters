import { ListRange } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Vm, columns } from './../../data/vm.generator';
import { LazyLoadService } from './lazy-load.service';

@Component({
  templateUrl: './lazy-loading-rows.component.html',
  styleUrls: ['./lazy-loading-rows.component.scss'],
  providers: [LazyLoadService],
})
export class AngularLazyLoadingRowsComponent {
  readonly data: Observable<{ vms: Vm[]; totalResults: number; loadedCount: number }>;
  readonly columns = [...columns];
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
