import { Component } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounceTime, first, map, publishReplay, refCount, shareReplay, switchMap } from 'rxjs/operators';
import '@cds/core/grid/register.js';
import '@cds/core/checkbox/register.js';
import '@cds/core/dropdown/register.js';

import { columns, Column, Vm, generateVms } from '../../data/vm.generator';

interface ColumnVisibility extends Column {
  visible: boolean;
}

@Component({
  templateUrl: './column-dom-performance.component.html',
  styleUrls: ['./column-dom-performance.component.scss'],
})
export class CoreColumnDomPerformanceComponent {
  readonly pageIndex = new BehaviorSubject<number>(0);
  readonly pageSize = new BehaviorSubject<number>(10);
  readonly vms: Observable<Vm[]>;
  readonly pageCount: Observable<number>;
  readonly totalResults = 1000;
  readonly columns = new BehaviorSubject<ColumnVisibility[]>(
    columns.map(c => ({
      ...c,
      visible: true,
    }))
  );

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

  columnVisibleChange(event: any) {
    this.columns.next(
      this.columns.value.map(c => {
        const updated = { ...c };

        if (event.target.value === 'all' || event.target.value === updated.field) {
          updated.visible = event.target.checked;
        }
        return updated;
      })
    );
  }

  get allColumnsVisible() {
    return !this.columns.value.find(c => !c.visible);
  }

  get someColumnsVisible() {
    return Boolean(this.columns.value.find(c => c.visible)) && !this.allColumnsVisible;
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
