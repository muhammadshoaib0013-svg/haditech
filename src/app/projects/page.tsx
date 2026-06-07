import { getPublishedProjects } from '@/lib/supabase/content'
import WorkClientPage from '@/app/work/WorkClientPage'

export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  const projects = await getPublishedProjects()
  return <WorkClientPage projects={projects} />
}
