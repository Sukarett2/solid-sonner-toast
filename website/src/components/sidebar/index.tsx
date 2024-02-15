import { Component, For } from 'solid-js'

import { A } from '@solidjs/router'

type SidebarItem = {
  title: string
  href?: string
  children?: SidebarItem[]
}

interface SidebarProps {
  items: SidebarItem[]
}

const Sidebar: Component<SidebarProps> = (props) => {
  return (
    <aside class="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
      <div class="h-full py-6 pr-6 lg:py-8">
        <For each={props.items}>
          {(item) => (
            <div class="pb-4">
              <h4 class="mb-1 rounded-md px-2 py-1 text-sm font-semibold">{item.title}</h4>
              <For each={item.children}>
                {(child) => (
                  <A
                    end
                    href={child.href || ''}
                    class="text-sm group flex w-full items-center rounded-md border border-transparent px-2 py-1 mb-1"
                    activeClass="font-medium text-foreground"
                    inactiveClass="text-muted-foreground hover:font-medium hover:text-foreground"
                  >
                    {child.title}
                  </A>
                )}
              </For>
            </div>
          )}
        </For>
      </div>
    </aside>
  )
}

export default Sidebar
