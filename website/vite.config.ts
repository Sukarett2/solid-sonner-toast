import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'

import { defineConfig } from '@solidjs/start/config'
// @ts-ignore
import pkg from '@vinxi/plugin-mdx'

const { default: mdx } = pkg
export default defineConfig({
  start: {
    extensions: ['mdx', 'md'],
  },
  plugins: [
    mdx.withImports({})({
      jsx: true,
      jsxImportSource: 'solid-js',
      providerImportSource: 'solid-mdx',
      rehypePlugins: [
        rehypePrettyCode({ keepBackground: false, theme: 'github-light' }),
        rehypeSlug,
      ],
    }),
  ],
})
