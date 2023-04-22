import { useEffect, useMemo, useState } from 'react'
import { FilesIcon, SearchIcon } from './assets/icons'
import { GET_ALL_FILES } from '../../common/const'
import { PressFile } from '../../common/types'
import { FileTree, RenderFiles } from './components/FileTree'
import { SlatePad, RichUtils, createSlatepad } from 'slatepad'
import 'slatepad/dist/style.css'
export const App = () => {
  const [sideWidth, setSideWidth] = useState(240)
  const editor = useMemo(() => createSlatepad(), [])
  const [file, setFile] = useState<PressFile>({})
  useEffect(() => {
    window.api.interProcess(GET_ALL_FILES).then((value) => {
      const [f, _p] = value
      setFile(f)
    })
  }, [])
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
      <div
        className="fixed w-[6px]  h-full cursor-move hover:bg-blue-400 active:bg-blue-400 z-10"
        onMouseDown={handleMouseDown}
        style={{
          left: sideWidth + 45 - 3 + 'px'
        }}
      ></div>
      <div
        className="h-full min-w-[220px] bg-[#333d55]  overflow-scroll"
        style={{
          width: sideWidth
        }}
      >
        <RenderFiles file={file} onOpenFile={onOpenFile} />
      </div>
      <main className="flex-1 overflow-scroll">
        <SlatePad onChange={saveData} editor={editor} />
      </main>
    </div>
  )
  function handleMouseDown() {
    document.onmousemove = (e) => {
      const newClientX = e.clientX
      setSideWidth(newClientX - 50)
      return false
    }
    // 释放鼠标的时候解除事件绑定
    document.onmouseup = (_e) => {
      document.onmousemove = null
      document.onmouseup = null
      return false
    }
  }
}
