import { DeviceTree } from "./DeviceTree";

export interface CommunicationLayer {
  deviceTree: DeviceTree[] | null;

  setDeviceTree(deviceTree: DeviceTree[]): void;
  start(): void;
  stop(): void;
}
