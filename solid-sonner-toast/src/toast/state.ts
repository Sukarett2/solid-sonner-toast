import { JSXElement } from 'solid-js'
import { SetStoreFunction, createStore, produce } from 'solid-js/store'

import type { ExternalToast, PromiseData, PromiseT, ToastT } from './types'

let toastCount = 1
class ToastState {
  toasts: ToastT[]
  setToasts: SetStoreFunction<ToastT[]>

  constructor() {
    const [toasts, setToasts] = createStore<ToastT[]>([])
    this.toasts = toasts
    this.setToasts = setToasts
  }

  addToast = (toast: ToastT) => {
    this.setToasts(
      produce((toasts) => {
        toasts.unshift(toast)
      }),
    )
  }

  updateToast = (id: string | number, data: Partial<ToastT>) => {
    const index = this.toasts.findIndex((toast) => toast.id === id)
    if (index !== -1) {
      this.setToasts(index, data)
    }
  }

  deleteToast = (id: string | number) => {
    const target = this.toasts.find((toast) => toast.id === id)
    if (target) {
      this.updateToast(id, { dismissed: true })
    }
  }

  createToast = (data: ExternalToast & { message?: string | JSXElement }) => {
    const { message, ...rest } = data
    const alreadyExist = this.toasts.find((toast) => toast.id === data.id)
    const dismissible = data.dismissible === undefined ? true : data.dismissible

    let id: string | number = data.id ?? ''
    if (typeof id === 'string' && id.length === 0) {
      id = toastCount++
    }

    const newToast = { ...rest, id, title: message, dismissible }
    if (alreadyExist) {
      this.updateToast(id, newToast)
    } else {
      this.addToast(newToast)
    }

    return id
  }

  message = (message: string | JSXElement, data?: ExternalToast) => {
    return this.createToast({ ...data, message })
  }

  info = (message: string | JSXElement, data?: ExternalToast) => {
    return this.createToast({ ...data, type: 'info', message })
  }

  success = (message: string | JSXElement, data?: ExternalToast) => {
    return this.createToast({ ...data, type: 'success', message })
  }

  warning = (message: string | JSXElement, data?: ExternalToast) => {
    return this.createToast({ ...data, type: 'warning', message })
  }

  error = (message: string | JSXElement, data?: ExternalToast) => {
    return this.createToast({ ...data, type: 'error', message })
  }

  custom = (jsx: (id: string | number) => JSXElement, data?: ExternalToast) => {
    const id = data?.id ?? toastCount++
    return this.createToast({ ...data, jsx: jsx(id), id })
  }

  dismiss = (id: string | number) => {
    this.deleteToast(id)
  }

  promise = async <Data = unknown>(promise: PromiseT<Data>, data: PromiseData<Data>) => {
    let id: string | number | undefined = undefined
    if (data.loading !== undefined) {
      id = this.createToast({
        ...data,
        promise,
        type: 'loading',
        message: data.loading,
        description: typeof data.description !== 'function' ? data.description : null,
      })
    }

    try {
      const p = typeof promise === 'function' ? promise() : promise

      const response = await p

      if (response && response instanceof Response && response.ok === false) {
        const message = typeof data.error === 'function' ? data.error(response) : data.error
        const description =
          typeof data.description === 'function' ? data.description(response) : data.description

        this.createToast({
          id,
          type: 'error',
          message,
          description,
        })
      } else if (data.success) {
        const message = typeof data.success === 'function' ? data.success(response) : data.success
        const description =
          typeof data.description === 'function' ? data.description(response) : data.description

        this.createToast({
          id,
          type: 'success',
          message,
          description,
        })
      }
    } catch (error: any) {
      if (data.error !== undefined) {
        const message = typeof data.success === 'function' ? data.success(error) : data.success
        const description =
          typeof data.description === 'function' ? data.description(error) : data.description
        this.createToast({
          id,
          type: 'error',
          message,
          description,
        })
      }
    } finally {
      data.finally?.()
    }

    return id
  }
}

const toastState = new ToastState()
export const [toasts, setToasts] = [toastState.toasts, toastState.setToasts]

const toastFunction = (message: string | JSXElement, data?: ExternalToast) => {
  return toastState.createToast({ ...data, message })
}

const basicToast = toastFunction

export const toast = Object.assign(basicToast, {
  message: toastState.message,
  success: toastState.success,
  info: toastState.info,
  warning: toastState.warning,
  error: toastState.error,
  promise: toastState.promise,
  custom: toastState.custom,
  dismiss: toastState.dismiss,
})
