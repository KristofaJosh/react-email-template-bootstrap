// @generated-by-plop
import { Img } from '@react-email/components'

import { EmailContentWrapper } from '@/components/email-wrapper'
import { Typography } from '@/components/typography'
import { useEmailVariables } from '@/lib/context/variable-context'

export interface GeneralChristmasProps {
  email: string
  name?: string
}

const EmailBody = ({ name }: GeneralChristmasProps) => {
  const { baseAssetUrl, org } = useEmailVariables()

  return (
    <>
      <Img
        src={`${baseAssetUrl}/img.png`}
        alt="Merry Christmas"
        width="100%"
        className="mb-8 rounded-lg"
      />
      <div className={'content-body'}>
        {name ? (
          <Typography className="text-primary text-2xl font-bold">
            Merry Christmas, {name}! 🎄
          </Typography>
        ) : (
          <Typography className="text-primary text-2xl font-bold">Merry Christmas! 🎄</Typography>
        )}
        <Typography className="mt-4 text-gray-600">
          Wishing you a season filled with warmth, joy, and cherished moments. Thank you for being a
          part of our journey this year. May your holidays be bright and your New Year even
          brighter!
        </Typography>
        <Typography className="text-primary mt-4">
          From all of us at <b>{org}</b>
        </Typography>
      </div>
    </>
  )
}

export const Christmas = ({ ...props }: GeneralChristmasProps) => {
  return (
    <EmailContentWrapper email={props.email} previewText="Merry Christmas">
      <EmailBody {...props} />
    </EmailContentWrapper>
  )
}

Christmas.PreviewProps = {
  email: 'christopherjoshua18+ret@gmail.com',
  name: 'Chris Josh',
} as GeneralChristmasProps

export default Christmas
