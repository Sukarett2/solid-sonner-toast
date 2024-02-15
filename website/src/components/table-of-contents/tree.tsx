import type { TOCData } from '~/typing/mdx'
import { cn } from '~/utils/style'

import { Component, For, Show, createEffect, createSignal, onCleanup } from 'solid-js'

const createActiveItem = (ids: string[]) => {
  const [activeItem, setActiveItem] = createSignal()

  createEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveItem(entry.target.id)
          }
        })
      },
      { rootMargin: `0% 0% -80% 0%` },
    )

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) {
        observer.observe(el)
      }
    })

    onCleanup(() => {
      ids.forEach((id) => {
        const el = document.getElementById(id)
        if (el) {
          observer.unobserve(el)
        }
      })
    })
  })

  return activeItem
}

interface TreeProps {
  items: TOCData[]
  level?: number
}

export const Tree: Component<TreeProps> = (props) => {
  const activeItem = createActiveItem(props.items.map((item) => item.id ?? ''))

  return (
    <ul class={cn('m-0 list-none', { 'pl-4': props.level && props.level !== 1 })}>
      <For each={props.items}>
        {(item) => {
          const href = `#${item.id}`
          return (
            <li class="mt-0! pt-2">
              <a
                href={href}
                class={cn(
                  'inline-block no-underline transition-colors hover:text-foreground',
                  item.id === activeItem()
                    ? 'font-medium text-foreground'
                    : 'text-muted-foreground',
                )}
              >
                {item.title}
              </a>
              <Show when={item.children.length}>
                <Tree items={item.children} level={(props.level ?? 1) + 1} />
              </Show>
            </li>
          )
        }}
      </For>
    </ul>
  )
}
