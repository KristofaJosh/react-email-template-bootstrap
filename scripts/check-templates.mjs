import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getAllFiles, toImportPath } from './utils.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ROOT = path.resolve(__dirname, '..')
const EMAILS_DIR = path.join(ROOT, 'emails')
const INDEX_FILE = path.join(EMAILS_DIR, 'index.ts')

async function checkTemplates() {
  console.log('🔍 Validating email templates...')

  if (!fs.existsSync(INDEX_FILE)) {
    console.error('❌ emails/index.ts not found. Please run "yarn gen:templates" first.')
    process.exit(1)
  }

  const emailFiles = getAllFiles(EMAILS_DIR, '.tsx', ['index.ts'])
  let hasErrors = false

  const indexContent = fs.readFileSync(INDEX_FILE, 'utf8')

  const toPascalCase = (str) =>
    str.replace(/[-_](\w)/g, (_, c) => c.toUpperCase()).replace(/^\w/, (c) => c.toUpperCase())

  for (const file of emailFiles) {
    const relativePath = path.relative(ROOT, file)
    const content = fs.readFileSync(file, 'utf8')
    const fileName = path.basename(file, '.tsx')

    // Derive folder name (parent of the file)
    const folder = path.basename(path.dirname(file))

    const expectedComponentName = toPascalCase(fileName)
    const expectedInterfaceName = `${toPascalCase(folder)}${expectedComponentName}Props`

    const errors = []

    // 1. Check for watermark
    if (!content.includes('// @generated-by-plop')) {
      errors.push('Missing "// @generated-by-plop" watermark')
    }

    // 2. Check for EmailContentWrapper
    if (!content.includes('EmailContentWrapper')) {
      errors.push('Does not use "EmailContentWrapper"')
    }

    // 3. Check for EmailBody
    if (!content.includes('const EmailBody')) {
      errors.push('Missing "EmailBody" definition')
    }

    // 4. Check for PreviewProps
    if (!content.includes(`${expectedComponentName}.PreviewProps =`)) {
      errors.push(
        `Missing or incorrect ".PreviewProps" definition. Expected "${expectedComponentName}.PreviewProps"`
      )
    }

    // 5. Check component name export
    const componentExportRegex = new RegExp(`export const ${expectedComponentName}\\s*=\\s*`)
    if (!componentExportRegex.test(content)) {
      errors.push(`Component name mismatch. Expected "export const ${expectedComponentName}"`)
    }

    // 6. Check default export
    const defaultExportRegex = new RegExp(`export default ${expectedComponentName}\\s*;?`)
    if (!defaultExportRegex.test(content)) {
      errors.push(`Default export mismatch. Expected "export default ${expectedComponentName}"`)
    }

    // 7. Check interface name
    const interfaceRegex = new RegExp(`export interface ${expectedInterfaceName}\\b`)
    if (!interfaceRegex.test(content)) {
      errors.push(`Interface name mismatch. Expected "export interface ${expectedInterfaceName}"`)
    }

    // 8. Check if registered in index.ts
    // The index.ts uses relative imports like "./order/buyer-order-confirmation"
    const relImport = toImportPath(file, EMAILS_DIR)
    if (!indexContent.includes(`from "${relImport}"`)) {
      errors.push(`Not registered in emails/index.ts. Run "yarn gen:templates"`)
    }

    if (errors.length > 0) {
      console.error(`❌ ${relativePath}:`)
      errors.forEach((err) => console.error(`   - ${err}`))
      hasErrors = true
    }
  }

  if (hasErrors) {
    console.error(
      '\nFAIL: Some templates are invalid or were not created with the gen tool. Use `yarn gen:email` to generate email'
    )
    process.exit(1)
  } else {
    console.log('\n✅ All templates are valid!')
  }
}

void checkTemplates()
