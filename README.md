# 직장인 퇴사 판독기

21문항 심리검사로 나의 퇴사 유형을 진단하는 웹 서비스입니다.

**[quit-detector.vercel.app](https://quit-detector.vercel.app)**

## 어떤 서비스인가요?

KOSS-SF(한국직무스트레스측정도구)와 MBI(Maslach Burnout Inventory), JD-R 모델을 참고하여 설계한 21문항 퀴즈입니다. 7개 카테고리(직무요구, 직무자율, 관계갈등, 보상공정성, 조직문화, 직무불안정, 건강/소진)를 측정하고, 3축 분석을 통해 8가지 직장인 유형 중 하나로 분류합니다.

> 이 테스트는 재미를 위한 심리검사이며, 의학적 진단이나 처방을 대체하지 않습니다.

## 8가지 유형

3개의 축(O: 과부하, E: 환경불만, I: 불안/통제)의 조합으로 결과가 결정됩니다.

| 코드 | 유형 | 캐릭터 |
|------|------|--------|
| oei | 안정형 | 묵묵한 소 |
| oeI | 불안통제형 | 두리번 미어캣 |
| oEi | 조직회의형 | 눈치왕 미어캣 |
| Oei | 소진형 | 겉웃음 쿼카 |
| oEI | 환경불안형 | 웃프 쿼카 |
| OeI | 과로불안형 | 지친 고슴도치 |
| OEi | 이중고형 | 가시 세운 고슴도치 |
| OEI | 완전연소형 | 탈출한 철새 |

## 기술 스택

- **Frontend**: React 19 + TypeScript + Vite 8
- **Styling**: CSS Modules
- **Testing**: Vitest + Testing Library
- **Deploy**: Vercel
- **Share**: html2canvas (lazy loaded)

## 로컬 개발

```bash
pnpm install
pnpm dev
```

## 빌드

```bash
pnpm build
pnpm preview
```

## 테스트

```bash
pnpm test
```

## 프로젝트 구조

```
src/
  components/
    Welcome/        # 시작 화면
    Question/       # 질문 화면
    ProgressBar/    # 진행 바
    Result/         # 결과 화면
    Methodology/    # 방법론 안내
    PixelAnimal/    # 픽셀아트 동물 캐릭터 (animated SVG)
    ErrorBoundary   # 에러 처리
  data/
    questions.ts    # 21문항 데이터
  hooks/
    useQuiz.ts      # 퀴즈 상태 관리
  types/
    index.ts        # 타입 정의
  utils/
    scoring.ts      # 3축 분류 + 점수 계산
    shareImage.ts   # 결과 이미지 캡처/공유
```

## 라이선스

MIT
