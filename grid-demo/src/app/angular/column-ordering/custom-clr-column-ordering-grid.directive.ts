import { CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { Directive, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
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

  constructor(private readonly cdkDropList: CdkDropList) {}

  ngOnInit(): void {
    this.cdkDropList.orientation = 'horizontal';
    this.subscription = this.cdkDropList.dropped
      .pipe(
        tap(event => {
          this.reorderColumn(event);
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
}
