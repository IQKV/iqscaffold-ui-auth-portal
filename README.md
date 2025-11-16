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

# 🔐 Auth Portal - IQKV Authentication Service

## 📜 Description

**Dedicated authentication portal for IQKV platform** - Handles user sign up, sign in, and password reset functionality.

> This is a standalone authentication service that redirects to the main application (APP_DOMAIN) upon successful login. It does not contain any application-specific features or protected pages.

### 🎯 Purpose

This auth portal serves as the **centralized authentication gateway** for the IQKV platform:

- ✅ **Sign Up** - New user registration
- ✅ **Sign In** - User authentication
- ✅ **Forgot Password** - Password reset request
- ✅ **Reset Password** - Password reset with token
- ✅ **External Redirect** - Always redirects to APP_DOMAIN root on successful login

### 🚫 What This Portal Does NOT Include

- ❌ Dashboard or internal pages
- ❌ User profile management
- ❌ Email verification pages
- ❌ Security settings
- ❌ Application-specific features

All post-authentication features are handled by the main application at APP_DOMAIN.

---

## 🛠️ Technical Stack

React + TypeScript + Vite + TanStack Router + Mantine UI Template

> A modern, feature-rich template for building scalable React applications with the latest tools and best practices.

## 🔑 Key Features

### 🚀 **Core Technologies**

- ✨ **React 19** - Latest React with concurrent features and improved performance
- ⚡ **Vite 7** - Lightning-fast development with instant HMR and optimized builds
- 🎯 **TypeScript** - Type-safe development with latest language features
- 📦 **PNPM** - Fast, disk space efficient package manager with workspaces support

### 🔄 **State Management & Data**

- 🔄 **TanStack Router** - Type-safe routing with code splitting and search params
- 🔄 **TanStack Query** - Powerful data synchronization and caching
- 🔄 **Axios** - Promise-based HTTP client for API calls
- ✅ **React Hook Form + Zod** - Type-safe form validation and management
- 🍪 **JS Cookie** - Simple cookie management
- 🔗 **nuqs** - Type-safe URL search params state management

### 🌐 **Internationalization & Accessibility**

- 🌍 **Lingui** - Modern i18n framework with macro support and pluralization
- ♿ **A11y Support** - Built-in accessibility features and Storybook a11y addon

### 🧪 **Testing & Quality**

- 🧪 **Vitest** - Fast unit testing with coverage reports and UI
- 🧪 **Playwright** - Reliable end-to-end testing with UI mode
- 🧪 **Mock Service Worker** - Client-agnostic API mocking for development and testing
- 🧪 **Testing Library** - Simple and complete testing utilities for React

### 🔍 **Code Quality & Development**

- 🔍 **ESLint 9** - Modern linting with flat config and React/TypeScript rules
- 💅 **Prettier** - Opinionated code formatting with package.json plugin
- 🎨 **Stylelint** - CSS/SCSS linting for consistent styling
- 🪝 **Husky** - Git hooks for pre-commit validation
- 📝 **Commitlint** - Conventional commit message validation
- 🔪 **Knip** - Dead code elimination and dependency analysis

### 🧱 **Development Tools**

- 🔧 **SWC** - Fast TypeScript/JavaScript compiler for React
- 📦 **Bundle Analyzer** - Visualize and optimize bundle size
- 🧹 **Console Remover** - Remove console statements in production builds

### 🚀 **DevOps & Automation**

- 👷 **GitHub Actions** - CI/CD workflows for testing, building, and deployment
- 🔒 **Dependabot** - Automated dependency updates and security monitoring
- 📦 **Release-it** - Automated versioning and changelog generation
- 🐳 **Docker Compose** - Local development environment setup
- 📊 **SonarQube** - Code quality and security analysis

### 🏗️ **Architecture & Patterns**

- 🏗️ **Feature-Sliced Design** - Scalable frontend architecture methodology
- 🎯 **TypeScript Strict Mode** - Enhanced type safety with strict configuration
- 🔄 **Hot Module Replacement** - Instant updates during development

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
git commit -m "Initial commit from template"
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

| Command                   | Description                                |
| ------------------------- | ------------------------------------------ |
| `pnpm dev`                | Start development server                   |
| `pnpm build`              | Build for production                       |
| `pnpm preview`            | Preview production build                   |
| `pnpm test`               | Run unit tests with Vitest                 |
| `pnpm test:ui`            | Run tests with UI interface                |
| `pnpm test:coverage`      | Run tests with coverage report             |
| `pnpm e2e`                | Run end-to-end tests with Playwright       |
| `pnpm e2e:ui`             | Run e2e tests with UI interface            |
| `pnpm e2e:headed`         | Run e2e tests in headed mode               |
| `pnpm e2e:report`         | Open last Playwright HTML report           |
| `pnpm e2e:update`         | Update Playwright snapshots                |
| `pnpm e2e:debug`          | Debug e2e tests (PWDEBUG)                  |
| `pnpm playwright:install` | Install Playwright browsers                |
| `pnpm storybook`          | Start Storybook development server         |
| `pnpm storybook:build`    | Build Storybook for production             |
| `pnpm lint`               | Lint code with ESLint                      |
| `pnpm lint:fix`           | Fix linting issues automatically           |
| `pnpm lint:stylelint`     | Lint CSS/SCSS files                        |
| `pnpm prettier:check`     | Check code formatting                      |
| `pnpm prettier:write`     | Format code with Prettier                  |
| `pnpm type-check`         | Check TypeScript types                     |
| `pnpm messages:extract`   | Extract i18n messages                      |
| `pnpm messages:compile`   | Compile i18n messages                      |
| `pnpm release`            | Automate versioning and package publishing |

### 🏗️ **Feature-Sliced Design Architecture**

This project follows **Feature-Sliced Design (FSD)** methodology for scalable frontend architecture.

### Environment Variables

| Variable                          | Description                                   | Default                 | Required |
| --------------------------------- | --------------------------------------------- | ----------------------- | -------- |
| `VITE_API_URL_SERVER`             | Backend API base URL (user service)           | `http://localhost:8080` | Yes      |
| `VITE_AUTH_DOMAIN_AUTH`           | Auth portal domain                            | `https://auth.iqkv.com` | Yes      |
| `VITE_AUTH_DOMAIN_APP`            | Main application domain                       | `https://app.iqkv.com`  | Yes      |
| `VITE_AUTH_REDIRECT_AFTER_LOGIN`  | Redirect URL after successful login           | `VITE_AUTH_DOMAIN_APP`  | No       |
| `VITE_AUTH_REDIRECT_AFTER_LOGOUT` | Redirect URL after logout                     | `{AUTH_DOMAIN}/login`   | No       |
| `VITE_AUTH_REDIRECT_AFTER_SIGNUP` | Redirect URL after signup                     | `{AUTH_DOMAIN}/login`   | No       |
| `VITE_ENABLE_MSW`                 | Enable Mock Service Worker for API mocking    | `true`                  | No       |
| `VITE_LOG_LEVEL`                  | Console logging verbosity (silent/info/debug) | `info`                  | No       |
| `TZ`                              | Defines timezone                              | `UTC`                   | No       |
| `NODE_ENV`                        | Defines nodejs environment                    | `development`           | No       |

#### API Endpoints

The auth portal connects to the following backend endpoints (configured via `VITE_API_URL_SERVER`):

**Public Endpoints:**

- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/login` - Authenticate user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/validate` - Validate JWT token
- `GET /api/v1/auth/email/verify` - Verify email address
- `POST /api/v1/auth/email/resend` - Resend verification email
- `POST /api/v1/auth/password/forgot` - Initiate password reset
- `POST /api/v1/auth/password/reset` - Reset password

**Protected Endpoints:**

- `PATCH /api/v1/me/password` - Change password (requires authentication)
- `POST /api/v1/auth/logout` - Logout current session
- `POST /api/v1/auth/logout-all` - Logout all sessions

---

## 🧪 E2E Testing (Playwright)

- Install browsers (first time): `pnpm playwright:install`
- Run tests: `pnpm e2e`
- UI mode: `pnpm e2e:ui`
- Headed: `pnpm e2e:headed`
- Report: `pnpm e2e:report`

The dev server is auto-started by Playwright via `webServer` in `playwright.config.ts`.
CI runs Playwright on PRs/pushes via `.github/workflows/e2e-playwright.yml`.

## 📆 Changelog

Conventional changelog located [here](CHANGELOG.md).

## 🙏 Community & Contributions

Please follow [Contributing](.github/CONTRIBUTING.md) page.

## 📙 Code of Conduct

Please follow [Code of Conduct](.github/CODE_OF_CONDUCT.md) page.

<a name="license"></a>

## 📑 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
