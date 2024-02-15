import type { MDXData } from '~/typing/mdx'

import { createMemo } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import * as runtime from 'solid-jsx'

// const components: Record<string, any> = {}

// const componentList = [
//   'a',
//   'code',
//   'figcaption',
//   'figure',
//   'h1',
//   'h2',
//   'h3',
//   'h4',
//   'hr',
//   'p',
//   'pre',
//   'span',
//   'table',
//   'tbody',
//   'thead',
//   'td',
//   'th',
//   'tr',
// ]

// componentList.forEach((Comp) => {
//   components[Comp] = (props: any) => <Comp {...(props || {})}>{props?.children}</Comp>
// })

const components = {
  a: (props: any) => <a {...props}>{props?.children}</a>,
  code: (props: any) => <code {...props}>{props?.children}</code>,
  figcaption: (props: any) => <figcaption {...props}>{props?.children}</figcaption>,
  figure: (props: any) => <figure {...props}>{props?.children}</figure>,
  h1: (props: any) => <h1 {...props}>{props?.children}</h1>,
  h2: (props: any) => <h2 {...props}>{props?.children}</h2>,
  h3: (props: any) => <h3 {...props}>{props?.children}</h3>,
  hr: (props: any) => <hr {...props}>{props?.children}</hr>,
  p: (props: any) => <p {...props}>{props?.children}</p>,
  pre: (props: any) => <pre {...props}>{props?.children}</pre>,
  span: (props: any) => <span {...props}>{props?.children}</span>,
  table: (props: any) => <table {...props}>{props?.children}</table>,
  tbody: (props: any) => <tbody {...props}>{props?.children}</tbody>,
  thead: (props: any) => <thead {...props}>{props?.children}</thead>,
  tr: (props: any) => <tr {...props}>{props?.children}</tr>,
  th: (props: any) => <th {...props}>{props?.children}</th>,
  td: (props: any) => <td {...props}>{props?.children}</td>,
}

interface MDXComponentProps {
  mdx?: MDXData
  onMount?: () => void
}

const MDXComponent = (props: MDXComponentProps) => {
  const component = createMemo(() => {
    if (props.mdx) {
      const code = props.mdx.code

      const scope = { ...runtime }
      const fn = new Function(...Object.keys(scope), code)
      const Comp = fn(...Object.values(scope))?.default

      props.onMount?.()

      return () => <Comp components={components} />
    }

    return undefined
  })

  return <Dynamic component={component()} />
}

export default MDXComponent
