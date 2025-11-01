# Auth Process Layer Examples

## 1. Protected Component with Role Check

```tsx
import { useHasRole, useCurrentUser } from "@/processes/auth";

function AdminPanel() {
  const isAdmin = useHasRole("admin");
  const user = useCurrentUser();

  if (!isAdmin) {
    return <div>Access denied. Admin role required.</div>;
  }

  return (
    <div>
      <h2>Admin Panel</h2>
      <p>Welcome, {user?.firstName}!</p>
      {/* Admin-only content */}
    </div>
  );
}
```

## 2. Conditional Navigation Menu

```tsx
import { useIsAuthenticated, useHasAnyRole } from "@/processes/auth";

function NavigationMenu() {
  const isAuthenticated = useIsAuthenticated();
  const isStaff = useHasAnyRole(["admin", "moderator"]);

  return (
    <nav>
      <Link to="/">Home</Link>
      {isAuthenticated && (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile">Profile</Link>
          {isStaff && <Link to="/admin">Admin</Link>}
        </>
      )}
      {!isAuthenticated && <Link to="/login">Login</Link>}
    </nav>
  );
}
```

## 3. Auto-logout on Token Expiration

```tsx
import { useEffect } from "react";
import { useAuthStore, isSessionExpiringSoon } from "@/processes/auth";

function SessionMonitor() {
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const checkSession = () => {
      if (isSessionExpiringSoon(1)) {
        // 1 minute warning
        const shouldLogout = confirm(
          "Your session is about to expire. Continue?"
        );
        if (!shouldLogout) {
          logout();
        }
      }
    };

    const interval = setInterval(checkSession, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [logout]);

  return null;
}
```

## 4. API Request with Auto-retry on Token Refresh

```tsx
import { apiClient } from "@/shared/api";
import { useAuthStore } from "@/processes/auth";

async function fetchUserData() {
  try {
    const response = await apiClient.get("/api/user/profile");
    return response.data;
  } catch (error) {
    // The API client automatically handles 401 errors and token refresh
    // If refresh fails, user will be logged out automatically
    throw error;
  }
}

function UserProfile() {
  const user = useCurrentUser();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserData().then(setProfile).catch(console.error);
    }
  }, [user]);

  return <div>{profile ? <ProfileView data={profile} /> : <Loading />}</div>;
}
```

## 5. Multi-step Form with Auth Check

```tsx
import { useIsAuthenticated, requireAuth } from "@/processes/auth";

function MultiStepForm() {
  const [step, setStep] = useState(1);
  const isAuthenticated = useIsAuthenticated();

  const handleNextStep = () => {
    if (step === 2 && !isAuthenticated) {
      // Require auth before proceeding to step 3
      requireAuth();
      return;
    }
    setStep(step + 1);
  };

  return (
    <div>
      {step === 1 && <BasicInfoStep onNext={handleNextStep} />}
      {step === 2 && <ContactInfoStep onNext={handleNextStep} />}
      {step === 3 && <ProtectedStep />}
    </div>
  );
}
```

## 6. Permission-based Feature Toggle

```tsx
import { useHasPermission } from "@/processes/auth";

function DocumentEditor({ document }) {
  const canEdit = useHasPermission("edit:documents");
  const canDelete = useHasPermission("delete:documents");
  const canShare = useHasPermission("share:documents");

  return (
    <div>
      <DocumentViewer document={document} />

      <div className="actions">
        {canEdit && <EditButton document={document} />}
        {canDelete && <DeleteButton document={document} />}
        {canShare && <ShareButton document={document} />}
      </div>
    </div>
  );
}
```

## 7. Tenant-aware Component

```tsx
import { getUserTenant, belongsToTenant } from "@/processes/auth";

function TenantSpecificContent({ content }) {
  const userTenant = getUserTenant();
  const canViewContent = belongsToTenant(content.tenantId);

  if (!canViewContent) {
    return <div>This content is not available for your organization.</div>;
  }

  return (
    <div>
      <h3>{content.title}</h3>
      <p>Organization: {userTenant}</p>
      <div>{content.body}</div>
    </div>
  );
}
```

## 8. Custom Auth Hook

```tsx
import { useAuthStore, useCurrentUser } from "@/processes/auth";

function useAuthActions() {
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const user = useCurrentUser();

  const loginWithRedirect = async (credentials, redirectTo = "/dashboard") => {
    await login(credentials);
    window.location.href = redirectTo;
  };

  const logoutWithConfirm = async () => {
    const confirmed = confirm("Are you sure you want to logout?");
    if (confirmed) {
      await logout();
    }
  };

  return {
    user,
    login: loginWithRedirect,
    logout: logoutWithConfirm,
  };
}

// Usage
function LoginForm() {
  const { login } = useAuthActions();

  const handleSubmit = (credentials) => {
    login(credentials, "/welcome");
  };

  // ... rest of component
}
```

## 9. Auth-aware Error Boundary

```tsx
import { useAuthStore } from "@/processes/auth";

function AuthErrorBoundary({ children }) {
  const logout = useAuthStore((state) => state.logout);

  const handleAuthError = (error) => {
    if (error.status === 401 || error.status === 403) {
      logout();
      return <div>Session expired. Please login again.</div>;
    }
    throw error;
  };

  return <ErrorBoundary onError={handleAuthError}>{children}</ErrorBoundary>;
}
```

## 10. Real-time Auth Status

```tsx
import { useAuthStore, useAuthError } from "@/processes/auth";

function AuthStatusIndicator() {
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthError();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isLoading) {
    return <Badge color="yellow">Authenticating...</Badge>;
  }

  if (error) {
    return <Badge color="red">Auth Error</Badge>;
  }

  return (
    <Badge color={isAuthenticated ? "green" : "gray"}>
      {isAuthenticated ? "Authenticated" : "Not Authenticated"}
    </Badge>
  );
}
```
