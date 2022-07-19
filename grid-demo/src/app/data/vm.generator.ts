import { faker } from '@faker-js/faker';
import readableBytes from 'readable-bytes';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface VmQuery {
  pageIndex: number;
  pageSize: number;
  seed: number;
}

export interface Vm {
  id: string;
  name: string;
  state: string;
  status: string;
  managedBy: string;
  host: string;
  cluster: string;
  faultDomain: string;
  provisionedSpace: string;
  usedSpace: string;
}

const defaultQuery: VmQuery = {
  pageIndex: 0,
  pageSize: 10,
  seed: 100,
};

export function generateVms(partialQuery: Partial<VmQuery>) {
  const query = { ...defaultQuery, ...partialQuery };

  faker.seed(query.seed);

  const totalCount = +faker.random.numeric(4, { allowLeadingZeros: false });

  const vms: Vm[] = [];

  const skip = query.pageIndex * query.pageSize;
  const take = query.pageSize;

  for (let i = 0; i < totalCount && i < skip + take; i++) {
    const vmNumber = i + 1;

    const vm: Vm = {
      id: `${query.seed}-${vmNumber}`,
      ...generateVm(),
    };

    if (vmNumber > skip) {
      vms.push(vm);
    }
  }

  return of({ vms, totalCount }).pipe(delay(1000));
}

function generateVm() {
  const provisionedSpace = +faker.random.numeric(10);
  const usedSpace = +`0.${faker.random.numeric(1)}` * provisionedSpace;

  const vm: Omit<Vm, 'id'> = {
    name: faker.name.firstName(),
    state: faker.helpers.arrayElement(['Powered On', 'Powered Off']),
    status: 'Normal',
    managedBy: faker.helpers.arrayElement(['', '', '', 'vSphere ESX Agent Manager']),
    host: faker.internet.ipv4(),
    cluster: faker.helpers.arrayElement(['Cluster1', 'Cluster2', 'Cluster3', 'Cluster4', 'Cluster5']),
    faultDomain: '',
    provisionedSpace: readableBytes(provisionedSpace),
    usedSpace: readableBytes(usedSpace),
  };

  return vm;
}
