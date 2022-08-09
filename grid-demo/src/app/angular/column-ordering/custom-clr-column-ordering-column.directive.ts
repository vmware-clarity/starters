import { CdkDrag } from '@angular/cdk/drag-drop';
import { AfterViewInit, Directive, ElementRef, HostBinding, HostListener, Input, OnDestroy } from '@angular/core';
import { ClrDatagrid } from '@clr/angular';
import { fromEvent, Subscription } from 'rxjs';
import { CustomClrColumnOrderingGridDirective } from './custom-clr-column-ordering-grid.directive';

@Directive({
  selector: 'clr-dg-column[customClrColumnOrderingColumn]',
})
export class CustomClrColumnOrderingColumnDirective implements AfterViewInit, OnDestroy {
  constructor(
    private readonly gridDirective: CustomClrColumnOrderingGridDirective,
    private readonly datagrid: ClrDatagrid,
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly cdkDrag: CdkDrag
  ) {
    cdkDrag.previewContainer = 'parent';
  }

  private mouseEnterSubscription: Subscription | undefined;
  private mouseLeaveSubscription: Subscription | undefined;

  @Input() customClrColumnOrderingColumn: any;
  @Input() columnIndex!: number;
  @HostBinding('class.grabbed') get isGrabbed() {
    return this.gridDirective.grabbedColumn === this.customClrColumnOrderingColumn;
  }

  @HostListener('keydown', ['$event']) keydown(event: KeyboardEvent) {
    const isColumnTarget = (event.target as HTMLElement)?.tagName === 'CLR-DG-COLUMN';
    const isSpace = event.code === 'Space';
    const isLeft = event.code === 'ArrowLeft';
    const isRight = event.code === 'ArrowRight';
    const isMovingColumn = this.gridDirective.grabbedColumn && (isLeft || isRight);

    if (isColumnTarget && (isSpace || isMovingColumn)) {
      event.stopImmediatePropagation();
      event.preventDefault();

      if (isSpace) {
        this.gridDirective.grabbedColumn =
          this.gridDirective.grabbedColumn === this.customClrColumnOrderingColumn
            ? null
            : this.customClrColumnOrderingColumn;
      } else if (this.gridDirective.grabbedColumn) {
        const newIndex = this.getNewIndex(isLeft);

        if (newIndex !== this.columnIndex) {
          this.gridDirective.reorderColumn({ previousIndex: this.columnIndex, currentIndex: newIndex });
          this.setActiveCell();
        }
      }
    }
  }

  ngAfterViewInit(): void {
    const separator = this.elementRef.nativeElement.querySelector('clr-dg-column-separator')!;

    this.mouseEnterSubscription = fromEvent(separator, 'mouseenter').subscribe({
      next: () => (this.cdkDrag.disabled = true),
    });

    this.mouseLeaveSubscription = fromEvent(separator, 'mouseleave').subscribe({
      next: () => (this.cdkDrag.disabled = false),
    });
  }

  ngOnDestroy(): void {
    this.mouseEnterSubscription?.unsubscribe();
    this.mouseLeaveSubscription?.unsubscribe();
  }

  private setActiveCell() {
    setTimeout(() => {
      (this.datagrid as any).keyNavigation.setActiveCell(this.elementRef.nativeElement);
    });
  }

  private getNewIndex(isLeft: boolean) {
    const grid: ElementRef<HTMLElement> = (this.datagrid as any).el;
    const columnVisibilityStatuses = Array.from(grid.nativeElement.querySelectorAll('clr-dg-column')).map(
      el => !el.classList.contains('datagrid-hidden-column')
    );

    const leftVisibleColumnIndex = columnVisibilityStatuses.slice(0, this.columnIndex).lastIndexOf(true);
    const rightVisibleColumnIndex = columnVisibilityStatuses.slice(this.columnIndex + 1).indexOf(true);
    const leftColumnIndex = leftVisibleColumnIndex >= 0 ? leftVisibleColumnIndex : 0;
    const rightColumnIndex =
      rightVisibleColumnIndex >= 0 ? this.columnIndex + 1 + rightVisibleColumnIndex : this.datagrid.columns.length - 1;

    return isLeft ? leftColumnIndex : rightColumnIndex;
  }
}
