import { useEffect, useMemo, useRef, useState } from 'react'
import { SlatePad, EditorUtils, createSlatepad } from 'slatepad'
import 'slatepad/dist/style.css'
import { Folders } from './components/Folders'
import { GET_FILE_CONTENT, SAVE_FILE, TOOGLE_DEVTOOL } from '../../common/const'
import debounce from 'debounce'
import { ActivityBar } from './components/ActivityBar'
import { FileSelector } from './components/FileSelector'
import { TitleBar } from './components/TitleBar'
import 'prism-themes/themes/prism-atom-dark.css'

export const App = () => {
  const editor = useMemo(() => createSlatepad(), [])
  const pathRef = useRef('')
  const [showFileSelector, setShowFileSelector] = useState(false)
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
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.code === 'KeyP') {
        setShowFileSelector(!showFileSelector)
      }
      if (e.code === 'F12') {
        window.api.sendToMain(TOOGLE_DEVTOOL)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showFileSelector])
  return (
    <div className="w-[100vw] h-[100vh] flex flex-col">
      <TitleBar />
      <div className="flex flex-1 overflow-scroll">
        <ActivityBar />
        <FileSelector
          onOpenFile={onOpenFile}
          show={showFileSelector}
          setHidden={() => setShowFileSelector(false)}
        />
        <Folders onOpenFile={onOpenFile} />
        <main className="flex-1 overflow-scroll">
          <SlatePad onChange={saveData} editor={editor} />
        </main>
      </div>
    </div>
  )
}
