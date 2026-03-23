export function useSvgToPng() {
  async function convert(svgUrl: string, width: number, height: number, scale = 2): Promise<Blob> {
    await document.fonts.ready

    const img = new Image()
    img.crossOrigin = 'anonymous'

    const loaded = new Promise<void>((resolve, reject) => {
      // oxlint-disable-next-line eslint-plugin-unicorn(prefer-add-event-listener)
      img.onload = () => resolve()
      // oxlint-disable-next-line eslint-plugin-unicorn(prefer-add-event-listener)
      img.onerror = () => reject(new Error(`Failed to load SVG: ${svgUrl}`))
    })

    img.src = svgUrl
    await loaded

    const canvas = document.createElement('canvas')
    canvas.width = width * scale
    canvas.height = height * scale

    const ctx = canvas.getContext('2d')!
    ctx.scale(scale, scale)
    ctx.drawImage(img, 0, 0, width, height)

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(blob => {
        if (blob) resolve(blob)
        else reject(new Error('Canvas toBlob failed'))
      }, 'image/png')
    })
  }

  return { convert }
}
