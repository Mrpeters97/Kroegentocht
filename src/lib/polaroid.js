// Bouwt een downloadbare "polaroid" van een gemaakte foto: witte lijst,
// de foto bovenin (vierkant), en onderin — gecentreerd in het witte
// balkje — hetzelfde logo-lockup als in de header: de folie-"29" met het
// uitgesneden hoofd (mét feesthoedje) ertussen, dat net iets over de foto
// heen valt. Levert een PNG data-URL.

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

function drawCover(ctx, img, x, y, w, h) {
  const scale = Math.max(w / img.width, h / img.height)
  const dw = img.width * scale
  const dh = img.height * scale
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh)
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

export async function buildPolaroidDataUrl({ photo }) {
  const W = 820
  const border = 48
  const photoSize = W - border * 2 // 724
  const footerH = 250
  const H = border + photoSize + footerH

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, H)

  // Foto bovenin
  const photoImg = await loadImg(photo)
  drawCover(ctx, photoImg, border, border, photoSize, photoSize)
  ctx.strokeStyle = 'rgba(0,0,0,0.08)'
  ctx.lineWidth = 1
  ctx.strokeRect(border + 0.5, border + 0.5, photoSize - 1, photoSize - 1)

  let head = null
  try {
    head = await loadImg(HEAD_SRC)
  } catch {
    /* geen hoofd beschikbaar */
  }

  const photoBottom = border + photoSize

  // ── Logo-lockup: de folie-"29" met het hoofd ertussen, gecentreerd in
  //    het witte balkje en net iets over de foto heen (zoals de header). ──
  const digitH = 162
  const dscale = digitH / DIG.h
  // Verticaal middelpunt van de cijfers: zo gekozen dat het hoofd + hoedje
  // net over de onderrand van de foto vallen, terwijl de cijfers mooi in het
  // witte balkje staan.
  const lockCenterY = photoBottom + 86

  // Cijfers via Path2D met een roze folie-gradient. De lichte top van de
  // header-folie is hier iets roziger gemaakt zodat de "29" leesbaar blijft
  // op het witte papier.
  ctx.save()
  ctx.translate(W / 2, lockCenterY)
  ctx.scale(dscale, dscale)
  ctx.translate(-DIG.cx, -DIG.cy)
  const foil = ctx.createLinearGradient(900, 680, 1750, 2488)
  foil.addColorStop(0, '#FFC2DD')
  foil.addColorStop(0.28, '#FF9FC9')
  foil.addColorStop(0.52, '#F86FA8')
  foil.addColorStop(0.8, '#F0539A')
  foil.addColorStop(1, '#D23E7E')
  ctx.fillStyle = foil
  ctx.fill(new Path2D(TWO_PATH), 'evenodd')
  ctx.fill(new Path2D(NINE_PATH), 'evenodd')
  ctx.restore()

  // Hoofd tússen de cijfers, met dezelfde nudge als de header
  // (iets links van het midden + iets omhoog).
  if (head) {
    const headSize = digitH * 0.96
    const headCx = W / 2 - headSize * 0.06
    const headCy = lockCenterY - headSize * 0.16
    const headX = headCx - headSize / 2
    const headY = headCy - headSize / 2
    drawContain(ctx, head, headX, headY, headSize, headSize)
    // Hoedje bovenop het hoofd (schuin)
    drawHat(ctx, headX + headSize * 0.5, headY + headSize * 0.16, headSize * 0.016, 14)
  }

  return canvas.toDataURL('image/png')
}
