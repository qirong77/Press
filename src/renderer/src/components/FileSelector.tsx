import { useEffect, useState } from 'react'
import { GET_ALL_FILES } from '../../../common/const'

export const FileSelector = () => {
  const [paths, setPaths] = useState([{ path: '', name: '' }])
//   const [active, setActive] = useState(0)
  useEffect(() => {
    window.api.interProcess(GET_ALL_FILES).then((value) => {
      const [, paths] = value
      setPaths(paths)
    })
  }, [])
  return (
    <div
      className="fixed top-0 left-[50%] p-[4px] translate-x-[-50%]  w-[400px] h-[280px] z-50 rounded  bg-[#627a9f]"
      style={{
        boxShadow: '2px 0px 8px 0px rgb(4 4 4 / 8%)'
      }}
    >
      <div>
        <input type="text" className="outline-none w-full rounded pl-[2px]" />
      </div>
      <ul>
        {paths.map(({ name, path }) => (
          <li className="list-none" key={path}>
            <span>{name + '  '}</span>
            <span className="text-xs">{path}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
