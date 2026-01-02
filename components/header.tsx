import { Hr, Img } from '@react-email/components'

import { useEmailVariables } from '@/lib/context/variable-context'

export const Header = () => {
  const { orgLogo } = useEmailVariables()
  return (
    <>
      <div className="flex h-[70px] items-center overflow-hidden">
        <Img
          src={orgLogo}
          className={'my-auto h-auto max-h-[30px]'}
          width="auto"
          height="25px"
          alt="Org"
        />
      </div>
      <Hr className="mb-4 border border-gray-50" />
    </>
  )
}
