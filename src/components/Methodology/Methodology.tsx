import styles from './Methodology.module.css'

interface MethodologyProps {
  onBack: () => void
}

export function Methodology({ onBack }: MethodologyProps) {
  return (
    <div className={styles.methodology}>
      <button
        type="button"
        className={styles.backBtn}
        onClick={onBack}
        aria-label="뒤로 가기"
      >
        ← 뒤로
      </button>

      <h1 className={styles.title}>이 테스트는 어떻게 만들어졌나요?</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>📚 이론적 배경</h2>
        <p className={styles.p}>
          이 진단은 직업 심리학의 대표적인 연구들을 참고해 일상 언어로 재구성한
          자기 보고식 체크리스트입니다.
        </p>
        <ul className={styles.refList}>
          <li>
            <strong>KOSS-SF</strong> — 한국직무스트레스측정도구 단축형 (장세진
            등, 2005). 직무 요구, 직무 자율, 관계 갈등, 직무 불안정, 조직
            체계, 보상 부적절, 직장 문화의 7개 요인을 측정합니다.
          </li>
          <li>
            <strong>Maslach Burnout Inventory (MBI)</strong> — Maslach, C., &
            Jackson, S. E. (1981). 감정 소진, 냉소적 태도, 개인적 성취감 저하
            세 축으로 번아웃을 정의합니다.
          </li>
          <li>
            <strong>Job Demands-Resources Model (JD-R)</strong> — Bakker, A.
            B., & Demerouti, E. (2007). 직무 요구와 직무 자원의 균형이 건강과
            몰입을 결정한다는 모형입니다.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>🧮 점수는 어떻게 계산되나요?</h2>
        <ol className={styles.steps}>
          <li>각 응답(1~5점)을 0~100 척도의 "퇴사 점수"로 변환합니다.</li>
          <li>
            <strong>긍정 문항</strong>은 역채점됩니다. (그렇다 = 좋은 상태 =
            낮은 점수)
          </li>
          <li>
            카테고리별로 평균을 내고, 전체 평균이 종합 점수(0~100)가 됩니다.
          </li>
          <li>
            점수대에 따라 5단계 판정(천직 ~ 당장 탈출)과 가장 나쁜
            카테고리에 맞춘 조언이 제공됩니다.
          </li>
          <li>
            응답의 표준편차로 <strong>일관성 수준</strong>을 계산합니다. 모든
            답이 동일하면 무성의 응답으로 간주합니다.
          </li>
        </ol>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>⚠️ 한계와 주의사항</h2>
        <ul className={styles.warnList}>
          <li>
            이 진단은 <strong>의학적/심리학적 진단이 아닙니다</strong>. 재미와
            자기 성찰을 위한 도구입니다.
          </li>
          <li>
            자기 보고식(self-report)이므로 그날의 기분과 상황에 따라 결과가
            달라질 수 있습니다.
          </li>
          <li>
            KOSS-SF나 MBI의 원문항을 그대로 사용하지 않았으며, 요인 구조에
            근거해 일상 언어로 재작성했습니다. 따라서 학술 용도로는 사용할 수
            없습니다.
          </li>
          <li>
            한 번의 점수로 퇴사를 결정하지 마세요. 기간을 두고 반복 측정하거나,
            신뢰할 수 있는 사람과의 대화를 통해 판단을 보완하세요.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>🆘 도움이 필요하다면</h2>
        <ul className={styles.helpList}>
          <li>
            <strong>정신건강상담</strong> 전화 1577-0199 (24시간)
          </li>
          <li>
            <strong>직장갑질119</strong> — 직장 내 괴롭힘·갑질 상담
          </li>
          <li>
            <strong>근로복지공단 EAP</strong> — 근로자 심리상담 서비스
          </li>
        </ul>
      </section>

      <button
        type="button"
        className={styles.backBtnBottom}
        onClick={onBack}
      >
        ← 테스트로 돌아가기
      </button>
    </div>
  )
}
