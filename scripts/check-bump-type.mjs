import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { getAllFiles } from './utils.mjs'

const BASE_BRANCH = process.env.GITHUB_BASE_REF || 'main'

/**
 * Generates a snapshot of all .d.ts files in the dist directory.
 * This runs the generation and build scripts to ensure we have the latest types.
 */
function getDeclarationSnapshot() {
  try {
    // Generate templates and build types
    execSync('yarn gen:templates', { stdio: 'ignore' })
    execSync('yarn build:types', { stdio: 'ignore' })

    const distDir = path.resolve(process.cwd(), 'dist')
    const files = getAllFiles(distDir, '.d.ts')

    return files
      .map((f) => {
        const relativePath = path.relative(distDir, f)
        const content = fs.readFileSync(f, 'utf8')
        return `FILE: ${relativePath}\n${content}`
      })
      .join('\n---\n')
  } catch (e) {
    console.error('Error generating snapshot:', e.message)
    return ''
  }
}

function run() {
  try {
    // 1. Get snapshot of current (new) types
    const currentSnapshot = getDeclarationSnapshot()

    // 2. Determine the base reference to compare against
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
    let baseRef = `origin/${BASE_BRANCH}`

    // In GitHub Actions 'push' event, we are on 'main' and GITHUB_BASE_REF is not set.
    // We want to compare against the commit before the push.
    if (!process.env.GITHUB_BASE_REF && currentBranch === 'main') {
      baseRef = 'HEAD^'
    }

    // Ensure we have the baseRef available
    try {
      execSync(`git fetch origin ${BASE_BRANCH} --depth=2`, {
        stdio: 'ignore',
      })
    } catch (e) {
      // Ignore fetch errors, might be shallow clone or already fetched
    }

    // 3. Get snapshot of base types
    // We'll use git show to read the files instead of switching branches if possible,
    // but since we need to run build:types, we actually NEED to switch or have the files.
    // Switching is easier.

    let baseSnapshot = ''
    try {
      execSync(`git checkout ${baseRef}`, { stdio: 'ignore' })
      baseSnapshot = getDeclarationSnapshot()
      // Switch back to original branch
      execSync(`git checkout -`, { stdio: 'ignore' })
    } catch (e) {
      console.error('Error checking out base ref:', e.message)
      // If we can't checkout base, we'll assume minor or patch
      baseSnapshot = 'UNKNOWN'
    }

    // 4. Determine bump type
    if (currentSnapshot !== baseSnapshot) {
      // Types changed or new templates added -> Minor
      console.log('minor')
    } else {
      // Types are identical, check if any source code changed in monitored folders
      const diff = execSync(
        `git diff --name-only ${baseRef} HEAD -- emails/ components/ lib/ utils/`
      ).toString()
      if (diff.trim()) {
        console.log('patch') // Content changed but types didn't -> Patch
      } else {
        console.log('none') // No relevant changes
      }
    }
  } catch (e) {
    // Fallback to patch for safety
    console.log('patch')
  }
}

run()
