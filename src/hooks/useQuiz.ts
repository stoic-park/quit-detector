import { useState, useCallback, useMemo } from 'react'
import type { Answers, AnswerValue, Question, QuizResult } from '../types'
import { calculateResult } from '../utils/scoring'

export type Screen = 'welcome' | 'quiz' | 'result' | 'methodology'

export function useQuiz(questions: Question[]) {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [previousScreen, setPreviousScreen] = useState<Screen>('welcome')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})

  const currentQuestion = questions[currentIndex]
  const totalQuestions = questions.length
  const answeredCount = Object.keys(answers).length

  const result: QuizResult | null = useMemo(() => {
    if (answeredCount < questions.length) return null
    return calculateResult(questions, answers)
  }, [questions, answers, answeredCount])

  const start = useCallback(() => {
    setCurrentIndex(0)
    setAnswers({})
    setScreen('quiz')
  }, [])

  const answer = useCallback(
    (value: AnswerValue) => {
      if (!currentQuestion) return
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }))
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((i) => i + 1)
      } else {
        setScreen('result')
      }
    },
    [currentQuestion, currentIndex, questions.length],
  )

  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1)
    }
  }, [currentIndex])

  const restart = useCallback(() => {
    setCurrentIndex(0)
    setAnswers({})
    setScreen('welcome')
  }, [])

  const showMethodology = useCallback(() => {
    setPreviousScreen(screen)
    setScreen('methodology')
  }, [screen])

  const closeMethodology = useCallback(() => {
    setScreen(previousScreen)
  }, [previousScreen])

  return {
    screen,
    currentQuestion,
    currentIndex,
    totalQuestions,
    answeredCount,
    answers,
    result,
    start,
    answer,
    goBack,
    restart,
    showMethodology,
    closeMethodology,
  }
}
