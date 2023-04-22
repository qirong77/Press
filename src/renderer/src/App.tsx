import { useEffect, useMemo, useState } from 'react'
import { FilesIcon, SearchIcon } from './assets/icons'
import { SlatePad, RichUtils, createSlatepad } from 'slatepad'
import 'slatepad/dist/style.css'
import { Folders } from './components/Folders'
export const App = () => {
  const editor = useMemo(() => createSlatepad(), [])

  const saveData = (value) => {
    // RichUtils.replaceAll(editor,'')
  }
  const onOpenFile = (path = '', fileContent = '') => {
    RichUtils.clearAll(editor)
    RichUtils.insertMarkdown(editor, fileContent)
  }
  return (
    <div className="w-[100vw] h-[100vh] flex">
      <div className="w-[45px] h-full flex flex-col items-center bg-[#283042] text-slate-100 p-[8px] [&>button]:my-1">
        <FilesIcon />
        <SearchIcon />
      </div>
      <Folders onOpenFile={onOpenFile} />
      <main className="flex-1 overflow-scroll">
        <SlatePad onChange={saveData} editor={editor} />
      </main>
    </div>
  )
}
