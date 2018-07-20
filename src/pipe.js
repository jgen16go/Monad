const pipe = (fns) => {
  const task = typeof fns === 'function' ? [fns] : fns
  return input => task.reduce((output, curr) => output.bind(curr), input)
}

export default pipe
