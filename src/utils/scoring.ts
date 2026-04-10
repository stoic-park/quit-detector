import type {
  AdvicePack,
  Answers,
  AnswerValue,
  Category,
  CategoryScore,
  Consistency,
  Question,
  QuizResult,
  Verdict,
} from '../types'
import { CATEGORY_LABELS } from '../types'

/**
 * 각 답변을 "퇴사 점수"(0~100)로 변환. 0=좋음, 100=나쁨.
 */
export function answerToQuitScore(
  answer: AnswerValue,
  positive: boolean,
): number {
  const raw = ((answer - 1) / 4) * 100
  return positive ? 100 - raw : raw
}

export function calculateCategoryScores(
  questions: Question[],
  answers: Answers,
): CategoryScore[] {
  const byCategory = new Map<Category, number[]>()

  for (const q of questions) {
    const ans = answers[q.id]
    if (ans === undefined) continue
    const score = answerToQuitScore(ans, q.positive)
    const existing = byCategory.get(q.category) ?? []
    existing.push(score)
    byCategory.set(q.category, existing)
  }

  const result: CategoryScore[] = []
  for (const [category, scores] of byCategory.entries()) {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length
    result.push({
      category,
      score: Math.round(avg),
      label: CATEGORY_LABELS[category],
    })
  }

  result.sort((a, b) => b.score - a.score)
  if (result.length > 0) {
    result[0].worst = true
  }
  return result
}

export function calculateTotalScore(
  questions: Question[],
  answers: Answers,
): number {
  if (questions.length === 0) return 0
  const scores: number[] = []
  for (const q of questions) {
    const ans = answers[q.id]
    if (ans === undefined) continue
    scores.push(answerToQuitScore(ans, q.positive))
  }
  if (scores.length === 0) return 0
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
}

/**
 * 응답 일관성 계산.
 * - 원시 답변(1~5)의 표준편차 기반
 * - 평탄화(flatlining): stdDev가 매우 낮으면 무성의 응답 가능성
 */
export function calculateConsistency(answers: Answers): Consistency {
  const values = Object.values(answers)
  if (values.length === 0) {
    return {
      level: 'low',
      label: '측정 불가',
      note: '응답이 없습니다.',
      stdDev: 0,
      flatlined: true,
    }
  }

  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const variance =
    values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length
  const stdDev = Math.sqrt(variance)

  const flatlined = stdDev < 0.4

  if (flatlined) {
    return {
      level: 'low',
      label: '낮음',
      note: '거의 모든 문항에 비슷한 답을 선택했어요. 답변을 다시 찬찬히 떠올려보면 더 정확해져요.',
      stdDev,
      flatlined: true,
    }
  }
  if (stdDev < 0.9) {
    return {
      level: 'medium',
      label: '보통',
      note: '응답 폭이 좁은 편입니다. 결과는 참고용으로 보세요.',
      stdDev,
      flatlined: false,
    }
  }
  return {
    level: 'high',
    label: '높음',
    note: '문항별로 충분한 변화를 보이는 응답입니다.',
    stdDev,
    flatlined: false,
  }
}

export function getVerdict(totalScore: number): Verdict {
  if (totalScore <= 20) {
    return {
      level: 1,
      title: '천직이네요!',
      description:
        '당신은 지금 자리에 잘 맞는 것 같아요. 지금의 루틴과 관계를 소중히 지켜가세요.',
      color: '#16a34a',
    }
  }
  if (totalScore <= 40) {
    return {
      level: 2,
      title: '아직은 견딜 만',
      description:
        '전반적으로 괜찮지만 몇 가지 아쉬운 부분이 있네요. 퇴사까지는 아닙니다.',
      color: '#65a30d',
    }
  }
  if (totalScore <= 60) {
    return {
      level: 3,
      title: '경고등 점멸 중',
      description:
        '스트레스가 쌓이고 있어요. 이대로 두면 감정이 더 상할 수 있어요.',
      color: '#eab308',
    }
  }
  if (totalScore <= 80) {
    return {
      level: 4,
      title: '진지하게 고민할 때',
      description:
        '여러 영역에서 빨간불이 켜졌어요. 퇴사를 진지하게 검토할 시점입니다.',
      color: '#f97316',
    }
  }
  return {
    level: 5,
    title: '당장 탈출하세요',
    description:
      '건강과 삶의 질이 위협받고 있어요. 이 상황을 더 견디는 건 위험합니다.',
    color: '#dc2626',
  }
}

/**
 * 가장 점수가 나쁜 카테고리에 맞춘 조언 생성.
 */
export function getAdvice(
  verdict: Verdict,
  categoryScores: CategoryScore[],
): AdvicePack {
  const worst = categoryScores[0]
  if (!worst) {
    return {
      headline: '결과를 다시 확인해 주세요.',
      steps: [],
      reflect: '',
    }
  }

  const cat = worst.category
  const level = verdict.level

  const ADVICE_BY_CATEGORY: Record<
    Category,
    { headline: string; steps: string[]; reflect: string }
  > = {
    jobDemand: {
      headline: '업무량이 당신을 짓누르고 있어요.',
      steps: [
        '이번 주 업무 중 "내가 꼭 안 해도 되는 일" 1가지를 찾아 위임하거나 연기하세요.',
        '상사와 1:1 때 현재 우선순위 TOP 3를 함께 확정해 나머지는 내려놓으세요.',
        '야근/주말 근무가 상시화되었다면 구조적 원인(인력/프로세스)을 적어 문서화해 두세요.',
      ],
      reflect:
        '"내가 없어도 회사는 돌아간다"는 말을 마음에 새겨두세요. 지속가능한 페이스가 가장 빠른 길입니다.',
    },
    jobControl: {
      headline: '재량 없이 끌려가는 기분이 들고 있어요.',
      steps: [
        '다음 주 업무 중 하나를 골라 "결정 권한을 달라"고 구체적으로 요청해 보세요.',
        '내 전문성이 발휘되는 과제를 회의 때 자원해서 맡아보세요.',
        '3개월 안에 역량을 새로 쓸 수 있는 프로젝트가 없다면, 부서 이동이나 이직을 검토하세요.',
      ],
      reflect:
        '성장은 "도전 × 자율성"에서 나옵니다. 지금 그 공식이 성립하는지 자문해 보세요.',
    },
    relationConflict: {
      headline: '관계에서 오는 피로가 가장 큽니다.',
      steps: [
        '갈등의 당사자와 문제를 "업무 언어"로만 축소해 짧게 대화해 보세요.',
        '믿을 만한 동료 또는 사외 친구에게 상황을 털어놓고 객관화하세요.',
        '개선 시도에도 변화가 없다면, 팀 이동 요청이나 이직 준비를 시작하세요.',
      ],
      reflect:
        '관계 스트레스는 혼자 해결되지 않습니다. 물리적 거리가 답일 때도 많아요.',
    },
    rewardFairness: {
      headline: '노력에 비해 제대로 보상받지 못한다고 느끼고 있어요.',
      steps: [
        '내 기여도를 수치로 정리해 보세요 (매출/지표/절감/팀 기여).',
        '시장 급여 밴드(잡플래닛/블라인드/링크드인)를 조사해 기준선을 세우세요.',
        '다음 평가/리뷰 때 "무엇이 바뀌어야 내가 남을지" 구체적으로 말해보세요.',
      ],
      reflect:
        '공정성은 협상으로 확보됩니다. 말하지 않으면 바뀌지 않아요.',
    },
    orgCulture: {
      headline: '조직의 방식 자체에 의문이 쌓이고 있어요.',
      steps: [
        '내가 느끼는 불합리를 3가지로 정리해 보세요.',
        '그중 내가 바꿀 수 있는 것 / 없는 것을 구분해 보세요.',
        '바꿀 수 없는 것이 핵심 가치관과 충돌한다면, 퇴사 검토가 타당합니다.',
      ],
      reflect:
        '조직 문화는 개인이 바꾸기 가장 어려운 영역입니다. "맞지 않음"을 인정하는 것도 용기예요.',
    },
    jobInsecurity: {
      headline: '이 자리의 미래가 불안하게 느껴지고 있어요.',
      steps: [
        '3개월 비상금(생활비)을 확보하세요. 선택지가 생기면 불안은 반으로 줄어요.',
        '이력서와 포트폴리오를 최신 상태로 업데이트하세요.',
        '헤드헌터 1명, 이직 성공한 지인 1명과 가볍게 대화해 "시장에서의 나"를 점검하세요.',
      ],
      reflect:
        '"지금 퇴사"가 아니라 "언제든 퇴사할 수 있는 상태"가 최고의 안전망입니다.',
    },
    healthBurnout: {
      headline: '몸과 마음이 보내는 신호가 심각합니다.',
      steps: [
        '이번 주 내로 쉬는 날을 반드시 확보하세요 (병가/연차 포함).',
        '수면/운동/식사 중 무너진 것 하나부터 회복 루틴을 잡으세요.',
        '2주 이상 증상이 이어진다면 정신건강의학과 상담을 고려하세요 (1577-0199 정신건강상담).',
      ],
      reflect:
        '건강이 무너지면 어떤 선택도 할 수 없습니다. 회복이 가장 먼저입니다.',
    },
  }

  const pack = ADVICE_BY_CATEGORY[cat]

  // 레벨이 매우 낮으면 (level 1-2) 경고보다 유지 조언으로 바꿔 소프트 톤
  if (level <= 2) {
    return {
      headline: '지금 상태는 괜찮지만, 한 가지 기억해 두세요.',
      steps: [
        `가장 주의할 영역은 "${worst.label}"입니다. 점수가 ${worst.score}점이에요.`,
        pack.steps[0],
        '번아웃은 점수가 낮을 때 예방하는 게 가장 쉽습니다.',
      ],
      reflect: pack.reflect,
    }
  }

  return pack
}

export function calculateResult(
  questions: Question[],
  answers: Answers,
): QuizResult {
  const totalScore = calculateTotalScore(questions, answers)
  const verdict = getVerdict(totalScore)
  const categoryScores = calculateCategoryScores(questions, answers)
  const consistency = calculateConsistency(answers)
  const advice = getAdvice(verdict, categoryScores)
  return { totalScore, verdict, categoryScores, consistency, advice }
}
