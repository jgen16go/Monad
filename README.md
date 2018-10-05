# Monad

[![CircleCI](https://circleci.com/gh/jgen16go/Monad/tree/master.svg?style=svg)](https://circleci.com/gh/jgen16go/Monad/tree/master)

## Maybe
### just
```
const f = x => typeof x === 'string' ? Maybe.nothing() : Maybe.just(x + 1)
const g = x => Maybe.just(x + 1)
const left = Maybe.just(1).bind(f).bind(g) // just 3 - {v:3}
```
### nothing
```
const f = x => typeof x === 'string' ? Maybe.nothing() : Maybe.just(x + 1)
const g = x => Maybe.just(x + 1)
const left = Maybe.just('1').bind(f).bind(g) // nothing - {v:null}
```

## Either
### right
```
const f = x => typeof x === 'string' ? Maybe.nothing() : Maybe.just(x + 1)
const g = x => Either.right(x + 1)
const left = Either.right(1).bind(f).bind(g) // right 3 - {l:null, r:3}
```
### left
```
const f = x => typeof x === 'string' ? Maybe.nothing() : Maybe.just(x + 1)
const g = x => Either.right(x + 1)
const left = Either.right('1').bind(f).bind(g) // right 3 - {l:'error', r:null}
```

## util
### pipe
```
const f = (x) => Maybe.just(x + 1)
const g = (x) => Maybe.just(x * 2)
const left = pipe([f, g])(Maybe.just(1))
```
```
const f = x => Either.right(x)
const g = x => typeof x === 'string' ? Either.left('error') : Either.right(x)
const left = pipe([f, g])(Either.right(1))
```

### do
```
const left = _do(Maybe, function*() {
  const a = yield Maybe.just(1)
  const b = yield Maybe.just(1)
  const c = yield Maybe.just(a + b)
  return c
})
```
```
const left = _do(Either, function*() {
  const a = yield Either.right(1)
  const b = yield Either.right(1)
  const c = yield Either.right(a + b)
  return c
})
```
