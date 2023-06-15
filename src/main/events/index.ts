import { BrowserWindow } from 'electron'
import { onInterProcess } from './modules/onInterProcess'
import { onRenderer } from './modules/onRenderer'
import { watch } from 'fs'
import { BASE_PATH } from '../const'
import { FILE_CHANGE } from '../../common/const'

export const onEvents = (window: BrowserWindow) => {
  onRenderer(window)
  onInterProcess()
  watch(BASE_PATH, () => {
    window.webContents.send(FILE_CHANGE)
  })
}
