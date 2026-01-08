import yaml from 'js-yaml';

export class DocString extends String {
  mediaType: string;
  data?: any;

  constructor(content: string, mediaType: string = '') {
    super(content);
    this.mediaType = mediaType ?? '';
    if (this.mediaType) try {
      if (this.mediaType === 'json') this.data = JSON.parse(content);
      else if (this.mediaType?.match(/^ya?ml$/)) this.data = yaml.load(content) as any;
    } catch (e:any) {
      throw new Error(`parsing ${this.mediaType} content failed: ${e?.message || 'Unknown error'}${e?.stack ? '\n' + e.stack : ''}`);
    }
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
