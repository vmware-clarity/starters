import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VirtualMachine } from './virtual-machine';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

const totalResults = 1000;

@Injectable({ providedIn: 'root' })
export class DataService {
  constructor(private readonly httpClient: HttpClient) {}

  loadPage(pageIndex: number, pageSize: number) {
    const skip = pageSize * pageIndex;
    const take = Math.min(pageSize, totalResults - skip);

    return this.httpClient.get<VirtualMachine[]>(
      `https://vsphere-fake.herokuapp.com/vms?skip=${skip}&take=${take}&seed=0`
    );
  }

  getTotalResults() {
    return of(totalResults).pipe(delay(1000));
  }
}
