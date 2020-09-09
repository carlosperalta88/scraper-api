const applyAsync = (acc, val) => acc.then(val)
export default (...fns) =>
  (initialValue) =>
    fns.reduce(applyAsync, Promise.resolve(initialValue))
