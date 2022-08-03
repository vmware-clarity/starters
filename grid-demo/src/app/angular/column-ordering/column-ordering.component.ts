import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Vm, generateVms, columns, Column } from './../../data/vm.generator';
import { ColumnOrderChangedEvent } from './custom-clr-column-ordering-grid.directive';

@Component({
  templateUrl: './column-ordering.component.html',
  styleUrls: ['./column-ordering.component.scss'],
})
export class AngularColumnOrderingComponent {
  readonly vms: Observable<Vm[]>;
  columns = columns;

  constructor() {
    this.vms = generateVms({ pageIndex: 0, pageSize: 1000 }).pipe(map(data => data.vms));
  }

  columnPickedUp(columnName: string) {
    console.log(`column "${columnName}" picked up`);
  }

  columnDropped(columnName: string) {
    console.log(`column "${columnName}" dropped`);
  }

  columnOrderChanged(event: ColumnOrderChangedEvent<Column>) {
    const fromPosition = event.previousIndex + 1;
    const toPosition = event.currentIndex + 1;
    console.log(`column "${event.column.displayName}" moved from position ${fromPosition} to position ${toPosition}`);
  }
}
