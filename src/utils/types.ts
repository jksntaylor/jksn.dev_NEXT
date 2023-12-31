export type t_project = {
  cover_image: { url: string }
  awards: { award?: string }[]
  project_title: { text: string }[]
  project_link: { url: string }
  project_link_text: string
  year: string
  role: string
  client1: string
  client2?: string
  images: { project_image: { url: string }}[]
  project_description: string
}