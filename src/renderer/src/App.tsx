import { useEffect, useState } from 'react'
import { Arrow, FilesIcon, FolderCloseIcon } from './assets/icons'
import { GET_ALL_FILES } from '../../common/const'

interface ITree {
  name: string
  children?: ITree[]
}
export const App = () => {
  const [sideWidth, setSideWidth] = useState(240)
  const [tree, setTree] = useState<ITree[]>([{ name: 'book' }, { name: 'folder', children: [] }])
  useEffect(() => {
    window.api.interProcess(GET_ALL_FILES).then((f) => {
      console.log(f)
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
        <ul className="text-slate-200">{renderTree(tree)}</ul>
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
    document.onmouseup = (e) => {
      const newPosition = e.clientX
      if (newPosition < 180 || newPosition > 600) {
      }
      document.onmousemove = null
      document.onmouseup = null
      return false
    }
  }
  function renderTree(tree: ITree[]) {
    return tree.map((node) => {
      if (node.children) {
        return (
          <ul>
            {File(node)}
            {renderTree(node.children)}
          </ul>
        )
      }
      return File(node)
    })
  }
}
function File(node: ITree) {
  const [isOpen, setIsOpen] = useState(false)
  const handleClick = () => {
    setIsOpen(!isOpen)
  }
  return (
    <li className="flex text-slate-100 justify-start items-center h-[30px] [&>button]:w-[20px]">
      {node.children && (
        <>
          <Arrow onClick={handleClick} className={`p-[3px] ${isOpen ? '-rotate-90' : ''}`} />
          <FolderCloseIcon />
        </>
      )}
      <span className="ml-1">{node.name}</span>
    </li>
  )
}
