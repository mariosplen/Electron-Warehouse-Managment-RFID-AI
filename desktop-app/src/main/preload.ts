import { contextBridge } from "electron";
import { TCPClient } from "./utils/tcpClient";

let client: TCPClient = null;

const startTCPClient = (serverHost: string, serverPort: number) => {
  client = new TCPClient(serverHost, serverPort);
};

contextBridge.exposeInMainWorld("electron", {
  getCurrentEpcs: () => client.getCurrentEpcs(),
  startTCPClient: (serverHost: string, serverPort: number) =>
    startTCPClient(serverHost, serverPort),
});
