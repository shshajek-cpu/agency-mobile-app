<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-25 | Updated: 2026-03-25 -->

# src

## Purpose
애플리케이션 소스 코드. React 컴포넌트, 스타일, 에셋을 포함.

## Key Files

| File | Description |
|------|-------------|
| `App.tsx` | 메인 컴포넌트 (936줄) — 서비스 목록, 포트폴리오, 문의 폼 |
| `App.css` | 전체 스타일링 (1,445줄) — 순수 CSS |
| `main.tsx` | React 엔트리포인트 (StrictMode 래핑) |
| `index.css` | 글로벌 리셋, CSS 변수 정의 |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `assets/` | 정적 에셋 — 히어로 이미지, SVG 로고 |

## For AI Agents

### Working In This Directory
- `App.tsx`가 모든 UI 로직을 담고 있음 — 수정 시 영향 범위 큼
- 컴포넌트 분리 시 이 디렉토리에 새 `.tsx` 파일 추가
- CSS는 모듈화되지 않음 — 클래스명 충돌 주의
- TypeScript strict mode 적용됨

### Common Patterns
- 상수 배열: 파일 상단 `const UPPER_CASE = [...]`
- interface 정의: 컴포넌트 바로 위
- 한국어 텍스트 하드코딩

<!-- MANUAL: -->
