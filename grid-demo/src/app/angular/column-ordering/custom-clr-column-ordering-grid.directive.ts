import { CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { ApplicationRef, Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ClrDatagrid } from '@clr/angular';
import { Subscription } from 'rxjs';

import { getDatagridElementRef, getDatagridKeyNavigationController } from '../helpers/datagrid-private-member.helpers';
import { CustomClrColumnOrderingService } from './custom-clr-column-ordering.service';

export interface ColumnOrderChangedEvent<TColumn = any> {
  column: TColumn;
  previousIndex: number;
  currentIndex: number;
}

@Directive({
  selector: 'clr-datagrid[customClrColumnOrderingGrid]',
  providers: [CustomClrColumnOrderingService],
})
export class CustomClrColumnOrderingGridDirective implements OnInit, OnDestroy {
  @Input() columns!: any[];
  @Output() columnsChange = new EventEmitter<any[]>();
  @Output() columnOrderChanged = new EventEmitter<ColumnOrderChangedEvent>();

  private droppedSubscription: Subscription | undefined;

  constructor(
    private readonly datagrid: ClrDatagrid,
    private readonly cdkDropList: CdkDropList,
    private readonly columnOrderingService: CustomClrColumnOrderingService,
    private readonly applicationRef: ApplicationRef
  ) {}

  ngOnInit() {
    this.patchSetActiveCell();
    this.cdkDropList.orientation = 'horizontal';
    this.droppedSubscription = this.cdkDropList.dropped.subscribe(event => {
      const mappedIndices = this.getMappedIndices(event);
      this.reorderColumn(mappedIndices);
    });
  }

  ngOnDestroy() {
    this.droppedSubscription?.unsubscribe();
  }

  reorderColumn(event: { previousIndex: number; currentIndex: number }) {
    if (event.currentIndex !== event.previousIndex) {
      const value = [...this.columns];
      const column = value[event.previousIndex];
      moveItemInArray(value, event.previousIndex, event.currentIndex);
      this.columnsChange.emit(value);
      this.columnOrderChanged.emit({ ...event, column });
    }
  }

  private getMappedIndices(event: { previousIndex: number; currentIndex: number }) {
    const grid: ElementRef<HTMLElement> = getDatagridElementRef(this.datagrid);
    const columnVisibilityStatuses = Array.from(grid.nativeElement.querySelectorAll('clr-dg-column')).map(
      el => !el.classList.contains('datagrid-hidden-column')
    );

    let hiddenIndex = 0;
    let visibleIndex = 0;
    const hiddenColumns = columnVisibilityStatuses.filter(visible => !visible).length;
    const mappedIndices = columnVisibilityStatuses.map(visible =>
      visible ? hiddenColumns + visibleIndex++ : hiddenIndex++
    );

    const previousIndex = mappedIndices.indexOf(event.previousIndex);
    const currentIndex = mappedIndices.indexOf(event.currentIndex);

    return { previousIndex, currentIndex };
  }

  private patchSetActiveCell() {
    const keyNavigationController = getDatagridKeyNavigationController(this.datagrid);
    const oldFunction: (activeCellElement: HTMLElement) => void = keyNavigationController.setActiveCell;

    keyNavigationController.setActiveCell = (activeCellElement: HTMLElement) => {
      oldFunction.call(keyNavigationController, activeCellElement);
      const activeCellIsColumn = activeCellElement.tagName === 'CLR-DG-COLUMN';

      if (!activeCellIsColumn) {
        this.columnOrderingService.grabbedColumn.next(null);
        this.applicationRef.tick(); // hack, we shouldn't have to do this
      }
    };
  }
}
