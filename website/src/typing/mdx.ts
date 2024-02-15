export interface TOCData {
  id: string
  title: string
  children: TOCData[]
}

export interface MDXData {
  code: string
  raw: string
  toc?: TOCData[]
  matter?: {
    title?: string
  }
}
