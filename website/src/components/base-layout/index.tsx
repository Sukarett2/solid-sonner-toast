import { JSXElement } from 'solid-js'

import SiteHeader from '../site-header'

const BaseLayout = (props: { children: JSXElement }) => {
  return (
    <div class="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main class="flex-1">{props.children}</main>
    </div>
  )
}

export default BaseLayout
