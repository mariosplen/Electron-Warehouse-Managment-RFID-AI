export interface RaddecReading {
  timestamp: number;
  transmitterId: string;
  transmitterIdType: number;
  transmitterSignature: number;
  numberOfDecodings: number;
  receiverAntenna: number;
  receiverId: string;
  receiverIdType: number;
  rssi: number;
  receiverSignature: string;
}
