import { CdkDrag } from '@angular/cdk/drag-drop';
import { Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import { ClrDatagrid } from '@clr/angular';
import { CustomClrColumnOrderingGridDirective } from './custom-clr-column-ordering-grid.directive';

@Directive({
  selector: 'clr-dg-column[customClrColumnOrderingColumn]',
})
export class CustomClrColumnOrderingColumnDirective {
  constructor(
    private readonly gridDirective: CustomClrColumnOrderingGridDirective,
    private readonly datagrid: ClrDatagrid,
    private readonly elementRef: ElementRef,
    cdkDrag: CdkDrag
  ) {
    cdkDrag.previewContainer = 'parent';
  }

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
        const newIndex = isLeft
          ? Math.max(0, this.columnIndex - 1)
          : Math.min(this.datagrid.columns.length - 1, this.columnIndex + 1);
        this.gridDirective.reorderColumn({ previousIndex: this.columnIndex, currentIndex: newIndex });
        this.setActiveCell();
      }
    }
  }

  private setActiveCell() {
    setTimeout(() => {
      (this.datagrid as any).keyNavigation.setActiveCell(this.elementRef.nativeElement);
    });
  }
}
