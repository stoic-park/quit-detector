export type Category =
  | 'jobDemand' // 직무 요구
  | 'jobControl' // 직무 자율
  | 'relationConflict' // 관계 갈등
  | 'rewardFairness' // 보상 공정성
  | 'orgCulture' // 조직 문화
  | 'jobInsecurity' // 직무 불안정
  | 'healthBurnout' // 건강/소진

export interface Question {
  id: number
  category: Category
  text: string
  /**
   * true: 긍정 질문 (그렇다 = 좋은 상태 = 낮은 퇴사 점수)
   * false: 부정 질문 (그렇다 = 나쁜 상태 = 높은 퇴사 점수)
   */
  positive: boolean
}

export type AnswerValue = 1 | 2 | 3 | 4 | 5

export interface Answers {
  [questionId: number]: AnswerValue
}

export interface CategoryScore {
  category: Category
  score: number
  label: string
  worst?: boolean
}

export type ConsistencyLevel = 'high' | 'medium' | 'low'

export interface Consistency {
  level: ConsistencyLevel
  label: string
  note: string
  stdDev: number
  flatlined: boolean
}

export type AnimalType = 'ox' | 'meerkat' | 'quokka' | 'hedgehog' | 'bird'

export type TypeCode = 'OEI' | 'OEi' | 'OeI' | 'Oei' | 'oEI' | 'oEi' | 'oeI' | 'oei'

export interface Verdict {
  typeCode: TypeCode
  totalScore: number
  animal: AnimalType
  typeName: string
  archetype: string
  slogan: string
  tags: string[]
  description: string
  color: string
  axes: {
    O: { score: number; high: boolean }
    E: { score: number; high: boolean }
    I: { score: number; high: boolean }
  }
}

export interface AdvicePack {
  headline: string
  steps: string[]
  reflect: string
}

export interface QuizResult {
  totalScore: number
  verdict: Verdict
  categoryScores: CategoryScore[]
  consistency: Consistency
  advice: AdvicePack
}

export const CATEGORY_LABELS: Record<Category, string> = {
  jobDemand: '직무 요구',
  jobControl: '직무 자율',
  relationConflict: '관계 갈등',
  rewardFairness: '보상 공정성',
  orgCulture: '조직 문화',
  jobInsecurity: '직무 불안정',
  healthBurnout: '건강/소진',
}

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  jobDemand: '업무량, 시간 압박, 집중 부담',
  jobControl: '재량권, 기술 활용, 의사결정 참여',
  relationConflict: '상사/동료와의 갈등, 조직 신뢰',
  rewardFairness: '금전적·비금전적 보상, 존중',
  orgCulture: '의사소통, 공정성, 합리성',
  jobInsecurity: '고용 안정, 미래 성장 전망',
  healthBurnout: '감정 소진, 냉소, 신체 증상',
}

export const LIKERT_LABELS: Record<AnswerValue, string> = {
  1: '매우 그렇지 않다',
  2: '그렇지 않다',
  3: '보통이다',
  4: '그렇다',
  5: '매우 그렇다',
}
