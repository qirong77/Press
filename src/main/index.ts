import { onEvents } from './events/index';
import { app, BrowserWindow } from 'electron'

import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createWindow } from './electron/createWindow'

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  createWindow()
  onEvents()
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

