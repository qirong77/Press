import { useState } from 'react'
import { FilesIcon, SearchIcon } from '../assets/icons'

export const ActivityBar = () => {
  const [active, setActive] = useState(0)
  return (
    <div className="w-[45px] h-full flex flex-col items-center bg-[#283042] text-slate-400 p-[8px] [&>button]:my-1">
      <FilesIcon
        style={{
          color: active === 0 ? 'whitesmoke' : ''
        }}
        onClick={() => {
          setActive(0)
        }}
      />
      <SearchIcon
        style={{
          color: active === 1 ? 'whitesmoke' : ''
        }}
        onClick={() => {
          setActive(1)
        }}
      />
    </div>
  )
}
