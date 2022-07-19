export interface VirtualMachine {
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
