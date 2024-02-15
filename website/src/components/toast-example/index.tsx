import { cn } from '~/utils/style'

import { Component, For, createEffect, createSignal } from 'solid-js'
import { Toaster, toast } from 'solid-sonner-toast'

import { codeToHtml } from 'shiki'

import Button from '../button'
import './style.css'

const Types = [
  {
    text: 'Default',
    code: "toast('Event has been created')",
    fn: () => toast('Event has been created'),
  },
  {
    text: 'Description',
    code: `toast.message('Event has been created', {
    description: 'Monday, January 3rd at 6:00pm',
  })`,
    fn: () =>
      toast.message('Event has been created', {
        description: 'Monday, January 3rd at 6:00pm',
      }),
  },
  {
    text: 'Success',
    code: "toast.success('Event has been created')",
    fn: () => toast.success('Event has been created'),
  },
  {
    text: 'Info',
    code: "toast.info('Be at the area 10 minutes before the event time')",
    fn: () => toast.info('Be at the area 10 minutes before the event time'),
  },
  {
    text: 'Warning',
    code: "toast.warning('Event start time cannot be earlier than 8am')",
    fn: () => toast.warning('Event start time cannot be earlier than 8am'),
  },
  {
    text: 'Error',
    code: "toast.error('Event has not been created')",
    fn: () => toast.error('Event has not been created'),
  },
  {
    text: 'Undo',
    code: `toast('Event has been created', {
  action: {
    label: 'Undo',
    onClick: () => console.log('Undo'),
  },
}),`,
    fn: () =>
      toast('Event has been created', {
        action: {
          label: 'Undo',
          onClick: () => console.log('Undo'),
        },
      }),
  },
]

const [position, setPosition] = createSignal('bottom-right')
const Positions = [
  'bottom-right',
  'bottom-left',
  'bottom-center',
  'top-left',
  'top-center',
  'top-right',
].map((position) => ({
  text: position,
  code: `<Toaster position="${position}" />`,
  fn: () => setPosition(position),
}))

const [expand, setExpand] = createSignal(false)
const Expands = [
  { text: 'Default', code: '<Toaster expand={false} />', fn: () => setExpand(false) },
  { text: 'Expand', code: '<Toaster expand={true} />', fn: () => setExpand(true) },
]

const [richColors, setRichColors] = createSignal(false)
const [closeButton, setCloseButton] = createSignal(false)
const Others = [
  {
    text: 'Rich Colors Success',
    code: `toast.success('Event has been created')

// ...

<Toaster richColors  />`,
    fn: () => {
      setRichColors(true)
      toast.success('Event has been created')
    },
  },
  {
    text: 'Rich Colors Error',
    code: `toast.error('Event has not been created')

// ...

<Toaster richColors  />`,
    fn: () => {
      setRichColors(true)
      toast.error('Event has not been created')
    },
  },
  {
    text: 'Rich Colors Info',
    code: `toast.info('Be at the area 10 minutes before the event time')

// ...

<Toaster richColors  />`,
    fn: () => {
      setRichColors(true)
      toast.info('Be at the area 10 minutes before the event time')
    },
  },
  {
    text: 'Rich Colors Warning',
    code: `toast.warning('Event start time cannot be earlier than 8am')

// ...

<Toaster richColors  />`,
    fn: () => {
      setRichColors(true)
      toast.warning('Event start time cannot be earlier than 8am')
    },
  },
  {
    text: 'Close Button',
    code: `toast('Event has been created', {
  description: 'Monday, January 3rd at 6:00pm',
})

// ...

<Toaster  closeButton />`,
    fn: () => {
      setCloseButton(true)
      toast('Event has been created', {
        description: 'Monday, January 3rd at 6:00pm',
      })
    },
  },
  {
    text: 'Headless',
    code: `toast.custom((id) => (
  <div>
    <h1>Custom toast</h1>
    <button onClick={() => toast.dismiss(id)}>Dismiss</button>
  </div>
))

// ...

<Toaster  />`,
    fn: () => {
      setCloseButton(false)
      setRichColors(false)
      toast.custom((id) => (
        <div>
          <h1>Custom toast</h1>
          <button onClick={() => toast.dismiss(id)}>Dismiss</button>
        </div>
      ))
    },
  },
]

interface SectionProps {
  title: string
  description?: string
  items: { text: string; code: string; fn: () => void }[]
}

const Section: Component<SectionProps> = (props) => {
  const [value, setValue] = createSignal(props.items?.[0].text)
  const [code, setCode] = createSignal(props.items[0].code)
  const [innerHTML, setInnerHTML] = createSignal('')

  createEffect(async () => {
    if (code()) {
      const html = await codeToHtml(code(), {
        lang: 'tsx',
        theme: 'github-light',
      })

      setInnerHTML(html)
    }
  })

  return (
    <div class="w-full flex flex-col gap-4 flex-wrap">
      <h2 class="text-xl font-medium">{props.title}</h2>
      {props.description}
      <div class="flex gap-4 flex-wrap">
        <For each={props.items}>
          {(item) => (
            <Button
              onClick={() => {
                item.fn()
                setValue(item.text)
                setCode(item.code)
              }}
              class={cn({
                'bg-accent text-accent-foreground': value() === item.text,
              })}
            >
              {item.text}
            </Button>
          )}
        </For>
      </div>
      <div
        innerHTML={innerHTML()}
        class="section-code-block w-full border px-4 py-2 rounded-md text-sm"
      />
    </div>
  )
}

const ToastExample = () => (
  <div class="max-w-[642px] mx-auto pb-4 flex flex-col items-start">
    <h1 class="text-4xl font-medium my-8">solid-sonner-toast example</h1>
    <div class="flex flex-col items-start gap-16">
      <Section
        title="Types"
        description="You can customize the type of toast you want to render, and pass an options object as the
    second argument."
        items={Types}
      />
      <Section
        title="Positions"
        description="Swipe direction changes depending on the position."
        items={Positions}
      />
      <Section
        title="Expand"
        description="You can change the amount of toasts visible through the visibleToasts prop."
        items={Expands}
      />
      <Section title="Others" description="" items={Others} />
    </div>
    <Toaster
      position={position() as any}
      expand={expand()}
      richColors={richColors()}
      closeButton={closeButton()}
    />
  </div>
)

export default ToastExample
