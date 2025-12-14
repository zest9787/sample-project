# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```


<div style="text-align: center">

# 🧑‍💼 Sample Project Management (React + Vite + TS)

Sample 프론트엔드 프로젝트  
**FSD(Feature-Sliced Design)** 구조와 **Storybook** 기반 컴포넌트 문서화를 사용합니다.

![Vite](https://img.shields.io/badge/Vite-⚡-informational)
![React](https://img.shields.io/badge/React-⚛︎-informational)
![TypeScript](https://img.shields.io/badge/TypeScript-TS-informational)
![Storybook](https://img.shields.io/badge/Storybook-UI-informational)
</div>

---

## 🚀 Getting Started

### Requirements

- Node.js: **22.0**을 맞추세요. (권장: LTS)
- Package manager: `pnpm` (예시)

> Storybook을 쓴다면 Storybook 메이저 버전에 맞는 Node 버전을 사용하는 게 중요합니다.

---

### Create Project (React + Vite + TypeScript)

```bash
npm create vite@latest sample-project -- --template react-ts
cd sample-project
npm install
npm run dev
```

## ✨ Highlights

- **React + Vite + TypeScript** 빠른 개발 환경
- **FSD** 기반 아키텍처로 기능 단위 확장/유지보수 용이
- **Storybook**으로 공통 UI/feature 문서화 및 QA
- **의존성 주입** 패턴으로 테스트/스토리 시나리오 구성 쉬움  
  (예: `searchEmployees`를 mock으로 주입)

---


## 🏃 npm scripts

### Build and dev scripts

- `dev` – start dev server
- `build` – bundle application for production

### Other scripts

- `storybook` – starts storybook dev server
- `storybook:build` – build production storybook bundle to `storybook-static`
- `prettier:write` – formats all files with Prettier


---

## 🧱 Tech Stack

- React
- Vite
- TypeScript
- Storybook (React + Vite)

> 패키지 매니저: `pnpm`

---

## 🗂️ Project Structure (FSD)

```txt
src/
  app/               # 앱 초기화, 전역 스타일, 라우팅/프로바이더
  shared/            # 범용 UI, 유틸, 공용 훅
  entities/          # 도메인 모델(사원 등) + 표현(UI)
  features/          # 유스케이스(검색/선택/등록 등)
  widgets/           # 여러 feature/entities를 조합한 블록
  pages/             # 라우트 단위 페이지
```

---

## 🧱 Tech Stack
![react](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![axios](https://img.shields.io/badge/axios.js-854195?style=for-the-badge&logo=axios&logoColor=5A29E4)
![ant.design](https://img.shields.io/badge/-Ant%20Design-333333?style=for-the-badge&logo=ant-design&logoColor=0170FE)
![@tanstack/react-query](https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white)
![zustand](https://img.shields.io/badge/zustand-602c3c?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAA8FBMVEVHcExXQzpKQDlFV16lpqyGh4tPPTdWT0weHRU7LRZGQzmxYjlaTkZsbmywVyxtXDSFhISXm6WWpcaytb6bm56gprY0LiiXmp2prLamsMa0XS42MSxkTUVDSkuyYzGihXdDV2GprbmedVxaRD1kTUWUdGFGOCN4a2OfpbI0SFFAMSddTkbCc0dWQiGFRypXQyJUQCBcTTWviDVXQyJcUDjlqCWxjkG+hBTiohtURD6lr8lORTtDVVZmPyxwSipaRSJDOzaWpsyYqMyYqM2dq8tPOjBERTs6QUKTcCeKaCJvViZdSDK4iSngoiDvqx7KkRuGEi1hAAAAOXRSTlMApZ78cB8hCAMQO/j/FOH4KlT1wFfJTjaY6SxtVexFn3Tn2sN6d671mVuJ+/PPN9CT6TfpS4C9jJaVLRihAAAAi0lEQVQIHXXBxRKCUAAF0Es/QMDubsVuGrv1///GBQ4bx3PwgwC8gFCRohs8QrQV0ZtKOZ9JcgBmU8MwqFa9kjNTUWB58f2jPOjU9juTBTbPq+vIar972MZjwPr1uDvqCFw2wQpQVm/t7Oo9gAgAFtrtZNtMFQFp7nkWU5IQECfjYbuQFvBFRJHgjw9L0A80UmaGpAAAAABJRU5ErkJggg==)
![styled-components](https://img.shields.io/badge/-styled%20components-%2320232a?style=for-the-badge&logo=styled-components)
![vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white)
![typescript](https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=for-the-badge)
![storybook](https://img.shields.io/badge/Storybook-FF4785?logo=storybook&logoColor=white&style=for-the-badge)


[//]: # (![js]&#40;https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white&#41; )

[//]: # (![html]&#40;https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white&#41; )

[//]: # (![css]&#40;https://img.shields.io/badge/CSS-239120?&style=for-the-badge&logo=css3&logoColor=white&#41; )

[//]: # (![MySQL]&#40;https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white&#41; )

[//]: # (![java]&#40;https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white&#41; )

[//]: # (![c]&#40;https://img.shields.io/badge/C-00599C?style=for-the-badge&logo=c&logoColor=white&#41; )

[//]: # (![python]&#40;https://img.shields.io/badge/Python-14354C?style=for-the-badge&logo=python&logoColor=white&#41; )

[//]: # (![kotlin]&#40;https://img.shields.io/badge/Kotlin-0095D5?&style=for-the-badge&logo=kotlin&logoColor=white&#41; )

[//]: # (![spring]&#40;https://img.shields.io/badge/Spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white&#41;)

[//]: # ()
