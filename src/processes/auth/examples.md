# Auth Process Layer Examples

> **Note**: This is an authentication portal for login/signup flows. After successful authentication, users are redirected to the main application domain. Most examples here are for reference when integrating auth into protected applications.

## 1. Basic Auth Status Check

```tsx
import { useIsAuthenticated, useAuthLoading } from "@/processes/auth";

function AuthStatus() {
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuthLoading();

  if (isLoading) {
    return <div>Checking authentication...</div>;
  }

  return <div>Status: {isAuthenticated ? "Authenticated" : "Not Authenticated"}</div>;
}
```

## 2. Display Current User Info

```tsx
import { useCurrentUser, useUserFullName, useUserInitials } from "@/processes/auth";

function UserGreeting() {
  const user = useCurrentUser();
  const fullName = useUserFullName();
  const initials = useUserInitials();

  if (!user) {
    return null;
  }

  return (
    <div>
      <Avatar>{initials}</Avatar>
      <span>Welcome, {fullName}!</span>
      <span>{user.email}</span>
    </div>
  );
}
```

## 3. Authority-based Access Control

```tsx
import { useHasAuthority, useHasAnyAuthority } from "@/processes/auth";

function AdminPanel() {
  const isAdmin = useHasAuthority("ROLE_ADMIN");
  const isStaff = useHasAnyAuthority(["ROLE_ADMIN", "ROLE_MODERATOR"]);

  if (!isAdmin) {
    return <div>Access denied. Admin authority required.</div>;
  }

  return (
    <div>
      <h2>Admin Panel</h2>
      {isStaff && <StaffTools />}
    </div>
  );
}
```

## 4. Permission-based Feature Toggle

```tsx
import { useHasPermission, useHasAnyPermission } from "@/processes/auth";

function DocumentEditor({ document }) {
  const canEdit = useHasPermission("edit:documents");
  const canDelete = useHasPermission("delete:documents");
  const canShare = useHasAnyPermission(["share:documents", "share:all"]);

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

## 5. Session Expiration Monitor

```tsx
import { useEffect } from "react";
import { useAuthStore, isSessionExpiringSoon, getTimeUntilExpiration } from "@/processes/auth";

function SessionMonitor() {
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const checkSession = () => {
      const minutesRemaining = getTimeUntilExpiration();

      if (isSessionExpiringSoon(5)) {
        console.warn(`Session expires in ${minutesRemaining} minutes`);
      }

      if (isSessionExpiringSoon(1)) {
        const shouldLogout = confirm("Your session is about to expire. Continue?");
        if (!shouldLogout) {
          logout();
        }
      }
    };

    const interval = setInterval(checkSession, 30000);
    return () => clearInterval(interval);
  }, [logout]);

  return null;
}
```

## 6. Auth Guards for Route Protection

```tsx
import { isAuthenticated, requireAuth, requireGuest } from "@/processes/auth";

// Check if user is authenticated
function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    requireAuth(); // Redirects to login
    return null;
  }
  return children;
}

// Ensure user is NOT authenticated (for login/signup pages)
function GuestRoute({ children }) {
  if (isAuthenticated()) {
    requireGuest(); // Redirects to app
    return null;
  }
  return children;
}
```

## 7. Role-based Route Guards

```tsx
import { requireRole, requireAnyRole } from "@/processes/auth";

function AdminRoute({ children }) {
  // Throws error if user doesn't have ROLE_ADMIN authority
  requireRole("ROLE_ADMIN");
  return children;
}

function StaffRoute({ children }) {
  // Throws error if user doesn't have any of these authorities
  requireAnyRole(["ROLE_ADMIN", "ROLE_MODERATOR", "ROLE_STAFF"]);
  return children;
}
```

## 8. Permission-based Guards

```tsx
import { requirePermission } from "@/processes/auth";

function EditDocumentPage({ documentId }) {
  // Throws error if user doesn't have permission
  requirePermission("edit:documents");

  return <DocumentEditor documentId={documentId} />;
}
```

## 9. Auth Utility Functions

```tsx
import {
  isAdmin,
  isSuperAdmin,
  isTenantOwner,
  getUserAuthorityPriority,
  formatUserDisplayName,
  getUserInitials,
} from "@/processes/auth";

function UserBadge({ user }) {
  const displayName = formatUserDisplayName(user);
  const initials = getUserInitials(user);
  const priority = getUserAuthorityPriority(user);

  return (
    <div>
      <Avatar>{initials}</Avatar>
      <span>{displayName}</span>
      {isSuperAdmin(user) && <Badge>Super Admin</Badge>}
      {isAdmin(user) && <Badge>Admin</Badge>}
      {isTenantOwner(user) && <Badge>Owner</Badge>}
      <span>Priority: {priority}</span>
    </div>
  );
}
```

## 10. Custom Auth Hook

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
    isAuthenticated: !!user,
  };
}
```

## 11. Auth Error Handling

```tsx
import { useAuthStore, useAuthError } from "@/processes/auth";

function AuthErrorDisplay() {
  const error = useAuthError();
  const clearError = useAuthStore((state) => state.clearError);

  if (!error) {
    return null;
  }

  return (
    <Alert color="red" onClose={clearError}>
      <strong>Authentication Error:</strong> {error.message}
    </Alert>
  );
}
```

## 12. Real-time Auth Status Indicator

```tsx
import { useAuthStore, useAuthError, useAuthInitialized } from "@/processes/auth";

function AuthStatusIndicator() {
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthInitialized();
  const error = useAuthError();

  if (!isInitialized) {
    return <Badge color="gray">Initializing...</Badge>;
  }

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
