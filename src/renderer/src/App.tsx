import { useMemo, useRef } from 'react'
import { FilesIcon, SearchIcon } from './assets/icons'
import { SlatePad, RichUtils, createSlatepad } from 'slatepad'
import 'slatepad/dist/style.css'
import { Folders } from './components/Folders'
import { GET_FILE_CONTENT, SAVE_FILE } from '../../common/const'
import debounce from 'debounce'
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
    RichUtils.clearAll(editor)
    editor.insertFragment(JSON.parse(fileContent))
    RichUtils.clearHistory(editor)
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
