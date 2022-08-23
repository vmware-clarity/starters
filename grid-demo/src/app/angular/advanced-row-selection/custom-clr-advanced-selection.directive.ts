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
      !isSpecialKeyClick(event) &&
      !isCheckboxClick(target) &&
      hasDatagridRowParent(target, this.elementRef.nativeElement)
    ) {
      this.datagrid.selected = [];
    }
  }
}

function isSpecialKeyClick(event: MouseEvent) {
  return event.shiftKey || event.ctrlKey || event.metaKey;
}

function isCheckboxClick(target: HTMLElement | null) {
  return target?.parentElement?.className === 'clr-checkbox-wrapper';
}

function hasDatagridRowParent(target: HTMLElement | null, maxParent: HTMLElement) {
  const clrRowTagName = 'CLR-DG-ROW';

  while (target && target !== maxParent && target.tagName !== clrRowTagName) {
    target = target.parentElement;
  }

  return target?.tagName === clrRowTagName;
}
