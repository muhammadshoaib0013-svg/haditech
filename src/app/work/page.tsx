import { getPublishedProjects } from '@/lib/supabase/content'
import WorkClientPage from './WorkClientPage'

export const dynamic = 'force-dynamic'

export default async function WorkPage() {
  const projects = await getPublishedProjects()
  return <WorkClientPage projects={projects} />
}
