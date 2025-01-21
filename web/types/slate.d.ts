// types/slate.d.ts

import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'

type CustomElement = {
  type: 'paragraph' | 'heading-1' | 'heading-2' | 'block-quote'
  align?: string
  children: CustomText[]
}

type FormattedText = {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  code?: boolean
  fontSize?: string
}

type CustomText = FormattedText

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor
    Element: CustomElement
    Text: CustomText
  }
}