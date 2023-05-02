import { BrowserWindow } from "electron"
import { onInterProcess } from "./modules/onInterProcess"
import { onRenderer } from "./modules/onRenderer"

export const onEvents = (widow:BrowserWindow) => {
    onRenderer(widow)
    onInterProcess()
}