import fs from 'fs'
import path from 'path'

/**
 * Recursively gather files in a directory
 * @param {string} dir
 * @param {string} [extension] optional extension to filter by (e.g. '.tsx')
 * @param {string[]} [excludeNames] optional names to exclude (e.g. ['index.ts'])
 * @returns {string[]}
 */
export function getAllFiles(dir, extension = '', excludeNames = []) {
  if (!fs.existsSync(dir)) return []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  let files = []
  for (const entry of entries) {
    if (entry.name.startsWith('.') || excludeNames.includes(entry.name)) continue
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath, extension, excludeNames))
    } else if (!extension || entry.name.endsWith(extension)) {
      files.push(fullPath)
    }
  }
  return files.sort()
}

/**
 * Converts an absolute path to a relative import path for use in templates.
 * @param {string} absPath
 * @param {string} baseDir
 * @param {string} [extensionToRemove] optional extension to remove (e.g. '.tsx')
 * @returns {string}
 */
export function toImportPath(absPath, baseDir, extensionToRemove = '.tsx') {
  let rel = path.relative(baseDir, absPath).replace(/\\/g, '/')
  if (extensionToRemove) {
    rel = rel.replace(new RegExp(`\\${extensionToRemove}$`), '')
  }
  if (!rel.startsWith('./') && !rel.startsWith('../')) rel = `./${rel}`
  return rel
}
