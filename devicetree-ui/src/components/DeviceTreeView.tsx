// client/components/DeviceTreeView.tsx
import React, { useEffect, useState } from "react";
import DeviceNode from "./DeviceNode";
import { HTTPCommunicationLayer } from "../communication-layers/HTTPCommunicationLayer";
import { DeviceAction, DeviceTree } from "../interfaces/DeviceTree";

interface DeviceTreeViewProps {
  serverUrl: string;
}

const DeviceTreeView: React.FC<DeviceTreeViewProps> = ({ serverUrl }) => {
  const [deviceTree, setDeviceTree] = useState<DeviceTree[] | null>(null);
  const [deviceActions, setDeviceActions] = useState<DeviceAction[] | null>(
    null
  );
  const httpClient = new HTTPCommunicationLayer(serverUrl);

  useEffect(() => {
    httpClient.setOnDeviceActionsUpdate(setDeviceActions);
    httpClient.setOnDeviceTreeUpdate(setDeviceTree);
    httpClient.start();

    return () => {
      httpClient.stop();
    };
  }, []);

  return (
    <div className="device-tree-view">
      {deviceTree ? (
        deviceTree.map((node) => <DeviceNode key={`${node.id}`} node={node} />)
      ) : (
        <div>Loading device tree...</div>
      )}
      <div className="device-messages">
        {deviceActions &&
          deviceActions.map((msg, index) => (
            <div
              key={index}
              className={`device-message device-message-${msg.type}`}
            >
              {msg.message}
            </div>
          ))}
      </div>
    </div>
  );
};

export default DeviceTreeView;
