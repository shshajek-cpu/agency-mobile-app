<!-- Generated: 2026-03-25 | Updated: 2026-03-25 -->

# agency-mobile-app

## Purpose
한국어 디지털 에이전시 웹사이트. 마케팅, 웹 개발, 자동화, 디자인 4가지 서비스를 소개하고 고객 문의를 받는 싱글페이지 애플리케이션.

## Tech Stack
- **Framework:** React 19.2.4 + TypeScript 5.9.3
- **Build:** Vite 8.0.1 (dev server port 3000)
- **Styling:** Pure CSS (프레임워크 없음)
- **Font:** Pretendard (CDN, 한국어 웹폰트)
- **Image Gen:** Gemini API + Sharp (마스코트/아이콘 생성 스크립트)
- **Linting:** ESLint 9 + TypeScript ESLint

## Key Files

| File | Description |
|------|-------------|
| `src/App.tsx` | 메인 컴포넌트 (936줄) — 서비스 목록, 포트폴리오, 문의 폼 전부 포함 |
| `src/App.css` | 전체 스타일링 (1,445줄) |
| `src/main.tsx` | React 엔트리포인트 (StrictMode) |
| `src/index.css` | 글로벌 리셋, :root 변수 |
| `index.html` | HTML 엔트리, Pretendard CDN 로드 |
| `vite.config.ts` | Vite 설정 (React 플러그인, port 3000, host: true) |
| `models.json` | Gemini API 모델 정의 (이미지 생성용) |

## Project Structure

```
/
├── src/
│   ├── App.tsx          ← 메인 (서비스, 폼, 포트폴리오 전부 여기)
│   ├── App.css          ← 모든 스타일
│   ├── main.tsx         ← 엔트리
│   ├── index.css        ← 글로벌
│   └── assets/          ← hero.png, react.svg, vite.svg
├── public/
│   ├── mascot-*.png     ← 마스코트 캐릭터 이미지 9종
│   ├── icon-*.png       ← 서비스 카테고리 아이콘 4종
│   ├── icons.svg        ← SVG 아이콘 스프라이트
│   └── favicon.svg
├── gen-*.mjs            ← Gemini API 이미지 생성 스크립트 7개
└── 설정 파일들           ← tsconfig, eslint, vite, package.json
```

## App Architecture

`App.tsx` 하나에 모든 로직이 들어있는 싱글 컴포넌트 구조:

- **서비스 데이터:** `SERVICES_DATA` 배열 (8개 서비스 항목)
- **카테고리:** 마케팅, 웹 개발, 자동화, 디자인
- **폼 데이터:** `FormData` interface (예산, 일정, 연락처 등)
- **상수:** `SERVICE_OPTIONS`, `BUDGET_OPTIONS`, `TIMELINE_OPTIONS`, `CONTACT_OPTIONS`
- **UI 섹션:** 히어로 → 서비스 목록 → 상세 → 포트폴리오 → 리뷰 → 문의 폼

## For AI Agents

### Working In This Directory
- 모든 UI 코드가 `src/App.tsx`에 집중됨 — 컴포넌트 분리가 필요할 수 있음
- CSS는 `src/App.css`에 전부 있음 — CSS Modules나 styled-components 아님
- 한국어 텍스트가 하드코딩됨 — i18n 미적용
- 이미지는 `public/`에서 직접 참조 (import 아님)

### Scripts
- `npm run dev` — 개발 서버 (port 3000)
- `npm run build` — TypeScript 체크 + Vite 빌드
- `npm run lint` — ESLint 실행

### Image Generation
`gen-*.mjs` 스크립트들은 Gemini API로 마스코트/아이콘을 생성:
- `generate-images.mjs` — 마스터 오케스트레이터
- `gen-mascot.mjs` — 마스코트 캐릭터 생성
- `gen-3d-icons.mjs` — 3D 아이콘 생성
- `gen-single.mjs` — 단일 이미지 생성
- `gen-suit.mjs` — 아이콘 세트 생성
- `gen-test.mjs` — 생성 파이프라인 테스트
- `remove-bg.mjs` — 배경 제거 (Sharp 사용)

### Common Patterns
- TypeScript strict mode 사용
- 상수는 파일 상단에 대문자 배열로 정의
- Props interface는 컴포넌트 위에 정의
- ESM 모듈 시스템 (`"type": "module"`)

### Known Limitations
- App.tsx가 936줄로 비대 — 컴포넌트 분리 권장
- 라우터 없음 (SPA 싱글 페이지)
- 상태 관리 라이브러리 없음 (useState만 사용)
- 테스트 없음

## Dependencies

### External
- `react` / `react-dom` 19.2.4 — UI 프레임워크
- `vite` 8.0.1 — 번들러/데브 서버
- `typescript` 5.9.3 — 타입 시스템
- `sharp` 0.34.5 — 이미지 처리 (생성 스크립트용)

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
