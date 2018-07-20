import Maybe from './maybe'
import _do from './do'
import pipe from './pipe'

describe('Maybe', () => {
  describe('モナド則', () => {
    test('`return x >>= f` should be equal `f a`', () => {
      // モナドから取り出した値に関数を適用するのと関数を値に適用することは等しい
      const f = (x) => Maybe.just(x + 1)
      const left = Maybe.just(1).bind(f)
      const right = f(1)
      expect(left).toEqual(right)
    })

    test('`m >>= return` should be equal `m`', () => {
      // モナドから取り出した値をモナドに格納したものは元のモナドと等しい
      const m = Maybe.just(1)
      const left = Maybe.just(m.value())
      const right = m
      expect(left).toEqual(right)
    })

    test('`(m >>= f) >>= g` should be equal `m >>= (x -> f x >>= g)`', () => {
      // (m * f) * g == m * (f * g)
      // mf >>= g == m >>= fgのように見立てます。どちらもmがf→gの順に渡されます。処理される順番が同じなので、fやgがどのような関数であっても結果は同じです。
      const f = (x) => Maybe.just(x + 1)
      const g = (x) => Maybe.just(x * 2)
      const left = Maybe.just(Maybe.just(1).bind(f).value()).bind(g)
      const right = Maybe.just(f(1).bind(g)).value()
      expect(left).toEqual(right)
    })
  })

  describe('methods', () => {
    test(`nothing`, () => {
      const left = Maybe.nothing()
      expect(left).toEqual({v: null})
    })

    test(`just`, () => {
      const left = Maybe.just(1)
      expect(left).toEqual({v: 1})
    })

    test(`pure`, () => {
      const left = Maybe.pure(1)
      expect(left).toEqual({v: 1})
    })

    test('bind just', () => {
      const f = (x) => Maybe.just(x + 1)
      const m = Maybe.just(1)
      const left = m.bind(f)
      expect(left).toEqual({v: 2})
    })

    test('bind nothing', () => {
      const f = (x) => Maybe.just(x + 1)
      const m = Maybe.just(null)
      const left = m.bind(f)
      expect(left).toEqual({v: null})
    })

    test(`chaining just`, () => {
      const f = (x) => Maybe.just(x + 1)
      const g = (x) => Maybe.just(x * 2)
      const left = Maybe.just(1).bind(f).bind(g)
      expect(left).toEqual({v: 4})
    })

    test(`chaining nothing`, () => {
      const f = (x) => Maybe.just(x + 1)
      const g = (x) => typeof x === 'number' ? Maybe.nothing() : x
      const left = Maybe.just(1).bind(f).bind(g)
      expect(left).toEqual({v: null})
    })

    test(`pipe just`, () => {
      const f = (x) => Maybe.just(x + 1)
      const g = (x) => Maybe.just(x * 2)
      const left = pipe([f, g])(Maybe.just(1))
      expect(left).toEqual({v: 4})
    })

    test(`pipe single just`, () => {
      const f = (x) => Maybe.just(x + 1)
      const left = pipe(f)(Maybe.just(1))
      expect(left).toEqual({v: 2})
    })

    test(`pipe nothing`, () => {
      const f = (x) => typeof x === 'number' ? Maybe.nothing() : x;
      const g = (x) => Maybe.just(x * 2)
      const left = pipe([f, g])(Maybe.just(1))
      expect(left).toEqual({v: null})
    })

    test('do just', () => {
      const left = _do(Maybe, function*() {
        const a = yield Maybe.just(1)
        const b = yield Maybe.just(1)
        const c = yield Maybe.just(a + b)
        return c
      })
      expect(left).toEqual({v: 2})
    })

    test('do nothing', () => {
      const left = _do(Maybe, function*() {
        const a = yield Maybe.just(1)
        const b = yield Maybe.nothing()
        const c = yield Maybe.just(a + b)
        return c
      })
      expect(left).toEqual({v: null})
    })
  })
})
