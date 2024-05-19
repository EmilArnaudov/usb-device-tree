import { DeviceTree } from "./DeviceTree";

export interface CommunicationLayer {
  deviceTree: DeviceTree[] | null;
  setDeviceTree(deviceTree: DeviceTree[]): void;
  updateDeviceTree(): void;
  listenForUsbChanges(): void;
  handleUsbChanges(): void;
  start(): void;
  stop(): void;
}
