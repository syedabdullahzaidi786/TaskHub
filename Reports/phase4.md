## Phase IV – Securing Environment Variables

### Objective
Secure sensitive configuration data in the Kubernetes deployment by migrating from plain-text environment variables to Kubernetes Secrets, ensuring no credentials are exposed in version control or deployment manifests.

### The Security Problem
Initially, sensitive information such as `DATABASE_URL`, `BETTER_AUTH_SECRET`, and `GEMINI_API_KEY` was defined directly in the Helm chart's `values.yaml` and `deployment.yaml`. This posed significant risks:
- **Exposure**: Credentials visible in plain text in the codebase.
- **Risk**: High risk of accidental commit to version control.
- **Compliance**: Violated security best practices for secrets management.

### Solution Overview
We implemented a robust secret management strategy using Helm and Kubernetes Secrets:
1.  **Separation**: Extracted actual secrets into a separate `values.secrets.yaml` file (git-ignored).
2.  **Sanitization**: Replaced real values in `values.yaml` with safe placeholders.
3.  **Injection**: Configured the backend Deployment to inject secrets from a Kubernetes Secret resource using `envFrom`.

### Implementation Details

#### 1. Secret Separation
Sensitive patterns are now excluded from version control via `.gitignore`:
```gitignore
# Helm Secrets
*.secrets.yaml
k8s-configs/
```

#### 2. Helm Secret Template
A new `templates/secret.yaml` was created to dynamically generate Kubernetes Secrets from the chart values, automatically base64-encoding the data.

#### 3. Deployment Changes
The `deployment.yaml` was refactored to remove the `env` block for sensitive keys and instead use:
```yaml
envFrom:
  - secretRef:
      name: {{ .Chart.Name }}-secrets
```

#### 4. Secure Deployment Workflow
A helper script `deploy-backend-with-secrets.ps1` was added to facilitate the secure upgrade process.

**Deploying with Secrets:**
```powershell
helm upgrade --install todo-backend ./charts/todo-backend `
  -f ./charts/todo-backend/values.yaml `
  -f ./charts/todo-backend/values.secrets.yaml
```

### Verification
Verify the security hardening using `kubectl`:

1.  **Check Secret Creation**:
    ```powershell
    kubectl get secret todo-backend-secrets
    ```
2.  **Inspect Deployment**:
    ```powershell
    kubectl describe deployment todo-backend
    ```
    *Result*: Environment variables sourced from the Secret are not shown in plain text.

### Outcome
- ✅ **Zero Exposure**: No secrets in `values.yaml` or `deployment.yaml`.
- ✅ **Version Control Safety**: Real credentials are effectively ignored by Git.
- ✅ **Kubernetes Native**: Leveraging standard K8s Secret primitives.

---
*Ready for Phase V: StatefulSet Database Deployment*