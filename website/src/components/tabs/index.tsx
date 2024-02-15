import {
  Component,
  For,
  JSXElement,
  Show,
  createContext,
  createEffect,
  createSignal,
  useContext,
} from 'solid-js'

interface TabProps {
  value: string
  children: JSXElement
}

const TabsContext = createContext<{ activeValue: () => string }>()

export const Tab: Component<TabProps> = (props) => {
  const tabsContext = useContext(TabsContext)

  return <Show when={props.value === tabsContext?.activeValue()} children={props.children} />
}

interface TabsProps {
  items: string[]
  children: JSXElement
}

const Tabs: Component<TabsProps> = (props) => {
  const [activeValue, setActiveValue] = createSignal(props.items?.[0])

  return (
    <TabsContext.Provider value={{ activeValue }}>
      <div class="mt-4 flex w-max min-w-full border-b border-gray-200 pb-px dark:border-neutral-800">
        <For each={props.items}>
          {(item) => {
            return (
              <button
                onClick={() => setActiveValue(item)}
                classList={{
                  'mr-2 rounded-t p-2 font-medium leading-5 transition-colors -mb-0.5 select-none':
                    true,
                  'border-b-2 border-blue-500 text-blue-600': item === activeValue(),
                }}
              >
                {item}
              </button>
            )
          }}
        </For>
      </div>
      <div>{props.children}</div>
    </TabsContext.Provider>
  )
}

export default Tabs
