import { lstatSync, readdirSync } from 'fs'
import { homedir } from 'os'
import { basename, join, resolve } from 'path'

export const getAllFiles = () => {
  const paths: string[] = []
  const targetFolder = join(homedir(), 'Desktop', 'press-test')
  const dfs = (path: string, level = 0) => {
    const node = {
      fileName: basename(path),
      children: [],
      path,
      level
    }
    readdirSync(path).forEach((fileName) => {
      if (/^\./.test(fileName)) return
      const nextPath = resolve(path, fileName)
      if (lstatSync(nextPath).isDirectory()) {
        const childNode = dfs(nextPath, level + 1)
        node.children.push(childNode)
      }
    })
    // 如果当前节点是文件夹就对里面的文件进行排序，文件排前面，文件夹排后面
    const folders = node.children.filter((child) => lstatSync(child.path).isDirectory())
    const files = node.children.filter((child) => !lstatSync(child.path).isDirectory())
    node.children = [...files, ...folders]
    return node
  }
  const tree = dfs(targetFolder, 0)
  console.log(tree)
  return []
}
