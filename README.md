> ## 🤔 What is this template all about?
>
> - This template can be used as a base layer for a ReactJS UI projects.
> - Make the project easy to maintain with **7 issue templates**.
> - Quick-start documentation with an extraordinary README structure.
> - Manage issues with **20 issue labels**.
> - Make _community healthier_ with all the guides like code of conduct, contributing, support, security...
> - Learn more with the [official GitHub guide on creating repositories from a template](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-repository-from-a-template).
> - To start using it, click **[Use this template](https://github.com/IQKV/standard-mantine-ui-project-layout/generate)** to create your new repository.

---

# 🔐 Auth Portal - IQ Scaffold Authentication Service

**Dedicated authentication portal for IQ Scaffold platform** - A standalone authentication gateway built with modern React architecture.

## 📜 Description

This auth portal serves as the **centralized authentication gateway** for the IQKV platform, handling all authentication flows before redirecting users to the main application.

### 🎯 Features

- ✅ **Sign Up** - New user registration with validation
- ✅ **Sign In** - User authentication with remember me
- ✅ **Forgot Password** - Password reset request flow
- ✅ **Reset Password** - Secure password reset with token
- ✅ **Multi-tenant Support** - Tenant-aware authentication via X-Tenant-ID header
- ✅ **Cookie-based Auth** - Secure HTTP-only cookie authentication
- ✅ **RFC 7807 Error Handling** - Standardized error responses with field-level validation

---

## 🛠️ Technical Stack

**React 19 + TypeScript + Vite 7 + TanStack Router + Mantine UI v8**

> Modern, type-safe authentication portal built with Feature-Sliced Design architecture and comprehensive testing.

## 🔑 Key Features

### 🚀 **Core Technologies**

- ✨ **React 19** - Latest React with concurrent features
- ⚡ **Vite 7** - Lightning-fast development with SWC compiler
- 🎯 **TypeScript 5.9** - Strict type safety with latest language features
- 📦 **PNPM 10.20** - Fast, disk space efficient package manager
- 🎨 **Mantine UI v8** - Complete component library with theming

### 🔄 **State Management & Data**

- 🔄 **TanStack Router v1** - Type-safe file-based routing with code splitting
- 🔄 **TanStack Query v5** - Server state management and caching
- 🔄 **Zustand** - Lightweight client state with Immer middleware (processes layer)
- 🔄 **Axios** - HTTP client with RFC 7807 error handling and interceptors
- ✅ **Mantine Form + Zod** - Type-safe form validation with custom resolver
- 🔗 **nuqs** - Type-safe URL search params state management

### 🌐 **Internationalization & Accessibility**

- 🌍 **Lingui v5** - Modern i18n with lazy-loaded translations and macro support
- ♿ **A11y First** - ARIA attributes, semantic HTML, and keyboard navigation

### 🧪 **Testing & Quality**

- 🧪 **Vitest 3** - Fast unit testing with coverage (v8) and UI mode
- 🧪 **Playwright 1.56** - E2E testing with auto-start dev server
- 🧪 **Testing Library** - React Testing Library for component tests
- 🧪 **MSW 2** - Mock Service Worker for API mocking in dev/test
- 🧪 **Co-located Tests** - Tests alongside source files following FSD architecture
- 🧪 **Architecture Tests** - Automated FSD compliance verification

### 🔍 **Code Quality & Development**

- 🔍 **ESLint 9** - Flat config with Mantine preset + TanStack plugins
- 💅 **Prettier 3.6** - Code formatting with packagejson plugin
- 🎨 **Stylelint 16** - CSS/SCSS linting with standard-scss config
- 🪝 **Husky** - Git hooks for pre-commit validation
- 📝 **Commitlint** - Conventional commit enforcement
- 🔪 **Knip 5** - Dead code elimination and unused dependency detection

### 🧱 **Development Tools**

- 🔧 **SWC** - Fast TypeScript/JavaScript compiler via @vitejs/plugin-react-swc
- 📦 **Bundle Visualizer** - Analyze and optimize bundle size
- 🧹 **Console Remover** - Strip console statements in production
- 🔧 **TanStack Router Plugin** - File-based routing with type generation

### 🚀 **DevOps & Automation**

- 👷 **GitHub Actions** - CI workflows for build, test, and quality checks
- 🔒 **Dependabot** - Automated dependency updates with auto-approve
- 📦 **Release-it** - Automated versioning with conventional changelog
- 🐳 **Docker Compose** - Dev container with multi-stage builds
- 📊 **SonarQube** - Code quality analysis (sonar-project.properties)

### 🏗️ **Architecture & Patterns**

- 🏗️ **Feature-Sliced Design** - Enforced layer boundaries with automated tests
- 🏗️ **Processes Layer** - Cross-feature concerns (auth, tenant management)
- 🎯 **TypeScript Strict Mode** - Maximum type safety with strict configuration
- 🔄 **Public API Pattern** - All slices export through index.ts (enforced by tests)
- 🔄 **Co-located Tests** - Tests alongside source files for maintainability

## 📚 Documentation

> [!TIP]
>
> #### Install Prerequisites:
>
> - [Node LTS version](https://nodejs.org/en/blog/release/v22.15.0/)
> - [pnpm](https://pnpm.io/installation)
> - [Git](https://git-scm.com/)
> - [Docker](https://www.docker.com/get-started/)
> - [Docker Compose](https://docs.docker.com/compose/)

### 🔺 Using This Template

#### Option 1: Use GitHub Template (Recommended)

1. Click **[Use this template](https://github.com/IQKV/standard-mantine-ui-project-layout/generate)** button
2. Create your new repository
3. Clone your new repository
4. Follow the setup steps below

#### Option 2: Clone Directly

```shell script
# Clone the repository
git clone https://github.com/IQKV/standard-mantine-ui-project-layout.git my-app

# Navigate to project directory
cd my-app

# Remove the original git history (optional)
rm -rf .git
git init
git add .
git commit -m "feat: initial commit"
```

### 🔺 Local Development Setup

```shell script
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Start local dev services in Docker (optional)
docker compose -f compose.yaml up -d

# Start development server
pnpm dev
```

The application will be available at `http://localhost:5173`

### 🎨 Template Customization

After creating your project from this template, you'll want to customize it:

#### 1. Update Project Information

- [ ] Update `package.json` name, description, and repository URLs
- [ ] Update `README.md` title and description
- [ ] Update `LICENSE` file with your information
- [ ] Update GitHub repository settings and topics

#### 2. Customize Branding

- [ ] Update the app title in `src/pages/__root.tsx`
- [ ] Modify the theme in `src/app/theme.ts` with your brand colors
- [ ] Replace favicon and other icons in `public/` directory
- [ ] Update meta tags in `index.html`

#### 3. Configure Environment

- [ ] Update `.env.example` with your API endpoints
- [ ] Configure `src/shared/lib/client.ts` with your API base URL and update values in `src/app/config`
- [ ] Set up authentication endpoints in API clients

### 📃 Available Scripts

| Command                   | Description                                     |
| ------------------------- | ----------------------------------------------- |
| `pnpm dev`                | Start development server (port 5173)            |
| `pnpm build`              | Build for production (with i18n compilation)    |
| `pnpm preview`            | Preview production build                        |
| `pnpm test`               | Run unit tests with Vitest                      |
| `pnpm test:arch`          | Run FSD architecture compliance tests           |
| `pnpm test:ui`            | Run tests with UI interface                     |
| `pnpm test:coverage`      | Run tests with coverage report (v8)             |
| `pnpm e2e`                | Run E2E tests with Playwright (Chromium)        |
| `pnpm e2e:ui`             | Run E2E tests with Playwright UI mode           |
| `pnpm e2e:headed`         | Run E2E tests in headed mode                    |
| `pnpm e2e:debug`          | Debug E2E tests with PWDEBUG                    |
| `pnpm e2e:report`         | Open last Playwright HTML report                |
| `pnpm e2e:all-browsers`   | Run E2E tests on Chromium, Firefox, and WebKit  |
| `pnpm playwright:install` | Install Playwright browsers with dependencies   |
| `pnpm lint`               | Lint code with ESLint                           |
| `pnpm lint:fix`           | Fix linting issues automatically                |
| `pnpm lint:stylelint`     | Lint CSS/SCSS files                             |
| `pnpm prettier:check`     | Check code formatting                           |
| `pnpm prettier:write`     | Format code with Prettier                       |
| `pnpm type-check`         | Check TypeScript types (no emit)                |
| `pnpm messages:extract`   | Extract i18n messages from source               |
| `pnpm messages:compile`   | Compile i18n messages for production            |
| `pnpm knip`               | Find unused files, dependencies, and exports    |
| `pnpm release`            | Automated versioning and changelog (release-it) |
| `pnpm ci`                 | Run CI checks (lint + test)                     |

### 🏗️ **Feature-Sliced Design Architecture**

This project follows **Feature-Sliced Design (FSD)** methodology with **automated architecture tests** that enforce:

- ✅ Layer structure (app, processes, pages, widgets, features, entities, shared)
- ✅ Public API exports (all slices must have index.ts)
- ✅ Required segments (features must have ui/ and model/)
- ✅ Naming conventions (kebab-case for pages and shared UI)

**Run architecture tests:** `pnpm test:arch`

```
src/
├── app/          # Application layer (providers, routing, config)
├── processes/    # Process layer (auth, tenant - cross-feature concerns)
├── pages/        # Page layer (route components)
├── widgets/      # Widget layer (auth-layout, tenant-info, theme-toggle)
├── features/     # Feature layer (signin-form, signup-form, forgot/reset password)
├── entities/     # Entity layer (form entity)
├── shared/       # Shared layer (ui, lib, api, types, locales, mocks)
└── architecture.test.ts  # Automated FSD compliance tests
```

### Environment Variables

| Variable                          | Description                                   | Default                       | Required |
| --------------------------------- | --------------------------------------------- | ----------------------------- | -------- |
| `VITE_API_URL_SERVER`             | Backend API base URL (user service)           | `http://localhost:8080`       | Yes      |
| `VITE_AUTH_DOMAIN_AUTH`           | Auth portal domain                            | `https://auth.iqscaffold.com` | Yes      |
| `VITE_AUTH_DOMAIN_APP`            | Main application domain                       | `https://app.iqscaffold.com`  | Yes      |
| `VITE_AUTH_REDIRECT_AFTER_LOGIN`  | Redirect URL after successful login           | `VITE_AUTH_DOMAIN_APP`        | No       |
| `VITE_AUTH_REDIRECT_AFTER_LOGOUT` | Redirect URL after logout                     | `{AUTH_DOMAIN}/login`         | No       |
| `VITE_AUTH_REDIRECT_AFTER_SIGNUP` | Redirect URL after signup                     | `{AUTH_DOMAIN}/login`         | No       |
| `VITE_ENABLE_MSW`                 | Enable Mock Service Worker for API mocking    | `true`                        | No       |
| `VITE_LOG_LEVEL`                  | Console logging verbosity (silent/info/debug) | `info`                        | No       |
| `TZ`                              | Defines timezone                              | `UTC`                         | No       |
| `NODE_ENV`                        | Defines nodejs environment                    | `development`                 | No       |

#### API Integration

The auth portal connects to backend services via `VITE_API_URL_SERVER` with:

- **Cookie-based Authentication** - HTTP-only cookies with `withCredentials: true`
- **Multi-tenant Support** - Automatic `X-Tenant-ID` header injection
- **RFC 7807 Error Handling** - Standardized Problem Details format
- **Field-level Validation** - Backend validation errors mapped to form fields
- **Global Error Notifications** - Automatic error notifications for server errors

**Expected Backend Endpoints:**

- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User authentication
- `POST /api/v1/auth/password/forgot` - Password reset request
- `POST /api/v1/auth/password/reset` - Password reset with token

**Error Response Format (RFC 7807):**

```json
{
  "type": "validation-error",
  "title": "Validation Failed",
  "status": 400,
  "detail": "One or more fields are invalid",
  "fields": [
    {
      "field": "email",
      "message": "Email is already registered",
      "rejectedValue": "user@example.com"
    }
  ],
  "correlationId": "abc-123",
  "requestId": "req-456"
}
```

---

## 🧪 Testing Strategy

### Unit Tests (Vitest 3)

Unit tests are **co-located with source files** following FSD architecture:

```
src/
├── features/
│   └── signin-form/
│       ├── ui/
│       │   ├── signin-form-feature.tsx
│       │   └── signin-form-feature.test.tsx  ← Co-located test
│       └── model/
│           ├── validation.ts
│           └── validation.test.ts  ← Co-located test
├── shared/
│   └── ui/
│       └── form-field/
│           ├── form-field.tsx
│           └── form-field.test.tsx  ← Co-located test
```

**Test Configuration:**

- **Test Runner:** Vitest 3 with happy-dom environment
- **Testing Library:** @testing-library/react v16 + user-event v14
- **Coverage:** v8 provider with HTML/text reporters
- **Setup:** `src/setupTests.ts` with Mantine mocks

**Running Tests:**

```bash
pnpm test              # Run all unit tests
pnpm test:arch         # Run FSD architecture tests
pnpm test:ui           # Run with Vitest UI
pnpm test:coverage     # Generate coverage report
```

### E2E Testing (Playwright 1.56)

**Configuration:**

- **Auto-start Dev Server:** Configured in `playwright.config.ts`
- **Browsers:** Chromium (default), Firefox, WebKit (CI or ALL_BROWSERS=true)
- **Parallel Execution:** Enabled locally, sequential in CI
- **Retries:** 1 retry locally, 2 in CI
- **Artifacts:** Screenshots, videos, traces on failure

**Running E2E Tests:**

```bash
pnpm playwright:install  # First time: install browsers
pnpm e2e                 # Run tests (Chromium only)
pnpm e2e:ui              # Interactive UI mode
pnpm e2e:headed          # Watch tests run
pnpm e2e:debug           # Debug with Playwright Inspector
pnpm e2e:report          # View HTML report
pnpm e2e:all-browsers    # Test on all browsers
```

**Test Organization:**

```
e2e/
├── setup/
│   └── global-setup.ts
├── auth/
│   ├── login.spec.ts
│   ├── signup.spec.ts
│   └── password-reset.spec.ts
└── smoke/
    └── homepage.spec.ts
```

### Architecture Tests

**Automated FSD compliance verification:**

```bash
pnpm test:arch
```

**What's Tested:**

- ✅ All FSD layers exist (app, processes, pages, widgets, features, entities, shared)
- ✅ All slices have public API (index.ts)
- ✅ Features have required segments (ui/, model/)
- ✅ Widgets have ui/ or component file
- ✅ Shared segments have index.ts
- ✅ Naming conventions (kebab-case for pages and shared UI)

## 📆 Changelog

Conventional changelog located [here](CHANGELOG.md).

## 🙏 Community & Contributions

Please follow [Contributing](.github/CONTRIBUTING.md) page.

## 📙 Code of Conduct

Please follow [Code of Conduct](.github/CODE_OF_CONDUCT.md) page.

<a name="license"></a>

## 📑 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
