import { Component, Show, createEffect, createSignal, onCleanup, onMount } from 'solid-js'
import { Dynamic } from 'solid-js/web'

import { getIcon } from './assets'
import { SWIPE_THRESHOLD } from './const'
import Loading from './loading'
import type { ToastClassnames, ToastProps } from './types'

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

const Toast: Component<ToastProps> = (props) => {
  let toastRef: HTMLLIElement | undefined
  let dragStartTime: Date | undefined
  let pointerStartRef: { x: number; y: number } | undefined

  const [mounted, setMounted] = createSignal(false)
  const [removed, setRemoved] = createSignal(false)
  const [swiping, setSwiping] = createSignal(false)
  const [swipeOut, setSwipeOut] = createSignal(false)
  const [initialHeight, setInitialHeight] = createSignal(0)
  const [offsetBeforeRemove, setOffsetBeforeRemove] = createSignal(0)

  const toast = () => props.toast
  const coords = () => props.position.split('-')

  const heightIndex = () => props.heights.findIndex((height) => height.toastId === toast().id) || 0
  const toastsHeightBefore = () =>
    props.heights.reduce(
      (prev, current, toastIndex) => (toastIndex < heightIndex() ? prev + current.height : prev),
      0,
    )

  const offset = () => toastsHeightBefore() + heightIndex() * props.gap
  const dismissible = () => !!toast().dismissible
  const loading = () => toast().type === 'loading'
  const disabled = loading

  const deleteToast = () => {
    setRemoved(true)
    setOffsetBeforeRemove(offset())

    props.setHeights((heights) => {
      const index = heights.findIndex((height) => height.toastId === toast().id)
      if (index !== -1) {
        heights.splice(index, 1)
      }
      return [...heights]
    })

    setTimeout(() => {
      props.removeToast(toast())
    }, 200)
  }

  onMount(() => {
    requestAnimationFrame(() => {
      setMounted(true)
    })
  })

  // update height
  createEffect(() => {
    if (!mounted() || !toastRef) {
      return
    }

    const originalHeight = toastRef.style.height
    toastRef.style.height = 'auto'
    const newHeight = toastRef.getBoundingClientRect().height
    toastRef.style.height = originalHeight

    setInitialHeight(newHeight)

    props.setHeights((heights) => {
      const targetHeight = heights.find((height) => height.toastId === toast().id)
      if (targetHeight) {
        targetHeight.height = newHeight
      } else {
        heights.unshift({ toastId: toast().id, height: newHeight })
      }

      return [...heights]
    })
  })

  // cleanup timer when hovering
  createEffect(() => {
    let timerId: number

    if (toast().promise && loading()) {
      return
    }

    if (!props.expanded) {
      timerId = setTimeout(() => {
        toast().onAutoClose?.(toast())
        deleteToast()
      }, toast().duration ?? props.duration)
    }

    onCleanup(() => timerId && clearTimeout(timerId))
  })

  createEffect(() => {
    if (toast().dismissed && !removed()) {
      deleteToast()
      toast().onDismiss?.(toast())
    }
  })

  return (
    <li
      aria-atomic="true"
      role="status"
      tabIndex={0}
      ref={toastRef}
      data-sonner-toast
      data-index={props.index}
      data-mounted={mounted()}
      data-removed={removed()}
      data-styled={!(toast().jsx || toast().unstyled || props.unstyled)}
      data-x-position={coords()[1]}
      data-y-position={coords()[0]}
      data-type={toast().type}
      data-front={props.index === 0}
      data-visible={props.index < props.visibleToasts}
      data-expanded={Boolean(props.expanded || (props.expandByDefault && mounted()))}
      data-promise={!!toast().promise}
      data-swiping={swiping()}
      data-swipe-out={swipeOut()}
      data-dismissible={dismissible()}
      class={cn(
        props.className,
        toast().className,
        props.classNames?.toast,
        props.classNames?.[toast().type as keyof ToastClassnames],
        toast().classNames?.[toast().type as keyof ToastClassnames],
      )}
      style={{
        '--index': props.index,
        '--toasts-before': props.index,
        '--z-index': props.toasts.length - props.index,
        '--offset': `${removed() ? offsetBeforeRemove() : offset()}px`,
        '--initial-height': initialHeight(),
        ...props.style,
        ...toast().style,
      }}
      onpointerdown={(event) => {
        if (disabled() || !dismissible()) return
        dragStartTime = new Date()
        setOffsetBeforeRemove(offset())
        // Ensure we maintain correct pointer capture even when going outside of the toast (e.g. when swiping)
        ;(event.target as HTMLElement).setPointerCapture(event.pointerId)
        if ((event.target as HTMLElement).tagName === 'BUTTON') return
        setSwiping(true)
        pointerStartRef = { x: event.clientX, y: event.clientY }
      }}
      onpointerup={() => {
        if (swipeOut() || !dismissible) return

        pointerStartRef = undefined
        const swipeAmount = Number(
          toastRef?.style.getPropertyValue('--swipe-amount').replace('px', '') || 0,
        )
        const timeTaken = new Date().getTime() - (dragStartTime?.getTime() || 0)
        const velocity = Math.abs(swipeAmount) / timeTaken

        // Remove only if threshold is met
        if (Math.abs(swipeAmount) >= SWIPE_THRESHOLD || velocity > 0.11) {
          setOffsetBeforeRemove(offset())
          toast().onDismiss?.(toast())
          deleteToast()
          setSwipeOut(true)
          return
        }

        toastRef?.style.setProperty('--swipe-amount', '0px')
        setSwiping(false)
      }}
      onpointermove={(event) => {
        if (!pointerStartRef || !dismissible()) return

        const yPosition = event.clientY - pointerStartRef.y
        const xPosition = event.clientX - pointerStartRef.x

        const clamp = coords()[0] === 'top' ? Math.min : Math.max
        const clampedY = clamp(0, yPosition)
        const swipeStartThreshold = event.pointerType === 'touch' ? 10 : 2
        const isAllowedToSwipe = Math.abs(clampedY) > swipeStartThreshold

        if (isAllowedToSwipe) {
          toastRef?.style.setProperty('--swipe-amount', `${yPosition}px`)
        } else if (Math.abs(xPosition) > swipeStartThreshold) {
          // User is swiping in wrong direction so we disable swipe gesture
          // for the current pointer down interaction
          pointerStartRef = undefined
        }
      }}
    >
      <Show when={props.closeButton && !toast().jsx}>
        <button
          aria-label="Close toast"
          data-disabled={disabled()}
          data-close-button
          class={cn(props.classNames?.closeButton, toast().classNames?.closeButton)}
          onClick={() => {
            if (!disabled() && dismissible()) {
              deleteToast()
              toast().onDismiss?.(toast())
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </Show>
      <Show
        when={toast().jsx || typeof toast().title !== 'string'}
        fallback={
          <>
            <Show when={toast().icon || getIcon(toast().type) || toast().promise}>
              <div data-icon>
                <Show when={(toast().promise || loading()) && !toast().icon}>
                  {props.loadingIcon ? (
                    <div class="loader" data-visible={loading()}>
                      {props.loadingIcon}
                    </div>
                  ) : (
                    <Loading visible={loading()} />
                  )}
                </Show>
                <Dynamic component={toast().icon ? () => toast().icon : getIcon(toast().type)} />
              </div>
            </Show>
            <div data-content>
              <div data-title class={cn(props.classNames?.title, toast().classNames?.title)}>
                {toast().title}
              </div>
              <Show when={toast().description}>
                <div
                  data-description
                  class={cn(
                    props.descriptionClassName,
                    toast().descriptionClassName,
                    props.classNames?.description,
                    toast().classNames?.description,
                  )}
                >
                  {toast().description}
                </div>
              </Show>
            </div>
            <Show when={toast().action}>
              <button
                data-button=""
                style={toast().actionButtonStyle || props.actionButtonStyle}
                class={cn(props.classNames?.actionButton, toast()?.classNames?.actionButton)}
                onClick={(event) => {
                  toast().action?.onClick?.(event)
                  if (event.defaultPrevented) return
                  deleteToast()
                }}
              >
                {toast().action?.label}
              </button>
            </Show>
            <Show when={toast().cancel}>
              <button
                data-button
                data-cancel
                style={toast().cancelButtonStyle || props.cancelButtonStyle}
                class={cn(props.classNames?.cancelButton, toast().classNames?.cancelButton)}
                onClick={() => {
                  if (!dismissible()) return
                  deleteToast()
                  toast().cancel?.onClick?.()
                }}
              >
                {toast().cancel?.label}
              </button>
            </Show>
          </>
        }
      >
        <Dynamic component={() => toast().jsx || toast().title} />
      </Show>
    </li>
  )
}

export default Toast
