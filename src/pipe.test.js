import pipe from './pipe'

class Monad {
  constructor(_v) {
    this.v = _v
  }
  bind(f) {
    return f(this.v)
  }
  static pure(a) {
    return new Monad(a)
  }
}

describe('pipe', () => {
  test('run', () => {
    const f = x => Monad.pure(x)
    const g = x => Monad.pure(x)
    const left = pipe([f, g])(Monad.pure(1))
    expect(left).toEqual({v:1})
  })
})
