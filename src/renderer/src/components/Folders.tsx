import { ReactNode, useEffect, useMemo,  useState } from 'react'
import { Arrow, FolderCloseIcon } from '../assets/icons'
import { GET_ALL_FILES, GET_FILE_CONTENT } from '../../../common/const'
import { PressFile } from '../../../common/types'
import React from 'react'

export const Folders = ({ onOpenFile }) => {
  const [sideWidth, setSideWidth] = useState(240)
  const [fileData, setFileData] = useState<PressFile>()
  useEffect(() => {
    window.api.interProcess(GET_ALL_FILES).then((value) => {
      const [f, _p] = value
      setFileData(f)
    })
  }, [])
  return (
    <div>
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
        <RenderFiles fileData={fileData} onOpenFile={onOpenFile} />
      </div>
      0
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

function RenderFiles({ fileData, onOpenFile }) {
  const [active, setActive] = useState('')
  // 嵌套的组件,每次更新都重新更新并执行整个函数,所以需要再外层进行状态存储
  const folderStatus = useMemo(() => new Map(), [])
  if (!fileData) return <div></div>
  return <FileTree file={fileData} />
  function FileTree({ file }) {
    if (file.isDir) {
      const childs = file.children.map((child) => <FileTree key={child.path} file={child} />)
      return <Folder file={file} childs={childs}></Folder>
    } else return <FileItem file={file} setActive={setActive} />
  }
  function Folder({ file, childs }) {
    const [isOpen, setIsOpen] = useState(file.level === 0 ? true : folderStatus.get(file.path))
    return (
      <ul
        className="overflow-hidden"
        style={{
          height: isOpen ? 'auto' : '30px'
        }}
      >
        <FileItem
          file={file}
          toggleOpen={() => {
            folderStatus.set(file.path, !isOpen)
            setIsOpen(!isOpen)
          }}
        >
          {file.isDir && (
            <>
              <Arrow className={`p-[3px] ${isOpen ? '' : '-rotate-90'}`} />
              <FolderCloseIcon />
            </>
          )}
        </FileItem>
        {childs}
      </ul>
    )
  }
  function FileItem({
    file,
    children,
    setActive,
    toggleOpen
  }: {
    file: PressFile
    children?: ReactNode
    toggleOpen?: Function
    setActive?: Function
  }) {
    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      if (!file.isDir) {
        onOpenFile(file.path)
        setActive?.(file.path)
      } else toggleOpen?.()
    }
    return (
      <li
        onClick={handleClick}
        className="flex text-slate-100 hover:bg-[#3c4b6f]  justify-start items-center h-[30px] overflow-hidden whitespace-nowrap cursor-pointer"
        style={{
          paddingLeft: file.level * 20 - 20 + 'px',
          display: file.level === 0 ? 'none' : 'flex',
          backgroundColor: active === file.path ? '#3c4b6f' : ''
        }}
      >
        <div className="flex [&>button]:w-[20px]">{children}</div>
        <span className="ml-1">{file.fileName}</span>
      </li>
    )
  }
}
