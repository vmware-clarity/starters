import { ListRange } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Vm, columns } from 'src/app/data/vm.generator';
import { LazyLoadService } from './lazy-load.service';

@Component({
  templateUrl: './lazy-loading-rows.component.html',
  styleUrls: ['./lazy-loading-rows.component.scss'],
  providers: [LazyLoadService],
})
export class AngularLazyLoadingRowsComponent {
  readonly columns = columns;
  readonly data: Observable<{ vms: Vm[]; totalResults: number; loadedCount: number }>;
  clrDgSelectable = true;

  constructor(private readonly lazyLoadService: LazyLoadService, changeDetectorRef: ChangeDetectorRef) {
    this.data = this.lazyLoadService.getVms().pipe(
      tap(() => {
        changeDetectorRef.detectChanges();
      })
    );
  }

  renderRangeChange($event: ListRange) {
    this.lazyLoadService.updateRange($event);
  }
}
