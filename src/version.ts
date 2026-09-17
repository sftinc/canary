/**
 * The version markers, oldest first. The page shows the LAST one; everything
 * above it is the record of previous pushes.
 *
 * The list is kept whole on purpose. It is the brief for whoever writes the
 * next one: read the entries below to pick up the register — a short, true,
 * faintly diverting fact — then append one in that spirit that is not already
 * here. Pick the subject at random; the further it lands from the last few
 * entries the better, and a theme forming across them is a sign to jump
 * somewhere else. Never edit or reorder what is above.
 *
 * Keep it short enough to read as a headline. It is set enormous, and much past
 * 45 characters it stops being a hero and starts being a paragraph.
 *
 * The earliest entries predate the convention and do not model it.
 */
const MARKERS = [
  '2026-09-17 first light',
  '2026-09-17 second light',
  'Canaries got their own tiny oxygen bottles',
  "Bananas are berries; strawberries aren't",
] as const

/** The `?? MARKERS[0]` is unreachable; it is how the compiler learns the array is not empty. */
export const MARKER = MARKERS.at(-1) ?? MARKERS[0]
