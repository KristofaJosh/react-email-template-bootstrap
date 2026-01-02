// Public types and helper for consumers of the email-templates package.
// JSDoc examples are included to demonstrate typical usage patterns.

import type * as React from 'react'

import { templates } from '@/emails/index'

/**
 * Type-level access to the generated templates map.
 * @example
 * type Modules = TemplateModules;
 * // keyof Modules gives you all available email modules.
 */
export type TemplateModules = typeof import('../emails/index').templates
export type {
  EmailModuleExportKeys,
  EmailRenderPayload,
  EmailRenderRecord,
  EmailVariableType,
  Variables,
} from '../emails/index'

/**
 * Returns the React component for a given module/template with accurate props typing.
 * If the module/template pair does not exist, returns undefined.
 *
 * @example
 * import { getTemplateComponent } from "@<org>/email-templates";
 * import type { EmailVariableType } from "@<org>/email-templates";
 *
 * const Comp = getTemplateComponent("order", "buyer-order-confirmation");
 * if (Comp) {
 *   const props: EmailVariableType<"order", "buyer-order-confirmation"> = { /* ... *\/ };
 *   // <Comp {...props} />
 * }
 */
export function getTemplateComponent<
  M extends keyof TemplateModules,
  T extends keyof TemplateModules[M],
>(
  emailModule: M,
  template: T
): React.ComponentType<import('../emails/index').EmailVariableType<M, T>> | undefined {
  const moduleMap = templates[emailModule] as TemplateModules[M] | undefined
  if (!moduleMap) return undefined

  const entry = moduleMap[template] as TemplateModules[M][T] | undefined
  if (!entry) return undefined

  type Props = import('../emails/index').EmailVariableType<M, T> & {}
  const component = (entry as unknown as { component: React.ComponentType<Props> }).component
  return component as React.ComponentType<import('../emails/index').EmailVariableType<M, T>>
}
