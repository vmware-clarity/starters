import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Vm, generateVms, columns } from './../../data/vm.generator';

@Component({
  templateUrl: './column-ordering.component.html',
  styleUrls: ['./column-ordering.component.scss'],
})
export class AngularColumnOrderingComponent {
  readonly vms: Observable<Vm[]>;
  readonly columns = new BehaviorSubject<{ field: keyof Vm; displayName: string }[]>(columns);

  constructor() {
    this.vms = generateVms({ pageIndex: 0, pageSize: 1000 }).pipe(map(data => data.vms));
  }

  columnDropped(event: CdkDragDrop<Vm[]>) {
    const value = [...this.columns.value];
    const temp = value[event.currentIndex];
    value[event.currentIndex] = value[event.previousIndex];
    value[event.previousIndex] = temp;
    this.columns.next(value);
  }
}
