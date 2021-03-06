import { Directive, ElementRef, OnInit } from '@angular/core';
import { ClrDatagrid } from '@clr/angular';

@Directive({
  selector: 'clr-datagrid[customClrScreenReaderColumns]',
})
export class CustomClrScreenReaderColumnsDirective implements OnInit {
  constructor(private readonly datagrid: ClrDatagrid, private readonly elementRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.monkeyPatchActiveCell();
  }

  private monkeyPatchActiveCell() {
    let lastActive = true;
    const keyNavigationController = (this.datagrid as any).keyNavigation;
    const oldFunction: (activeCell: HTMLElement) => void = keyNavigationController.setActiveCell;

    keyNavigationController.setActiveCell = (activeCell: HTMLElement) => {
      oldFunction.call(keyNavigationController, activeCell);
      const active = activeCell.tagName === 'CLR-DG-COLUMN';

      if (active && !lastActive) {
        this.addAria();
      } else if (!active && lastActive) {
        this.removeAria();
      }

      lastActive = active;
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
