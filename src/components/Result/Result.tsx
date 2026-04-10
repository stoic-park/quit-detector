import { useRef, useState } from 'react'
import type { QuizResult } from '../../types'
import { PixelAnimal } from '../PixelAnimal/PixelAnimal'
import { shareResultImage } from '../../utils/shareImage'
import styles from './Result.module.css'

interface ResultProps {
  result: QuizResult
  onRestart: () => void
  onShowMethodology: () => void
}

export function Result({ result, onRestart, onShowMethodology }: ResultProps) {
  const { totalScore, verdict, categoryScores, consistency, advice } = result
  const [sharing, setSharing] = useState(false)
  const [shareStatus, setShareStatus] = useState<string | null>(null)
  const captureRef = useRef<HTMLDivElement>(null)

  const handleShare = async () => {
    setSharing(true)
    setShareStatus(null)
    try {
      const outcome = await shareResultImage(result, captureRef.current)
      if (outcome === 'shared') setShareStatus('공유됨!')
      else if (outcome === 'downloaded') setShareStatus('이미지 저장됨!')
      else setShareStatus('공유 실패')
    } catch {
      setShareStatus('공유 실패')
    } finally {
      setSharing(false)
      setTimeout(() => setShareStatus(null), 2500)
    }
  }

  return (
    <div className={styles.result}>
      {/* 캡처 영역 시작 */}
      <div ref={captureRef} className={styles.captureArea}>
        <div className={styles.captureHeader}>직장인 퇴사 판독기</div>

        <div
          className={styles.scoreCard}
          style={{ borderColor: verdict.color }}
        >
          <div className={styles.animalWrap}>
            <PixelAnimal animal={verdict.animal} size={120} />
          </div>
          <div
            className={styles.archetypeName}
            style={{ color: verdict.color }}
          >
            {verdict.archetype}
          </div>
          <div className={styles.typeRow}>
            <span className={styles.typeCode} style={{ color: verdict.color }}>
              {verdict.typeCode}
            </span>
            <span className={styles.typeName}>{verdict.typeName}</span>
          </div>
          <p className={styles.slogan}>"{verdict.slogan}"</p>
          <div className={styles.scoreRow}>
            <div
              className={styles.scoreValue}
              style={{ color: verdict.color }}
            >
              {totalScore}
            </div>
          </div>
          <div className={styles.tags}>
            {verdict.tags.map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        </div>

        <div className={styles.axesBox}>
          <h3 className={styles.axesTitle}>3축 분석</h3>
          {(['O', 'E', 'I'] as const).map((axis) => {
            const data = verdict.axes[axis]
            const labels = { O: '과부하', E: '환경불만', I: '불안/통제' }
            return (
              <div key={axis} className={styles.axisRow}>
                <span className={styles.axisLabel}>
                  <strong style={{ color: data.high ? verdict.color : 'rgba(255,255,255,0.5)' }}>{axis}</strong>
                  {' '}{labels[axis]}
                </span>
                <div className={styles.axisBar}>
                  <div
                    className={styles.axisBarFill}
                    style={{
                      width: `${data.score}%`,
                      background: data.high ? verdict.color : 'rgba(255,255,255,0.25)',
                    }}
                  />
                </div>
                <span className={styles.axisScore}>{data.score}</span>
              </div>
            )
          })}
        </div>

        <div className={styles.verdictBox}>
          <p className={styles.verdictDesc}>{verdict.description}</p>
        </div>

        <div className={styles.adviceBox} style={{ borderLeftColor: verdict.color }}>
          <div className={styles.adviceHeader}>
            <span className={styles.adviceIcon}>💡</span>
            <h3 className={styles.adviceHeadline}>{advice.headline}</h3>
          </div>
          <ol className={styles.adviceSteps}>
            {advice.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
          {advice.reflect && (
            <p className={styles.adviceReflect}>{advice.reflect}</p>
          )}
        </div>

        <div className={styles.breakdown}>
          <h3 className={styles.breakdownTitle}>카테고리별 점수</h3>
          <div className={styles.categories}>
            {categoryScores.map((cat) => (
              <div
                key={cat.category}
                className={`${styles.category} ${cat.worst ? styles.worstCategory : ''}`}
              >
                <div className={styles.catHeader}>
                  <span className={styles.catLabel}>
                    {cat.label}
                    {cat.worst && (
                      <span className={styles.worstBadge}>주의</span>
                    )}
                  </span>
                  <span className={styles.catScore}>{cat.score}</span>
                </div>
                <div className={styles.catBar}>
                  <div
                    className={styles.catBarFill}
                    style={{
                      width: `${cat.score}%`,
                      background: getBarColor(cat.score),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`${styles.consistencyBox} ${styles[`consistency_${consistency.level}`]}`}
        >
          <div className={styles.consistencyRow}>
            <span className={styles.consistencyLabel}>응답 일관성</span>
            <span className={styles.consistencyValue}>{consistency.label}</span>
          </div>
          <p className={styles.consistencyNote}>{consistency.note}</p>
        </div>

        <div className={styles.captureFooter}>quit-detector.vercel.app</div>
      </div>
      {/* 캡처 영역 끝 */}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.primaryBtn}
          onClick={onRestart}
        >
          다시 테스트하기
        </button>
        <button
          type="button"
          className={styles.secondaryBtn}
          onClick={handleShare}
          disabled={sharing}
        >
          {sharing ? '이미지 생성 중...' : shareStatus ?? '결과 이미지 공유'}
        </button>
      </div>

      <button
        type="button"
        className={styles.methodologyLink}
        onClick={onShowMethodology}
      >
        이 테스트는 어떻게 만들어졌나요? →
      </button>
    </div>
  )
}

function getBarColor(score: number): string {
  if (score <= 20) return '#16a34a'
  if (score <= 40) return '#65a30d'
  if (score <= 60) return '#eab308'
  if (score <= 80) return '#f97316'
  return '#dc2626'
}
