import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ClrDatagrid } from '@clr/angular';
import { Subscription } from 'rxjs';

import { fromActiveCell } from '../helpers/datagrid-active-cell.helpers';

@Directive({
  selector: 'clr-datagrid[customClrScreenReaderColumns]',
})
export class CustomClrScreenReaderColumnsDirective implements OnInit, OnDestroy {
  private setActiveCellSubscription: Subscription | undefined;
  private lastActiveCellWasColumn = true;

  constructor(private readonly datagrid: ClrDatagrid, private readonly elementRef: ElementRef<HTMLElement>) {}

  ngOnInit() {
    this.setActiveCellSubscription = fromActiveCell(this.datagrid).subscribe(activeCellElement => {
      this.handleActiveCell(activeCellElement);
    });
  }

  ngOnDestroy() {
    this.setActiveCellSubscription?.unsubscribe();
  }

  private handleActiveCell(activeCellElement: HTMLElement) {
    const activeCellIsColumn = activeCellElement.tagName === 'CLR-DG-COLUMN';

    if (activeCellIsColumn && !this.lastActiveCellWasColumn) {
      this.addAria();
    } else if (!activeCellIsColumn && this.lastActiveCellWasColumn) {
      this.removeAria();
    }

    this.lastActiveCellWasColumn = activeCellIsColumn;
  }

  private addAria() {
    this.getAriaButtons().forEach(button => {
      button.setAttribute('aria-label', button.getAttribute('data-aria-label')!);
      button.removeAttribute('data-aria-label');
    });

    this.getAriaText().forEach(span => {
      span.style.display = 'inline';
    });
  }

  private removeAria() {
    this.getAriaButtons().forEach(button => {
      button.setAttribute('data-aria-label', button.getAttribute('aria-label')!);
      button.removeAttribute('aria-label');
    });

    this.getAriaText().forEach(span => {
      span.style.display = 'none';
    });
  }

  private getAriaButtons() {
    const filterButtons = this.elementRef.nativeElement.querySelectorAll<HTMLElement>('clr-dg-filter button');
    const separatorButtons = this.elementRef.nativeElement.querySelectorAll<HTMLElement>(
      'clr-dg-column-separator button'
    );

    return [...Array.from(filterButtons), ...Array.from(separatorButtons)];
  }

  private getAriaText() {
    return this.elementRef.nativeElement.querySelectorAll<HTMLElement>('clr-dg-column-separator .clr-sr-only');
  }
}
