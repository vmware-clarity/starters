import { Component } from '@angular/core';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounceTime, first, map, publishReplay, refCount, shareReplay, switchMap } from 'rxjs/operators';
import '@cds/core/grid/register.js';
import '@cds/core/checkbox/register.js';
import '@cds/core/dropdown/register.js';

import { columns, Vm, generateVms } from '../../data/vm.generator';

@Component({
  templateUrl: './column-ordering.component.html',
  styleUrls: ['./column-ordering.component.scss'],
})
export class CoreColumnOrderingComponent {
  readonly pageIndex = new BehaviorSubject<number>(0);
  readonly pageSize = new BehaviorSubject<number>(10);
  readonly vms: Observable<Vm[]>;
  readonly pageCount: Observable<number>;
  readonly totalResults = 1000;
  readonly columns = new BehaviorSubject<typeof columns>(columns);

  readonly ariaLiveMessage = new BehaviorSubject<string>('');

  constructor() {
    const allVms = this.getAllVms().pipe(shareReplay(1));
    this.vms = this.getVms(allVms).pipe(shareReplay(1));
    this.pageCount = this.getPageCount().pipe(shareReplay(1));
  }

  pageChange(event: any) {
    this.pageIndex.next(event.detail);
  }

  pageSizeChange(event: any) {
    this.pageSize.next(event.detail);
    this.pageIndex.next(0);
  }

  sortColumns(e: any) {
    if (e.detail.type === 'reordered') {
      const value = [...this.columns.value];

      const fromIndex = value.findIndex(i => `${i.field}` === e.detail.from.getAttribute('cds-field'));
      const targetIndex = value.findIndex(i => `${i.field}` === e.detail.target.getAttribute('cds-field'));

      // if the item is moving further in the array, everything else will shift back 1, so subtract 1
      const offset = fromIndex > targetIndex ? 0 : -1;
      moveItemInArray(value, fromIndex, targetIndex + offset);

      this.columns.next(value);
      this.ariaLiveMessage.next(`${e.detail.from.textContent} moved to column ${e.detail.target.ariaColIndex}`);
    } else {
      this.ariaLiveMessage.next(`${e.detail.from.textContent} column ${e.detail.type}`);
    }
  }

  private getAllVms() {
    return generateVms({ pageIndex: 0, pageSize: this.totalResults }).pipe(map(data => data.vms));
  }

  private getVms(allVms: Observable<Vm[]>) {
    return combineLatest([this.pageIndex, this.pageSize]).pipe(
      debounceTime(0),
      switchMap(([pageIndex, pageSize]) =>
        allVms.pipe(map(allVms => allVms.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize)))
      )
    );
  }

  private getPageCount() {
    return this.pageSize.pipe(map(pageSize => Math.ceil(this.totalResults / pageSize)));
  }
}
