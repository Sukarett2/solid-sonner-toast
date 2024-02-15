module.exports = {
  printWidth: 100,
  tabWidth: 2,
  trailingComma: 'all',
  singleQuote: true,
  semi: false,
  importOrder: ['^solid', '^[a-z0-9]+', '^@[a-z]+', '^@/(.*)$', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
}
