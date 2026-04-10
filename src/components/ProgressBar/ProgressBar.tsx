import styles from './ProgressBar.module.css'

interface ProgressBarProps {
  current: number
  total: number
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = total > 0 ? (current / total) * 100 : 0
  return (
    <div className={styles.wrap}>
      <div className={styles.label}>
        {current} / {total}
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
      >
        <div
          className={styles.fill}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
