import { useMemo, useRef } from 'react'

import { SlatePad, EditorUtils, createSlatepad } from 'slatepad'
import 'slatepad/dist/style.css'
import { Folders } from './components/Folders'
import { GET_FILE_CONTENT, SAVE_FILE } from '../../common/const'
import debounce from 'debounce'
import { ActivityBar } from './components/ActivityBar'
import { FileSelector } from './components/FileSelector'
import { TitleBar } from './components/TitleBar'
export const App = () => {
  const editor = useMemo(() => createSlatepad(), [])
  const pathRef = useRef('')
  const saveData = debounce((value) => {
    window.api.sendToMain(SAVE_FILE, pathRef.current, JSON.stringify(value))
  }, 500)
  const onOpenFile = async (path = '') => {
    window.api.sendToMain(SAVE_FILE, pathRef.current, JSON.stringify(editor.children))
    pathRef.current = path
    const fileContent = await window.api.interProcess(GET_FILE_CONTENT, path)
    EditorUtils.clearAll(editor)
    editor.insertFragment(JSON.parse(fileContent))
    EditorUtils.clearHistory(editor)
  }
  return (
    <div className="w-[100vw] h-[100vh] flex flex-col">
      <TitleBar />
      <div className='flex flex-1 overflow-scroll'>
        <ActivityBar />
        {/* <FileSelector/> */}
        <Folders onOpenFile={onOpenFile} />
        <main className="flex-1 overflow-scroll">
          <SlatePad onChange={saveData} editor={editor} />
        </main>
      </div>
    </div>
  )
}
