import { useEffect, useState } from 'react'
import { FilesIcon, SearchIcon } from './assets/icons'
import { GET_ALL_FILES } from '../../common/const'
import { PressFile } from '../../common/types'
import { FileTree } from './components/FileTree'
import { SlatePad } from 'slatepad'
import 'slatepad/dist/style.css'
export const App = () => {
  const [sideWidth, setSideWidth] = useState(240)
  const [file, setFile] = useState<PressFile>({})
  useEffect(() => {
    window.api.interProcess(GET_ALL_FILES).then((value) => {
      const [f, _p] = value
      setFile(f)
    })
  }, [])
  return (
    <div className="w-[100vw] h-[100vh] flex">
      <div className="w-[45px] h-full flex flex-col items-center bg-[#283042] text-slate-100 p-[8px] [&>button]:my-1">
        <FilesIcon />
        <SearchIcon />
      </div>
      <div
        className="fixed w-[6px] h-full cursor-move hover:bg-blue-400 active:bg-blue-400 z-10"
        onMouseDown={handleMouseDown}
        style={{
          left: sideWidth + 45 - 3 + 'px'
        }}
      ></div>
      <div
        className="h-full bg-[#333d55]  overflow-scroll"
        style={{
          width: sideWidth
        }}
      >
        <ul className="text-slate-200">
          <FileTree file={file} />
        </ul>
      </div>
      <main className="flex-1">
        <SlatePad />
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
