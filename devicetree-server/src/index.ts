import { PORT } from "./constants";
import HTTPServerCommunicationLayer from "./communication-layers/HTTPCommunicationLayer";

const HTTPCommunicationLayer = new HTTPServerCommunicationLayer(PORT);

HTTPCommunicationLayer.start();
