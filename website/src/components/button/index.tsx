import { cn } from '~/utils/style'

import { Component, JSX, JSXElement } from 'solid-js'

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  children: JSXElement
}

const Button: Component<ButtonProps> = (props) => {
  return (
    <button
      {...props}
      class={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2',
        props.class,
      )}
    >
      {props.children}
    </button>
  )
}

export default Button
