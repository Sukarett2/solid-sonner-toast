// @refresh reload
import { Suspense } from 'solid-js'

import { Meta, MetaProvider, Title } from '@solidjs/meta'
import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start'

import './app.css'
import BaseLayout from './components/base-layout'

export default function App() {
  return (
    <MetaProvider>
      <Title>solid-sonner-toast</Title>
      <Meta name="description" content="An unofficial port of sonner for Solid" />
      <Meta name="keywords" content="toast, sonner, Solid" />
      <Router
        root={(props) => (
          <BaseLayout>
            <Suspense>{props.children}</Suspense>
          </BaseLayout>
        )}
      >
        <FileRoutes />
      </Router>
    </MetaProvider>
  )
}
