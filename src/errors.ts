export class NoMatchingRoute extends Error {
  // tslint:disable-next-line variable-name
  private __proto__ = NoMatchingRoute.prototype;

  constructor(message?: string) {
    super(message);
    this.name = 'NoMatchingRoute';
  }

  public toString() {
    return this.name + ': ' + this.message;
  }
}
