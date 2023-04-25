import { ReactNode, useEffect, useMemo, useState } from 'react'
import { Arrow, FolderCloseIcon } from '../assets/icons'
import {
  FILE_MENU,
  FOLDER_MENU,
  GET_ALL_FILES,
  NEW_FILE,
  NEW_FOLDER,
  RENAME_FILE
} from '../../../common/const'
import { PressFile } from '../../../common/types'
import React from 'react'

export const Folders = ({ onOpenFile }) => {
  const [sideWidth, setSideWidth] = useState(240)
  const [fileData, setFileData] = useState<PressFile>()
  // 嵌套的组件,每次更新都重新更新并执行整个函数,所以需要再外层进行状态存储
  const folderStatus = useMemo(() => new Map(), [])
  useEffect(() => {
    const update = () =>
      window.api.interProcess(GET_ALL_FILES).then((value) => {
        const [f, _p] = value
        setFileData(f)
      })
    update()
    window.api.onMain(GET_ALL_FILES, update)
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
  function RenderFiles({ fileData, onOpenFile }) {
    const [active, setActive] = useState('')
    const [contextActive, setContextActive] = useState('')
    const [rename, setRename] = useState('')
    const [newFile, setNewFile] = useState('')
    const [isNewFolder, setIsNewFolder] = useState(false)
    useEffect(() => {
      const hanldeRename = () => {
        setRename(contextActive)
      }
      const handleNewFile = () => {
        setNewFile(contextActive)
        setIsNewFolder(false)
      }
      const handleNewFolder = () => {
        setNewFile(contextActive)
        setIsNewFolder(true)
      }
      window.api.onMain(NEW_FILE, handleNewFile)
      window.api.onMain(NEW_FOLDER, handleNewFolder)
      window.api.onMain(RENAME_FILE, hanldeRename)
      return () => {
        window.electron.ipcRenderer.removeListener(NEW_FILE, handleNewFile)
        window.electron.ipcRenderer.removeListener(NEW_FOLDER, handleNewFolder)
        window.electron.ipcRenderer.removeListener(RENAME_FILE, hanldeRename)
      }
    }, [contextActive])
    if (!fileData) return <div></div>
    return (
      <>
        <FileTree file={fileData} />
      </>
    )
    function FileTree({ file }) {
      if (file.isDir) {
        const childs = file.children.map((child) => <FileTree key={child.path} file={child} />)
        return <Folder file={file} childs={childs}></Folder>
      } else return <FileItem file={file} setActive={setActive} />
    }
    function Folder({ file, childs }) {
      const [isOpen, setIsOpen] = useState(file.level === 0 ? true : folderStatus.get(file.path))
      useEffect(() => {
        if (newFile === file.path) setIsOpen(true)
      }, [newFile])
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
          {newFile === file.path && (
            <li className="flex items-center h-[30px] text-white py-[2px]">
              {isNewFolder && (
                <div className="mx-[6px] [&>button]:w-[20px]">
                  <FolderCloseIcon />
                </div>
              )}
              <input
                className="pl-[4px] text-black rounded"
                autoFocus
                onBlur={(e) => {
                  if (e.target.value) {
                    window.api.sendToMain(NEW_FILE, file.path, e.target.value, isNewFolder)
                  }
                  setNewFile('')
                }}
                type="text"
              />
            </li>
          )}
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
        file.isDir ? toggleOpen?.() : onOpenFile(file.path) && setActive?.(file.path)
      }
      const handleContext = (e: React.MouseEvent) => {
        e.preventDefault()
        setContextActive(file.path)
        window.api.sendToMain(file.isDir ? FOLDER_MENU : FILE_MENU, file.path)
      }
      const handleKeyDown = (_e) => {}
      return (
        <li
          onClick={handleClick}
          onContextMenu={handleContext}
          className="flex text-slate-100 hover:bg-[#3c4b6f]  justify-start items-center h-[30px] overflow-hidden whitespace-nowrap cursor-pointer"
          style={{
            paddingLeft: file.level * 20 - 20 + 'px',
            display: file.level === 0 ? 'none' : 'flex',
            backgroundColor: active === file.path ? '#3c4b6f' : ''
          }}
        >
          <div className="flex [&>button]:w-[20px]">{children}</div>
          <div className="ml-1">
            {file.path === rename ? (
              <input
                autoFocus
                onClick={(e) => e.stopPropagation()}
                onBlur={(e) => {
                  if (e.target.value) {
                    window.api.sendToMain(RENAME_FILE, file.path, e.target.value)
                  }
                  setRename('')
                }}
                onKeyDown={handleKeyDown}
                className="text-black pl-[4px] rounded"
              />
            ) : (
              <span>{file.fileName}</span>
            )}
          </div>
        </li>
      )
    }
  }
}
