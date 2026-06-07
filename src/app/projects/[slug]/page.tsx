import CaseStudyPage, { generateMetadata as workGenerateMetadata, generateStaticParams as workGenerateStaticParams } from '@/app/work/[slug]/page'

export const revalidate = 60

export const generateStaticParams = workGenerateStaticParams
export const generateMetadata = workGenerateMetadata

export default CaseStudyPage
