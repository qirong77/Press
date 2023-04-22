import { getAllFiles } from './../helper/getAllFiles'

import { GET_ALL_FILES, GET_FILE_CONTENT } from './../../../common/const'
import { ipcMain } from 'electron'
import { readFileSync } from 'fs'

export const onInterProcess = () => {
  ipcMain.handle(GET_ALL_FILES, getAllFiles)
  ipcMain.handle(GET_FILE_CONTENT, (_e, path) => readFileSync(path, 'utf-8'))
}
