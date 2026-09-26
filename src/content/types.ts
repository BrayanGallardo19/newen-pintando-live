export interface Video { src: string; poster?: string; label?: string }
export interface Variant { label: string; price: string; image?: string }
export interface Product {
  archived?: boolean | null
  id: number; order: number; slug: string; name: string; price: string; category: string
  detail: string; description: string; images: string[]; options: Variant[]; videos: Video[]
}
export interface Category { slug: string; name: string; order: number; cover?: string | null }
export interface Site {
  name: string; tagline: string; whatsapp: string; instagram: string; instagramLabel: string
  logo: string; heroLandscape: string; heroTitle: string; heroAccent: string
  heroText: string; heroImages: string[]; showcaseVideos: Video[]
}
