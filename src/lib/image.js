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

// Trigger een download van een data-URL met de gegeven bestandsnaam.
export function downloadDataUrl(dataUrl, filename) {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
}

// Zet een data-URL om naar een File-object.
function dataUrlToFile(dataUrl, filename) {
  const [meta, b64] = dataUrl.split(',')
  const mime = (meta.match(/:(.*?);/) || [, 'image/png'])[1]
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return new File([bytes], filename, { type: mime })
}

// Bewaar een afbeelding. Op de telefoon openen we het native deel-menu
// (Web Share API met bestand), zodat de gebruiker 'm direct in z'n Foto's
// kan opslaan i.p.v. eerst in de browser-downloads te belanden. Lukt dat
// niet (desktop / geen ondersteuning), dan vallen we terug op een download.
export async function savePolaroid(dataUrl, filename) {
  try {
    const file = dataUrlToFile(dataUrl, filename)
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'Polaroid' })
        return
      } catch (err) {
        // Gebruiker sloot het deel-menu zelf → niets verder doen.
        if (err && err.name === 'AbortError') return
        // Anders: val terug op een gewone download.
      }
    }
  } catch {
    /* val terug op download */
  }
  downloadDataUrl(dataUrl, filename)
}
