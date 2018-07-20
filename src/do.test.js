import _do from './do'

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

describe('do', () => {
  test('run', () => {
    const left = _do(Monad, function*() {
      const a = yield Monad.pure(1)
      return a
    })
    expect(left).toEqual({v:1})
  })
})
