import { useState } from 'react'
import type { QuizResult } from '../../types'
import styles from './ShareButtons.module.css'

interface ShareButtonsProps {
  result: QuizResult
  onCaptureShare: () => Promise<void>
}

const SITE_URL = 'https://quit-detector.vercel.app'

function getShareText(result: QuizResult) {
  return `내 퇴사 유형은 "${result.verdict.archetype}" (${result.verdict.typeName})!\n퇴사 점수: ${result.totalScore}점\n"${result.verdict.slogan}"\n\n나도 테스트 해보기 👉`
}

export function ShareButtons({ result, onCaptureShare }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const shareText = getShareText(result)

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '직장인 퇴사 판독기',
          text: shareText,
          url: SITE_URL,
        })
      } catch {
        // user cancelled
      }
    } else {
      await onCaptureShare()
    }
  }

  const handleKakao = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${SITE_URL}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // fallback
      const input = document.createElement('textarea')
      input.value = `${shareText}\n${SITE_URL}`
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const handleKakaoTalk = () => {
    const text = `${shareText}\n${SITE_URL}`
    const kakaoUrl = `https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(SITE_URL)}&text=${encodeURIComponent(text)}`
    window.open(kakaoUrl, '_blank', 'width=600,height=700')
  }

  const handleFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL)}`,
      '_blank',
      'width=600,height=400',
    )
  }

  const handleX = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(SITE_URL)}`,
      '_blank',
      'width=600,height=400',
    )
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>친구에게 공유하기</h3>
      <div className={styles.buttons}>
        <button
          type="button"
          className={styles.shareBtn}
          onClick={handleNativeShare}
          aria-label="공유하기"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
        </button>

        <button
          type="button"
          className={`${styles.shareBtn} ${styles.link}`}
          onClick={handleKakao}
          aria-label="링크 복사"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          {copied && <span className={styles.toast}>링크 복사됨!</span>}
        </button>

        <button
          type="button"
          className={`${styles.shareBtn} ${styles.kakao}`}
          onClick={handleKakaoTalk}
          aria-label="카카오톡 공유"
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M12 3C6.5 3 2 6.58 2 11c0 2.83 1.82 5.3 4.56 6.72l-1.16 4.28 4.96-3.26c.52.06 1.06.1 1.64.1 5.5 0 10-3.58 10-8S17.5 3 12 3z"/>
          </svg>
        </button>

        <button
          type="button"
          className={`${styles.shareBtn} ${styles.facebook}`}
          onClick={handleFacebook}
          aria-label="페이스북 공유"
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07c0 6.02 4.39 11.02 10.13 11.93v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.33l-.53 3.49h-2.8v8.44C19.61 23.09 24 18.09 24 12.07z"/>
          </svg>
        </button>

        <button
          type="button"
          className={`${styles.shareBtn} ${styles.x}`}
          onClick={handleX}
          aria-label="X 공유"
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
