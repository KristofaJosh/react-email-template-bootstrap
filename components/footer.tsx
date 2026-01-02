import { Column, Hr, Img, Row, Section, Text } from '@react-email/components'

import { Link } from '@/components/link'
import { useEmailVariables } from '@/lib/context/variable-context'

const socialMediaIcons = [
  { src: '/socials/x.png', href: '#' },
  {
    src: '/socials/facebook.png',
    href: '#',
  },
  {
    src: '/socials/instagram.png',
    href: '#',
  },
  {
    src: '/socials/linkedin.png',
    href: '#',
  },
]

const getSocialName = (src: string) => {
  // get social name between /socials/ and .png
  const match = src.match(/\/socials\/([a-z]+)\.png/)
  return match ? match[1] : ''
}

const getUnsubscribeHref = ({ email }: { email: string }) => {
  const subject = 'Unsubscribe '
  const body = `Please unsubscribe ${email} from advertisement, ads, and event emails only. I only wish to continue receiving other important communications.`

  return `mailto:support@org.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export const Footer = ({ email }: { email: string }) => {
  const { baseAssetUrl, orgLogo, org } = useEmailVariables()

  return (
    <Section className={'mt-8'}>
      <Hr className="mb-8 border border-gray-200" />
      <Row>
        <Text className="mb-8 text-base text-gray-600">
          If you&#39;d rather not receive this kind of email, you can{' '}
          <Link href={getUnsubscribeHref({ email })}>unsubscribe</Link> by sending an email to
          support@org.com.
          <br />
          <span className="mt-4 block">
            &copy; {new Date().getFullYear()} {org}. All rights reserved.
          </span>
        </Text>
      </Row>
      <Row className="mb-4 items-center gap-4">
        <Column className={'flex w-fit items-center justify-center'}>
          <Img
            src={orgLogo}
            alt={org}
            width="auto"
            height="20"
            className="inline-block"
          />
        </Column>
        <Column align="right">
          {socialMediaIcons.map(({ src, href }, index) => (
            <a key={index} href={href} target="_blank" rel="noopener noreferrer">
              <Img
                src={`${baseAssetUrl}/${src}`}
                alt={getSocialName(src)}
                width="20"
                height="20"
                className="ml-4 inline-block size-6"
              />
            </a>
          ))}
        </Column>
      </Row>
    </Section>
  )
}
