# USB Device Tree Viewer

USB Device Tree Viewer is a client-server application that displays a live tree of USB devices connected to the server's machine using standard HTTP polling.

## Features

- Displays a tree of connected USB devices and hubs.
- Updates the tree in real-time when devices are connected or disconnected.
- Shows vendor and product IDs, device type (hub or device), and string descriptor if available.
- Abstract communication layer allowing the use of different communication protocols (e.g., HTTP, WebSockets, TCP sockets, etc.).
- Implemented using Node.js (server) and React.js (client).

## Start the ui

1. Open devicetree-ui folder with VSCode.
2. Run 'npm i' in terminal.
3. Run 'npm run dev'.

## Start the server

1. Open devicetree-server folder with VSCode.
2. Run 'npm i' in terminal.
3. Run 'npm start'.
