import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Vm, generateVms, columns } from './../../data/vm.generator';

@Component({
  templateUrl: './column-dom-performance.component.html',
  styleUrls: ['./column-dom-performance.component.scss'],
})
export class AngularColumnDomPerformanceComponent {
  readonly vms: Observable<Vm[]>;
  readonly columns = [...columns];

  constructor() {
    this.vms = generateVms({ pageIndex: 0, pageSize: 1000 }).pipe(map(data => data.vms));
  }
}
