import { A } from '@solidjs/router'

const SiteHeader = () => {
  return (
    <header class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="w-full px-12 flex h-14 max-w-screen-2xl items-center">
        <A href="/" class="mr-6 flex items-center space-x-2">
          <span class="hidden font-bold sm:inline-block">solid-sonner-toast</span>
        </A>
        <nav class="flex items-center gap-6 text-sm">
          <A
            href="/docs"
            class="transition-colors hover:text-foreground"
            activeClass="text-foreground font-normal"
            inactiveClass="text-foreground/60 font-light"
          >
            Docs
          </A>
          <A
            href="/example"
            class="transition-colors hover:text-foreground"
            activeClass="text-foreground font-normal"
            inactiveClass="text-foreground/60 font-light"
          >
            Example
          </A>
        </nav>
        <div class="ml-auto">
          <A href="https://github.com/Ken-HH24/solid-sonner-toast">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-brand-github hover:cursor-pointer"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
            </svg>
          </A>
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
