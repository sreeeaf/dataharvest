import { useEffect, useRef } from 'react'

const CHARS =
  '01アイウエオカキクケコサシスセソタチツテト0123456789ABCDEF#$%&+-<>'

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const fontSize = 16
    let columns = Math.floor(width / fontSize)
    let drops = new Array(columns).fill(0).map(() => Math.random() * -100)

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      columns = Math.floor(width / fontSize)
      drops = new Array(columns).fill(0).map(() => Math.random() * -100)
    }
    window.addEventListener('resize', handleResize)

    let animationFrame: number
    let lastTime = 0
    const frameInterval = 55

    function draw(time: number) {
      animationFrame = window.requestAnimationFrame(draw)
      if (time - lastTime < frameInterval) return
      lastTime = time
      if (!ctx) return

      ctx.fillStyle = 'rgba(4, 6, 8, 0.15)'
      ctx.fillRect(0, 0, width, height)

      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        if (y > 0) {
          ctx.fillStyle = 'rgba(57, 255, 106, 0.85)'
          ctx.fillText(char, x, y)
          ctx.fillStyle = 'rgba(57, 255, 106, 0.15)'
          ctx.fillText(char, x, y - fontSize)
        }

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    animationFrame = window.requestAnimationFrame(draw)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 opacity-30"
      aria-hidden="true"
    />
  )
}
