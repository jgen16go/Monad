const isUndefOrNullable = (x) => x === null || x === undefined

class Maybe {
  constructor(_v) {
    this.v = _v
  }
  isJust() {
    return !isUndefOrNullable(this.v)
  }
  bind(f) {
    return this.isJust() ? f(this.v) : Maybe.nothing()
  }
  static pure(a) {
    return Maybe.just(a)
  }
  static just(a) {
    return new Maybe(a)
  }
  static nothing() {
    return new Maybe(null)
  }
  value() {
    return this.v
  }
}

export default Maybe
