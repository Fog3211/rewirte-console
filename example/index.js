const MyConsole = require('../dist/index.umd')

const myConsole = new MyConsole()

myConsole.filter({
  global,
  methods: ['warn', 'error']
})

console.log('abcd', 123, [33, 81])
console.error('test error')

myConsole.reset()

console.warn('kkkkkk', {})
console.log('abcd', 123)
