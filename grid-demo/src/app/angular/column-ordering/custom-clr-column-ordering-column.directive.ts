import { CdkDrag } from '@angular/cdk/drag-drop';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { ClrDatagrid, ClrDatagridColumn } from '@clr/angular';
import { fromEvent, Subscription } from 'rxjs';

import { getDatagridElementRef, getDatagridKeyNavigationController } from '../helpers/datagrid-private-member.helpers';
import { CustomClrColumnOrderingGridDirective } from './custom-clr-column-ordering-grid.directive';
import { CustomClrColumnOrderingService } from './custom-clr-column-ordering.service';

@Directive({
  selector: 'clr-dg-column[customClrColumnOrderingColumn]',
})
export class CustomClrColumnOrderingColumnDirective implements AfterViewInit, OnDestroy {
  constructor(
    private readonly gridDirective: CustomClrColumnOrderingGridDirective,
    private readonly datagrid: ClrDatagrid,
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly columnOrderingService: CustomClrColumnOrderingService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly column: ClrDatagridColumn,
    private readonly cdkDrag: CdkDrag
  ) {
    cdkDrag.previewContainer = 'parent';
  }

  private mouseEnterSubscription: Subscription | undefined;
  private mouseLeaveSubscription: Subscription | undefined;
  private grabbedColumnSubscription: Subscription | undefined;
  @Input() customClrColumnOrderingColumn: any;
  @Input() columnIndex!: number;
  @Output() columnPickedUp = new EventEmitter<void>();
  @Output() columnDropped = new EventEmitter<void>();
  @HostBinding('class.grabbed') isGrabbed = false;

  @HostListener('keydown', ['$event'])
  keydown(event: KeyboardEvent) {
    const isColumnTarget = (event.target as HTMLElement)?.tagName === 'CLR-DG-COLUMN';
    const isSpace = event.code === 'Space';
    const isLeft = event.code === 'ArrowLeft';
    const isRight = event.code === 'ArrowRight';
    const isMovingColumn = this.columnOrderingService.grabbedColumn.value && (isLeft || isRight);

    if (isColumnTarget && (isSpace || isMovingColumn)) {
      event.stopImmediatePropagation();
      event.preventDefault();

      if (isSpace) {
        if (this.columnOrderingService.grabbedColumn.value === this.customClrColumnOrderingColumn) {
          this.columnOrderingService.grabbedColumn.next(null);
          this.columnDropped.next();
        } else {
          this.columnOrderingService.grabbedColumn.next(this.customClrColumnOrderingColumn);
          this.columnPickedUp.next();
        }
      } else if (this.columnOrderingService.grabbedColumn.value) {
        const newIndex = this.getNewIndex(isLeft);

        if (newIndex !== this.columnIndex) {
          this.gridDirective.reorderColumn({ previousIndex: this.columnIndex, currentIndex: newIndex });
          this.setActiveCell();
        }
      }
    }
  }

  ngOnInit() {
    this.grabbedColumnSubscription = this.columnOrderingService.grabbedColumn.subscribe(column => {
      this.isGrabbed = column === this.customClrColumnOrderingColumn;
      this.column.colType = (((this.column.colType as any) || 0) + 1) as any;
      this.changeDetectorRef.detectChanges();
    });
  }

  ngAfterViewInit() {
    const separator = this.elementRef.nativeElement.querySelector('clr-dg-column-separator')!;

    this.mouseEnterSubscription = fromEvent(separator, 'mouseenter').subscribe(() => {
      this.cdkDrag.disabled = true;
    });

    this.mouseLeaveSubscription = fromEvent(separator, 'mouseleave').subscribe(() => {
      this.cdkDrag.disabled = false;
    });
  }

  ngOnDestroy() {
    this.mouseEnterSubscription?.unsubscribe();
    this.mouseLeaveSubscription?.unsubscribe();
    this.grabbedColumnSubscription?.unsubscribe();
  }

  private setActiveCell() {
    setTimeout(() => {
      getDatagridKeyNavigationController(this.datagrid).setActiveCell(this.elementRef.nativeElement);
    });
  }

  private getNewIndex(isLeft: boolean) {
    const grid: ElementRef<HTMLElement> = getDatagridElementRef(this.datagrid);
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
