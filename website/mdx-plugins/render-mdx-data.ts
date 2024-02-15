import type { Plugin } from 'rollup'

export const renderMDXData = (): Plugin => {
  return {
    name: 'render-mdx-data',
    // renderChunk(code, chunk) {
    //   const moduleId = chunk.facadeModuleId || ''
    //   const moduleMeta = this.getModuleInfo(moduleId)?.meta

    //   const raw = moduleMeta?._sourceCode
    //   const matter = moduleMeta?._matter
    //   const toc = moduleMeta?._toc

    //   this.emitFile({
    //     type: 'asset',
    //     fileName: `${chunk.name}.json`,
    //     source: JSON.stringify({
    //       code,
    //       raw,
    //       matter,
    //       toc,
    //     }),
    //   })
    // },
    generateBundle(_, bundle) {
      Object.keys(bundle).forEach((key) => {
        if (!/.json$/.test(key)) {
          delete bundle[key]
        }
      })
    },
  }
}
