import Either from './either'
import _do from './do'
import pipe from './pipe'

describe('Either', () => {
  describe('モナド則', () => {
    test('`return x >>= f` should be equal `f a`', () => {
      // モナドから取り出した値に関数を適用するのと関数を値に適用することは等しい
      const f = (x) => Either.right(x + 1)
      const left = Either.right(1).bind(f)
      const right = f(1)
      expect(left).toEqual(right)
    })

    test('`m >>= return` should be equal `m`', () => {
      // モナドから取り出した値をモナドに格納したものは元のモナドと等しい
      const m = Either.right(1)
      const left = Either.right(m.value())
      const right = m
      expect(left).toEqual(right)
    })

    test('`(m >>= f) >>= g` should be equal `m >>= (x -> f x >>= g)`', () => {
      // (m * f) * g == m * (f * g)
      // mf >>= g == m >>= fgのように見立てます。どちらもmがf→gの順に渡されます。処理される順番が同じなので、fやgがどのような関数であっても結果は同じです。
      const f = (x) => Either.right(x + 1)
      const g = (x) => Either.right(x * 2)
      const left = Either.right(Either.right(1).bind(f).value()).bind(g)
      const right = Either.right(f(1).bind(g)).value()
      expect(left).toEqual(right)
    })
  })

  describe('methods', () => {
    test('left', () => {
      const left = Either.left('error')
      expect(left).toEqual({l:'error', r:null})
    })

    test('right', () => {
      const left = Either.right(1)
      expect(left).toEqual({l:null, r:1})
    })

    test('pure', () => {
      const left = Either.pure(1)
      expect(left).toEqual({l:null, r:1})
    })

    test('bind right', () => {
      const f = x => Either.right(x)
      const m = Either.right(1)
      const left = m.bind(f)
      expect(left).toEqual({l:null, r:1})
    })

    test('bind left', () => {
      const f = x => Either.left('error')
      const m = Either.right(1)
      const left = m.bind(f)
      expect(left).toEqual({l:'error', r:null})
    })

    test('value left', () => {
      const m = Either.left('error')
      const left = m.value()
      expect(left).toEqual('error')
    })

    test('value right', () => {
      const m = Either.right(1)
      const left = m.value()
      expect(left).toEqual(1)
    })

    test('chaining left', () => {
      const f = x => Either.right(x)
      const g = x => typeof x === 'string' ? Either.left('error') : Either.right(x)
      const left = Either.right('1').bind(f).bind(g)
      expect(left).toEqual({l:'error', r:null})
    })

    test('chaining right', () => {
      const f = x => Either.right(x)
      const g = x => typeof x === 'string' ? Either.left('error') : Either.right(x)
      const left = Either.right(1).bind(f).bind(g)
      expect(left).toEqual({l:null, r:1})
    })

    test('pipe left', () => {
      const f = x => Either.right(x)
      const g = x => typeof x === 'string' ? Either.left('error') : Either.right(x)
      const left = pipe([f, g])(Either.right('1'))
      expect(left).toEqual({l:'error', r:null})
    })

    test('pipe right', () => {
      const f = x => Either.right(x)
      const g = x => typeof x === 'string' ? Either.left('error') : Either.right(x)
      const left = pipe([f, g])(Either.right(1))
      expect(left).toEqual({l:null, r:1})
    })

    test('pipe single right', () => {
      const f = x => Either.right(x)
      const g = x => typeof x === 'string' ? Either.left('error') : Either.right(x)
      const left = pipe(f)(Either.right(1))
      expect(left).toEqual({l:null, r:1})
    })

    test('do right', () => {
      const left = _do(Either, function*() {
        const a = yield Either.right(1)
        const b = yield Either.right(1)
        const c = yield Either.right(a + b)
        return c
      })
      expect(left).toEqual({l:null, r: 2})
    })

    test('do left', () => {
      const left = _do(Either, function*() {
        const a = yield Either.right(1)
        const b = yield Either.left('error')
        const c = yield Either.right(a + b)
        return c
      })
      expect(left).toEqual({l:'error', r: null})
    })
  })

})
