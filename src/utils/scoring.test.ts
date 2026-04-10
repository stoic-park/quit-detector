import {
  answerToQuitScore,
  calculateTotalScore,
  calculateCategoryScores,
  calculateConsistency,
  getVerdict,
  getTypeCode,
  getAdvice,
  calculateResult,
} from './scoring'
import type { Answers, CategoryScore, Question } from '../types'

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

describe('getTypeCode', () => {
  it('returns oei when all scores are low', () => {
    const scores: CategoryScore[] = [
      { category: 'jobDemand', score: 20, label: '직무 요구' },
      { category: 'healthBurnout', score: 20, label: '건강/소진' },
      { category: 'rewardFairness', score: 20, label: '보상 공정성' },
      { category: 'orgCulture', score: 20, label: '조직 문화' },
      { category: 'relationConflict', score: 20, label: '관계 갈등' },
      { category: 'jobInsecurity', score: 20, label: '직무 불안정' },
      { category: 'jobControl', score: 20, label: '직무 자율' },
    ]
    expect(getTypeCode(scores)).toBe('oei')
  })

  it('returns OEI when all scores are high', () => {
    const scores: CategoryScore[] = [
      { category: 'jobDemand', score: 80, label: '직무 요구' },
      { category: 'healthBurnout', score: 80, label: '건강/소진' },
      { category: 'rewardFairness', score: 80, label: '보상 공정성' },
      { category: 'orgCulture', score: 80, label: '조직 문화' },
      { category: 'relationConflict', score: 80, label: '관계 갈등' },
      { category: 'jobInsecurity', score: 80, label: '직무 불안정' },
      { category: 'jobControl', score: 80, label: '직무 자율' },
    ]
    expect(getTypeCode(scores)).toBe('OEI')
  })

  it('returns mixed type correctly', () => {
    const scores: CategoryScore[] = [
      { category: 'jobDemand', score: 80, label: '직무 요구' },
      { category: 'healthBurnout', score: 80, label: '건강/소진' },
      { category: 'rewardFairness', score: 20, label: '보상 공정성' },
      { category: 'orgCulture', score: 20, label: '조직 문화' },
      { category: 'relationConflict', score: 20, label: '관계 갈등' },
      { category: 'jobInsecurity', score: 20, label: '직무 불안정' },
      { category: 'jobControl', score: 20, label: '직무 자율' },
    ]
    expect(getTypeCode(scores)).toBe('Oei')
  })
})

describe('getVerdict', () => {
  it('returns correct animal for type code', () => {
    const lowScores: CategoryScore[] = [
      { category: 'jobDemand', score: 20, label: '직무 요구' },
      { category: 'healthBurnout', score: 20, label: '건강/소진' },
      { category: 'rewardFairness', score: 20, label: '보상 공정성' },
      { category: 'orgCulture', score: 20, label: '조직 문화' },
      { category: 'relationConflict', score: 20, label: '관계 갈등' },
      { category: 'jobInsecurity', score: 20, label: '직무 불안정' },
      { category: 'jobControl', score: 20, label: '직무 자율' },
    ]
    const verdict = getVerdict(20, lowScores)
    expect(verdict.typeCode).toBe('oei')
    expect(verdict.animal).toBe('ox')
  })
})

describe('getAdvice', () => {
  it('returns targeted advice for worst category', () => {
    const scores: CategoryScore[] = [
      { category: 'healthBurnout', score: 90, label: '건강/소진', worst: true },
      { category: 'jobDemand', score: 70, label: '직무 요구' },
      { category: 'rewardFairness', score: 50, label: '보상 공정성' },
      { category: 'orgCulture', score: 50, label: '조직 문화' },
      { category: 'relationConflict', score: 50, label: '관계 갈등' },
      { category: 'jobInsecurity', score: 50, label: '직무 불안정' },
      { category: 'jobControl', score: 50, label: '직무 자율' },
    ]
    const verdict = getVerdict(70, scores)
    const advice = getAdvice(verdict, scores)
    expect(advice.headline).toContain('몸과 마음')
    expect(advice.steps.length).toBeGreaterThan(0)
  })

  it('returns soft advice when score is low', () => {
    const scores: CategoryScore[] = [
      { category: 'jobDemand', score: 30, label: '직무 요구', worst: true },
      { category: 'healthBurnout', score: 10, label: '건강/소진' },
      { category: 'rewardFairness', score: 10, label: '보상 공정성' },
      { category: 'orgCulture', score: 10, label: '조직 문화' },
      { category: 'relationConflict', score: 10, label: '관계 갈등' },
      { category: 'jobInsecurity', score: 10, label: '직무 불안정' },
      { category: 'jobControl', score: 10, label: '직무 자율' },
    ]
    const verdict = getVerdict(15, scores)
    const advice = getAdvice(verdict, scores)
    expect(advice.headline).toContain('괜찮')
  })
})

describe('calculateResult', () => {
  it('produces full result object', () => {
    const answers: Answers = { 1: 3, 2: 3, 3: 3 }
    const result = calculateResult(questions, answers)
    expect(result.totalScore).toBe(50)
    expect(result.verdict.typeCode).toBeDefined()
    expect(result.categoryScores.length).toBe(2)
    expect(result.consistency).toBeDefined()
    expect(result.advice).toBeDefined()
  })
})
