import { useEffect, useState } from 'react'
import { FilesIcon, } from './assets/icons'
import { GET_ALL_FILES } from '../../common/const'
import { PressFile } from '../../common/types'
import { FileTree } from './components/FileTree'

export const App = () => {
  const [sideWidth, setSideWidth] = useState(240)
  const [file, setFile] = useState<PressFile>({})
  useEffect(() => {
    window.api.interProcess(GET_ALL_FILES).then((value) => {
      const [f, _p] = value
      console.log(f)
      setFile(f)
    })
  }, [])
  return (
    <div className="w-[100vw] h-[100vh] flex">
      <div className="w-[50px] h-full flex flex-col items-center bg-[#283042] text-slate-100 p-[6px]">
        <FilesIcon />
      </div>
      <div
        className="fixed w-[4px] h-full cursor-move hover:bg-blue-400"
        onMouseDown={handleMouseDown}
        style={{
          left: sideWidth + 50 - 2 + 'px'
        }}
      ></div>
      <div
        className=" h-full bg-[#333d55]  overflow-scroll"
        style={{
          width: sideWidth
        }}
      >
        <ul className="text-slate-200"><FileTree file={file}/></ul>
      </div>
      <main></main>
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
