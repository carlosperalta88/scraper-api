export default (...fns) => (x) => fns.reduceRight((y, f) => f(y), x)
