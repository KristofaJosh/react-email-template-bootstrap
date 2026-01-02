import 'dotenv/config'

import {
  Body,
  Container,
  Font,
  Head,
  pixelBasedPreset,
  Preview,
  Tailwind,
} from '@react-email/components'
import { PropsWithChildren } from 'react'
import { twcn } from 'utils/twcn'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { EmailVariablesContextProvider } from '@/lib/context/variable-context'
import { tailwindConfig } from '@/lib/tailwind-config'

interface EmailWrapperProps extends PropsWithChildren {
  previewText: string
  containerClassName?: string
  email: string
}

export const EmailContentWrapper = ({
  children,
  previewText,
  email,
  containerClassName,
}: EmailWrapperProps) => {
  return (
    <EmailVariablesContextProvider>
      <Preview className={'capitalize'}>{previewText}</Preview>
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          ...tailwindConfig,
        }}
      >
        <Head>
          <Font
            fontFamily="Creato Display"
            fallbackFontFamily="sans-serif"
            webFont={{
              url: 'https://fonts.cdnfonts.com/css/creato-display',
              format: 'woff2',
            }}
            fontWeight={400}
            fontStyle="normal"
          />
          <style>
            {`
              .content-body {
                padding: 0 14px;
                font-size: 16px;
                              
                @media (min-width: 768px) {
                  padding: 0px 18px;
                }
              }
           `}
          </style>
        </Head>
        <Body
          className={twcn('font-creato mx-auto my-auto bg-gray-50 p-2 text-black md:p-5')}
        >
          <Container
            className={twcn('mx-auto my-10 max-w-[576px] rounded md:my-[40px]', containerClassName)}
          >
            <Header />
            {children}
            <Footer email={email} />
          </Container>
        </Body>
      </Tailwind>
    </EmailVariablesContextProvider>
  )
}
