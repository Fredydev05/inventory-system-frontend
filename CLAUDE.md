# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server at http://localhost:4200
npm run build      # Production build
npm run watch      # Dev build in watch mode
npm test           # Unit tests with Vitest
npm run serve:ssr  # Run SSR server after build
```

## Architecture

Angular 21 frontend using standalone components, signals, and lazy-loaded features. Backend API runs at `http://inventory-system-backend.test/api` (Laragon local dev).

### Directory Structure

```
src/app/
├── core/           # Singleton services, guards, interceptors, base models
├── features/       # Feature modules (auth, dashboard, products, customers, sales, purchases, inventory)
├── layouts/        # MainLayoutComponent (sidebar nav) and AuthLayoutComponent
└── shared/         # Reusable directives, pipes, utilities
```

Each feature follows the pattern: `components/`, `models/`, `services/`, `<feature>.routes.ts`.

### Routing

- All routes protected by `authGuard` except `/login`
- Features are lazy-loaded via `loadComponent` / `loadChildren`
- Root redirect: `''` → `/dashboard`

### HTTP Layer

- `jwtInterceptor`: Attaches `Authorization: Bearer {token}` to all requests
- `errorInterceptor`: On 401, clears session and redirects to `/login`
- All API responses follow `ApiResponse<T> { success, data?, message? }`
- Token stored in localStorage via `StorageService` (SSR-safe)

### UI Stack

- **ng-zorro-antd** (Ant Design): Layout, menus, forms, modals, dropdowns
- **ag-grid-angular**: Data tables in list components
- **SCSS + LESS**: Global styles in `styles.scss`; Ant Design theme overrides in `theme.less`
- Locale set to `es_ES` (Spanish)

### Key Patterns

- All components are standalone — import NzModule pieces individually
- Use Angular signals for reactive state (not RxJS BehaviorSubject where avoidable)
- Feature services are provided in root; no NgRx or external state store
- SSR enabled — always use `isPlatformBrowser` before accessing `localStorage` or browser APIs directly (use `StorageService` instead)
