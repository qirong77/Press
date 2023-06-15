import { lstatSync, readdirSync } from 'fs'
import { basename, resolve } from 'path'
import { PressFile } from '../../../common/types'

export const getAllFiles = () => {
  const paths: any[] = []
  const targetFolder = '/Users/qirong77/Documents/PressNotes'
  // const targetFolder = join(homedir(), 'Desktop', 'press-test')
  const dfs = (path: string, level = 0) => {
    const node: PressFile = {
      fileName: basename(path),
      children: [],
      path,
      level,
      isDir: false
    }
    if (!lstatSync(path).isDirectory()) {
      paths.push({
        path,
        name: basename(path)
      })
      return node
    }
    node.isDir = true
    readdirSync(path).forEach((fileName) => {
      if (/^\./.test(fileName)) return
      const nextPath = resolve(path, fileName)
      node.children.push(dfs(nextPath, level + 1))
    })
    // 如果当前节点是文件夹就对里面的文件进行排序，文件排前面，文件夹排后面
    const folders = node.children.filter((child) => lstatSync(child.path).isDirectory())
    const files = node.children.filter((child) => !lstatSync(child.path).isDirectory())
    node.children = [...files, ...folders]
    return node
  }
  const tree = dfs(targetFolder, 0)
  return [tree, paths, targetFolder]
}
