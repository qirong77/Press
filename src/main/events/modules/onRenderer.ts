import { ipcMain } from 'electron'
import { SAVE_FILE } from '../../../common/const'
import { existsSync, writeFileSync } from 'fs'

export const onRenderer = () => {
  ipcMain.on(SAVE_FILE, (_e, filePath, content = '') => {
    if (content.includes('undefined')) {
      console.log(filePath, content)
      throw new Error('保存可能除了问题')
    }
    existsSync(filePath) && writeFileSync(filePath, content, 'utf-8')
  })
}
