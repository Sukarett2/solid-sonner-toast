import { type Component, For } from 'solid-js'

interface LoadingProps {
  visible: boolean
}

const Loading: Component<LoadingProps> = (props) => {
  return (
    <div class="sonner-loading-wrapper" data-visible={props.visible}>
      <div class="sonner-spinner">
        <For each={new Array(12).fill(0)}>{() => <div class="sonner-loading-bar" />}</For>
      </div>
    </div>
  )
}

export default Loading
