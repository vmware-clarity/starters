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
  columns = columns.map(column => ({ ...column, hidden: false }));

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
