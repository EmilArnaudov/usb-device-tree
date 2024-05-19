// client/components/DeviceNode.tsx
import React, { useState } from "react";
import { DeviceNodeProps } from "../interfaces/DeviceTree";

const DeviceNode: React.FC<DeviceNodeProps> = ({ node }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const toggleChildrenVisibility = () => {
    if (node.info.type === "Hub") {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="device-node">
      <div className="device-node-header" onClick={toggleChildrenVisibility}>
        <span className={`device-node-type device-node-type-${node.info.type}`}>
          {`${node.info.type} `}
        </span>
        <span className="device-node-vendor-product">
          {node.info.vendorId} - {node.info.productId}
        </span>
        {node.info.manufacturer && (
          <span className="device-node-additional-info">
            {node.info.manufacturer}
          </span>
        )}
        {node.info.product && (
          <span className="device-node-additional-info">
            {node.info.product}
          </span>
        )}
        {node.info.serialNumber && (
          <span className="device-node-additional-info">
            {node.info.serialNumber}
          </span>
        )}
      </div>
      {isExpanded && node.children && (
        <div className="device-node-children">
          {node.children.map((child) => (
            <DeviceNode key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DeviceNode;
