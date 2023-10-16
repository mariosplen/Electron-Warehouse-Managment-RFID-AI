import { RaddecReading } from "../types/RaddecReading";

export class ReaderStack {
  constructor(private items: RaddecReading[], garbageCollector: number) {
    this.removeOldReadingsInterval(garbageCollector);
  }

  get(oldestItemInSeconds: number): RaddecReading[] {
    return this.getLastReading(oldestItemInSeconds);
  }

  push(newItem: RaddecReading): void {
    // check if item with same transmitterSignature exists, if it does remove it
    for (let i = this.items.length - 1; i >= 0; i--) {
      if (this.items[i].transmitterSignature === newItem.transmitterSignature) {
        this.items.splice(i, 1);
      }
    }
    this.items.push(newItem);
  }

  private removeOld(seconds: number): void {
    const now = new Date().getTime();

    for (let i = this.items.length - 1; i >= 0; i--) {
      if (this.items[i].timestamp < now - seconds * 1000) {
        this.items = this.items.slice(i + 1, -1); // remove old readings, from the moment when the first reading is older we can remove all the previous readings
        return;
      }
    }
  }

  private removeOldReadingsInterval(seconds: number): void {
    setInterval(() => {
      this.removeOld(seconds);
    }, seconds * 1000);
  }

  // todo: need to test this
  private getLastReading(seconds: number): RaddecReading[] {
    const now = new Date().getTime();
    return this.items.filter((item) => item.timestamp > now - seconds * 1000);
  }
}
