export type PressFile = {
  fileName: string
  children: PressFile[]
  path: string
  level: number
  isDir: boolean
}
