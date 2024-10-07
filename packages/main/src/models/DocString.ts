export class DocString extends String {
  mediaType: string;

  constructor(content: string, mediaType: string = '') {
    super(content);
    this.mediaType = mediaType;
  }

  toString(): string {
    return this.valueOf();
  }

  [Symbol.toPrimitive](hint: string): string | number {
    if (hint === 'number') {
      return Number(this.valueOf());
    }
    return this.valueOf();
  }
}
