import { useState } from 'react'
import { Arrow, FolderCloseIcon } from '../assets/icons'
export const FileTree = ({ file }) => {
  if (file.isDir) {
    const childs = file.children.map((child) => <FileTree key={child.path} file={child} />)
    return <Folder file={file} childs={childs} />
  } else return <FileItem file={file} />
}

function Folder({ file, childs }) {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <ul
      className="overflow-hidden"
      style={{
        height: isOpen ? 'auto' : '30px'
      }}
    >
      <li
        className="flex text-slate-100 justify-start items-center h-[30px] overflow-hidden whitespace-nowrap"
        style={{
          paddingLeft: file.level * 20 - 20 + 'px',
          display: file.level === 0 ? 'none' : 'flex'
        }}
      >
        <div className="flex [&>button]:w-[20px]">
          <Arrow
            onClick={() => setIsOpen(!isOpen)}
            className={`p-[3px] ${isOpen ? '' : '-rotate-90'}`}
          />
          <FolderCloseIcon />
        </div>
        <span className="ml-1">{file.fileName}</span>
      </li>
      {childs}
    </ul>
  )
}
function FileItem({ file }) {
  return (
    <li
      className="flex text-slate-100 justify-start items-center h-[30px] overflow-hidden whitespace-nowrap"
      style={{
        paddingLeft: file.level * 20 - 20 + 'px',
        display: file.level === 0 ? 'none' : 'flex'
      }}
    >
      <div className="flex [&>button]:w-[20px]"></div>
      <span className="ml-1">{file.fileName}</span>
    </li>
  )
}
