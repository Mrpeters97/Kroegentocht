// Bouwt een downloadbare 9:16-afbeelding: de feestelijke app-achtergrond
// (donkere gloed + schuine slinger + zwevende ballonnen) met daarop een
// licht schuingedraaide polaroid. In de polaroid de gemaakte foto (volledig
// binnen het kader) en onderin het logo-lockup: de folie-"29" met het
// uitgesneden hoofd (mét feesthoedje) ertussen. Levert een PNG data-URL.

const HEAD_SRC = '/images/jarige.png'

// De cijfer-vormen van het logo, geëxtraheerd uit public/images/logo.svg.
// Identiek aan FoilBalloonLogo zodat de polaroid hetzelfde logo toont.
const TWO_PATH =
  'M1658.68 2115.72L469.784 2487.92L408.465 2292.05C943.935 1601.78 1062.18 1377.45 995.911 1165.79C947.449 1010.99 848.946 958.578 679.405 1011.66C477.219 1074.95 425.165 1230 525.686 1495.69L201.126 1552.2C66.5844 1181.54 209.557 921.716 622.352 792.484C982.496 679.736 1220.04 762.62 1305.75 1036.41C1392.13 1312.31 1272.64 1547.44 826.369 2112.66L836.515 2130.29C897.326 2106.63 957.021 2086.78 1021.26 2066.67L1587.8 1889.31L1658.68 2115.72Z'
const NINE_PATH =
  'M2168.36 2342.32C1794.33 2260.43 1615.96 2058.72 1646.23 1750.19L1981.2 1778.35C1952.84 1969.81 2040.47 2090.66 2224.79 2131.01C2458.7 2182.22 2620.05 2033.43 2700.28 1666.93L2702.88 1655.08C2583.35 1741.87 2412.52 1768.85 2219.57 1726.61C1862.78 1648.5 1704.02 1439.79 1770.57 1135.81L1771.28 1132.58C1839.71 819.982 2111.72 692.021 2517.01 780.753C2963.27 878.452 3132.43 1158.35 3028.83 1631.55L3016.8 1686.53C2902.58 2208.24 2604.92 2437.89 2168.36 2342.32ZM2353.81 1557.19C2553.22 1600.85 2690.64 1530.4 2727.93 1360.09L2728.63 1356.86C2768.75 1173.61 2674.86 1040.1 2465.74 994.315C2254.47 948.061 2127.46 1017.4 2087.11 1201.72L2086.63 1203.88C2045.81 1390.36 2134.99 1509.29 2353.81 1557.19Z'
// Bounding box van beide cijfers samen (in SVG-coördinaten).
const DIG = { cx: 1599, cy: 1584, w: 3066, h: 1808 }

function loadImg(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function drawContain(ctx, img, x, y, w, h) {
  const scale = Math.min(w / img.width, h / img.height)
  const dw = img.width * scale
  const dh = img.height * scale
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh)
}

// Feesthoedje (zelfde vormen als de PartyHat-SVG) op het canvas.
// (baseCx, baseCy) = ankerpunt onder de kegelrand; scale t.o.v. de
// 40×50 viewBox; rotDeg geeft de vrolijke schuine stand.
function drawHat(ctx, baseCx, baseCy, scale, rotDeg) {
  ctx.save()
  ctx.translate(baseCx, baseCy)
  ctx.rotate((rotDeg * Math.PI) / 180)
  ctx.scale(scale, scale)
  ctx.translate(-20, -44) // viewBox-basis (20,44) → anker

  // Kegel
  const g = ctx.createLinearGradient(0, 0, 40, 50)
  g.addColorStop(0, '#FFE3F0')
  g.addColorStop(0.45, '#FF9FC9')
  g.addColorStop(1, '#D23E7E')
  ctx.beginPath()
  ctx.moveTo(20, 5)
  ctx.lineTo(7, 44)
  ctx.lineTo(33, 44)
  ctx.closePath()
  ctx.fillStyle = g
  ctx.fill()
  ctx.lineWidth = 0.8
  ctx.strokeStyle = 'rgba(255,255,255,0.6)'
  ctx.stroke()

  // Polka-dots + glansveeg, geclipt op de kegel
  ctx.save()
  ctx.clip()
  const dots = [
    [18, 17, 2.4, '#FFD27F'],
    [24, 25, 2.2, '#7FE8C2'],
    [15, 31, 2.6, '#7FB2E8'],
    [24, 37, 2.3, '#C9A8FF'],
    [29, 34, 1.7, '#FFD27F'],
  ]
  for (const [cx, cy, r, color] of dots) {
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
  }
  ctx.beginPath()
  ctx.moveTo(20, 5)
  ctx.lineTo(12, 42)
  ctx.lineTo(16, 43)
  ctx.closePath()
  ctx.fillStyle = 'rgba(255,255,255,0.35)'
  ctx.fill()
  ctx.restore()

  // Gekartelde witte rand onderaan
  ctx.fillStyle = '#ffffff'
  for (const [cx, cy] of [[9, 44], [15, 45], [21, 45.2], [27, 45], [32, 44]]) {
    ctx.beginPath()
    ctx.arc(cx, cy, 2, 0, Math.PI * 2)
    ctx.fill()
  }

  // Pluksels + pom-pom
  ctx.strokeStyle = '#FFD27F'
  ctx.lineWidth = 1.3
  ctx.lineCap = 'round'
  for (const [x2, y2] of [[20, 1], [24, 2.5], [16, 2.5]]) {
    ctx.beginPath()
    ctx.moveTo(20, 6)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }
  ctx.beginPath()
  ctx.arc(20, 6, 4.3, 0, Math.PI * 2)
  ctx.fillStyle = '#FFD27F'
  ctx.fill()
  ctx.lineWidth = 0.6
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'
  ctx.stroke()

  ctx.restore()
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

// ── Feestelijke app-achtergrond op het canvas ──────────────────────────
// Quadratische Bézier-slinger (zelfde control-punten als Garland.jsx).
const G_P0 = [6, 20]
const G_P1 = [172, 154]
const G_P2 = [352, 162]
const G_COLORS = ['#E879A6', '#7FB2E8', '#C9A8FF', '#7FE8C2', '#FFD27F']
function gBezier(t) {
  const u = 1 - t
  return [
    u * u * G_P0[0] + 2 * u * t * G_P1[0] + t * t * G_P2[0],
    u * u * G_P0[1] + 2 * u * t * G_P1[1] + t * t * G_P2[1],
  ]
}
function gTangentDeg(t) {
  const dx = 2 * (1 - t) * (G_P1[0] - G_P0[0]) + 2 * t * (G_P2[0] - G_P1[0])
  const dy = 2 * (1 - t) * (G_P1[1] - G_P0[1]) + 2 * t * (G_P2[1] - G_P1[1])
  return (Math.atan2(dy, dx) * 180) / Math.PI
}

function drawGarland(ctx, W, H) {
  ctx.save()
  ctx.translate(0, H * 0.1)
  const s = W / 360 // viewBox-breedte 360 → volledige canvasbreedte
  ctx.scale(s, s)
  // Touw
  ctx.strokeStyle = 'rgba(255,255,255,0.45)'
  ctx.lineWidth = 1.6
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(G_P0[0], G_P0[1])
  ctx.quadraticCurveTo(G_P1[0], G_P1[1], G_P2[0], G_P2[1])
  ctx.stroke()
  // Vlaggetjes, elk gekanteld langs de helling van het touw
  const N = 13
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1)
    const [x, y] = gBezier(t)
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate((gTangentDeg(t) * Math.PI) / 180)
    ctx.beginPath()
    ctx.moveTo(-8, 1)
    ctx.lineTo(8, 1)
    ctx.lineTo(0, 17)
    ctx.closePath()
    ctx.fillStyle = G_COLORS[i % G_COLORS.length]
    ctx.fill()
    ctx.lineWidth = 0.6
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'
    ctx.stroke()
    ctx.restore()
  }
  ctx.restore()
}

// Eén zwevende 3D-ballon (lichaam + knoopje + touwtje).
function drawBalloon(ctx, cx, cy, size, color, dark, rot) {
  const w = size
  const h = size * 1.22
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate((rot * Math.PI) / 180)
  // Lichaam met grondschaduw
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.4)'
  ctx.shadowBlur = size * 0.3
  ctx.shadowOffsetY = size * 0.18
  const fx = -w * 0.16
  const fy = -h * 0.23
  const grad = ctx.createRadialGradient(fx, fy, w * 0.04, fx, fy, w * 0.85)
  grad.addColorStop(0, 'rgba(255,255,255,0.85)')
  grad.addColorStop(0.5, color)
  grad.addColorStop(1, dark)
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
  // Knoopje
  ctx.fillStyle = dark
  ctx.beginPath()
  ctx.moveTo(0, h / 2 + size * 0.12)
  ctx.lineTo(-size * 0.08, h / 2 - 1)
  ctx.lineTo(size * 0.08, h / 2 - 1)
  ctx.closePath()
  ctx.fill()
  // Touwtje
  ctx.strokeStyle = 'rgba(255,255,255,0.4)'
  ctx.lineWidth = size * 0.03
  ctx.lineCap = 'round'
  const sy = h / 2 + size * 0.14
  ctx.beginPath()
  ctx.moveTo(0, sy)
  ctx.bezierCurveTo(-size * 0.12, sy + size * 0.18, size * 0.14, sy + size * 0.32, 0, sy + size * 0.5)
  ctx.stroke()
  ctx.restore()
}

function drawFestiveBackground(ctx, W, H) {
  // Diep-donker canvas
  ctx.fillStyle = '#0B0712'
  ctx.fillRect(0, 0, W, H)
  // Subtiele paars/roze gloed (zoals de body-gradient)
  let g = ctx.createRadialGradient(W * 0.5, -H * 0.1, 0, W * 0.5, -H * 0.1, W * 1.05)
  g.addColorStop(0, '#1f1530')
  g.addColorStop(0.55, 'rgba(31,21,48,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)
  g = ctx.createRadialGradient(W, H * 1.1, 0, W, H * 1.1, W * 0.95)
  g.addColorStop(0, '#1a1426')
  g.addColorStop(0.6, 'rgba(26,20,38,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)
  // Verre, onscherpe gloed-blobs
  const sf = W / 390 // schaal t.o.v. de telefoon-viewport
  const blobs = [
    [-0.12, 0.06, 240, '#B85C8E', 0.16],
    [0.72, 0.02, 180, '#5E7FB8', 0.14],
    [0.78, 0.6, 260, '#7A5FB0', 0.16],
    [-0.08, 0.66, 200, '#A86A9A', 0.14],
  ]
  ctx.save()
  ctx.filter = 'blur(60px)'
  for (const [x, y, s, c, op] of blobs) {
    const d = s * sf
    ctx.globalAlpha = op
    ctx.fillStyle = c
    ctx.beginPath()
    ctx.arc(x * W + d / 2, y * H + d / 2, d / 2, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
  // Slinger
  drawGarland(ctx, W, H)
  // Zwevende ballonnen
  const balloons = [
    [0.06, 0.3, 64, '#FF7DAE', '#C24D80', -6],
    [0.82, 0.24, 56, '#7FB2E8', '#3F6FB0', 7],
    [0.7, 0.7, 76, '#C9A8FF', '#7E5BC2', -5],
    [0.16, 0.74, 60, '#7FE8C2', '#3FAE89', 6],
    [0.4, 0.84, 50, '#FFD27F', '#C99B3F', -4],
    [0.9, 0.48, 44, '#FF9DC2', '#C95E8E', 8],
    [-0.02, 0.5, 48, '#A6C2E6', '#5E7FB8', -8],
  ]
  for (const [x, y, s, color, dark, rot] of balloons) {
    const d = s * sf
    drawBalloon(ctx, x * W + d / 2, y * H + d / 2, d, color, dark, rot)
  }
}

// ── De polaroid-kaart zelf (in lokale kaart-coördinaten, oorsprong 0,0) ──
// Alleen wit papier + de foto; het logo komt los bovenop (drawLogo).
function drawPolaroidCard(ctx, cardW, cardH, photoImg) {
  // Wit papier mét slagschaduw (de schaduw valt op de achtergrond).
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.5)'
  ctx.shadowBlur = 60
  ctx.shadowOffsetY = 30
  roundRect(ctx, 0, 0, cardW, cardH, 14)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  ctx.restore()

  // Klassieke polaroid: smalle rand boven/zijkant, iets dikkere onderrand.
  const border = 40
  const bottomBorder = 130
  const areaX = border
  const areaY = border
  const areaW = cardW - border * 2
  const areaH = cardH - border - bottomBorder

  // Foto: volledig binnen het kader (contain), nooit afgesneden.
  const fit = Math.min(areaW / photoImg.width, areaH / photoImg.height)
  const pw = photoImg.width * fit
  const ph = photoImg.height * fit
  const px = areaX + (areaW - pw) / 2
  const py = areaY + (areaH - ph) / 2
  ctx.drawImage(photoImg, px, py, pw, ph)
  ctx.strokeStyle = 'rgba(0,0,0,0.08)'
  ctx.lineWidth = 1
  ctx.strokeRect(px + 0.5, py + 0.5, pw - 1, ph - 1)
}

// ── Het logo-lockup (folie-"29" + hoofd mét hoedje ertussen) ──
// Tekent rond (cx, lockCenterY) in de huidige canvas-coördinaten.
function drawLogo(ctx, cx, lockCenterY, digitH, head) {
  const dscale = digitH / DIG.h
  ctx.save()
  ctx.shadowColor = 'rgba(190,52,110,0.55)'
  ctx.shadowBlur = 30
  ctx.shadowOffsetY = 18
  ctx.translate(cx, lockCenterY)
  ctx.scale(dscale, dscale)
  ctx.translate(-DIG.cx, -DIG.cy)
  const foil = ctx.createLinearGradient(900, 680, 1750, 2488)
  foil.addColorStop(0, '#FFC2DD')
  foil.addColorStop(0.28, '#FF9FC9')
  foil.addColorStop(0.52, '#F86FA8')
  foil.addColorStop(0.8, '#F0539A')
  foil.addColorStop(1, '#D23E7E')
  const digits = new Path2D(TWO_PATH)
  digits.addPath(new Path2D(NINE_PATH))
  ctx.fillStyle = foil
  ctx.fill(digits, 'evenodd')
  ctx.restore()

  if (head) {
    const headSize = digitH * 0.96
    const headCx = cx - headSize * 0.06
    const headCy = lockCenterY - headSize * 0.16
    const headX = headCx - headSize / 2
    const headY = headCy - headSize / 2
    ctx.save()
    ctx.shadowColor = 'rgba(0,0,0,0.4)'
    ctx.shadowBlur = 16
    ctx.shadowOffsetY = 10
    drawContain(ctx, head, headX, headY, headSize, headSize)
    ctx.restore()
    drawHat(ctx, headX + headSize * 0.5, headY + headSize * 0.16, headSize * 0.016, 14)
  }
}

export async function buildPolaroidDataUrl({ photo }) {
  // Vast 9:16 portret-formaat.
  const W = 1080
  const H = 1920

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  // 1. Feestelijke achtergrond
  drawFestiveBackground(ctx, W, H)

  const photoImg = await loadImg(photo)
  let head = null
  try {
    head = await loadImg(HEAD_SRC)
  } catch {
    /* geen hoofd beschikbaar */
  }

  // 2. Polaroid-kaart, licht schuin op de achtergrond. Iets naar onderen
  //    geschoven zodat er bovenaan ruimte is voor het logo.
  const cardW = 740
  const cardH = 980
  const cardCx = W / 2
  const cardCy = H / 2 + 70
  ctx.save()
  ctx.translate(cardCx, cardCy)
  ctx.rotate((-4.5 * Math.PI) / 180) // semi-schuin
  ctx.translate(-cardW / 2, -cardH / 2)
  drawPolaroidCard(ctx, cardW, cardH, photoImg)
  ctx.restore()

  // 3. Logo bovenaan — zoals in de app — dat net een klein stukje over de
  //    bovenkant van de polaroid heen valt.
  drawLogo(ctx, W / 2 - 16, 470, 250, head)

  return canvas.toDataURL('image/png')
}
