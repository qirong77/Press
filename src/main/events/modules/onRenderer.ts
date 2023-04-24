import { ipcMain } from 'electron'
import { FILE_MENU, FOLDER_MENU, SAVE_FILE } from '../../../common/const'
import { existsSync, writeFileSync } from 'fs'
import { handleFolderMenu, hanldeFileMenu } from '../helper/showMenu'

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
}
