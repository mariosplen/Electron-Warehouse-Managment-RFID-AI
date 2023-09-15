import * as net from "net";

interface RFIDData {
  [epc: string]: {
    timestamp: number;
  };
}

class TCPClient {
  private serverHost: string;
  private serverPort: number;
  private client: net.Socket;
  private detectedTags: RFIDData = {};

  constructor(serverHost: string, serverPort: number) {
    this.serverHost = serverHost;
    this.serverPort = serverPort;
    this.client = new net.Socket();
    this.connect();
  }

  private connect() {
    this.client.connect(this.serverPort, this.serverHost, () => {
      console.log("Connected to server");
    });

    this.client.on("data", (data) => {
      const rfidTag = data.toString().split(",");
      // console.log(rfidTag);
      this.detectedTags[rfidTag[0]] = {
        timestamp: Date.now(),
      };
    });

    this.client.on("close", () => {
      console.log("Connection closed");
    });
  }

  // removes tags older than 4 seconds and returns the current tags
  getCurrentEpcs() {
    const currentTime = Date.now();
    for (const epc in this.detectedTags) {
      if (this.detectedTags[epc].timestamp < currentTime - 4000) {
        delete this.detectedTags[epc];
      }
    }
    return this.detectedTags;
  }
}

export { TCPClient, RFIDData };
