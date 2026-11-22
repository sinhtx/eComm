import { FACEBOOK_URL, hasSocialLinks, INSTAGRAM_URL } from '@/lib/site'

export function SocialLinks({
  className,
  linkClassName,
}: {
  className?: string
  linkClassName: string
}) {
  if (!hasSocialLinks()) return null

  return (
    <div className={className}>
      {INSTAGRAM_URL ? (
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
        >
          Instagram
        </a>
      ) : null}
      {FACEBOOK_URL ? (
        <a
          href={FACEBOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
        >
          Facebook
        </a>
      ) : null}
    </div>
  )
}
