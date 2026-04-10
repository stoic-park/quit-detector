import {
  answerToQuitScore,
  calculateTotalScore,
  calculateCategoryScores,
  calculateConsistency,
  getVerdict,
  getAdvice,
  calculateResult,
} from './scoring'
import type { Answers, Question } from '../types'

const questions: Question[] = [
  { id: 1, category: 'jobDemand', text: 'q1', positive: false },
  { id: 2, category: 'jobDemand', text: 'q2', positive: true },
  { id: 3, category: 'healthBurnout', text: 'q3', positive: false },
]

describe('answerToQuitScore', () => {
  it('positive question: 5 → 0, 1 → 100', () => {
    expect(answerToQuitScore(5, true)).toBe(0)
    expect(answerToQuitScore(1, true)).toBe(100)
    expect(answerToQuitScore(3, true)).toBe(50)
  })

  it('negative question: 5 → 100, 1 → 0', () => {
    expect(answerToQuitScore(5, false)).toBe(100)
    expect(answerToQuitScore(1, false)).toBe(0)
    expect(answerToQuitScore(3, false)).toBe(50)
  })
})

describe('calculateTotalScore', () => {
  it('returns 0 when no answers', () => {
    expect(calculateTotalScore(questions, {})).toBe(0)
  })

  it('mid answers → 50', () => {
    const answers: Answers = { 1: 3, 2: 3, 3: 3 }
    expect(calculateTotalScore(questions, answers)).toBe(50)
  })

  it('all worst answers → 100', () => {
    // q1 negative + 5 → 100, q2 positive + 1 → 100, q3 negative + 5 → 100
    const answers: Answers = { 1: 5, 2: 1, 3: 5 }
    expect(calculateTotalScore(questions, answers)).toBe(100)
  })

  it('all best answers → 0', () => {
    const answers: Answers = { 1: 1, 2: 5, 3: 1 }
    expect(calculateTotalScore(questions, answers)).toBe(0)
  })
})

describe('calculateCategoryScores', () => {
  it('groups by category and sorts worst first', () => {
    const answers: Answers = { 1: 5, 2: 1, 3: 1 }
    // jobDemand: (100 + 100) / 2 = 100
    // healthBurnout: 0
    const result = calculateCategoryScores(questions, answers)
    expect(result[0].category).toBe('jobDemand')
    expect(result[0].worst).toBe(true)
    expect(result[0].score).toBe(100)
  })
})

describe('calculateConsistency', () => {
  it('detects flatlining', () => {
    const answers: Answers = { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3 }
    const c = calculateConsistency(answers)
    expect(c.flatlined).toBe(true)
    expect(c.level).toBe('low')
  })

  it('reports high consistency for varied answers', () => {
    const answers: Answers = { 1: 1, 2: 5, 3: 2, 4: 4, 5: 3 }
    const c = calculateConsistency(answers)
    expect(c.level).toBe('high')
    expect(c.flatlined).toBe(false)
  })

  it('handles empty answers', () => {
    const c = calculateConsistency({})
    expect(c.level).toBe('low')
    expect(c.flatlined).toBe(true)
  })
})

describe('getVerdict', () => {
  it('returns correct level for each range', () => {
    expect(getVerdict(0).level).toBe(1)
    expect(getVerdict(20).level).toBe(1)
    expect(getVerdict(21).level).toBe(2)
    expect(getVerdict(40).level).toBe(2)
    expect(getVerdict(50).level).toBe(3)
    expect(getVerdict(70).level).toBe(4)
    expect(getVerdict(100).level).toBe(5)
  })
})

describe('getAdvice', () => {
  it('returns targeted advice for worst category', () => {
    const verdict = getVerdict(70)
    const scores = [
      { category: 'healthBurnout' as const, score: 90, label: '건강/소진', worst: true },
      { category: 'jobDemand' as const, score: 50, label: '직무 요구' },
    ]
    const advice = getAdvice(verdict, scores)
    expect(advice.headline).toContain('몸과 마음')
    expect(advice.steps.length).toBeGreaterThan(0)
  })

  it('returns soft advice when score is low', () => {
    const verdict = getVerdict(15)
    const scores = [
      { category: 'jobDemand' as const, score: 30, label: '직무 요구', worst: true },
    ]
    const advice = getAdvice(verdict, scores)
    expect(advice.headline).toContain('괜찮')
  })
})

describe('calculateResult', () => {
  it('produces full result object', () => {
    const answers: Answers = { 1: 3, 2: 3, 3: 3 }
    const result = calculateResult(questions, answers)
    expect(result.totalScore).toBe(50)
    expect(result.verdict.level).toBe(3)
    expect(result.categoryScores.length).toBe(2)
    expect(result.consistency).toBeDefined()
    expect(result.advice).toBeDefined()
  })
})
