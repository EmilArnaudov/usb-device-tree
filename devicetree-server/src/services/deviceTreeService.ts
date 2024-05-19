import { DeviceTree, USBDeviceInfo } from "../interfaces/DeviceTree";

function addChildToParent(
  device: USBDeviceInfo,
  parentNode: DeviceTree
): boolean {
  if (
    device.parent &&
    device.parent.vendorId === parentNode.info.vendorId &&
    device.parent.productId === parentNode.info.productId
  ) {
    parentNode.children.push({
      id: `${device.vendorId}-${device.productId}`,
      info: device,
      children: [],
    });
    return true;
  }

  for (const childNode of parentNode.children) {
    if (addChildToParent(device, childNode)) {
      return true;
    }
  }

  return false;
}

export function buildDeviceTree(deviceList: USBDeviceInfo[]): DeviceTree[] {
  const deviceTree: DeviceTree[] = [];

  for (const device of deviceList) {
    if (!device.parent) {
      deviceTree.push({
        id: `${device.vendorId}-${device.productId}-${Math.random().toFixed(
          2
        )}`,
        info: device,
        children: [],
      });
    }
  }

  for (const device of deviceList) {
    if (device.parent) {
      for (const parentNode of deviceTree) {
        if (addChildToParent(device, parentNode)) {
          break;
        }
      }
    }
  }

  return deviceTree;
}
