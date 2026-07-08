import sharp from 'sharp'
import { mkdirSync } from 'fs'

mkdirSync('public/icons', { recursive: true })

// Standard icon — logo fills most of the canvas
const standardSvg = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <rect width="48" height="48" rx="10" fill="#4F46E5"/>
  <path
    d="M11 18h26M15 18v-3.5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2V18M13.5 18l-2 16M34.5 18l2 16M20 24v10M28 24v10"
    stroke="#FFFFFF"
    stroke-width="2.4"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>`

// Maskable icon — extra padding (safe zone) since Android may crop edges
const maskableSvg = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <rect width="48" height="48" fill="#4F46E5"/>
  <g transform="translate(8, 8) scale(0.667)">
    <path
      d="M11 18h26M15 18v-3.5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2V18M13.5 18l-2 16M34.5 18l2 16M20 24v10M28 24v10"
      stroke="#FFFFFF"
      stroke-width="2.4"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </g>
</svg>`

async function generate(svgFn, filename, size) {
  await sharp(Buffer.from(svgFn(size)))
    .resize(size, size)
    .png()
    .toFile(`public/icons/${filename}`)
  console.log(`Generated ${filename}`)
}

await generate(standardSvg, 'icon-192.png', 192)
await generate(standardSvg, 'icon-512.png', 512)
await generate(maskableSvg, 'icon-maskable-192.png', 192)
await generate(maskableSvg, 'icon-maskable-512.png', 512)

console.log('All icons generated in public/icons/')