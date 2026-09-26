import type { Product, Video } from '../content/types'

export const VIDEO_GAP_MS = 2500

export type ShowcaseVideo = Video & { name: string; description: string }

export function buildVideoPlaylist(general: Video[], works: Pick<Product, 'name' | 'description' | 'images' | 'videos'>[]): ShowcaseVideo[] {
  const candidates = [
    ...general.map(video => ({ ...video, name: video.label || 'Muestra general de trabajos', description: 'Un recorrido por el universo Newen Pintando.' })),
    ...works.flatMap(work => work.videos.map(video => ({ ...video, poster: video.poster || work.images[0], name: work.name, description: work.description }))),
  ]
  const seen = new Set<string>()
  return candidates.filter(video => video.src && !seen.has(video.src) && !!seen.add(video.src))
}

export function nextVideoIndex(index: number, count: number): number {
  return count ? (index + 1) % count : 0
}

export function selectorLayout(width: number): { sideCount: number; step: number } {
  const sideCount = width >= 1000 ? 4 : width >= 600 ? 3 : 2
  return { sideCount, step: width > 0 ? width / (sideCount * 2 + .5) : 72 }
}

export function selectorSlots(phase: number, count: number, sideCount: number) {
  if (count < 1) return []
  const first = Math.floor(phase) - sideCount
  return Array.from({ length: sideCount * 2 + 2 }, (_, n) => {
    const slot = first + n
    const offset = slot - phase
    return { slot, index: ((slot % count) + count) % count, offset, visible: Math.abs(offset) < sideCount + .5 }
  })
}

export function dragSelectorPhase(startPhase: number, startX: number, currentX: number, step: number): number {
  return step > 0 ? startPhase + (startX - currentX) / step : startPhase
}
