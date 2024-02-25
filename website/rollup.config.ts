import { readdirSync } from 'fs'
import path from 'path'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGFM from 'remark-gfm'
import remarkMDXFrontmatter from 'remark-mdx-frontmatter'
import type { RollupOptions } from 'rollup'
import { fileURLToPath } from 'url'

import mdx from '@mdx-js/rollup'
import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

import { injectMDXData, renderMDXData } from './mdx-plugins'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const contentFiles = readdirSync(path.resolve(__dirname, 'src/contents'), 'utf-8')
const inputs = contentFiles.map((file) => ({
  path: path.resolve(__dirname, `src/contents/${file}`),
  name: file,
}))

const rollupOptions = inputs.map(
  (input): RollupOptions => ({
    input: input.path,
    output: {
      dir: 'contents',
      name: 'Component',
      format: 'iife',
      footer: '; return Component',
    },
    plugins: [
      injectMDXData(),
      nodeResolve(),
      mdx({
        jsxImportSource: 'solid-jsx',
        jsx: true,
        remarkPlugins: [remarkFrontmatter, remarkMDXFrontmatter, remarkGFM],
        rehypePlugins: [
          rehypeSlug,
          [rehypePrettyCode, { keepBackground: false, theme: 'github-light' }],
        ],
      }),
      typescript(),
      babel({
        presets: ['solid'],
        babelHelpers: 'bundled',
        extensions: ['.js', '.jsx', '.cjs', '.mjs', '.md', '.mdx', '.tsx', 'ts'],
      }),
      renderMDXData(),
    ],
    logLevel: 'silent',
  }),
)

export default rollupOptions
