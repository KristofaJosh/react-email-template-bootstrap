import { Link as Lnk } from '@react-email/components'
import { ComponentProps } from 'react'
import { twcn } from 'utils/twcn'

export const Link = ({ className, ...props }: ComponentProps<typeof Lnk>) => (
  <Lnk {...props} className={twcn('text-primary font-normal underline', className)} />
)
