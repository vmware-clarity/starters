import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Vm, generateVms, columns } from './../../data/vm.generator';

@Component({
  templateUrl: './screen-reader-columns.component.html',
  styleUrls: ['./screen-reader-columns.component.scss'],
})
export class AngularScreenReaderColumnsComponent {
  readonly vms: Observable<Vm[]>;
  readonly columns = [...columns];

  constructor() {
    this.vms = generateVms({ pageIndex: 0, pageSize: 1000 }).pipe(map(data => data.vms));
  }
}
