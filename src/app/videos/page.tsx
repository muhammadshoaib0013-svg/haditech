import { getPublishedVideos } from '@/lib/supabase/content'
import VideosClientPage from './VideosClientPage'

export const revalidate = 60

export default async function VideosPage() {
  const videos = await getPublishedVideos()
  return <VideosClientPage videos={videos} />
}
