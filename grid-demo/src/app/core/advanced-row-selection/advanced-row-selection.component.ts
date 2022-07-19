import { Component } from '@angular/core';
import { DataService } from 'src/data/data-service';
import { VirtualMachine } from 'src/data/virtual-machine';

import '@cds/core/grid/register.js';

@Component({
  templateUrl: './advanced-row-selection.component.html',
  styleUrls: ['./advanced-row-selection.component.scss'],
})
export class CoreAdvancedRowSelectionComponent {
  columns: { field: keyof VirtualMachine; displayName: string }[] = [
    { field: 'id', displayName: 'Id' },
    { field: 'name', displayName: 'Name' },
    { field: 'status', displayName: 'Status' },
    { field: 'cluster', displayName: 'Cluster' },
    { field: 'host', displayName: 'Host' },
    { field: 'provisionedSpace', displayName: 'Provisioned Space' },
    { field: 'usedSpace', displayName: 'Used Space' },
  ];

  currentPage = 0;
  pageSize = 50;
  totalResults = 0;

  loading = false;

  machines: VirtualMachine[] = [];

  selected: string[] = [];

  get allRowsSelected() {
    return !this.loading && this.selected.length === this.totalResults;
  }

  get someRowsSelected() {
    return !this.loading && this.selected.length > 0 && this.selected.length !== this.totalResults;
  }

  isRowSelected(id: string) {
    return this.selected.indexOf(id) >= 0;
  }

  constructor(private readonly dataService: DataService) {
    // are you supposed to fetch in the constructor? probably not...
    this.fetchData();
  }

  fetchData() {
    this.machines = [];
    this.loading = true;
    this.dataService.loadPage(this.currentPage, this.pageSize).subscribe(vms => {
      this.machines = vms;
      this.loading = false;
      //hardcode for now
      this.totalResults = 1000;
    });
  }

  get pageCount() {
    return Math.ceil(this.totalResults / this.pageSize);
  }

  pageChange(e: any) {
    this.currentPage = e.detail as number;
    this.fetchData();
  }

  pageSizeChange(e: any) {
    this.currentPage = 0;
    this.pageSize = e.detail as number;
    this.fetchData();
  }

  rowSelected(id: string, e: any) {
    if (e.target.checked) {
      this.selected = [...this.selected, id];
    } else {
      this.selected = this.selected.filter(i => i !== id);
    }
  }
}
