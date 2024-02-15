import { clientOnly } from '@solidjs/start'

const ToastExample = clientOnly(() => import('~/components/toast-example'))

const Example = () => {
  return <ToastExample />
}

export default Example
