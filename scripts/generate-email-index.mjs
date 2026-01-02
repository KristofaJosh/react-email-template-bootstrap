#!/usr/bin/env node
/*
 Auto-generates emails/index.ts from the files under emails/**.tsx

 Rules/assumptions:
 - Domain is the first-level directory under emails/ (e.g., emails/negotiations/new-offer.tsx -> domain "negotiations").
 - Template key is the kebab-case filename without extension (e.g., new-offer).
 - Component export name is detected in priority order:
   1) a named export like: export const ComponentName = (...)
   2) a default export: export default ComponentName
 - Props type is detected if exported and named `${ComponentName}Props` as an interface or type.
   If found, the generated templates entry will annotate component and variables with the props type for strong typing.

 The generated file exposes:
 - templates: a nested map of domains -> templates
 - EmailRenderPayload generic type to get correct variables type per template
*/

import fs from 'fs'
import path from 'path'
import { getAllFiles, toImportPath } from './utils.mjs'

const ROOT = process.cwd()
const EMAILS_DIR = path.join(ROOT, 'emails')
const OUTPUT_FILE = path.join(EMAILS_DIR, 'index.ts')

/** Attempt to extract component and props names from file contents */
function analyzeFileContents(contents) {
  // export const ComponentName = (
  const namedMatch = contents.match(/export\s+const\s+(\w+)\s*=\s*\(/)
  // export default ComponentName
  const defaultMatch = contents.match(/export\s+default\s+(\w+)\s*;/)
  const componentName = namedMatch?.[1] || defaultMatch?.[1] || null

  let propsName = null
  // generic fallback: try to find any exported *Props
  const anyProps = contents.match(/export\s+(?:interface|type)\s+(\w*Props)\b/)
  if (anyProps) propsName = anyProps[1]

  return { componentName, propsName }
}

function toDomainAndTemplate(absPath) {
  const rel = path.relative(EMAILS_DIR, absPath).replace(/\\/g, '/')
  const parts = rel.split('/')
  const domain = parts[0]
  const file = parts[parts.length - 1]
  const template = file.replace(/\.tsx$/, '')
  return { domain, template }
}

function run() {
  if (!fs.existsSync(EMAILS_DIR)) {
    console.error('Emails directory not found at:', EMAILS_DIR)
    process.exit(1)
  }

  const files = getAllFiles(EMAILS_DIR, '.tsx', ['index.ts'])
  if (files.length === 0) {
    console.warn('No .tsx files found under emails/. Writing minimal index.ts')
  }

  const entries = []
  const imports = new Set()
  const typeImports = new Set()
  const fromDir = path.dirname(OUTPUT_FILE)

  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8')
    const { componentName, propsName } = analyzeFileContents(src)
    const { domain, template } = toDomainAndTemplate(file)
    const importPath = toImportPath(file, fromDir)

    if (!componentName) continue

    imports.add(`import { ${componentName} } from "${importPath}";`)
    if (propsName) typeImports.add(`import type { ${propsName} } from "${importPath}";`)

    entries.push({ domain, template, componentName, propsName })
  }

  const domains = {}
  for (const e of entries) {
    domains[e.domain] ||= []
    domains[e.domain].push(e)
  }

  const domainBlocks = Object.keys(domains)
    .sort()
    .map((domain) => {
      const items = domains[domain]
        .sort((a, b) => a.template.localeCompare(b.template))
        .map((e) => {
          const comp = e.componentName
          const props = e.propsName
          const compType = props ? ` as React.ComponentType<${props}>` : ''
          const varsInit = props ? `{} as ${props}` : '{}'
          return `    "${e.template}": { component: ${comp}${compType}, variables: ${varsInit} },`
        })
        .join('\n')
      return `  ${domain}: {\n${items}\n  },`
    })
    .join('\n')

  const header = `/* AUTO-GENERATED FILE. DO NOT EDIT MANUALLY. */\n/* Run: yarn gen:templates */`
  const importLines = [
    `import * as React from "react";`,
    ...Array.from(imports).sort(),
    ...Array.from(typeImports).sort(),
  ].join('\n')

  const templatesObj = `export const templates = {\n${domainBlocks}\n} as const`

  const typesBlock = `
/**
 * All available email modules and their templates as generated from the filesystem.
 *
 * @example
 * // Iterate available modules and templates at runtime
 * for (const mod of Object.keys(templates)) {
 *   for (const tpl of Object.keys(templates[mod])) {
 *     console.log(mod, tpl);
 *   }
 * }
 */
export type TemplateModules = typeof templates;

/**
 * Canonical entry type for a given module/template pair.
 * Useful when you need access to the full entry (component + variables).
 *
 * @example
 * type Entry = TemplateEntry<"order", "buyer-order-confirmation">;
 * // Entry["component"] is the React component, Entry["variables"] is the props type
 */
export type TemplateEntry<
  M extends keyof TemplateModules,
  T extends keyof TemplateModules[M]
> = TemplateModules[M][T];

/**
 * Resolves the props (variables) type for a given module/template pair.
 * This is the single source of truth for props typing across the package.
 *
 * @example
 * // Get the props type for a specific template
 * type Props = TemplateProps<"order", "buyer-order-confirmation">;
 *
 * @example
 * // Equivalent backwards-compatible alias: EmailVariableType
 * type Props2 = EmailVariableType<"order", "buyer-order-confirmation">;
 */
export type TemplateProps<
  M extends keyof TemplateModules,
  T extends keyof TemplateModules[M]
> =
  "variables" extends keyof TemplateEntry<M, T>
    ? TemplateEntry<M, T>["variables"]
    : never;

/**
 * Backwards-compatible alias for TemplateProps.
 * Prefer using TemplateProps in new code.
 *
 * @example
 * type Props = EmailVariableType<"order", "buyer-order-confirmation">;
 */
export type EmailVariableType<
  M extends keyof TemplateModules,
  T extends keyof TemplateModules[M]
> = TemplateProps<M, T>;

/**
 * All props (variables) types grouped by module and template.
 * Handy for type-level indexing.
 *
 * @example
 * // Access a props type via indexing
 * type Props = Variables["order"]["buyer-order-confirmation"];
 */
export type Variables = {
  [M in keyof TemplateModules]: {
    [T in keyof TemplateModules[M]]: TemplateProps<M, T>
  }
};

/**
 * Payload expected by the render endpoints and helpers.
 * Use generics to get precise typing for the variables field.
 *
 * @example
 * const payload: EmailRenderPayload<"order", "buyer-order-confirmation"> = {
 *   emailModule: "order",
 *   template: "buyer-order-confirmation",
 *   variables: { ... },
 * };
 */
export type EmailRenderPayload<
  M extends keyof TemplateModules = keyof TemplateModules,
  T extends keyof TemplateModules[M] = keyof TemplateModules[M]
> = {
  emailModule: M;
  template: T;
  variables: TemplateProps<M, T>;
};

/**
 * Union of valid template keys exported by each module.
 *
 * @example
 * // A type that narrows to the keys of any module
 * type AnyTemplateKey = EmailModuleExportKeys;
 */
export type EmailModuleExportKeys = {
  [K in keyof TemplateModules]: keyof TemplateModules[K];
}[keyof TemplateModules];

// ------- Additional exports -------
/** @internal Helper type used to derive EmailRenderRecord union */
type AnyEmailRenderPayload = {
  [M in keyof TemplateModules]: {
    [T in keyof TemplateModules[M]]: EmailRenderPayload<M, T>
  }[keyof TemplateModules[M]]
}[keyof TemplateModules];

/**
 * Minimal record containing only identifying fields for an email to render.
 *
 * @example
 * const rec: EmailRenderRecord = { emailModule: "order", template: "order-placed" };
 */
export type EmailRenderRecord = Pick<AnyEmailRenderPayload, "emailModule" | "template">;
`

  const content = [header, importLines, '', templatesObj, typesBlock].join('\n\n')

  fs.writeFileSync(OUTPUT_FILE, content, 'utf8')
  console.log(`Generated ${path.relative(ROOT, OUTPUT_FILE)} with ${entries.length} template(s).`)
}

run()
