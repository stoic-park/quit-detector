import { useEffect, useRef } from 'react'
import { Welcome } from './components/Welcome/Welcome'
import { Question } from './components/Question/Question'
import { Result } from './components/Result/Result'
import { ProgressBar } from './components/ProgressBar/ProgressBar'
import { Methodology } from './components/Methodology/Methodology'
import { useQuiz } from './hooks/useQuiz'
import { QUESTIONS } from './data/questions'
import styles from './App.module.css'

export default function App() {
  const {
    screen,
    currentQuestion,
    currentIndex,
    totalQuestions,
    answers,
    result,
    start,
    answer,
    goBack,
    restart,
    showMethodology,
    closeMethodology,
  } = useQuiz(QUESTIONS)

  const liveRegionRef = useRef<HTMLDivElement | null>(null)

  // Focus / live region update when question changes
  useEffect(() => {
    if (screen === 'quiz' && currentQuestion && liveRegionRef.current) {
      liveRegionRef.current.textContent = `문항 ${currentIndex + 1} / ${totalQuestions}: ${currentQuestion.text}`
    }
  }, [screen, currentQuestion, currentIndex, totalQuestions])

  // Keyboard shortcuts: 1-5 to answer, Backspace/ArrowLeft to go back
  useEffect(() => {
    if (screen !== 'quiz') return
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return
      const key = e.key
      if (['1', '2', '3', '4', '5'].includes(key)) {
        e.preventDefault()
        answer(Number(key) as 1 | 2 | 3 | 4 | 5)
      } else if (key === 'Backspace' || key === 'ArrowLeft') {
        e.preventDefault()
        goBack()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [screen, answer, goBack])

  return (
    <div className={styles.app}>
      <div className={styles.card}>
        {screen === 'welcome' && (
          <Welcome
            onStart={start}
            onShowMethodology={showMethodology}
            totalQuestions={totalQuestions}
          />
        )}

        {screen === 'quiz' && currentQuestion && (
          <div className={styles.quizWrap}>
            <ProgressBar
              current={currentIndex + 1}
              total={totalQuestions}
            />
            <Question
              question={currentQuestion}
              selected={answers[currentQuestion.id]}
              onAnswer={answer}
              onBack={goBack}
              canGoBack={currentIndex > 0}
            />
          </div>
        )}

        {screen === 'result' && result && (
          <Result
            result={result}
            onRestart={restart}
            onShowMethodology={showMethodology}
          />
        )}

        {screen === 'methodology' && (
          <Methodology onBack={closeMethodology} />
        )}
      </div>

      {/* Screen reader live region for quiz progress */}
      <div
        ref={liveRegionRef}
        aria-live="polite"
        aria-atomic="true"
        className={styles.srOnly}
      />
    </div>
  )
}
