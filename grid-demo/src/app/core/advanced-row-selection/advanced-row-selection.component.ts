import { Component } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounceTime, first, map, publishReplay, refCount, shareReplay, switchMap } from 'rxjs/operators';
import '@cds/core/grid/register.js';
import '@cds/core/checkbox/register.js';

import { columns, Vm, generateVms } from '../../data/vm.generator';

@Component({
  templateUrl: './advanced-row-selection.component.html',
  styleUrls: ['./advanced-row-selection.component.scss'],
})
export class CoreAdvancedRowSelectionComponent {
  readonly pageIndex = new BehaviorSubject<number>(0);
  readonly pageSize = new BehaviorSubject<number>(10);
  readonly selectedMap = new BehaviorSubject<{ [key: string]: true }>({});
  readonly vms: Observable<Vm[]>;
  readonly pageCount: Observable<number>;
  readonly selectedCount: Observable<number>;
  readonly entirePageSelected: Observable<boolean>;
  readonly totalResults = 1000;
  readonly columns = columns;
  private lastSelecteId: string | null = null;

  constructor() {
    const allVms = this.getAllVms().pipe(shareReplay(1));
    this.vms = this.getVms(allVms).pipe(shareReplay(1));
    this.pageCount = this.getPageCount().pipe(shareReplay(1));
    this.selectedCount = this.getSelectedCount().pipe(shareReplay(1));
    this.entirePageSelected = this.getEntirePageSelected().pipe(shareReplay(1));
  }

  pageChange(event: any) {
    this.pageIndex.next(event.detail);
    this.lastSelecteId = null;
  }

  pageSizeChange(event: any) {
    this.pageSize.next(event.detail);
    this.pageIndex.next(0);
    this.lastSelecteId = null;
  }

  rowChecked(event: Event, id: string) {
    event.stopPropagation();

    this.checkRow(id);
  }

  rowClicked(event: MouseEvent, id: string) {
    if (event.shiftKey && this.selectedMap.value[id] === undefined) {
      this.vms.subscribe(vms => {
        const value: any = { ...this.selectedMap.value };
        const range = [this.lastSelecteId, id];
        const startIndex = vms.findIndex(vm => range.includes(vm.id));
        const stopIndex = startIndex + 1 + vms.slice(startIndex + 1).findIndex(vm => range.includes(vm.id));
        vms.slice(startIndex, stopIndex + 1).forEach(vm => {
          value[vm.id] = true;
          this.lastSelecteId = vm.id;
        });
        this.selectedMap.next(value);
      });
    } else if (isSpecialKeyClick(event)) {
      this.checkRow(id);
    } else {
      this.selectedMap.next({ [id]: true });
      this.lastSelecteId = id;
    }
  }

  selectAll() {
    combineLatest([this.vms, this.entirePageSelected])
      .pipe(first())
      .subscribe(([vms, entirePageSelected]) => {
        const value = { ...this.selectedMap.value };

        if (entirePageSelected) {
          vms.forEach(vm => {
            delete value[vm.id];
          });
        } else {
          vms.forEach(vm => {
            value[vm.id] = true;
          });
        }

        this.selectedMap.next(value);
      });
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  private checkRow(id: string) {
    const value: any = { ...this.selectedMap.value };

    if (value[id]) {
      delete value[id];
      this.lastSelecteId = null;
    } else {
      value[id] = true;
      this.lastSelecteId = id;
    }

    this.selectedMap.next(value);
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

  private getSelectedCount() {
    return this.selectedMap.pipe(map(map => Object.keys(map).length));
  }

  private getEntirePageSelected() {
    return combineLatest([this.vms, this.selectedMap]).pipe(
      map(([vms, selectedMap]) => !vms.some(vm => selectedMap[vm.id] === undefined))
    );
  }
}

function isSpecialKeyClick(event: MouseEvent) {
  return event.shiftKey || event.ctrlKey || event.metaKey;
}
