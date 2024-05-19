// client/App.tsx
import React from "react";
import DeviceTreeView from "./components/DeviceTreeView";
import { PORT, SERVER_URL } from "./constants";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="app-container">
      <h1>Connected Devices</h1>
      <DeviceTreeView serverUrl={`${SERVER_URL}:${PORT}`} />
    </div>
  );
};

export default App;
