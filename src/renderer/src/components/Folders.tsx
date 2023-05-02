import { ReactNode, useEffect, useMemo, useState } from 'react'
import { Arrow, FolderCloseIcon, FolderOpenIcon } from '../assets/icons'
import {
  FILE_MENU,
  FOLDER_MENU,
  GET_ALL_FILES,
  MOVE_FILE,
  NEW_FILE,
  NEW_FOLDER,
  RENAME_FILE
} from '../../../common/const'
import { PressFile } from '../../../common/types'
import React from 'react'

export const Folders = ({ onOpenFile }) => {
  const [sideWidth, setSideWidth] = useState(240)
  const minWidth = 180
  const [fileData, setFileData] = useState<PressFile>()
  // 嵌套的组件,每次更新都重新更新并执行整个函数,所以需要在外层进行状态存储
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
    <div className="folder">
      <div
        className="drag-line fixed w-[3px]  h-full cursor-move z-10"
        onMouseDown={handleMouseDown}
        style={{
          left: sideWidth + 45 - 3 + 'px'
        }}
      ></div>
      <div
        className={`h-full min-w-[${minWidth}] overflow-scroll`}
        style={{
          width: sideWidth
        }}
        onContextMenu={() => {
          window.api.sendToMain(FOLDER_MENU, fileData?.path)
        }}
      >
        <RenderFiles fileData={fileData} onOpenFile={onOpenFile} />
      </div>
    </div>
  )
  function handleMouseDown() {
    document.onmousemove = (e) => {
      const newClientX = e.clientX
      const positionX = newClientX - 50
      if (positionX >= minWidth) {
        setSideWidth(positionX)
      }
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
        setNewFile(contextActive || fileData?.path || '')
        setIsNewFolder(false)
      }
      const handleNewFolder = () => {
        setNewFile(contextActive || fileData?.path || '')
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
    }, [contextActive, fileData])
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
    function Folder({ file, childs }: { file: PressFile; childs: ReactNode }) {
      const [isOpen, setIsOpen] = useState(file.level === 0 ? true : folderStatus.get(file.path))
      const [isDrag, setIsDrag] = useState(false)
      const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.code === 'Enter') {
          const target = e.target as HTMLInputElement
          if (target.value) {
            window.api.sendToMain(NEW_FILE, file.path, target.value, isNewFolder)
          }
          setRename('')
        }
      }
      useEffect(() => {
        if (newFile === file.path) setIsOpen(true)
      }, [newFile])
      return (
        <ul
          onDragOver={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setIsDrag(true)
          }}
          onDragLeave={() => {
            setIsDrag(false)
          }}
          onDrop={(e) => {
            e.stopPropagation()
            setIsDrag(false)
            const path = e.dataTransfer.getData('path')
            window.api.sendToMain(MOVE_FILE, path, file.path)
          }}
          className="overflow-hidden"
          style={{
            height: file.level === 0 ? '100%' : isOpen ? 'auto' : '30px',
            backgroundColor: isDrag ? '#283042' : ''
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
                {isOpen ? <FolderOpenIcon /> : <FolderCloseIcon />}
              </>
            )}
          </FileItem>
          {newFile === file.path && (
            <li className="flex items-center h-[30px] p-[2px]">
              {isNewFolder && (
                <div className="mx-[6px] [&>button]:w-[20px]">
                  <FolderCloseIcon />
                </div>
              )}
              <input
                className="pl-[4px] rounded"
                autoFocus
                onKeyDown={handleKeyDown}
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
        e.stopPropagation()
        setContextActive(file.path)
        window.api.sendToMain(file.isDir ? FOLDER_MENU : FILE_MENU, file.path)
      }
      const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.code === 'Enter') {
          const target = e.target as HTMLInputElement
          if (target.value) {
            window.api.sendToMain(NEW_FILE, file.path, target.value, isNewFolder)
            setNewFile('')
          }
        }
      }
      const handleDragStart = (e: React.DragEvent) => {
        e.stopPropagation()
        e.dataTransfer?.setData('path', file.path)
      }
      return (
        <li
          draggable
          onClick={handleClick}
          onContextMenu={handleContext}
          className={`flex file-item justify-start  ${
            file.path === active ? 'file-item-active' : ''
          }  items-center h-[30px] overflow-hidden whitespace-nowrap cursor-pointer`}
          style={{
            paddingLeft: file.level * 20 - 20 + 'px',
            display: file.level === 0 ? 'none' : 'flex'
          }}
          onDragStart={handleDragStart}
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
                className=" pl-[4px] rounded"
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
