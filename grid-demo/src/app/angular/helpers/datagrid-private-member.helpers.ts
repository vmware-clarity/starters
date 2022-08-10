import { ElementRef } from '@angular/core';
import { ClrDatagrid } from '@clr/angular';

interface ClrDatagridPrivateMembers {
  el: ElementRef<HTMLElement>;
  keyNavigation: KeyNavigationController;
}

export interface KeyNavigationController {
  setActiveCell(activeCellElement: HTMLElement): void;
}

export function getDatagridElementRef(datagrid: ClrDatagrid) {
  const datagridPrivateMembers = datagrid as unknown as ClrDatagridPrivateMembers;

  return datagridPrivateMembers.el;
}

export function getDatagridKeyNavigationController(datagrid: ClrDatagrid) {
  const datagridPrivateMembers = datagrid as unknown as ClrDatagridPrivateMembers;

  return datagridPrivateMembers.keyNavigation;
}
