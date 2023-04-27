import { useState } from 'react'
import { FilesIcon, SearchIcon } from '../assets/icons'

export const ActivityBar = () => {
  const [active, setActive] = useState(0)
  return (
    <div
      className={`activity-bar w-[45px] h-full flex flex-col items-center px-[6px] [&>button]:mb-2`}
    >
      <FilesIcon
        className={`${active === 0 ? 'icon-active' : ''}`}
        onClick={() => {
          setActive(0)
        }}
      />
      <SearchIcon
        className={`${active === 1 ? 'icon-active' : ''}`}

        onClick={() => {
          setActive(1)
        }}
      />
    </div>
  )
}
