'use strict'

const fabric = require('@umijs/fabric')

module.exports = {
  ...fabric.prettier,
  jsxSingleQuote: true,
  semi: false,
  printWidth: 150,
}
