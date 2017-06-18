export class NoMatchingRoute extends Error {
  private __proto__ = NoMatchingRoute.prototype;

  constructor(message?: string) {
    super(message);
    this.name = 'NoMatchingRoute';
  }

  toString() {
    return this.name + ': ' + this.message;
  }
}
