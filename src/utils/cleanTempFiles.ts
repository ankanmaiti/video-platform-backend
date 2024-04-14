import { readdirSync, unlinkSync } from "fs"
import path from "path"

export function cleanFiles(dirName: string, filesToKeep?: string[]) {

  const tempFiles = readdirSync(dirName)

  tempFiles?.forEach(file => {

    if (filesToKeep?.some(fileToKeep => fileToKeep == file)) {
      return file
    }

    unlinkSync(path.join(dirName, file))
  })
}
