import { CommunicationLayer } from "../interfaces/CommunicationLayer";
import { DeviceAction, DeviceTree } from "../interfaces/DeviceTree";

export class HTTPCommunicationLayer implements CommunicationLayer {
  private timeoutId: number | null = null;
  private actionsTimeoutId: number | null = null;

  deviceTree: DeviceTree[] | null = null;
  private onDeviceTreeUpdate: ((deviceTree: DeviceTree[]) => void) | null =
    null;

  deviceActions: DeviceAction[] | null = null;
  private onDeviceActionsUpdate:
    | ((deviceActions: DeviceAction[]) => void)
    | null = null;

  constructor(private serverUrl: string, private pollInterval: number = 3000) {}

  setDeviceTree(deviceTree: DeviceTree[]): void {
    this.deviceTree = deviceTree;
    if (this.onDeviceTreeUpdate) {
      this.onDeviceTreeUpdate(deviceTree);
    }
  }

  setDeviceActions(deviceActions: DeviceAction[]): void {
    this.deviceActions = deviceActions;
    if (this.onDeviceActionsUpdate) {
      this.onDeviceActionsUpdate(deviceActions);
    }
  }

  setOnDeviceTreeUpdate(
    onDeviceTreeUpdate: (deviceTree: DeviceTree[]) => void
  ): void {
    this.onDeviceTreeUpdate = onDeviceTreeUpdate;
  }

  setOnDeviceActionsUpdate(
    onDeviceActionsUpdate: (deviceActions: DeviceAction[]) => void
  ): void {
    this.onDeviceActionsUpdate = onDeviceActionsUpdate;
  }

  start(): void {
    this.pollDeviceTree();
    this.pollActions();
  }

  stop(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    } else if (this.actionsTimeoutId) {
      clearTimeout(this.actionsTimeoutId);
      this.actionsTimeoutId = null;
    }
  }

  private pollDeviceTree(): void {
    fetch(`${this.serverUrl}/device-tree`)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error(`Server responded with status ${response.status}`);
        }
      })
      .then((deviceTree: DeviceTree[]) => {
        this.setDeviceTree(deviceTree);
      })
      .catch((error) => {
        console.error("Error fetching device tree:", error);
      })
      .finally(() => {
        this.timeoutId = setTimeout(
          () => this.pollDeviceTree(),
          this.pollInterval
        );
      });
  }

  private pollActions(): void {
    fetch(`${this.serverUrl}/actions`)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error(`Server responded with status ${response.status}`);
        }
      })
      .then((deviceActions: DeviceAction[]) => {
        this.setDeviceActions(deviceActions);
      })
      .catch((error) => {
        console.error("Error fetching device tree:", error);
      })
      .finally(() => {
        this.actionsTimeoutId = setTimeout(
          () => this.pollActions(),
          this.pollInterval
        );
      });
  }
}
