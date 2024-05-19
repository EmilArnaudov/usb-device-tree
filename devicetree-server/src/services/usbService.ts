import { usb, getDeviceList } from "usb";
import { USBDeviceInfo } from "../interfaces/DeviceTree";

export async function listUSBDevices(): Promise<USBDeviceInfo[]> {
  const devices: usb.Device[] = getDeviceList();
  const mappedDevicesPromises = devices.map(async (device) => {
    const { deviceDescriptor } = device;
    const { idProduct, idVendor } = deviceDescriptor;

    const isHub = deviceDescriptor.bDeviceClass === usb.LIBUSB_CLASS_HUB;
    const parent = device.parent
      ? {
          vendorId: device.parent.deviceDescriptor.idVendor,
          productId: device.parent.deviceDescriptor.idProduct,
        }
      : null;

    const deviceInfo: USBDeviceInfo = {
      vendorId: Number(idVendor),
      productId: Number(idProduct),
      type: isHub ? "Hub" : "Device",
      parent,
    };

    try {
      device.open();

      const manufacturer = await getStringDescriptorAsync(
        device,
        deviceDescriptor.iManufacturer
      );
      if (manufacturer) {
        deviceInfo.manufacturer = manufacturer;
      }

      const product = await getStringDescriptorAsync(
        device,
        deviceDescriptor.iProduct
      );
      if (product) {
        deviceInfo.product = product;
      }

      const serialNumber = await getStringDescriptorAsync(
        device,
        deviceDescriptor.iSerialNumber
      );
      if (serialNumber) {
        deviceInfo.serialNumber = serialNumber;
      }
    } catch (error) {
      // console.log(error);
    }

    return deviceInfo;
  });

  const mappedDevices = await Promise.all(mappedDevicesPromises);

  return mappedDevices;
}

function getStringDescriptorAsync(
  device: usb.Device,
  descriptor: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    device.getStringDescriptor(descriptor, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}
