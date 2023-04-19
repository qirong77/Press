import { getAllFiles } from './../helper/getAllFiles';

import { GET_ALL_FILES } from './../../../common/const';
import { ipcMain } from "electron"

export const onInterProcess = () => {
    ipcMain.handle(GET_ALL_FILES,getAllFiles)
}