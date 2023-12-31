import * as prismic from '@prismicio/client'

const endpoint = prismic.getRepositoryEndpoint(import.meta.env.VITE_PRISMIC_REPOSITORY)
export const client = prismic.createClient(endpoint, {
  accessToken: import.meta.env.VITE_PRISMIC_API_KEY,
})
