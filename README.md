# PyCon Korea Frontend (2025 - )

2025년 이후부터 PyCon Korea 사이트들의 모노레포입니다.

## 구성

- `apps/pyconkr-2025` — 2025 행사 사이트
- `apps/pyconkr-2026` — 2026 행사 사이트
- `apps/pyconkr-admin` — 관리자 페이지
- `apps/pyconkr-participant-portal` — 참가자 포털
- `packages/common`, `packages/shop` — 앱들이 공유하는 코드
- `dotenv/` — 모든 앱이 공유하는 환경변수 파일

## 요구 사항

- Node.js 22+
- pnpm (`package.json`의 `packageManager` 필드 버전. `corepack enable`로 자동 설치 가능)
- 첫 실행 시 mkcert가 로컬 CA를 시스템 신뢰 저장소에 자동 설치합니다 (관리자 비밀번호 요구될 수 있음)

## 설치

```bash
pnpm install
```

## 환경변수

기본값은 `dotenv/.env.development`(원격 dev 백엔드)와 `dotenv/.env.production`에 들어 있고, 그대로 둬도 dev는 동작합니다.

| 키 | 설명 |
|---|---|
| `VITE_PYCONKR_BACKEND_API_DOMAIN` | 백엔드 API 도메인. dev 서버에서는 vite proxy(`/v1`, `/api`)의 target으로 쓰이고, prod 빌드에서는 브라우저가 직접 호출합니다. |
| `VITE_PYCONKR_BACKEND_CSRF_COOKIE_NAME` | 백엔드 CSRF 토큰 쿠키 이름. 환경(prod / dev / local)별로 prefix가 달라서 분리되어 있습니다. |
| `VITE_PYCONKR_FRONTEND_DOMAIN` | 프론트엔드의 외부 도메인. 관리자 페이지의 외부 링크 생성 등에 사용됩니다. |
| `VITE_PYCONKR_SHOP_IMP_ACCOUNT_ID` | PortOne(아임포트) 가맹점 식별자. 결제 모듈 초기화에 사용됩니다. |

로컬에서 값을 덮어쓰고 싶다면 **`dotenv/.env.development.local`**(gitignored)을 만들어 사용하세요. 예: 로컬에서 직접 띄운 백엔드를 쓰고 싶을 때 —

```bash
VITE_PYCONKR_BACKEND_API_DOMAIN=http://localhost:8000
VITE_PYCONKR_BACKEND_CSRF_COOKIE_NAME=LOCAL_PYCONKR_BACKEND_csrftoken
```

## 개발 서버 실행

각 앱은 `https://localhost:<port>`로 뜹니다. 포트는 vite가 비어 있는 것을 자동 선택 (보통 5173부터).

```bash
pnpm dev:@apps/pyconkr-2025
pnpm dev:@apps/pyconkr-2026
pnpm dev:@apps/pyconkr-admin
pnpm dev:@apps/pyconkr-participant-portal
```

백엔드 호출은 vite proxy(`/v1`, `/api`)로 forward되므로 별도 `/etc/hosts` 설정은 필요 없습니다. CORS와 쿠키(`Secure`, `Domain` 속성)도 proxy 단에서 자동으로 처리합니다.

## 빌드 / 프리뷰

```bash
pnpm build:@apps/pyconkr-2025
pnpm preview:@apps/pyconkr-2025
```

다른 앱도 동일한 패턴 (`build:@apps/<app>`, `preview:@apps/<app>`).

## 린트 / 포맷

```bash
pnpm lint
pnpm format         # 자동 수정
pnpm format:check   # 검사만
```

## 자주 마주치는 이슈

- **TS 에러가 IDE에 떠 있는데 빌드/dev는 잘 됨**: 패키지 버전 변경 후 `node_modules/.pnpm/`에 orphan이 남아 IDE TS 서비스가 헷갈리는 경우입니다. `rm -rf node_modules && pnpm install` 후 VS Code의 TypeScript 서버를 재시작하세요.
- **mkcert 인증서 오류**: `mkcert -install`을 한 번 직접 실행해보세요.
