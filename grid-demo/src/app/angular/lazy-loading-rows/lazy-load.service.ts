import { ListRange } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { from, Subject } from 'rxjs';
import { debounceTime, distinct, map, scan, mergeMap, startWith, switchMap } from 'rxjs/operators';

import { Vm, generateVms } from '../../data/vm.generator';

const pageSize = 10;

@Injectable()
export class LazyLoadService {
  private readonly listRange = new Subject<ListRange>();

  getVms() {
    return getTotalResults().pipe(
      switchMap(totalResults =>
        this.listRange.pipe(
          debounceTime(250),
          map(range => getPageIndexesInView(range)),
          switchMap(pages => from(pages)),
          distinct(),
          mergeMap(pageIndex => generateVms({ pageIndex, pageSize }).pipe(map(data => ({ vms: data.vms, pageIndex })))),
          scan(
            (allVms: Vm[], data: { vms: Vm[]; pageIndex: number }) => {
              const before = allVms.slice(0, data.pageIndex * pageSize);
              const after = allVms.slice(data.pageIndex * pageSize + pageSize);
              return [...before, ...data.vms, ...after];
            },
            Array.from(Array(totalResults)).map(() => null as any as Vm)
          ),
          startWith(Array.from(Array(totalResults)).map(() => null as any as Vm)),
          map(vms => ({
            vms,
            totalResults,
            loadedCount: vms.filter(vm => vm).length,
          }))
        )
      )
    );
  }

  updateRange(range: ListRange) {
    this.listRange.next(range);
  }
}

function getPageIndexesInView(range: ListRange) {
  const from = Math.floor(range.start / pageSize);
  const to = Math.floor(range.end / pageSize);

  return Array.from(Array(to - from + 1)).map((_, index) => index + from);
}

function getTotalResults() {
  return generateVms({ pageIndex: 0, pageSize: 0 }).pipe(map(data => data.totalCount));
}
