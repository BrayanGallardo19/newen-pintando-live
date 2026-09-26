import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildVideoPlaylist, nextVideoIndex, VIDEO_GAP_MS, selectorLayout, selectorSlots, dragSelectorPhase } from '../src/features/showcase.ts'

test('reproduce videos existentes en orden, sin duplicar los compartidos', () => {
  const general = [{ src: '/general.mp4', label: 'Muestra' }]
  const works = [
    { name: 'Uno', description: 'Primera', images: ['/uno.webp'], videos: [{ src: '/uno.mp4' }] },
    { name: 'Dos', description: 'Segunda', images: ['/dos.webp'], videos: [{ src: '/uno.mp4' }, { src: '/dos.mp4' }] },
  ]
  assert.deepEqual(buildVideoPlaylist(general, works).map(item => item.src), ['/general.mp4', '/uno.mp4', '/dos.mp4'])
  assert.equal(nextVideoIndex(2, 3), 0)
  assert.equal(VIDEO_GAP_MS, 2500)
})

test('el selector llena la franja y repite visualmente pocos videos sin romper el orden', () => {
  const desktop = selectorLayout(1440)
  assert.equal(desktop.sideCount, 4)
  assert.ok(desktop.step * 4 > 630)
  const slots = selectorSlots(0, 2, desktop.sideCount).filter(item => item.visible)
  assert.equal(slots.length, 9)
  assert.deepEqual(slots.map(item => item.index), [0, 1, 0, 1, 0, 1, 0, 1, 0])
  assert.equal(selectorLayout(320).sideCount, 2)
  assert.equal(dragSelectorPhase(8.75, 200, 100, 100), 9.75)
})
