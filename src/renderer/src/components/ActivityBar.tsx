import { useState } from 'react'
import { FilesIcon, SearchIcon } from '../assets/icons'
import { ACTIVITY_BAR_WIDTH } from '../const'

export const ActivityBar = () => {
  const [active, setActive] = useState(0)
  return (
    <div
      className={`activity-bar w-[${ACTIVITY_BAR_WIDTH}px] h-full flex flex-col items-center px-[6px] [&>button]:mb-2 overflow-hidden`}
      style={{
        display: 'none'
      }}
    >
      <FilesIcon
        className={`${active === 0 ? 'icon-active' : ''}`}
        onClick={() => {
          setActive(0)
          // 隐藏侧边栏
          document.querySelector('.folder')?.classList.toggle('hidden')
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
