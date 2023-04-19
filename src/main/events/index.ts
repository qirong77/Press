import { onInterProcess } from "./modules/onInterProcess"
import { onRenderer } from "./modules/onRenderer"

export const onEvents = () => {
    onRenderer()
    onInterProcess()
}