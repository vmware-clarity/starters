import { Directionality } from '@angular/cdk/bidi';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { ListRange, _RecycleViewRepeaterStrategy } from '@angular/cdk/collections';
import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
  CdkVirtualForOfContext,
  CdkVirtualScrollViewport,
  FixedSizeVirtualScrollStrategy,
  ScrollDispatcher,
  ViewportRuler,
} from '@angular/cdk/scrolling';
import {
  ChangeDetectorRef,
  Directive,
  DoCheck,
  ElementRef,
  EventEmitter,
  Input,
  IterableDiffers,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { ClrDatagrid } from '@clr/angular';
import { Subscription } from 'rxjs';

type CdkVirtualForInputKey =
  | 'cdkVirtualForOf'
  | 'cdkVirtualForTrackBy'
  | 'cdkVirtualForTemplate'
  | 'cdkVirtualForTemplateCacheSize';

type CdkVirtualForInputs<T> = Partial<Pick<CdkVirtualForOf<T>, CdkVirtualForInputKey>>;

type CdkFixedSizeVirtualScrollInputs = Pick<CdkFixedSizeVirtualScroll, 'itemSize' | 'minBufferPx' | 'maxBufferPx'>;

const defaultCdkFixedSizeVirtualScrollInputs: CdkFixedSizeVirtualScrollInputs = {
  itemSize: 36,
  minBufferPx: 100,
  maxBufferPx: 200,
};

@Directive({
  selector: '[customClrVirtualRows][customClrVirtualRowsOf]',
})
export class CustomClrVirtualRowsDirective<T> implements OnInit, DoCheck, OnDestroy {
  @Input('customClrVirtualRowsOf')
  get cdkVirtualForOf() {
    return this._cdkVirtualForInputs.cdkVirtualForOf;
  }
  set cdkVirtualForOf(value: CdkVirtualForInputs<T>['cdkVirtualForOf']) {
    this._cdkVirtualForInputs.cdkVirtualForOf = value;
    this.updateCdkVirtualForInputs();
  }

  @Input('customClrVirtualRowsTrackBy')
  get cdkVirtualForTrackBy() {
    return this._cdkVirtualForInputs.cdkVirtualForTrackBy;
  }
  set cdkVirtualForTrackBy(value: CdkVirtualForInputs<T>['cdkVirtualForTrackBy']) {
    this._cdkVirtualForInputs.cdkVirtualForTrackBy = value;
    this.updateCdkVirtualForInputs();
  }

  @Input('customClrVirtualRowsTemplate')
  get cdkVirtualForTemplate() {
    return this._cdkVirtualForInputs.cdkVirtualForTemplate!;
  }
  set cdkVirtualForTemplate(value: CdkVirtualForInputs<T>['cdkVirtualForTemplate']) {
    this._cdkVirtualForInputs.cdkVirtualForTemplate = value;
    this.updateCdkVirtualForInputs();
  }

  @Input('customClrVirtualRowsTemplateCacheSize')
  get cdkVirtualForTemplateCacheSize() {
    return this._cdkVirtualForInputs.cdkVirtualForTemplateCacheSize;
  }
  set cdkVirtualForTemplateCacheSize(value: CdkVirtualForInputs<T>['cdkVirtualForTemplateCacheSize']) {
    this._cdkVirtualForInputs.cdkVirtualForTemplateCacheSize = coerceNumberProperty(value);
    this.updateCdkVirtualForInputs();
  }

  @Input('customClrVirtualRowsItemSize')
  get itemSize() {
    return this._cdkFixedSizeVirtualScrollInputs.itemSize;
  }
  set itemSize(value: CdkFixedSizeVirtualScrollInputs['itemSize']) {
    this._cdkFixedSizeVirtualScrollInputs.itemSize = coerceNumberProperty(value);
    this.updateFixedSizeVirtualScrollInputs();
  }

  @Input('customClrVirtualRowsMinBufferPx')
  get minBufferPx() {
    return this._cdkFixedSizeVirtualScrollInputs.minBufferPx;
  }
  set minBufferPx(value: CdkFixedSizeVirtualScrollInputs['minBufferPx']) {
    this._cdkFixedSizeVirtualScrollInputs.minBufferPx = coerceNumberProperty(value);
    this.updateFixedSizeVirtualScrollInputs();
  }

  @Input('customClrVirtualRowsMaxBufferPx')
  get maxBufferPx() {
    return this._cdkFixedSizeVirtualScrollInputs.maxBufferPx;
  }
  set maxBufferPx(value: CdkFixedSizeVirtualScrollInputs['maxBufferPx']) {
    this._cdkFixedSizeVirtualScrollInputs.maxBufferPx = coerceNumberProperty(value);
    this.updateFixedSizeVirtualScrollInputs();
  }

  @Output() renderedRangeChange = new EventEmitter<ListRange>();

  private _cdkVirtualForInputs: CdkVirtualForInputs<T> = {
    cdkVirtualForTrackBy: index => index,
  };

  private _cdkFixedSizeVirtualScrollInputs = { ...defaultCdkFixedSizeVirtualScrollInputs };

  private datagridElementRef: ElementRef<HTMLElement> = (this.datagrid as any).el;
  private datagridKeyNavigationController = (this.datagrid as any).keyNavigation;

  private activeCellElement: HTMLElement | undefined;
  private virtualScrollStrategy: FixedSizeVirtualScrollStrategy | undefined;
  private virtualScrollViewport: CdkVirtualScrollViewport | undefined;
  private cdkVirtualFor: CdkVirtualForOf<T> | undefined;
  private renderedRangeChangeSubscription: Subscription | undefined;

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly iterableDiffers: IterableDiffers,
    private readonly ngZone: NgZone,
    private readonly templateRef: TemplateRef<CdkVirtualForOfContext<T>>,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly directionality: Directionality,
    private readonly scrollDispatcher: ScrollDispatcher,
    private readonly viewportRuler: ViewportRuler,
    private readonly datagrid: ClrDatagrid
  ) {}

  ngOnInit() {
    this.patchKeyNavigationControllerSetActiveCell();

    this.virtualScrollStrategy = new FixedSizeVirtualScrollStrategy(
      this._cdkFixedSizeVirtualScrollInputs.itemSize,
      this._cdkFixedSizeVirtualScrollInputs.minBufferPx,
      this._cdkFixedSizeVirtualScrollInputs.maxBufferPx
    );

    this.virtualScrollViewport = createVirtualScrollViewportForDatagrid(
      this.changeDetectorRef,
      this.ngZone,
      this.directionality,
      this.scrollDispatcher,
      this.viewportRuler,
      this.datagridElementRef,
      this.virtualScrollStrategy
    );

    const viewRepeaterStrategy = new _RecycleViewRepeaterStrategy<T, T, CdkVirtualForOfContext<T>>();

    this.cdkVirtualFor = new CdkVirtualForOf<T>(
      this.viewContainerRef,
      this.templateRef,
      this.iterableDiffers,
      viewRepeaterStrategy,
      this.virtualScrollViewport,
      this.ngZone
    );

    this.updateCdkVirtualForInputs();

    this.virtualScrollViewport.ngOnInit();

    this.renderedRangeChangeSubscription = this.virtualScrollViewport.renderedRangeStream.subscribe(renderedRange => {
      this.renderedRangeChange.emit(renderedRange);
      this.restoreActiveCellAfterRenderedRangeUpdate();
    });
  }

  ngDoCheck() {
    this.cdkVirtualFor?.ngDoCheck();
  }

  ngOnDestroy() {
    this.cdkVirtualFor?.ngOnDestroy();
    this.virtualScrollViewport?.ngOnDestroy();
    this.renderedRangeChangeSubscription?.unsubscribe();
  }

  private patchKeyNavigationControllerSetActiveCell() {
    const _setActiveCell = this.datagridKeyNavigationController.setActiveCell;

    this.datagridKeyNavigationController.setActiveCell = (activeCellElement: HTMLElement) => {
      _setActiveCell.call(this.datagridKeyNavigationController, activeCellElement);
      this.activeCellElement = activeCellElement;
    };
  }

  private restoreActiveCellAfterRenderedRangeUpdate() {
    if (this.activeCellElement && this.activeCellElement.tabIndex === 0) {
      setTimeout(() => {
        this.datagridKeyNavigationController.setActiveCell(this.activeCellElement);
      });
    }
  }

  private updateCdkVirtualForInputs() {
    if (this.cdkVirtualFor) {
      for (const cdkVirtualForInputKey of Object.keys(this._cdkVirtualForInputs) as CdkVirtualForInputKey[]) {
        if (this.cdkVirtualFor[cdkVirtualForInputKey] !== this._cdkVirtualForInputs[cdkVirtualForInputKey]) {
          (this.cdkVirtualFor as any)[cdkVirtualForInputKey] = this._cdkVirtualForInputs[cdkVirtualForInputKey];
        }
      }
    }
  }

  private updateFixedSizeVirtualScrollInputs() {
    if (this.virtualScrollStrategy) {
      this.virtualScrollStrategy.updateItemAndBufferSize(
        this._cdkFixedSizeVirtualScrollInputs.itemSize,
        this._cdkFixedSizeVirtualScrollInputs.minBufferPx,
        this._cdkFixedSizeVirtualScrollInputs.maxBufferPx
      );
    }
  }
}

function createVirtualScrollViewportForDatagrid(
  changeDetectorRef: ChangeDetectorRef,
  ngZone: NgZone,
  directionality: Directionality,
  scrollDispatcher: ScrollDispatcher,
  viewportRuler: ViewportRuler,
  datagridElementRef: ElementRef<HTMLElement>,
  virtualScrollStrategy: FixedSizeVirtualScrollStrategy
) {
  const datagridDivElement = datagridElementRef.nativeElement.querySelector<HTMLElement>('.datagrid')!;
  const datagridTableElement = datagridElementRef.nativeElement.querySelector<HTMLElement>('.datagrid-table')!;
  const datagridHeaderElement = datagridElementRef.nativeElement.querySelector<HTMLElement>('.datagrid-header')!;
  const datagridDivElementRef: ElementRef<HTMLElement> = { nativeElement: datagridDivElement };

  let topOffset = 0;
  let totalContentSize = 0;

  function updateDatagridElementStyles() {
    datagridTableElement.style.transform = `translateY(${topOffset}px)`;
    datagridTableElement.style.height = `${totalContentSize - topOffset}px`;
    datagridHeaderElement.style.top = `-${topOffset}px`;
  }

  const virtualScrollViewport = new CdkVirtualScrollViewport(
    datagridDivElementRef,
    changeDetectorRef,
    ngZone,
    virtualScrollStrategy,
    directionality,
    scrollDispatcher,
    viewportRuler
  );

  const virtualScrollViewportContentWrapperElementRef: ElementRef = {
    nativeElement: {
      style: {
        set transform(value: any) {
          topOffset = value === undefined ? 0 : +/translateY\(([0-9]+)px\)/.exec(value)![1];
          updateDatagridElementStyles();
        },
      },
    },
  };

  virtualScrollViewport._contentWrapper = virtualScrollViewportContentWrapperElementRef;

  virtualScrollViewport.setTotalContentSize = (value: number) => {
    totalContentSize = value;
    updateDatagridElementStyles();
  };

  return virtualScrollViewport;
}
