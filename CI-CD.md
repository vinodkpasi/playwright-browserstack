# Playwright CI/CD

This project includes GitHub Actions pipelines for local Playwright validation and BrowserStack cross-browser execution.

## Workflows

### `playwright-ci-cd.yml`

Runs on:
- Push to `main`, `master`, or `develop`
- Pull requests targeting those branches
- Manual execution from GitHub Actions

Manual execution supports:
- `playwright` — local Playwright test
- `browserstack` — BrowserStack test
- `both` — both test suites

The pipeline publishes Playwright reports and test results as GitHub Actions artifacts and finishes with a quality gate.

### `nightly-browserstack.yml`

Runs a BrowserStack regression every weekday at 18:30 UTC (00:00 IST) and can also be started manually.

## GitHub Secrets

Create these repository secrets under **Settings → Secrets and variables → Actions**:

- `BROWSERSTACK_USERNAME`
- `BROWSERSTACK_ACCESS_KEY`

Do not commit BrowserStack credentials to `browserstack.yml` or source code.

## BrowserStack configuration

`browserstack.yml` reads credentials from:

```yaml
userName: ${BROWSERSTACK_USERNAME}
accessKey: ${BROWSERSTACK_ACCESS_KEY}
```

The current configuration runs against the platforms defined in that file and uses BrowserStack Local because `browserstackLocal: true` is enabled.

## Recommended branch strategy

```text
feature/*
    ↓ Pull Request
GitHub Actions
    ├── Local Playwright tests
    └── BrowserStack tests
             ↓
       Quality Gate
             ↓
          merge
             ↓
          main
```

## Local validation

```bash
npm ci
npx playwright install --with-deps chromium
npx playwright test
npm run test:browserstack
```
