export interface USBDeviceInfo {
  vendorId: number;
  productId: number;
  type: "Device" | "Hub";
  parent: { vendorId: number; productId: number } | null;
  manufacturer?: string;
  product?: string;
  serialNumber?: string;
}

export interface DeviceTree {
  id: string;
  info: USBDeviceInfo;
  children: DeviceTree[];
}

export interface DeviceAction {
  type: "connected" | "disconnected";
  message: string;
}
