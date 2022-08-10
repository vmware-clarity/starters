import { Directive, ElementRef, OnInit } from '@angular/core';
import { ClrDatagrid } from '@clr/angular';

import { getDatagridKeyNavigationController } from '../helpers/datagrid-private-member.helpers';

@Directive({
  selector: 'clr-datagrid[customClrScreenReaderColumns]',
})
export class CustomClrScreenReaderColumnsDirective implements OnInit {
  constructor(private readonly datagrid: ClrDatagrid, private readonly elementRef: ElementRef<HTMLElement>) {}

  ngOnInit() {
    this.patchSetActiveCell();
  }

  private patchSetActiveCell() {
    let lastActiveCellWasColumn = true;
    const keyNavigationController = getDatagridKeyNavigationController(this.datagrid);
    const oldFunction = keyNavigationController.setActiveCell;

    keyNavigationController.setActiveCell = (activeCellElement: HTMLElement) => {
      oldFunction.call(keyNavigationController, activeCellElement);
      const activeCellIsColumn = activeCellElement.tagName === 'CLR-DG-COLUMN';

      if (activeCellIsColumn && !lastActiveCellWasColumn) {
        this.addAria();
      } else if (!activeCellIsColumn && lastActiveCellWasColumn) {
        this.removeAria();
      }

      lastActiveCellWasColumn = activeCellIsColumn;
    };
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
