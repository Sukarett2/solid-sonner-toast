import type { JSX, JSXElement, Setter } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'

export type PromiseT<Data = unknown> = Promise<Data> | (() => Promise<Data>)

export type Position =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-right'
  | 'bottom-center'
  | 'bottom-left'

export type ToastTypes =
  | 'normal'
  | 'action'
  | 'success'
  | 'info'
  | 'warning'
  | 'error'
  | 'loading'
  | 'default'

export type PromiseData<Data> = {
  loading?: JSXElement
  success?: JSXElement | ((data: Data) => JSXElement)
  error?: JSXElement | ((data: Data) => JSXElement)
  description?: JSXElement | ((data: Data) => JSXElement)
  finally?: void | (() => Promise<void>)
}

export type ToastT = {
  id: string | number
  type?: ToastTypes
  duration?: number
  title?: string | JSXElement
  description?: JSXElement
  jsx?: JSXElement
  position?: Position
  promise?: PromiseT
  icon?: JSXElement
  unstyled?: boolean
  dismissed?: boolean
  dismissible?: boolean
  className?: string
  descriptionClassName?: string
  classNames?: ToastClassnames
  style?: JSX.CSSProperties
  cancelButtonStyle?: JSX.CSSProperties
  actionButtonStyle?: JSX.CSSProperties
  action?: {
    label: string
    onClick?: (
      event?: MouseEvent & {
        currentTarget: HTMLButtonElement
        target: Element
      },
    ) => void
  }
  cancel?: {
    label: string
    onClick?: () => void
  }
  onDismiss?: (toast: ToastT) => void
  onAutoClose?: (toast: ToastT) => void
}

export interface ToastClassnames {
  toast?: string
  title?: string
  description?: string
  loader?: string
  closeButton?: string
  cancelButton?: string
  actionButton?: string
  success?: string
  error?: string
  info?: string
  warning?: string
  default?: string
  content?: string
  icon?: string
}

interface ToastOptions {
  className?: string
  descriptionClassName?: string
  style?: JSX.CSSProperties
  cancelButtonStyle?: JSX.CSSProperties
  actionButtonStyle?: JSX.CSSProperties
  duration?: number
  unstyled?: boolean
  classNames?: ToastClassnames
}

export interface ToasterProps {
  dir?: 'rtl' | 'ltr' | 'auto'
  theme?: 'light' | 'dark' | 'system'
  invert?: boolean
  expand?: boolean
  duration?: number
  gap?: number
  offset?: string | number
  className?: string
  style?: JSX.CSSProperties
  position?: Position
  visibleToasts?: number
  loadingIcon?: JSXElement
  closeButton?: boolean
  richColors?: boolean
  toastOptions?: ToastOptions
}

export interface ToastProps {
  toast: ToastT
  toasts: ToastT[]
  heights: HeightT[]
  position: Position
  visibleToasts: number
  index: number
  gap: number
  duration: number
  expanded: boolean
  closeButton: boolean
  setToasts: SetStoreFunction<ToastT[]>
  removeToast: (toast: ToastT) => void
  setHeights: Setter<HeightT[]>
  unstyled?: boolean
  invert?: boolean
  expandByDefault?: boolean
  loadingIcon?: JSXElement
  style?: JSX.CSSProperties
  className?: string
  descriptionClassName?: string
  classNames?: ToastClassnames
  cancelButtonStyle?: JSX.CSSProperties
  actionButtonStyle?: JSX.CSSProperties
}

export type HeightT = {
  toastId: string | number
  height: number
}

export type ExternalToast = Omit<ToastT, 'id'> & {
  id?: string | number
}
