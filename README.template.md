# IQKV Authentication System 🔐

![CI](https://img.shields.io/github/actions/workflow/status/IQKV/standard-mantine-ui-project-layout/ci.yml?label=CI)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen)
![License](https://img.shields.io/github/license/IQKV/standard-mantine-ui-project-layout)

A modern, secure authentication system built with React 19, TypeScript, and Mantine UI. Features comprehensive user management, multi-tenant support, and enterprise-grade security.

<details>
  <summary><strong>Badge examples (optional)</strong></summary>

- Build: <code>![CI](https://img.shields.io/github/actions/workflow/status/ORG/REPO/ci.yml?label=CI)</code>
- Tests: <code>![Tests](https://img.shields.io/badge/tests-passing-brightgreen)</code>
- Coverage: <code>![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)</code>
- License: <code>![License](https://img.shields.io/github/license/ORG/REPO)</code>

</details>

## :beginner: About

IQKV Authentication System is a production-ready authentication and user management platform designed for modern web applications. Built with Feature-Sliced Design architecture, it provides a scalable foundation for enterprise applications requiring secure user authentication, role-based access control, and multi-tenant capabilities.

### 🎯 Key Features

- **🔐 Complete Authentication Flow**: Sign in, sign up, password reset, email verification
- **👥 User Management**: Comprehensive user profiles with roles and permissions
- **🏢 Multi-Tenant Support**: Tenant-based user isolation and management
- **🔒 Enterprise Security**: JWT tokens, secure storage, session management
- **🌍 Internationalization**: Multi-language support with Lingui
- **📱 Responsive Design**: Mobile-first approach with Mantine UI components
- **🧪 Comprehensive Testing**: Unit, integration, and E2E testing strategies
- **⚡ Performance Optimized**: Code splitting, lazy loading, and caching

### 🏗️ Architecture Highlights

- **Feature-Sliced Design (FSD)**: Scalable architecture with clear layer boundaries
- **Type-Safe Development**: Strict TypeScript configuration with Zod validation
- **Modern React Patterns**: React 19 with concurrent features and Suspense
- **State Management**: TanStack Query for server state, Zustand for client state
- **API Integration**: Axios with interceptors, error handling, and MSW mocking

## 📚 Documentation

- [API Documentation](docs/api/README.md)
- [Architecture Overview](docs/architecture/README.md)
- [Deployment Guide](docs/deployment/README.md)
- [Contributing Guidelines](.github/CONTRIBUTING.md)

---

<details>
  <summary><strong>✅ Pre-publish checklist (remove in final README)</strong></summary>

- [ ] Title updated and logo added
- [ ] Badges added (CI, tests, coverage, license)
- [ ] About/Usage/Installation/Commands completed
- [ ] Development prerequisites and environment documented
- [ ] Architecture notes reflect your stack and modules
- [ ] Links verified (Getting Started, docs, external resources)
- [ ] Guidance blocks, template-docs folder, are removed before publishing

</details>

---

## 📚 Template Usage

- [Getting Started](template-docs/getting-started.md)
- [Project Overview](template-docs/project-overview.md)
- [FSD Architecture](template-docs/fsd-architecture.md)
- [Development Guide](template-docs/development-guide.md)
- [Public API Enforcement](template-docs/public-api-enforcement.md)
- [Template Features](template-docs/template-features.md)
- [Zustand Integration](template-docs/zustand-integration.md)
- [Deployment](template-docs/deployment.md)

## 🧩 Authentication System Architecture

### 🔐 Authentication Features

- **Sign In/Sign Up**: Complete user registration and login flows
- **Password Management**: Forgot password, reset password with secure tokens
- **Email Verification**: Account activation and email confirmation
- **Session Management**: JWT token handling with automatic refresh
- **Multi-Domain Support**: Configurable auth and app domains

### 🏗️ FSD Layer Structure

- **App Layer**: Global providers, routing, theme configuration
- **Pages Layer**: Authentication routes (login, register, forgot-password, verify-email)
- **Features Layer**:
  - `signin-form` - User login functionality
  - `signup-form` - User registration with validation
  - `forgot-password-form` - Password reset request
  - `reset-password-form` - Password reset with token
  - `email-verification-form` - Email confirmation
- **Entities Layer**: User models, form types, authentication state
- **Shared Layer**: API clients, UI components, utilities, error handling

### 🔧 Technical Implementation

- **API Integration**: RESTful authentication endpoints with proper error handling
- **Form Validation**: Zod schemas with Mantine form integration
- **State Management**: TanStack Query for API state, local storage for tokens
- **Security**: Secure token storage, CSRF protection, input sanitization
- **Testing**: Comprehensive test coverage with MSW for API mocking
