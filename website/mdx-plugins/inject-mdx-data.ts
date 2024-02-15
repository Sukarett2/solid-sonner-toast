import type { TOCData } from '~/typing/mdx'

import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import type { Plugin } from 'rollup'
import { unified } from 'unified'
import { matter } from 'vfile-matter'
import type { VFile } from 'vfile-matter/lib'

interface Node {
  type: string
  tagName?: string
  properties?: { id?: string }
  depth?: number
  value?: string
  children?: Node[]
}

const getTOCData = () => (root: Node, file: { data?: any }) => {
  const tagNameToDepth: Record<string, number> = {
    h1: 1,
    h2: 2,
    h3: 3,
  }
  const res: TOCData[] = []
  if (!(root.type === 'root' && root.children?.length)) {
    return
  }

  const map: Record<string, TOCData> = {}
  for (const child of root.children) {
    const id = child.properties?.id
    const title = child.children?.[0]?.value
    const depth = tagNameToDepth[child.tagName ?? '']

    if (id && title && depth) {
      const parentDepth = depth - 1
      const parent = map[parentDepth]
      const node: TOCData = { id, title, children: [] }

      if (parent) {
        parent.children?.push(node)
      } else {
        res.push(node)
      }

      map[`${depth}`] = node
    }
  }

  const data = file.data || {}
  file.data = {
    ...data,
    toc: res,
  }
}

const getFrontMatter = () => (_: Node, file: VFile) => {
  matter(file)
}

export const injectMDXData = (): Plugin => {
  return {
    name: 'inject-mdx-data',
    async transform(code, id) {
      if (/.(mdx|md)$/.test(id)) {
        const result = await unified()
          .use(remarkParse)
          .use(remarkFrontmatter)
          .use(remarkMdxFrontmatter)
          .use(getFrontMatter)
          .use(remarkRehype)
          .use(rehypeSlug)
          .use(getTOCData)
          .use(rehypeStringify)
          .process(code)

        const contentData = {
          raw: code,
          toc: result.data?.toc,
          matter: result.data?.matter,
        }

        return { meta: { contentData } }
      }
    },
    renderChunk(code, chunk) {
      const moduleId = chunk.facadeModuleId || ''
      const moduleMeta = this.getModuleInfo(moduleId)?.meta

      const contentData = moduleMeta?.contentData || {}

      this.emitFile({
        type: 'asset',
        fileName: `${chunk.name}.json`,
        source: JSON.stringify({
          code,
          ...contentData,
        }),
      })
    },
  }
}
