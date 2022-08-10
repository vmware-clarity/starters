import { ClrDatagrid } from '@clr/angular';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';

import { getDatagridKeyNavigationController } from './datagrid-private-member.helpers';

const activeCellObservableCache = new WeakMap<ClrDatagrid, Observable<HTMLElement>>();

export function fromActiveCell(datagrid: ClrDatagrid) {
  return activeCellObservableCache.get(datagrid) || createAndCacheActiveCellObservable(datagrid);
}

function createAndCacheActiveCellObservable(datagrid: ClrDatagrid) {
  const activeCellObservable = createActiveCellObservable(datagrid).pipe(
    share({
      resetOnError: false,
      resetOnComplete: false,
      resetOnRefCountZero: false,
    })
  );

  activeCellObservableCache.set(datagrid, activeCellObservable);

  return activeCellObservable;
}

function createActiveCellObservable(datagrid: ClrDatagrid) {
  return new Observable<HTMLElement>(observer => {
    const keyNavigationController = getDatagridKeyNavigationController(datagrid);
    const _setActiveCell = keyNavigationController.setActiveCell;

    keyNavigationController.setActiveCell = activeCellElement => {
      _setActiveCell.call(keyNavigationController, activeCellElement);

      observer.next(activeCellElement);
    };

    return function unsubscribe() {
      keyNavigationController.setActiveCell = _setActiveCell;
    };
  });
}
