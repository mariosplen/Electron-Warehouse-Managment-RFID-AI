import { RaddecReading } from "../types/RaddecReading";

export class ReaderStack {
  constructor(private items: RaddecReading[], seconds: number) {
    this.removeOldReadingsInterval(seconds);
  }

  get(): RaddecReading[] {
    return this.items;
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

  removeOld(seconds: number): void {
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
}
