import express, { Request, Response } from "express";
import { Server as HTTPServer } from "http";
import { CommunicationLayer } from "../interfaces/CommunicationLayer";
import { DeviceAction, DeviceTree } from "../interfaces/DeviceTree";
import { usb } from "usb";
import { listUSBDevices } from "../services/usbService";
import { buildDeviceTree } from "../services/deviceTreeService";
import cors from "cors";

class HTTPServerCommunicationLayer implements CommunicationLayer {
  deviceTree: DeviceTree[] | null = null;
  actions: DeviceAction[] | null = null;
  httpServer: HTTPServer;
  port: number;

  constructor(port: number) {
    const app = express();

    app.use(cors());
    app.get("/device-tree", (_req: Request, res: Response) => {
      if (this.deviceTree) {
        res.json(this.deviceTree);
      } else {
        res.status(204).send();
      }
    });

    app.get("/actions", (_req: Request, res: Response) => {
      res.json(this.actions);
    });

    this.httpServer = new HTTPServer(app);
    this.port = port;
    this.updateDeviceTree();
  }

  setDeviceTree(deviceTree: DeviceTree[]): void {
    this.deviceTree = deviceTree;
  }

  listenForUsbChanges(): void {
    usb.on("attach", (device: usb.Device) => {
      const { deviceDescriptor } = device;
      const { idProduct, idVendor } = deviceDescriptor;

      const action: DeviceAction = {
        type: "connected",
        message: `Device ${`${idVendor}-${idProduct}`} has been connected.`,
      };
      if (!this.actions) {
        this.actions = [];
      }
      this.actions.unshift(action);
      this.handleUsbChanges();
    });

    usb.on("detach", (device: usb.Device) => {
      const { deviceDescriptor } = device;
      const { idProduct, idVendor } = deviceDescriptor;

      const action: DeviceAction = {
        type: "disconnected",
        message: `Device ${`${idVendor}-${idProduct}`} has been disconnected.`,
      };
      if (!this.actions) {
        this.actions = [];
      }
      this.actions.unshift(action);
      this.handleUsbChanges();
    });
  }

  handleUsbChanges(): void {
    this.updateDeviceTree();
  }

  async updateDeviceTree(): Promise<void> {
    const deviceInfos = await listUSBDevices();
    const newDeviceTree = buildDeviceTree(deviceInfos);

    this.setDeviceTree(newDeviceTree);
  }

  start(): void {
    this.listenForUsbChanges();
    this.httpServer.listen(this.port, () => {
      console.log(`Server started on localhost:${this.port}`);
    });
  }

  stop(): void {
    this.httpServer.close(() => {
      console.log("Server closed.");
    });
  }
}

export default HTTPServerCommunicationLayer;
