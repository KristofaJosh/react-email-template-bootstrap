// @generated-by-plop
import { Img, Section } from '@react-email/components'

import { EmailContentWrapper } from '@/components/email-wrapper'
import { Typography } from '@/components/typography'
import { useEmailVariables } from '@/lib/context/variable-context'

export interface GeneralNewYearProps {
  email: string
  name?: string
  year?: number
}

const EmailBody = ({ name, year = new Date().getFullYear() }: GeneralNewYearProps) => {
  const { baseAssetUrl, org } = useEmailVariables()
  const currentYear = year || new Date().getFullYear()

  return (
    <>
      <Img
        src={`${baseAssetUrl}/img.png`}
        alt={`Happy New Year ${currentYear}`}
        width="100%"
        className="mb-4 rounded-lg"
      />
      <div className={'content-body'}>
        <Section className="mb-8 text-center">
          <Typography className="text-primary my-2 text-3xl font-bold">
            Welcome to {currentYear}! 🎊
          </Typography>
          <Typography className="text-primary">
            Thank you for an amazing year
            {name && (
              <>
                , <b>{name}</b>
              </>
            )}
          </Typography>
          <Typography className="mt-4 leading-relaxed text-gray-600">
            We’re grateful for your trust and support. It means a lot to have you as part of the
            Org family. We look forward to another great year together. Wishing you good
            health, happiness, and a beautifully organized home.
          </Typography>
        </Section>
        <Typography className="text-primary mt-12 text-center">
          With gratitude,
          <br />
          <b className="text-xl">The {org} Team</b>
        </Typography>
      </div>
    </>
  )
}

export const NewYear = ({ ...props }: GeneralNewYearProps) => {
  const currentYear = props.year || new Date().getFullYear()
  return (
    <EmailContentWrapper
      email={props.email}
      previewText={`Thank you for an amazing year! ✨ Welcome to ${currentYear}! 🎊`}
    >
      <EmailBody {...props} />
    </EmailContentWrapper>
  )
}

NewYear.PreviewProps = {
  email: 'christopherjoshua18+ret@gmail.com',
  name: 'Chris Josh',
  year: 2025,
} as GeneralNewYearProps

export default NewYear
