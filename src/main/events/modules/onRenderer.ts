import { ipcMain } from 'electron'
import {
  FILE_MENU,
  FOLDER_MENU,
  GET_ALL_FILES,
  NEW_FILE,
  RENAME_FILE,
  SAVE_FILE
} from '../../../common/const'
import { existsSync, writeFileSync } from 'fs'
import { handleFolderMenu, hanldeFileMenu } from '../helper/showMenu'
import { createFile } from '../helper/createFile'
import { rename } from 'fs/promises'
import { basename, resolve } from 'path'
export const onRenderer = () => {
  ipcMain.on(SAVE_FILE, (_e, filePath, content = '') => {
    if (content.includes('undefined')) {
      console.log(filePath, content)
      throw new Error('保存可能除了问题')
    }
    existsSync(filePath) && writeFileSync(filePath, content, 'utf-8')
  })
  ipcMain.on(FILE_MENU, (_e, arg) => hanldeFileMenu(arg))
  ipcMain.on(FOLDER_MENU, (_e, arg) => handleFolderMenu(arg))
  ipcMain.on(NEW_FILE, createFile)
  ipcMain.on(RENAME_FILE, (e, oldPath: string, newName) => {
    const oldDir = oldPath.slice(0, oldPath.lastIndexOf(basename(oldPath)))
    const newPath = resolve(oldDir, newName)
    rename(oldPath, newPath)
      .then(() => {
        e.sender.send(GET_ALL_FILES)
      })
      .catch((reason) => console.log(reason))
  })
}
