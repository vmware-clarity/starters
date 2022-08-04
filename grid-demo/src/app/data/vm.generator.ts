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

export interface Column {
  field: keyof Vm;
  displayName: string;
  hidden: boolean;
}

export const columns: Column[] = [
  { field: 'id', displayName: 'Id', hidden: false },
  { field: 'name', displayName: 'Name', hidden: false },
  { field: 'state', displayName: 'State', hidden: false },
  { field: 'status', displayName: 'Status', hidden: false },
  { field: 'managedBy', displayName: 'Managed By', hidden: true },
  { field: 'host', displayName: 'Host', hidden: true },
  { field: 'cluster', displayName: 'Cluster', hidden: true },
  { field: 'faultDomain', displayName: 'Fault Domain', hidden: true },
  { field: 'provisionedSpace', displayName: 'Provisioned Space', hidden: false },
  { field: 'usedSpace', displayName: 'Used Space', hidden: false },
];

const defaultQuery: VmQuery = {
  pageIndex: 0,
  pageSize: 10,
  seed: 100,
};

const bytesPerGB = 1000000000;
const bytesPerTB = 1000000000000;

const stateOptions = [
  ...Array.from(new Array(20)).map(() => 'Powered On'),
  ...Array.from(new Array(10)).map(() => 'Powered Off'),
  'Starting Up',
  'Shutting Down',
  'Suspended',
];

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
  const provisionedSpace = faker.datatype.number(30 * bytesPerTB + bytesPerGB);
  const usedSpace = faker.datatype.number(provisionedSpace);

  const vm: Omit<Vm, 'id'> = {
    name: `${faker.word.noun()}-${faker.datatype.uuid().substring(0, 8)}`,
    state: faker.helpers.arrayElement(stateOptions),
    status: faker.helpers.arrayElement(['Normal', 'Normal', 'Normal', 'Normal', 'Fault']),
    managedBy: `vSphere ${faker.random.alpha(3).toUpperCase()} Agent Manager`,
    host: faker.internet.ipv4(),
    cluster: `Cluster ${Math.ceil(faker.datatype.number(99))}`,
    faultDomain: faker.internet.domainName(),
    provisionedSpace: readableBytes(provisionedSpace),
    usedSpace: readableBytes(usedSpace),
  };

  return vm;
}
