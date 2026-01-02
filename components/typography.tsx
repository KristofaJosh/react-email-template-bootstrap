import { Text } from '@react-email/components'
import { ComponentProps } from 'react'
import { twcn } from 'utils/twcn'

export const Typography = ({ className, ...props }: ComponentProps<typeof Text>) => {
  return <Text {...props} className={twcn('text-base', className)} />
}
