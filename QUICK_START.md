# Auth Portal - Quick Start Guide

## 🎯 What is this?

This is the **authentication portal** for IQKV platform. It handles:

- User sign up
- User sign in
- Password reset

**After successful login, users are automatically redirected to the main application (APP_DOMAIN).**

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

Copy the example config and update with your values:

```bash
cp public/config.js.example public/config.js
```

Edit `public/config.js`:

```javascript
// Your API server
window.VITE_API_URL_SERVER = "https://api.yourdomain.com";

// Auth portal domain
window.VITE_AUTH_DOMAIN_AUTH = "https://auth.yourdomain.com";

// Main application domain (where users go after login)
window.VITE_AUTH_DOMAIN_APP = "https://app.yourdomain.com";

// Redirect to main app root after login
window.VITE_AUTH_REDIRECT_AFTER_LOGIN = "https://app.yourdomain.com";
```

### 3. Start Development Server

```bash
pnpm dev
```

Visit `http://localhost:5173`

## 📋 Available Pages

| Route              | Purpose                   |
| ------------------ | ------------------------- |
| `/`                | Home/Login page           |
| `/login`           | Dedicated login page      |
| `/register`        | User registration         |
| `/forgot-password` | Request password reset    |
| `/reset-password`  | Reset password with token |

## 🔄 Authentication Flow

```
User visits auth portal
    ↓
User signs in/up
    ↓
Authentication successful
    ↓
Redirect to APP_DOMAIN root
    ↓
Main application handles everything else
```

## 🛠️ Development Commands

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm prettier:write
```

## 🔐 Security Notes

1. **No Application Logic**: This portal only handles authentication
2. **External Redirects**: All successful logins redirect to APP_DOMAIN
3. **Token Storage**: Tokens are stored in localStorage/cookies
4. **API Communication**: All auth requests go to VITE_API_URL_SERVER

## 🚫 What NOT to Add Here

- ❌ User dashboards
- ❌ Profile management
- ❌ Application features
- ❌ Business logic
- ❌ Protected content

**All post-authentication features belong in the main application (APP_DOMAIN).**

## 📝 Adding New Auth Features

If you need to add new authentication-related features:

1. Create feature in `src/features/`
2. Create page in `src/pages/`
3. Ensure it redirects to APP_DOMAIN after success
4. Update this documentation

Example structure:

```
src/features/my-auth-feature/
  ├── model/
  │   └── validation.ts
  ├── ui/
  │   └── my-auth-feature.tsx
  └── index.ts
```

## 🐛 Troubleshooting

### Issue: Redirect not working after login

**Solution**: Check `public/config.js` has correct `VITE_AUTH_REDIRECT_AFTER_LOGIN` value

### Issue: API calls failing

**Solution**: Verify `VITE_API_URL_SERVER` in `public/config.js`

### Issue: Already logged in but stuck on login page

**Solution**: Clear browser localStorage and cookies, then try again

## 📚 More Information

- Full documentation: See [README.md](README.md)
- Changes summary: See [PORTAL_CHANGES.md](PORTAL_CHANGES.md)
- Architecture: Feature-Sliced Design (FSD)

## 🤝 Need Help?

- Check the main README for detailed documentation
- Review the PORTAL_CHANGES.md for recent updates
- Contact the development team
