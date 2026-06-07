import { redirect } from 'next/navigation'

interface Props {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function AuthLoginRedirectPage({ searchParams }: Props) {
  const next = searchParams.next
  const nextParam = typeof next === 'string' ? `?next=${encodeURIComponent(next)}` : ''
  redirect(`/admin/login${nextParam}`)
}
