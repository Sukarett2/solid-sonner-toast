import Sidebar from '~/components/sidebar'
import { sidebarConfig } from '~/config/docs'

import { JSXElement } from 'solid-js'

export default function DocsLayout(props: { children: JSXElement }) {
  return (
    <div class="container px-12 mx-auto items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      <Sidebar items={sidebarConfig} />
      <main class="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
        {props.children}
      </main>
    </div>
  )
}
