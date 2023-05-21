import { useEffect, useRef, useState } from 'react'
import { GET_ALL_FILES } from '../../../common/const'
import pinyin from 'pinyin'
import debounce from 'debounce'
export const FileSelector = ({ onOpenFile, show, setHidden }) => {
  const [allPaths, setAllPaths] = useState([{ path: '', name: '' }])
  const [paths, setPaths] = useState([{ path: '', name: '', match: 0 }])
  const [basePath, setBasePath] = useState('')
  const [active, setActive] = useState(0)
  const iptRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    window.api.interProcess(GET_ALL_FILES).then((value) => {
      const [, paths, rootPath] = value
      setAllPaths(paths)
      setPaths(paths)
      setBasePath(rootPath)
    })
  }, [])
  useEffect(() => {
    show && iptRef.current?.focus()
  }, [show])
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      e.metaKey ? setActive(0) : setActive(active - 1 < 0 ? paths.length - 1 : active - 1)
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      e.metaKey
        ? setActive(paths.length - 1)
        : setActive(active + 1 > paths.length - 1 ? 0 : active + 1)
    }
    if (e.key === 'Enter') {
      iptRef.current!.value = ''
      onOpenFile(paths[active].path)
      setActive(0)
    }
  }
  const handleChange = debounce((e) => {
    setActive(0)
    const search = e.target.value as string
    if (!search) {
      setPaths([])
      return
    }
    const maths = allPaths
      .map((file) => ({
        ...file,
        match: getMatchLevel(file.name, search)
      }))
      .sort((f1, f2) => f2.match - f1.match)
    setPaths(maths)
  }, 100)
  return (
    <div
      className="file-selector fixed top-[0] z-6 left-[50%] p-[8px] translate-x-[-50%]  w-[400px] h-[280px] z-50 rounded "
      style={{
        boxShadow: 'rgb(4 4 4 / 25%) 0px 4px 6px 3px',
        display: show ? 'block' : 'none'
      }}
    >
      <div>
        <input
          ref={iptRef}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          onBlur={setHidden}
          type="text"
          className="outline-none w-full rounded pl-[3px]"
        />
      </div>
      <ul className="my-[6px] overflow-scroll h-[250px]">
        {paths.map(({ name, path }, index) => (
          <li
            onMouseDown={(e) => {
              e.preventDefault()
              onOpenFile(path)
              setHidden()
            }}
            className={`list-none cursor-pointer rounded px-[20px] py-[2px] flex items-center ${
              index === active ? 'selected' : ''
            }`}
            key={path}
          >
            <span className="text-sm">{name + '  '}</span>
            <span className="ml-[6px] text-xs">{path.replace(basePath, '')}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function getMatchLevel(fileName = '', word = '') {
  fileName = normalizeStr(fileName)
  word = normalizeStr(word)
  if (fileName.includes(word)) return 100 - fileName.indexOf(word)
  const mcl = maxCommonLength(fileName, word)
  // 当没有匹配项的时候,返回最长公共子序列的长度
  return mcl
  function normalizeStr(str = '') {
    return pinyin(str, {
      style: 'normal'
    })
      .join('')
      .toLowerCase()
  }
  function maxCommonLength(str1 = '1234', str2 = '321') {
    if (!str1.length || !str2.length) return 0
    if (str1[0] === str2[0]) {
      return maxCommonLength(str1.slice(1), str2.slice(1)) + 1
    }
    const case1 = maxCommonLength(str1.slice(1), str2)
    const case2 = maxCommonLength(str1.slice(), str2.slice(1))
    return Math.max(case1, case2)
  }
}
