# solid-sonner-toast

**This is an unofficial port of [sonner](https://sonner.emilkowal.ski/) for Solid.js, just for learning and interest. And there is already a port called [solid sonner](https://solid-sonner.vercel.app/)**

I'm pleased if you still want to try it out and here is the [document](https://solid-sonner-toast-website.vercel.app/) built with solid-start.

# Getting started

## Install

```sh 
pnpm i solid-sonner-toast 
```

## Add Toaster to your App

```tsx App.tsx
// @refresh reload
import { Suspense } from 'solid-js'
import { Toaster } from 'solid-sonner-toast'

import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start'

import './app.css'
import BaseLayout from './components/base-layout'

export default function App() {
  return (
    <Router
      root={(props) => (
        <BaseLayout>
          <Suspense>{props.children}</Suspense>
        </BaseLayout>
      )}
    >
      <Toaster />
      <FileRoutes />
    </Router>
  )
}
```

## Render a toast
Use `toast()` to render a toast
```tsx
import { toast } from 'solid-sonner-toast'

const Button = () => {
  return <button onClick={() => toast('Hello world')}>Hello world</button>
}
```


# toast()

| Property           |                                              Description                                               |        Default |
| :----------------- | :----------------------------------------------------------------------------------------------------: | -------------: |
| description        |                           Toast's description, renders underneath the title.                           |            `-` |
| position           |                                         Position of the toast.                                         | `bottom-right` |
| duration           |            Time in milliseconds that should elapse before automatically closing the toast.             |         `4000` |
| dismissible        |                     If `false`, it'll prevent the user from dismissing the toast.                      |         `true` |
| icon               |                      Icon displayed in front of toast's text, aligned vertically.                      |            `-` |
| action             |                      Renders a primary button, clicking it will close the toast.                       |            `-` |
| cancel             |                     Renders a secondary button, clicking it will close the toast.                      |            `-` |
| id                 |                                        Custom id for the toast.                                        |            `-` |
| onDismiss          |       The function gets called when either the close button is clicked, or the toast is swiped.        |            `-` |
| onAutoClose        | Function that gets called when the toast disappears automatically after it's timeout (duration` prop). |            `-` |
| unstyled           |                  Removes the default styling, which allows for easier customization.                   |        `false` |
| actionButtonStyles |                                      Styles for the action button                                      |           `{}` |
| cancelButtonStyles |                                      Styles for the cancel button                                      |           `{}` |

# Toaster

| Property              |                                                           Description                                                           |                             Default |
| :-------------------- | :-----------------------------------------------------------------------------------------------------------------------------: | ----------------------------------: |
| theme                 |                                       Toast's theme, either `light`, `dark`, or `system`                                        |                             `light` |
| richColors            |                                           Makes error and success state more colorful                                           |                             `false` |
| expand                |                                               Toasts will be expanded by default                                                |                             `false` |
| visibleToasts         |                                                    Amount of visible toasts                                                     |                                 `3` |
| position              |                                             Place where the toasts will be rendered                                             |                      `bottom-right` |
| closeButton           |                                                Adds a close button to all toasts                                                |                             `false` |
| offset                |                                              Offset from the edges of the screen.                                               |                              `32px` |
| dir                   |                                                 Directionality of toast's text                                                  |                               `ltr` |
| invert                |                                            Dark toasts in light mode and vice versa.                                            |                             `false` |
| gap                   |                                                Gap between toasts when expanded                                                 |                                `14` |
| loadingIcon           |                                                Changes the default loading icon                                                 |                                 `-` |