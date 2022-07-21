import { BehaviorSubject, Observable } from "rxjs";

export class GridStateService {

    readonly pageIndex = new BehaviorSubject<number>(0);
    readonly pageSize = new BehaviorSubject<number>(50);
    readonly selectedMap = new BehaviorSubject<{ [key: string]: true }>({});
    readonly totalResults: Observable<number>;
    readonly pageCount: Observable<number>;
    readonly selectedCount: Observable<number>;

    constructor() {
           debounceTime(0),
      switchMap(([pageIndex, pageSize]) => dataService.loadPage(pageIndex, pageSize).pipe(startWith(null)))
    );

    this.totalResults = dataService.getTotalResults().pipe(share());

    this.pageCount = combineLatest([this.totalResults, this.pageSize]).pipe(
      map(([totalResults, pageSize]) => Math.ceil(totalResults / pageSize))
    );

    this.selectedCount = this.selectedMap.pipe(map(map => Object.keys(map).length));
    }

}