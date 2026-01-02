import { Button as Btn } from '@react-email/components'
import { ComponentProps } from 'react'
import { twcn } from 'utils/twcn'

export const Button = ({ className, ...props }: ComponentProps<typeof Btn>) => {
  return (
    <Btn
      {...props}
      className={twcn('bg-primary rounded-md px-3 py-2 text-base text-white', className)}
    />
  )
}
