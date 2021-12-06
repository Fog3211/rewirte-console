import MyConsole from './index'

const myConsole = new MyConsole()

myConsole.filter({
  // methods: ['warn', 'error']
  include: /a/
})

console.log('abcd', 123, [33, 81])
console.error('test error')

myConsole.reset()

console.warn('kkkkkk', {})
console.log('abcd', 123)
