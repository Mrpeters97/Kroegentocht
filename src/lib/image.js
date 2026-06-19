// Schaal een gekozen/gemaakte foto terug naar een hanteerbaar formaat
// en lever 'm als JPEG data-URL. Belangrijk omdat we de foto's in
// localStorage bewaren (limiet ~5MB): een rauwe telefoonfoto van enkele
// MB's zou de opslag direct vol gooien. ~1100px + kwaliteit 0.82 ziet er
// scherp uit op een polaroid en blijft klein.
export function fileToResizedDataUrl(file, maxSize = 1100, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, w, h)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Kon de foto niet laden'))
    }
    img.src = url
  })
}
