import type { QuizResult } from '../types'

/**
 * 결과 화면 전체를 DOM 캡처하여 이미지로 변환.
 * element가 주어지면 해당 DOM을 캡처, 없으면 fallback.
 */
export async function captureResultElement(
  element: HTMLElement,
): Promise<Blob | null> {
  try {
    const { default: html2canvas } = await import('html2canvas')
    const canvas = await html2canvas(element, {
      backgroundColor: '#020617',
      scale: 2,
      useCORS: true,
      logging: false,
    })

    return await new Promise((resolve) =>
      canvas.toBlob((blob) => resolve(blob), 'image/png'),
    )
  } catch {
    return null
  }
}

export async function shareResultImage(
  result: QuizResult,
  element?: HTMLElement | null,
): Promise<'shared' | 'downloaded' | 'failed'> {
  if (!element) return 'failed'

  const blob = await captureResultElement(element)
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
        text: `내 퇴사 점수: ${result.totalScore}점 — ${result.verdict.archetype} (${result.verdict.typeName})`,
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
