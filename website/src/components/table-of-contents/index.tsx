import type { TOCData } from '~/typing/mdx'

import { Component } from 'solid-js'

import { Tree } from './tree'

interface TableOfContentsProps {
  toc: TOCData[]
}

const TableOfContents: Component<TableOfContentsProps> = (props) => {
  return (
    <div class="hidden text-sm xl:block">
      <div class="sticky top-16 -mt-10 pt-4">
        <div class="pb-10">
          <div class="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] py-12">
            <div class="space-y-2">
              <p class="font-medium">On This Page</p>
              <Tree items={props.toc} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TableOfContents
