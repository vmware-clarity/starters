import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class CustomClrColumnOrderingService {
  readonly grabbedColumn = new BehaviorSubject<any>(null);
}
