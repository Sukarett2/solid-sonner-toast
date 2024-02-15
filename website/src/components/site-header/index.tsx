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
      </div>
    </header>
  )
}

export default SiteHeader
