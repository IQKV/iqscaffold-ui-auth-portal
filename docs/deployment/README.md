## 🔐 Deployment Guide

### Overview

The IQ Key Value Auth Portal is deployed using Helm charts and automated CI/CD pipelines. The service provides a React-based authentication portal UI with Nginx serving, runtime configuration via ConfigMap, and SPA routing support.

### Prerequisites

- Kubernetes 1.19+
- Helm 3.2.0+
- Nginx Ingress Controller
- TLS certificates (for production)

### Environments

| Environment | Namespace      | Purpose                     |
| ----------- | -------------- | --------------------------- |
| Test        | `iqkv-sit-env` | Feature branch testing      |
| Staging     | `iqkv-uat-env` | Pre-production validation   |
| Production  | `iqkv-prd-env` | Live production environment |

### Automated Deployment (CI/CD)

#### Drone Pipeline Overview

The service uses Drone CI/CD pipeline with 10 stages:

1. **VerifyCode** - Code quality, tests, static analysis
2. **PublishArtifacts** - Build artifacts to registry
3. **PublishDockerImage** - Container images to registry
4. **DeployWorkInProgress** - WIP branch auto-deployment
5. **RollbackWorkInProgress** - WIP rollback
6. **PromoteFeatureDeployment** - Feature branch promotion
7. **RollbackFeatureDeployment** - Feature rollback
8. **PromoteDeployment** - Release promotion
9. **RollbackDeployment** - Release rollback
10. **ReleasePackage** - Automated version management

#### Branch Deployment Strategy

| Branch Type | Auto Deploy | Manual Promote | Target Environment |
| ----------- | ----------- | -------------- | ------------------ |
| `wip`       | ✅ SIT      | -              | SIT                |
| `feature/*` | -           | ✅ SIT         | SIT                |
| `dev`       | -           | ✅ Staging     | Staging            |
| Tags        | -           | ✅ Production  | Production         |

<details>
<summary>Deployment Commands</summary>

The pipeline uses these Helm commands for deployment:

```bash
# Development (WIP branches)
helm upgrade --install --atomic --wait --timeout 5m iqscaffold-ui-mantine-auth-portal ./ \
  --values ./values.yaml \
  --values ./values-test.yaml \
  --set image.tag=wip \
  --set app.env.apiServerUrl="https://api.iqkv.site" \
  --namespace iqkv-sit-env

# Production (Tagged releases)
helm upgrade --install --atomic --wait --timeout 5m iqscaffold-ui-mantine-auth-portal ./ \
  --values ./values.yaml \
  --values ./values-prd.yaml \
  --set image.tag=${DRONE_TAG} \
  --set app.env.apiServerUrl="https://api.iqkv.site" \
  --namespace iqkv-prd-env
```

</details>

### Manual Deployment

#### Quick Start

<details>
<summary>Quick Start Commands</summary>

```bash
# Clone Helm charts
git clone <HELM_CHARTS_REPOSITORY> charts
cd charts/KnowHowDevOps/iqscaffold-ui-mantine-auth-portal

# Deploy to development
helm upgrade --install auth-portal ./ \
  --values values-sit.yaml \
  --set app.env.apiServerUrl="https://api.iqkv.site" \
  --namespace iqkv-sit-env \
  --create-namespace
```

</details>

#### Environment-Specific Deployments

<details>
<summary>Development Deployment</summary>

```bash
helm upgrade --install auth-portal ./ \
  --values values-sit.yaml \
  --namespace iqkv-sit-env \
  --create-namespace
```

</details>

<details>
<summary>Production Deployment</summary>

```bash
helm upgrade --install auth-portal ./ \
  --values values-prd.yaml \
  --set app.env.apiServerUrl="https://api.iqkv.site" \
  --set app.env.authDomainAuth="https://auth.iqkv.site" \
  --set app.env.authDomainApp="https://app.iqkv.site" \
  --namespace iqkv-prd-env \
  --create-namespace
```

</details>

### Configuration

#### Required Configuration

| Setting          | Environment Variable     | Required | Description             |
| ---------------- | ------------------------ | -------- | ----------------------- |
| API Server URL   | `app.env.apiServerUrl`   | ✅       | Backend API endpoint    |
| Auth Domain Auth | `app.env.authDomainAuth` | ✅       | Authentication domain   |
| Auth Domain App  | `app.env.authDomainApp`  | ✅       | Application domain      |
| Redirect URLs    | `app.env.authRedirect*`  | ✅       | Post-auth redirect URLs |

#### External Dependencies

The service connects to these external components:

- **API Gateway**: Backend API services
- **User Service**: Authentication and user management
- **CDN/Load Balancer**: Static asset delivery

#### Service Configuration

| Setting        | Dev      | Production       |
| -------------- | -------- | ---------------- |
| Replicas       | 1        | 3                |
| CPU Request    | 100m     | 500m             |
| Memory Request | 128Mi    | 512Mi            |
| Autoscaling    | Disabled | 3-10 replicas    |
| Ingress        | Enabled  | Enabled with TLS |
| Monitoring     | Disabled | Enabled          |

<details>
<summary>Frontend-Specific Configuration</summary>

| Setting            | Dev     | Production | Description                |
| ------------------ | ------- | ---------- | -------------------------- |
| MSW (Mock Service) | false   | false      | Enable mock service worker |
| Log Level          | debug   | warn       | Application logging level  |
| CSP Policy         | Relaxed | Strict     | Content Security Policy    |
| Security Headers   | Basic   | Enhanced   | HTTP security headers      |
| Rate Limiting      | None    | 100/min    | Request rate limiting      |

</details>

### Monitoring & Health Checks

#### Health Endpoints

- **Liveness**: `/` (port 8080)
- **Readiness**: `/` (port 8080)
- **Health Check**: `/health` (port 8080)

#### Monitoring Stack

Production deployments include:

- Prometheus ServiceMonitor
- Alerting rules for service health
- Grafana dashboards

<details>
<summary>Frontend-Specific Alerts</summary>

| Alert                       | Condition                         | Severity | Description               |
| --------------------------- | --------------------------------- | -------- | ------------------------- |
| AuthPortalDown              | Service unavailable > 1 minute    | Critical | Service is down           |
| AuthPortalHighMemory        | Memory usage > 80%                | Warning  | High memory consumption   |
| AuthPortalHighLatency       | Response time > 2 seconds         | Warning  | High response times       |
| AuthPortalHighErrorRate     | Error rate > 5%                   | Warning  | High error rate           |
| AuthPortalCertificateExpiry | TLS certificate expires < 30 days | Warning  | Certificate expiring soon |

</details>

### Troubleshooting

#### Common Issues

<details>
<summary>Service Unavailable</summary>

```bash
# Check service logs
kubectl logs deployment/iqscaffold-ui-mantine-auth-portal -n iqkv-sit-env

# Check pod status
kubectl get pods -l app.kubernetes.io/name=iqscaffold-ui-mantine-auth-portal -n iqkv-sit-env

# Check ingress configuration
kubectl describe ingress iqscaffold-ui-mantine-auth-portal -n iqkv-sit-env
```

</details>

<details>
<summary>Configuration Issues</summary>

```bash
# View ConfigMap
kubectl describe configmap iqscaffold-ui-mantine-auth-portal-config -n iqkv-sit-env

# Check runtime configuration
kubectl exec -it deployment/iqscaffold-ui-mantine-auth-portal -n iqkv-sit-env -- \
  cat /usr/share/nginx/html/config.js
```

</details>

<details>
<summary>Test Health Endpoints</summary>

```bash
# Port forward to access health endpoints
kubectl port-forward deployment/iqscaffold-ui-mantine-auth-portal 8080:8080 -n iqkv-sit-env

# Test health endpoints
curl http://localhost:8080/
curl http://localhost:8080/health

# Test API connectivity (from browser console)
# Check window.VITE_API_SERVER_URL configuration
```

</details>

<details>
<summary>CORS and CSP Issues</summary>

```bash
# Check ingress CORS configuration
kubectl get ingress iqscaffold-ui-mantine-auth-portal -n iqkv-sit-env -o yaml

# View CSP configuration
kubectl exec -it deployment/iqscaffold-ui-mantine-auth-portal -n iqkv-sit-env -- \
  cat /usr/share/nginx/content-security-policy.conf

# Test CORS headers
curl -H "Origin: https://app.iqkv.site" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: X-Requested-With" \
  -X OPTIONS https://auth.iqkv.site/
```

</details>

#### Rollback

<details>
<summary>Rollback Commands</summary>

```bash
# Rollback to previous version
helm rollback iqscaffold-ui-mantine-auth-portal -n iqkv-prd-env

# Or uninstall completely
helm uninstall iqscaffold-ui-mantine-auth-portal -n iqkv-prd-env
```

</details>

### Security

- TLS enabled in production with Let's Encrypt certificates
- Strict Content Security Policy in production
- Enhanced security headers (HSTS, X-Frame-Options, etc.)
- CORS configured for iqkv.site subdomains only
- Rate limiting enabled in production
- Non-root container execution
- Read-only root filesystem in production
- Runtime configuration injection via ConfigMap
- No sensitive data in container images
