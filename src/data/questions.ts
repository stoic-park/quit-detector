import type { Question } from '../types'

/**
 * 질문은 KOSS-SF(한국직무스트레스측정도구 단축형), MBI(Maslach Burnout Inventory),
 * JD-R(Job Demands-Resources) 모델을 참고해 작성되었습니다.
 * 구체적인 원문항을 재사용하지 않고, 요인 구조에 근거해 일상 언어로 재작성했습니다.
 *
 * 긍정/부정 질문을 혼합하여 응답 편향(acquiescence bias)을 줄이고,
 * 표준편차 기반 일관성 지표로 평탄화 응답을 탐지합니다.
 */
export const QUESTIONS: Question[] = [
  // ===== 직무 요구 (Job Demand) - 3문항 =====
  {
    id: 1,
    category: 'jobDemand',
    text: '정해진 시간 안에 해내야 할 업무량이 지나치게 많다.',
    positive: false,
  },
  {
    id: 2,
    category: 'jobDemand',
    text: '업무 중에 여유를 가지고 쉬거나 숨 돌릴 시간이 있다.',
    positive: true,
  },
  {
    id: 3,
    category: 'jobDemand',
    text: '일이 끝나지 않아 야근이나 주말 근무를 자주 하게 된다.',
    positive: false,
  },

  // ===== 직무 자율 (Job Control) - 3문항 =====
  {
    id: 4,
    category: 'jobControl',
    text: '내 업무에서 어떤 방식으로 일할지 내가 결정할 수 있다.',
    positive: true,
  },
  {
    id: 5,
    category: 'jobControl',
    text: '업무에서 내가 가진 기술과 역량을 충분히 활용하고 있다.',
    positive: true,
  },
  {
    id: 6,
    category: 'jobControl',
    text: '내 일에 영향을 주는 결정에 나는 거의 참여하지 못한다.',
    positive: false,
  },

  // ===== 관계 갈등 (Relation Conflict) - 3문항 =====
  {
    id: 7,
    category: 'relationConflict',
    text: '상사(팀장/리더)에게 업무 관련 도움이나 지지를 받을 수 있다.',
    positive: true,
  },
  {
    id: 8,
    category: 'relationConflict',
    text: '동료와의 관계 때문에 불편하거나 스트레스를 받는 일이 잦다.',
    positive: false,
  },
  {
    id: 9,
    category: 'relationConflict',
    text: '문제가 생겼을 때 동료들과 편하게 상의할 수 있다.',
    positive: true,
  },

  // ===== 보상 공정성 (Reward Fairness) - 3문항 =====
  {
    id: 10,
    category: 'rewardFairness',
    text: '받는 급여가 내가 한 일과 기여도에 비해 공정하다고 느낀다.',
    positive: true,
  },
  {
    id: 11,
    category: 'rewardFairness',
    text: '잘한 일에 대해 인정이나 칭찬을 거의 받지 못한다.',
    positive: false,
  },
  {
    id: 12,
    category: 'rewardFairness',
    text: '복지나 처우가 비슷한 직무의 다른 회사에 비해 부족하다.',
    positive: false,
  },

  // ===== 조직 문화 (Org Culture) - 3문항 =====
  {
    id: 13,
    category: 'orgCulture',
    text: '회사의 의사결정과 평가 과정이 합리적이고 투명하다.',
    positive: true,
  },
  {
    id: 14,
    category: 'orgCulture',
    text: '조직 내에 부당한 대우나 차별이 있다고 느낀다.',
    positive: false,
  },
  {
    id: 15,
    category: 'orgCulture',
    text: '팀/회사 안에서 의사소통이 원활하게 이루어진다.',
    positive: true,
  },

  // ===== 직무 불안정 (Job Insecurity) - 3문항 =====
  {
    id: 16,
    category: 'jobInsecurity',
    text: '내 일자리나 고용이 불안하다고 느낀다.',
    positive: false,
  },
  {
    id: 17,
    category: 'jobInsecurity',
    text: '이 회사에서 내가 성장하고 배울 수 있는 기회가 있다.',
    positive: true,
  },
  {
    id: 18,
    category: 'jobInsecurity',
    text: '이 회사에서의 1~2년 뒤 내 모습이 긍정적으로 그려진다.',
    positive: true,
  },

  // ===== 건강/소진 (Health & Burnout) - 3문항 =====
  {
    id: 19,
    category: 'healthBurnout',
    text: '출근을 생각하면 가슴이 답답하거나 두려워진다.',
    positive: false,
  },
  {
    id: 20,
    category: 'healthBurnout',
    text: '일 때문에 잠을 잘 못 자거나 몸이 자주 아프다.',
    positive: false,
  },
  {
    id: 21,
    category: 'healthBurnout',
    text: '일을 마친 후 충분히 회복되어 개인 시간을 즐길 수 있다.',
    positive: true,
  },
]
