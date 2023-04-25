import { dialog } from 'electron'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { GET_ALL_FILES } from '../../../common/const'

export const createFile = (e: Electron.IpcMainEvent, folder = '', name = '', isDir: boolean) => {
  const newPath = resolve(folder, name)
  if (existsSync(newPath)) {
    dialog.showMessageBoxSync({
      type: 'info',
      message: '文件已经存在'
    })
    return
  }
  isDir ? mkdirSync(newPath) : writeFileSync(newPath, JSON.stringify([]), 'utf-8')
  e.sender.send(GET_ALL_FILES)
}
