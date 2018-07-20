const _do = (M, genfn) => {
  const gen = genfn()
  return recur(gen, null)
  function recur(gen, prev) {
    const {value, done} = gen.next(prev)
    const ma = value instanceof M ? value : M.pure(value)
    return ma.bind((a) => !done ? recur(gen, a) : M.pure(a))
  }
}

export default _do
