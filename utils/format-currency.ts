/**
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#currency
 */
interface NumberFormatOptions {
  /**
   * Possible values are the ISO 4217 currency codes,
   * such as "USD" for the US dollar,
   * "EUR" for the euro, or
   * "CNY" for the Chinese RMB — see https://en.wikipedia.org/wiki/ISO_4217#List_of_ISO_4217_currency_codes
   */
  currency?: string
  minimumIntegerDigits?: number
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  minimumSignificantDigits?: number
  maximumSignificantDigits?: number
}

export function formatCurrency(
  value: number,
  locale?: Intl.LocalesArgument,
  options?: NumberFormatOptions
): string | null {
  try {
    return new Intl.NumberFormat(locale || 'en-NG', {
      currencyDisplay: 'narrowSymbol',
      style: 'currency',
      currency: 'NGN',
      ...options,
    }).format(value)
  } catch {
    return null
  }
}
