import { CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ClrDatagrid } from '@clr/angular';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Directive({
  selector: 'clr-datagrid[customClrColumnOrderingGrid]',
})
export class CustomClrColumnOrderingGridDirective implements OnInit, OnDestroy {
  @Input() columns!: any[];
  @Output() columnsChange = new EventEmitter<any[]>();

  grabbedColumn: any;
  private subscription: Subscription | undefined;

  constructor(private readonly cdkDropList: CdkDropList, private readonly datagrid: ClrDatagrid) {}

  ngOnInit(): void {
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
}
