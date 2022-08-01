import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ClrDatagrid } from '@clr/angular';

@Directive({
  selector: 'clr-datagrid',
})
export class DatagridScrollPaddingDirective implements OnInit, OnDestroy {
  private resizeObserver: ResizeObserver | undefined;

  constructor(private readonly datagrid: ClrDatagrid) {}

  ngOnInit() {
    const datagridElementRef: ElementRef<HTMLElement> = (this.datagrid as any).el;
    const datagridDivElement = datagridElementRef.nativeElement.querySelector<HTMLElement>('.datagrid')!;
    const datagridHeaderElement = datagridElementRef.nativeElement.querySelector<HTMLElement>('.datagrid-header')!;

    this.resizeObserver = new ResizeObserver(() => {
      datagridDivElement.style.scrollPaddingTop = `${datagridHeaderElement.clientHeight}px`;
    });

    this.resizeObserver.observe(datagridElementRef.nativeElement);
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }
}
