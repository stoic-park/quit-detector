import type { QuizResult } from '../types'

/**
 * Canvas API로 결과 카드 이미지를 생성 (외부 의존성 제로).
 * 반환값: Blob (공유용)
 */
export async function renderResultImage(
  result: QuizResult,
): Promise<Blob | null> {
  const width = 1080
  const height = 1920
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  // 배경 그라데이션
  const bg = ctx.createLinearGradient(0, 0, 0, height)
  bg.addColorStop(0, '#1e1b4b')
  bg.addColorStop(1, '#020617')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, width, height)

  // 상단 텍스트
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.font = '600 36px -apple-system, BlinkMacSystemFont, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('직장인 퇴사 판독기', width / 2, 200)

  // 타이틀
  ctx.fillStyle = result.verdict.color
  ctx.font = '800 120px -apple-system, BlinkMacSystemFont, sans-serif'
  ctx.fillText(result.verdict.title, width / 2, 400)

  // 점수 원
  const cx = width / 2
  const cy = 820
  const radius = 280

  // 외곽 링 (전체)
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(255,255,255,0.1)'
  ctx.lineWidth = 30
  ctx.stroke()

  // 점수 링 (진행)
  const progress = result.totalScore / 100
  ctx.beginPath()
  ctx.arc(
    cx,
    cy,
    radius,
    -Math.PI / 2,
    -Math.PI / 2 + Math.PI * 2 * progress,
  )
  ctx.strokeStyle = result.verdict.color
  ctx.lineWidth = 30
  ctx.lineCap = 'round'
  ctx.stroke()

  // 점수 숫자
  ctx.fillStyle = 'white'
  ctx.font = '900 260px -apple-system, BlinkMacSystemFont, sans-serif'
  ctx.textBaseline = 'middle'
  ctx.fillText(String(result.totalScore), cx, cy)
  ctx.textBaseline = 'alphabetic'

  // /100
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.font = '700 70px -apple-system, BlinkMacSystemFont, sans-serif'
  ctx.fillText('/ 100', cx, cy + 260)

  // 카테고리 TOP 3
  const categoriesToShow = result.categoryScores.slice(0, 3)
  let y = 1280
  ctx.textAlign = 'left'
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.font = '600 36px -apple-system, BlinkMacSystemFont, sans-serif'
  ctx.fillText('가장 힘든 영역', 140, y)
  y += 60

  for (const cat of categoriesToShow) {
    // 라벨
    ctx.fillStyle = 'white'
    ctx.font = '700 48px -apple-system, BlinkMacSystemFont, sans-serif'
    ctx.fillText(cat.label, 140, y)
    // 점수
    ctx.fillStyle = getBarColor(cat.score)
    ctx.textAlign = 'right'
    ctx.fillText(String(cat.score), width - 140, y)
    ctx.textAlign = 'left'
    y += 20
    // 바 배경
    ctx.fillStyle = 'rgba(255,255,255,0.1)'
    ctx.fillRect(140, y, width - 280, 16)
    // 바 채움
    ctx.fillStyle = getBarColor(cat.score)
    ctx.fillRect(140, y, ((width - 280) * cat.score) / 100, 16)
    y += 80
  }

  // 하단 워터마크
  ctx.fillStyle = 'rgba(255,255,255,0.3)'
  ctx.font = '500 32px -apple-system, BlinkMacSystemFont, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('quit-detector · 재미로 보는 심리테스트', width / 2, height - 80)

  return await new Promise((resolve) =>
    canvas.toBlob((blob) => resolve(blob), 'image/png'),
  )
}

function getBarColor(score: number): string {
  if (score <= 20) return '#16a34a'
  if (score <= 40) return '#65a30d'
  if (score <= 60) return '#eab308'
  if (score <= 80) return '#f97316'
  return '#dc2626'
}

export async function downloadResultImage(
  result: QuizResult,
  filename = '퇴사판독기-결과.png',
): Promise<boolean> {
  const blob = await renderResultImage(result)
  if (!blob) return false
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  return true
}

export async function shareResultImage(
  result: QuizResult,
): Promise<'shared' | 'downloaded' | 'failed'> {
  const blob = await renderResultImage(result)
  if (!blob) return 'failed'

  const file = new File([blob], '퇴사판독기-결과.png', { type: 'image/png' })

  // Web Share API with files
  if (
    typeof navigator !== 'undefined' &&
    'share' in navigator &&
    'canShare' in navigator &&
    navigator.canShare({ files: [file] })
  ) {
    try {
      await navigator.share({
        files: [file],
        title: '직장인 퇴사 판독기',
        text: `내 퇴사 점수: ${result.totalScore}점 — ${result.verdict.title}`,
      })
      return 'shared'
    } catch {
      // fallthrough to download
    }
  }

  // Fallback: download
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = '퇴사판독기-결과.png'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  return 'downloaded'
}
