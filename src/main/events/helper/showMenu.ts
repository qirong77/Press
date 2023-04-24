import { Menu, MenuItemConstructorOptions } from 'electron'
import { lstatSync, readdirSync, rmdirSync, statSync, unlinkSync } from 'fs'
import { GET_ALL_FILES, NEW_FILE, RENAME_FILE } from '../../../common/const'
import { resolve } from 'path'

export interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string
  submenu?: DarwinMenuItemConstructorOptions[] | Menu
}
export const hanldeFileMenu = (path: string) => {
  const template: DarwinMenuItemConstructorOptions[] = [
    {
      label: '重命名',
      click(_menuItem, browserWindow, _event) {
        browserWindow?.webContents.send(RENAME_FILE)
      }
    },
    {
      label: '删除',
      click(_menuItem, browserWindow, _event) {
        unlinkSync(path)
        browserWindow?.webContents.send(GET_ALL_FILES)
      }
    }
  ]
  Menu.buildFromTemplate(template).popup()
}
export const handleFolderMenu = (path: string) => {
  const template: DarwinMenuItemConstructorOptions[] = [
    {
      label: '新建文件',
      click(_menuItem, browserWindow, _event) {
        browserWindow?.webContents.send(NEW_FILE)
      }
    },
    {
      label: '新建文件夹',
      click(_menuItem, browserWindow, _event) {
        browserWindow?.webContents.send(NEW_FILE)
      }
    },
    {
      label: '重命名',
      click(_menuItem, browserWindow, _event) {
        browserWindow?.webContents.send(RENAME_FILE)
      }
    },
    {
      label: '删除',
      click(_menuItem, browserWindow, _event) {
        deleteDir(path)
        browserWindow?.webContents.send(GET_ALL_FILES)
      }
    }
  ]
  Menu.buildFromTemplate(template).popup()
}
function deleteDir(path: string) {
  const dfs = (path: string) => {
    const files = readdirSync(path)
    files.forEach((file) => {
      const currentPath = resolve(path, file)
      if (statSync(currentPath).isDirectory()) {
        deleteDir(currentPath)
      } else unlinkSync(currentPath)
    })
  }
  dfs(path)
  rmdirSync(path)
}
