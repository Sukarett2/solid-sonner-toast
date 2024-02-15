import { Component, For, createEffect, createSignal, onCleanup } from 'solid-js'
import { produce } from 'solid-js/store'

import { GAP, TOAST_LIFETIME, VIEWPORT_OFFSET, VISIBLE_TOASTS, WIDTH } from './const'
import { setToasts, toasts } from './state'
import './style.css'
import Toast from './toast'
import type { HeightT, ToastT, ToasterProps } from './types'

function getDocumentDirection(): ToasterProps['dir'] {
  if (typeof window === 'undefined') return 'ltr'
  if (typeof document === 'undefined') return 'ltr' // For Fresh purpose

  const dirAttribute = document.documentElement.getAttribute('dir')

  if (dirAttribute === 'auto' || !dirAttribute) {
    return window.getComputedStyle(document.documentElement).direction as ToasterProps['dir']
  }

  return dirAttribute as ToasterProps['dir']
}

const Toaster: Component<ToasterProps> = (props) => {
  const position = () => props.position || 'bottom-right'
  const coords = () => (props.position || 'bottom-right').split('-')

  const [expanded, setExpanded] = createSignal(false)
  const [heights, setHeights] = createSignal<HeightT[]>([])
  const [actualTheme, setActualTheme] = createSignal(
    props.theme !== 'system'
      ? props.theme
      : typeof window !== 'undefined'
        ? window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : 'light',
  )

  createEffect(() => {
    if (props.theme !== 'system') {
      setActualTheme(props.theme ?? 'light')
      return
    }

    if (typeof window === 'undefined') {
      return
    }

    if (props.theme === 'system') {
      // check if current preference is dark
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // it's currently dark
        setActualTheme('dark')
      } else {
        // it's not dark
        setActualTheme('light')
      }
    }

    const updateTheme = ({ matches }: MediaQueryListEvent) => {
      if (matches) {
        setActualTheme('dark')
      } else {
        setActualTheme('light')
      }
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme)

    onCleanup(() => {
      if (typeof window !== 'undefined') {
        window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', updateTheme)
      }
    })
  })

  const removeToast = (toast: ToastT) => {
    setToasts(
      produce((toasts) => {
        const index = toasts.findIndex((t) => t.id === toast.id)
        toasts.splice(index, 1)
      }),
    )
  }

  return (
    <section tabIndex={-1}>
      <ol
        tabIndex={-1}
        dir={props.dir === 'auto' || props.dir === undefined ? getDocumentDirection() : props.dir}
        data-sonner-toaster=""
        data-x-position={coords()[1]}
        data-y-position={coords()[0]}
        data-rich-colors={!!props.richColors}
        data-theme={actualTheme()}
        class={props.className}
        style={{
          '--front-toast-height': `${heights()[0]?.height}px`,
          '--offset':
            typeof props.offset === 'number'
              ? `${props.offset}px`
              : props.offset || VIEWPORT_OFFSET,
          '--width': `${WIDTH}px`,
          '--gap': `${GAP}px`,
          ...props.style,
        }}
        onmouseenter={() => setExpanded(true)}
        onmouseleave={() => setExpanded(false)}
      >
        <For each={toasts}>
          {(toast, index) => (
            <Toast
              toast={toast}
              toasts={toasts}
              heights={heights()}
              position={position()}
              closeButton={!!props.closeButton}
              visibleToasts={props.visibleToasts ?? VISIBLE_TOASTS}
              duration={props.duration ?? TOAST_LIFETIME}
              expandByDefault={props.expand}
              loadingIcon={props.loadingIcon}
              invert={props.invert}
              gap={props.gap ?? GAP}
              index={index()}
              expanded={expanded()}
              setToasts={setToasts}
              setHeights={setHeights}
              removeToast={removeToast}
              style={props.toastOptions?.style}
              unstyled={props.toastOptions?.unstyled}
              className={props.toastOptions?.className}
              classNames={props.toastOptions?.classNames}
              descriptionClassName={props.toastOptions?.descriptionClassName}
              cancelButtonStyle={props.toastOptions?.cancelButtonStyle}
              actionButtonStyle={props.toastOptions?.actionButtonStyle}
            />
          )}
        </For>
      </ol>
    </section>
  )
}

export default Toaster
