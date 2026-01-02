import { Html } from '@react-email/components'
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react'

type EmailVariablesContextType = {
  baseUrl: string
  baseAssetUrl: string
  orgLogo: string
  org: string
  lang: string
  setLang: (lang: string) => void
  baseHref: (path: string) => string
}

export const EmailVariablesContext = createContext<EmailVariablesContextType | null>(null)

export const useEmailVariables = () => {
  const context = useContext(EmailVariablesContext)
  if (!context) {
    throw new Error('useEmailVariables must be used within an EmailVariablesContextProvider')
  }
  return context
}

interface EmailVariablesContextProviderProps extends PropsWithChildren {
  baseUrl?: string
  baseAssetUrl?: string
  orgLogo?: string
  org?: string
}

export const EmailVariablesContextProvider = ({
  children, org = '',
  baseUrl = process.env.BASE_URL || 'http://localhost:3001',
  baseAssetUrl = process.env.BASE_ASSET_URL || '',
}: EmailVariablesContextProviderProps) => {
  const [lang, setLang] = useState('en')

  const baseHref = useCallback((path: string) => baseUrl.replace(/\/+$/, '') + path, [baseUrl])

  const values = useMemo(() => {
    return {
      baseUrl,
      baseAssetUrl,
      org, // replace it with your org name
      orgLogo: `${baseAssetUrl}/email/<${org}>-logo-emblem-sm.png`,
      orgLogoLg: `${baseAssetUrl}/email/<${org}>-logo-emblem-lg.png`,
      orgLogoBg: `${baseAssetUrl}/email/<${org}>-logo-bg.png`,
      lang,
      setLang,
      baseHref,
    }
  }, [lang, baseAssetUrl, setLang, baseHref])

  return (
    <EmailVariablesContext.Provider value={values}>
      <Html lang={values.lang}>{children}</Html>
    </EmailVariablesContext.Provider>
  )
}
