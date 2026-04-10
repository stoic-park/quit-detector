import styles from './Welcome.module.css'

interface WelcomeProps {
  onStart: () => void
  onShowMethodology: () => void
  totalQuestions: number
}

export function Welcome({
  onStart,
  onShowMethodology,
  totalQuestions,
}: WelcomeProps) {
  return (
    <div className={styles.welcome}>
      <div className={styles.emoji} aria-hidden="true">
        🏃‍♂️💨
      </div>
      <h1 className={styles.title}>직장인 퇴사 판독기</h1>
      <p className={styles.subtitle}>
        지금 내 상태, 객관적으로 진단받아봐요
      </p>
      <div className={styles.info}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>문항</span>
          <span className={styles.infoValue}>{totalQuestions}개</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>소요</span>
          <span className={styles.infoValue}>약 3분</span>
        </div>
      </div>
      <button
        type="button"
        className={styles.startBtn}
        onClick={onStart}
        autoFocus
      >
        지금 진단 시작
      </button>
      <button
        type="button"
        className={styles.methodologyLink}
        onClick={onShowMethodology}
      >
        이 테스트는 어떻게 만들어졌나요? →
      </button>
      <p className={styles.disclaimer}>
        ※ KOSS-SF · MBI · JD-R 모델을 참고한 재미용 진단이에요. 의학적 진단이
        아닙니다.
      </p>
    </div>
  )
}
