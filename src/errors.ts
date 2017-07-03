export class NoMatchingRoute extends Error {
  // tslint:disable-next-line variable-name
  private __proto__ = NoMatchingRoute.prototype;

  constructor(message: string) {
    super(message);
    this.name = 'NoMatchingRoute';
  }
}

export class InvalidHTTPMethod extends Error {
  // tslint:disable-next-line variable-name
  private __proto__ = InvalidHTTPMethod.prototype;

  constructor(verb: string) {
    super(`Invalid HTTP Verb: ${verb}`);
    this.name = 'InvalidHTTPMethod';
  }
}
