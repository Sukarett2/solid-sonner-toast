// @refresh reload
import { Suspense } from 'solid-js'

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
      <FileRoutes />
    </Router>
  )
}
