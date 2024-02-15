import TableOfContents from '~/components/table-of-contents'
import type { MDXData } from '~/typing/mdx'

import { Match, Show, Switch, createSignal } from 'solid-js'
import { Fragment } from 'solid-jsx'

import { Navigate, type RouteDefinition, RouteSectionProps, createAsync } from '@solidjs/router'
import { clientOnly } from '@solidjs/start'

const MDXComponent = clientOnly(() => import('~/components/mdx-component'))

const getMDX = async (params?: Record<string, string>) => {
  try {
    const slug = params?.slug

    if (slug === undefined) {
      return undefined
    }

    const mdx: MDXData = await import(`../../../contents/${slug}.json`)
    return mdx
  } catch (error: any) {
    console.error(error)
  }

  return undefined
}

export const route = {
  load: async (args) => getMDX(args.params),
} satisfies RouteDefinition

const Doc = (props: RouteSectionProps) => {
  const mdx = createAsync(() => getMDX(props.params))
  const [mdxComponentMounted, setMDXComponentMounted] = createSignal(false)

  return (
    <Show when={props.params.slug} fallback={<Navigate href="/docs/getting-started" />}>
      <Fragment>
        <div class="prose mx-auto w-full min-w-0">
          <h1>{mdx()?.matter?.title}</h1>
          <MDXComponent mdx={mdx()} onMount={() => setMDXComponentMounted(true)} />
        </div>
        <Show when={mdx()?.toc && mdxComponentMounted()}>
          <TableOfContents toc={mdx()?.toc!} />
        </Show>
      </Fragment>
    </Show>
  )
}

export default Doc
