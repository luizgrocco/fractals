const SURROGATE_PAIR_REGEXP = /[\uD800-\uDBFF][\uDC00-\uDFFF]/;

type SingleCharType = string;

// In V8 (used by Chrome and Node), the maximum length is 2^29 - 24 (~1GiB). On 32-bit systems, the maximum length is 2^28 - 16 (~512MiB).
// In Firefox, the maximum length is 2^30 - 2 (~2GiB). Before Firefox 65, the maximum length was 2^28 - 1 (~512MiB).
// In Safari, the maximum length is 2^31 - 1 (~4GiB).
const STRING_LIMIT = 5;

export class UnlimitedString {
  batches: string[] = [];

  constructor(text = "") {
    this.createBatch();
    this.append(text);
  }

  get length() {
    try {
      return this.batches.reduce(
        (acc, item) => acc + Array.from(item).length,
        0
      );
    } catch (error) {
      console.log(
        "***** Warning: showing approximate length, due to JS limitations on large arrays *****",
        error
      );

      return (
        (this.batches.length - 1) * STRING_LIMIT +
        this.batches[this.batches.length - 1].length
      );
    }
  }

  append(text: string) {
    text = UnlimitedString.removeCombiningMarks(text);

    if (text.length <= this.availableSpaceInCurrentBatch()) {
      this.appendToCurrentBatch(text);

      return;
    }

    let space = this.availableSpaceInCurrentBatch();

    // Are we about to split exactly in the middle of a surrogate pair?
    if (SURROGATE_PAIR_REGEXP.test(text.slice(space - 1, space + 1))) space--;

    if (space === 0) {
      this.createBatch();
      this.append(text);

      return;
    }

    this.appendToCurrentBatch(text.slice(0, space));
    this.append(text.slice(space));
  }

  forEach(callback: (char: SingleCharType, index: number) => void) {
    let i = 0;

    for (const batch of this.batches)
      for (const character of batch) callback(character, i++);
  }

  *[Symbol.iterator]() {
    for (const batch of this.batches)
      for (const character of batch) yield character;
  }

  private createBatch() {
    this.batches[this.batches.length] = "";
  }

  private availableSpaceInCurrentBatch() {
    return STRING_LIMIT - this.batches[this.batches.length - 1].length;
  }

  private appendToCurrentBatch(text: string) {
    if (text.length > this.availableSpaceInCurrentBatch())
      throw new Error(
        `Cannot append text with length ${
          text.length
        } to current batch (only ${this.availableSpaceInCurrentBatch()} characters left)`
      );

    this.batches[this.batches.length - 1] += text;

    if (this.availableSpaceInCurrentBatch() === 0) this.createBatch();
  }

  private static removeCombiningMarks(text: string) {
    return text.normalize("NFC");
  }
}
