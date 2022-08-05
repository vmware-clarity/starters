import { faker } from '@faker-js/faker';
import readableBytes from 'readable-bytes';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import formatDistance from 'date-fns/formatDistance';

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
  hostCpu: string;
  hostMemory: string;
  guestMemoryPercent: string;
  activeMemory: string;
  dramReadBandwidth: string;
  pMemReadBandwidth: string;
  guestOS: string;
  compatibility: string;
  memorySize: string;
  reservation: string;
  cpus: string;
  nics: string;
  uptime: string;
  ipAddress: string;
  vmToolsVersionStatus: string;
  vmToolsRunningStatus: string;
  dnsName: string;
  evcCpuMode: string;
  evcGraphicsMode: string;
  uuid: string;
  notes: string;
  alarmActions: string;
  haProtection: string;
  needsConsolidation: string;
  vmStoragePoliciesCompliance: string;
  encryption: string;
  tpm: string;
  vbs: string;
}

export interface Column {
  field: keyof Vm;
  displayName: string;
  hidden: boolean;
  width?: number;
}

export const columns: Column[] = [
  { field: 'id', displayName: 'Id', hidden: false },
  { field: 'name', displayName: 'Name', hidden: false },
  { field: 'state', displayName: 'State', hidden: false },
  { field: 'status', displayName: 'Status', hidden: false },
  { field: 'managedBy', displayName: 'Managed By', hidden: true, width: 200 },
  { field: 'host', displayName: 'Host', hidden: true },
  { field: 'cluster', displayName: 'Cluster', hidden: true },
  { field: 'faultDomain', displayName: 'Fault Domain', hidden: true },
  { field: 'provisionedSpace', displayName: 'Provisioned Space', hidden: false },
  { field: 'usedSpace', displayName: 'Used Space', hidden: false },
  { field: 'hostCpu', displayName: 'Host CPU', hidden: false },
  { field: 'hostMemory', displayName: 'Host Memory', hidden: false },
  { field: 'guestMemoryPercent', displayName: 'Guest Mem - %', hidden: true },
  { field: 'activeMemory', displayName: 'Active Memory', hidden: true },
  { field: 'dramReadBandwidth', displayName: 'DRAM Read Bandwidth', hidden: true },
  { field: 'pMemReadBandwidth', displayName: 'PMem Read Bandwidth', hidden: true },
  { field: 'guestOS', displayName: 'Guest OS', hidden: true },
  { field: 'compatibility', displayName: 'Compatibility', hidden: true, width: 200 },
  { field: 'memorySize', displayName: 'Memory Size', hidden: true },
  { field: 'reservation', displayName: 'Reservation', hidden: true },
  { field: 'cpus', displayName: 'CPUs', hidden: true },
  { field: 'nics', displayName: 'NICs', hidden: true },
  { field: 'uptime', displayName: 'Uptime', hidden: true },
  { field: 'ipAddress', displayName: 'IP Address', hidden: true },
  { field: 'vmToolsVersionStatus', displayName: 'VM Tools Version Status', hidden: true },
  { field: 'vmToolsRunningStatus', displayName: 'VM Tools Running Status', hidden: true },
  { field: 'dnsName', displayName: 'DNS Name', hidden: true },
  { field: 'evcCpuMode', displayName: 'EVC CPU Mode', hidden: true },
  { field: 'evcGraphicsMode', displayName: 'EVC Graphics Mode (vSGA)', hidden: true },
  { field: 'uuid', displayName: 'UUID', hidden: true, width: 300 },
  { field: 'notes', displayName: 'Notes', hidden: true, width: 400 },
  { field: 'alarmActions', displayName: 'Alarm Actions', hidden: true },
  { field: 'haProtection', displayName: 'HA Protection', hidden: true },
  { field: 'needsConsolidation', displayName: 'Needs Consolidation', hidden: true },
  { field: 'vmStoragePoliciesCompliance', displayName: 'VM Storage Policies Compliance', hidden: true },
  { field: 'encryption', displayName: 'Encryption', hidden: true },
  { field: 'tpm', displayName: 'TPM', hidden: true },
  { field: 'vbs', displayName: 'VBS', hidden: true },
];

const defaultQuery: VmQuery = {
  pageIndex: 0,
  pageSize: 10,
  seed: 100,
};

const bytesPerGB = 1000000000;
const bytesPerTB = 1000000000000;
const hoursPerMonth = 24 * 30;
const millisecondsPerHour = 1000 * 60 * 60;

const stateOptions = [
  ...Array.from(new Array(20)).map(() => 'Powered On'),
  ...Array.from(new Array(10)).map(() => 'Powered Off'),
  'Starting Up',
  'Shutting Down',
  'Suspended',
];

const operatingSystemOptions = [
  ...Array.from(new Array(10)).map(() => 'Windows'),
  ...Array.from(new Array(7)).map(() => 'Ubuntu'),
  ...Array.from(new Array(6)).map(() => 'Red Hat'),
  ...Array.from(new Array(4)).map(() => 'Knoppix'),
  ...Array.from(new Array(4)).map(() => 'Debian'),
  ...Array.from(new Array(3)).map(() => 'OpenSUSE'),
  ...Array.from(new Array(1)).map(() => 'Mac OS'),
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
  const provisionedMemory = faker.datatype.number(127 * bytesPerGB) + bytesPerGB;
  const usedMemoryPercentage = faker.datatype.number(100);
  const usedMemory = (provisionedMemory * usedMemoryPercentage) / 100;

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
    hostCpu: `${(faker.datatype.number(500) + 100) / 100} GHz`,
    hostMemory: readableBytes(provisionedMemory),
    guestMemoryPercent: `${usedMemoryPercentage}%`,
    activeMemory: readableBytes(usedMemory),
    dramReadBandwidth: `${(faker.datatype.number(10000) + 100) / 100} Gbit/s`,
    pMemReadBandwidth: `${(faker.datatype.number(1000) + 100) / 100} Gbit/s`,
    guestOS: faker.helpers.arrayElement(operatingSystemOptions),
    compatibility: `ESXi ${faker.datatype.number(100) / 10} ${faker.random
      .alpha(2)
      .toUpperCase()} and later (VM version ${faker.datatype.number(99)})`,
    memorySize: readableBytes(provisionedMemory),
    reservation: readableBytes(usedMemory),
    cpus: Math.pow(2, faker.datatype.number(5)).toString(),
    nics: faker.datatype.number(4).toString(),
    uptime: formatDistance(
      new Date(),
      new Date(new Date().getTime() - faker.datatype.number(hoursPerMonth) * millisecondsPerHour)
    ),
    ipAddress: faker.internet.ip(),
    vmToolsVersionStatus: `${faker.datatype.number(99999)} (${faker.helpers.arrayElement([
      'Not installed',
      '3rd-party/Independent',
    ])})`,
    vmToolsRunningStatus: faker.helpers.arrayElement(stateOptions),
    dnsName: faker.internet.domainName(),
    evcCpuMode: faker.hacker.adjective(),
    evcGraphicsMode: faker.hacker.abbreviation(),
    uuid: faker.datatype.uuid(),
    notes: faker.hacker.phrase(),
    alarmActions: faker.helpers.arrayElement(['Enabled', 'Disabled']),
    haProtection: faker.helpers.arrayElement(['Enabled', 'Disabled']),
    needsConsolidation: faker.helpers.arrayElement(['Required', 'Not Required']),
    vmStoragePoliciesCompliance: faker.hacker.adjective(),
    encryption: faker.helpers.arrayElement(['Yes', 'No']),
    tpm: faker.helpers.arrayElement(['Present', 'Not Present']),
    vbs: faker.helpers.arrayElement(['Present', 'Not Present']),
  };

  return vm;
}
