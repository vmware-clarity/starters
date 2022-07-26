import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Vm, generateVms, columns } from './../../data/vm.generator';

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
}
