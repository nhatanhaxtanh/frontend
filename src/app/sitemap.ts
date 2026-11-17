import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/models`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/tin-tuc`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/dang-ky-lai-thu`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/lien-he`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/tinh-toan-vay`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  try {
    const [modelsRes, newsRes] = await Promise.all([
      fetch(`${BACKEND_URL}/api/models`, { next: { revalidate: 3600 } }),
      fetch(`${BACKEND_URL}/api/news`, { next: { revalidate: 3600 } }),
    ])

    const models = modelsRes.ok ? await modelsRes.json() : []
    const news = newsRes.ok ? await newsRes.json() : []

    const modelRoutes: MetadataRoute.Sitemap = models.map((m: { slug: string }) => ({
      url: `${SITE_URL}/models/${m.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }))

    const newsRoutes: MetadataRoute.Sitemap = news.map((n: { slug: string }) => ({
      url: `${SITE_URL}/tin-tuc/${n.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

    return [...staticRoutes, ...modelRoutes, ...newsRoutes]
  } catch {
    return staticRoutes
  }
}
