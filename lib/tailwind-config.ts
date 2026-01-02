import { TailwindConfig } from '@react-email/components'

type ColorConfig = {
  [key: string]: string
  500: string
}

type ColorsConfig = {
  [key: string]: ColorConfig
}

const mapDefaults = (colors: ColorsConfig) => {
  return Object.entries(colors).reduce(
    (acc, [key, value]) => {
      acc[key] = {
        ...value,
        get DEFAULT() {
          return this['500']
        },
      }
      return acc
    },
    {} as { [key: string]: ColorConfig & { DEFAULT: string } }
  )
}

const colors = {
  primary: {
    200: '#9BB3C1',
    300: '#688CA3',
    400: '#366684',
    500: '#0A394F',
    600: '#033351',
  },
  gray: {
    50: '#F9FAFB',
    300: '#D0D5DD',
    400: '#98A2B3',
    500: '#667085',
    600: '#475467',
  },
  'feedback-error': {
    300: '#FF6666',
    400: '#FF3333',
    500: '#FF0000',
    600: '#CC0000',
  },
  'feedback-success': {
    300: '#77E399',
    400: '#49DA77',
    500: '#1CD155',
    600: '#16A744',
  },
  'feedback-warning': {
    300: '#FBD085',
    400: '#FAC15C',
    500: '#F9B133',
    600: '#C78E29',
  },
}

export const tailwindConfig: TailwindConfig = {
  theme: {
    extend: {
      colors: mapDefaults(colors),
      fontFamily: {
        creato: ['Creato Display', 'sans-serif'],
      },
    },
  },
}
