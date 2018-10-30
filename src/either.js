const isUndefOrNullable = (x) => x === null || x === undefined

export class Either {
  constructor(_l, _r) {
    this.l = _l
    this.r = _r
  }
  isLeft() {
    return !isUndefOrNullable(this.l)
  }
  isRight() {
    return !isUndefOrNullable(this.r)
  }
  bind(f) {
    return this.isRight() ? f(this.r) : Either.left(this.l)
  }
  static pure(a) {
    return Either.right(a)
  }
  static right(a) {
    return new Either(null, a)
  }
  static left(a) {
    return new Either(a, null)
  }
  value() {
    return this.isLeft() ? this.l : this.r
  }
}

export const Right = Either.right
export const Left = Either.left
