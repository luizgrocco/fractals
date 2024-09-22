type SingleCharType = string;

// In V8 (used by Chrome and Node), the maximum length is 2^29 - 24 (~1GiB). On 32-bit systems, the maximum length is 2^28 - 16 (~512MiB).
// In Firefox, the maximum length is 2^30 - 2 (~2GiB). Before Firefox 65, the maximum length was 2^28 - 1 (~512MiB).
// In Safari, the maximum length is 2^31 - 1 (~4GiB).
const STRING_LIMIT = 5;

export class UnlimitedString {
  bacthes: string[] = [];
  batchIndex = 0;

  constructor(text = "") {
    this.bacthes[this.batchIndex] = "";

    this.append(text);
  }

  get length() {
    return this.bacthes.reduce((acc, item) => acc + Array.from(item).length, 0);
  }

  forEach(callback: (char: SingleCharType, index: number) => void) {
    let i = 0;

    for (const batch of this.bacthes)
      for (const character of batch) callback(character, i++);
  }

  append(text: string) {
    for (const character of text) this.concat(character);
  }

  private concat(character: SingleCharType) {
    if (this.bacthes[this.batchIndex].length + character.length > STRING_LIMIT)
      this.bacthes[++this.batchIndex] = ""; // Create a new batch.

    this.bacthes[this.batchIndex] += character;
  }
}
