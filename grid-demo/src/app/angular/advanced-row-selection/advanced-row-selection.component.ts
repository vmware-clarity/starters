import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Vm, generateVms, columns } from './../../data/vm.generator';

@Component({
  templateUrl: './advanced-row-selection.component.html',
  styleUrls: ['./advanced-row-selection.component.scss'],
})
export class AngularAdvancedRowSelectionComponent {
  readonly vms: Observable<Vm[]>;
  readonly columns = [...columns];

  constructor() {
    this.vms = generateVms({ pageIndex: 0, pageSize: 1000 }).pipe(map(data => data.vms));
  }
}
