import type { AnswerValue, Question as QuestionType } from '../../types'
import { LIKERT_LABELS, CATEGORY_LABELS } from '../../types'
import styles from './Question.module.css'

interface QuestionProps {
  question: QuestionType
  selected: AnswerValue | undefined
  onAnswer: (value: AnswerValue) => void
  onBack: () => void
  canGoBack: boolean
}

const OPTIONS: AnswerValue[] = [1, 2, 3, 4, 5]

export function Question({
  question,
  selected,
  onAnswer,
  onBack,
  canGoBack,
}: QuestionProps) {
  return (
    <div className={styles.question} key={question.id}>
      <div className={styles.category}>
        {CATEGORY_LABELS[question.category]}
      </div>
      <h2 className={styles.text}>{question.text}</h2>

      <div className={styles.options}>
        {OPTIONS.map((value) => {
          const isSelected = selected === value
          return (
            <button
              key={value}
              type="button"
              className={`${styles.option} ${
                isSelected ? styles.optionSelected : ''
              }`}
              onClick={() => onAnswer(value)}
              aria-pressed={isSelected}
            >
              <span className={styles.optionDot} data-level={value} />
              <span className={styles.optionLabel}>
                {LIKERT_LABELS[value]}
              </span>
            </button>
          )
        })}
      </div>

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={onBack}
          disabled={!canGoBack}
        >
          ← 이전
        </button>
      </div>
    </div>
  )
}
