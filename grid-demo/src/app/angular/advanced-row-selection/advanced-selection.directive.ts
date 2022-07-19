import { Directive, ElementRef, HostListener } from '@angular/core';
import { ClrDatagrid } from '@clr/angular';

@Directive({
  selector: 'clr-datagrid[clrAdvancedSelection]',
})
export class AdvancedSelectionDirective {
  constructor(private readonly elementRef: ElementRef, private readonly datagrid: ClrDatagrid) {}

  @HostListener('click', ['$event']) overrideSelection(evt: MouseEvent) {
    const target = evt.target as HTMLElement;

    if (
      !isSpecialKeyClick(evt) &&
      !isCheckboxClick(target) &&
      hasDatagridRowParent(target, this.elementRef.nativeElement)
    ) {
      this.datagrid.selected = [];
    }
  }
}

function isSpecialKeyClick(evt: MouseEvent) {
  return evt.shiftKey || evt.ctrlKey || evt.metaKey;
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
