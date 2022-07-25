import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Vm, generateVms, columns } from './../../data/vm.generator';

@Component({
  templateUrl: './row-dom-performance.component.html',
  styleUrls: ['./row-dom-performance.component.scss'],
})
export class AngularRowDomPerformanceComponent {
  readonly vms: Observable<Vm[]>;
  readonly columns = columns;

  constructor() {
    this.vms = generateVms({ pageIndex: 0, pageSize: 10000 }).pipe(map(data => data.vms));
  }
}
