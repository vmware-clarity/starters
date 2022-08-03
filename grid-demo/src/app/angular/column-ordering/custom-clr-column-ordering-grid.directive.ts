import { CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { ApplicationRef, Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ClrDatagrid } from '@clr/angular';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CustomClrColumnOrderingService } from './custom-clr-column-ordering.service';

@Directive({
  selector: 'clr-datagrid[customClrColumnOrderingGrid]',
  providers: [CustomClrColumnOrderingService],
})
export class CustomClrColumnOrderingGridDirective implements OnInit, OnDestroy {
  @Input() columns!: any[];
  @Output() columnsChange = new EventEmitter<any[]>();

  private subscription: Subscription | undefined;

  constructor(
    private readonly datagrid: ClrDatagrid,
    private readonly cdkDropList: CdkDropList,
    private readonly columnOrderingService: CustomClrColumnOrderingService,
    private readonly applicationRef: ApplicationRef
  ) {}

  ngOnInit(): void {
    this.patchSetActiveCell();
    this.cdkDropList.orientation = 'horizontal';
    this.subscription = this.cdkDropList.dropped
      .pipe(
        tap(event => {
          const mappedIndices = this.getMappedIndices(event);
          this.reorderColumn(mappedIndices);
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  reorderColumn(event: { previousIndex: number; currentIndex: number }) {
    if (event.currentIndex !== event.previousIndex) {
      const value = [...this.columns];
      moveItemInArray(value, event.previousIndex, event.currentIndex);
      this.columnsChange.emit(value);
    }
  }

  private getMappedIndices(event: { previousIndex: number; currentIndex: number }) {
    const grid: ElementRef<HTMLElement> = (this.datagrid as any).el;
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
    const keyNavigationController = (this.datagrid as any).keyNavigation;
    const oldFunction: (activeCell: HTMLElement) => void = keyNavigationController.setActiveCell;

    keyNavigationController.setActiveCell = (activeCell: HTMLElement) => {
      oldFunction.call(keyNavigationController, activeCell);
      const activeCellIsColumn = activeCell.tagName === 'CLR-DG-COLUMN';

      if (!activeCellIsColumn) {
        this.columnOrderingService.grabbedColumn.next(null);
        this.applicationRef.tick(); // hack, we shouldn't have to do this
      }
    };
  }
}
