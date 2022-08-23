import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';
import { ClrDatagrid } from '@clr/angular';

@Directive({
  selector: 'clr-datagrid[customClrAdvancedSelection]',
})
export class CustomClrAdvancedSelectionDirective implements OnInit {
  constructor(private readonly elementRef: ElementRef, private readonly datagrid: ClrDatagrid) {}

  ngOnInit() {
    this.datagrid.selected = [];
    this.datagrid.rowSelectionMode = true;
  }

  @HostListener('click', ['$event'])
  overrideSelection(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (
      !mouseEventIsSpecialKeyClick(event) &&
      !elementIsCheckbox(target) &&
      elementHasDatagridRowParent(target, this.elementRef.nativeElement)
    ) {
      this.datagrid.selected = [];
    }
  }
}

function mouseEventIsSpecialKeyClick(event: MouseEvent) {
  return event.shiftKey || event.ctrlKey || event.metaKey;
}

function elementIsCheckbox(element: HTMLElement | null) {
  return element?.parentElement?.className === 'clr-checkbox-wrapper';
}

function elementHasDatagridRowParent(element: HTMLElement | null, maxParent: HTMLElement) {
  const clrRowTagName = 'CLR-DG-ROW';

  while (element && element !== maxParent && element.tagName !== clrRowTagName) {
    element = element.parentElement;
  }

  return element?.tagName === clrRowTagName;
}
