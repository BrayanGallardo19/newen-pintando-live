export function carouselOffset(index: number, phase: number, count: number): number {
  if (count < 1) return 0
  let offset = index - phase
  if (offset > count / 2) offset -= count
  if (offset < -count / 2) offset += count
  return offset
}

export function carouselPosition(offset: number) {
  const distance = Math.min(Math.abs(offset), 3)
  return {
    x: offset * 19,
    y: -4 + 2 * distance ** 2,
    scale: 1 / (1 + .28 * distance ** 2),
    rotation: -Math.tanh(offset * .65) * 38,
    opacity: Math.max(0, 1 - (distance / 3) ** 2),
    depth: 60 - distance ** 2 * 60,
    order: 10 - Math.round(distance),
  }
}

export function dragCarouselPhase(startPhase: number, startX: number, currentX: number, viewportWidth: number, count: number, spacingRatio = .19): number {
  if (count < 1 || viewportWidth <= 0) return startPhase
  const spacing = viewportWidth * spacingRatio
  return ((startPhase + (startX - currentX) / spacing) % count + count) % count
}
