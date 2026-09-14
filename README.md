# Playwright + BrowserStack Automation Framework

A production-style **Playwright + TypeScript + BrowserStack** test automation project demonstrating local app and remote app cross os/device/browser testing, BrowserStack session reporting, and GitHub Actions CI/CD.

## ✨ Key Features

- **Playwright Test** with TypeScript
- Local browser execution with Chromium
- **BrowserStack** cross-browser and mobile-browser execution
- BrowserStack Node SDK integration
- BrowserStack Local tunnel support for private/local applications
- Desktop and mobile platform configuration in `browserstack.yml`
- Parallel execution using `parallelsPerPlatform`
- Automatic BrowserStack session details in the Playwright HTML report
- BrowserStack video, text logs, network/HAR logs, Playwright logs, and console-log links
- Screenshot on failure
- Retry support
- GitHub Actions CI/CD
- Manual workflow selection for Playwright, BrowserStack, or both
- Nightly BrowserStack regression
- CI quality gate
- GitHub Actions test/report artifacts

---

## 🏗️ Project Structure

```text
playwright-browserstack-main/
│
├── .github/
│   └── workflows/
│       ├── playwright-ci-cd.yml
│       └── nightly-browserstack.yml
│
├── dummy-website/                  # Self-contained local demo application
│   ├── index.html                  # Login page
│   ├── server.js                   # Node.js local web server
│   ├── style.css                   # Application styling
│   └── README.md
│
├── fixtures/
│   └── test.ts
│
├── tests/
│   ├── local-app.spec.ts
│   └── remote-app.spec.ts
│
├── browserstack.yml
├── playwright.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
├── CI-CD.md
└── README.md
```

---

## 🔧 Technology Stack

| Technology | Purpose |
|---|---|
| Playwright | End-to-end browser automation |
| TypeScript | Test development |
| Node.js | Runtime |
| BrowserStack | Cloud cross-browser/device execution |
| BrowserStack Node SDK | Playwright integration with BrowserStack |
| GitHub Actions | CI/CD |
| HTML Reporter | Playwright test reporting |

### Current package versions

The project currently declares:

- `@playwright/test` `^1.62.1`
- `browserstack-node-sdk` `^1.68.2`
- `@types/node` `^26.5.1`

Use the versions from `package-lock.json` for reproducible CI installations.

---

# 🚀 Getting Started

## Prerequisites

Install:

- Node.js
- npm
- Git
- A BrowserStack account for cloud execution

Verify your installation:

```bash
node --version
npm --version
git --version
```

---

## 📦 Install Dependencies

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd playwright-browserstack-main
npm ci
```

Install the required Playwright browser:

```bash
npx playwright install --with-deps chromium
```

For local development on Windows/macOS, you can also use:

```bash
npx playwright install chromium
```

---

# 🧪 Running Tests

## Run all Playwright tests

```bash
npm test
```

Equivalent command:

```bash
npx playwright test
```

---

## Run tests in headed mode

```bash
npm run test:headed
```

---

## Run tests in debug mode

```bash
npm run test:debug
```

---

## Open the Playwright HTML report

```bash
npm run test:report
```

---

# 🌐 BrowserStack Execution

BrowserStack execution is configured through:

```text
browserstack.yml
```

The project uses the BrowserStack Node SDK with the following command:

```bash
npm run test:browserstack
```

This executes:

```bash
browserstack-node-sdk playwright test
```

---

## 🔐 BrowserStack Credentials

Do **not** commit BrowserStack credentials to source control.

Set the following environment variables:

```text
BROWSERSTACK_USERNAME
BROWSERSTACK_ACCESS_KEY
```

### Windows PowerShell

```powershell
$env:BROWSERSTACK_USERNAME="your_username"
$env:BROWSERSTACK_ACCESS_KEY="your_access_key"
```

### Windows CMD

```cmd
set BROWSERSTACK_USERNAME=your_username
set BROWSERSTACK_ACCESS_KEY=your_access_key
```

### macOS/Linux

```bash
export BROWSERSTACK_USERNAME="your_username"
export BROWSERSTACK_ACCESS_KEY="your_access_key"
```

Then run:

```bash
npm run test:browserstack
```

---

# ⚙️ BrowserStack Configuration

The project uses environment-variable substitution:

```yaml
userName: ${BROWSERSTACK_USERNAME}
accessKey: ${BROWSERSTACK_ACCESS_KEY}
```

Current platforms include:

```yaml
platforms:
  - os: Windows
    osVersion: 10
    browserName: Edge
    browserVersion: latest

  - deviceName: Samsung Galaxy S22 Ultra
    browserName: chrome
    osVersion: 12.0
```

This allows the same Playwright test suite to execute against multiple environments.

---

# 🔀 Parallel Execution

The BrowserStack configuration currently contains:

```yaml
parallelsPerPlatform: 1
```

For example, with two configured platforms:

```text
Platform 1 → 1 BrowserStack parallel
Platform 2 → 1 BrowserStack parallel

Total BrowserStack parallel capacity used = 2
```

If configured as:

```yaml
parallelsPerPlatform: 2
```

with two platforms:

```text
Platform 1 → 2 parallels
Platform 2 → 2 parallels

Total = 4 BrowserStack parallel threads
```

### Important

`parallelsPerPlatform` controls BrowserStack's cloud-side parallel capacity.

Playwright's `workers` controls Playwright-side test scheduling.

When using the BrowserStack SDK, avoid assuming that increasing Playwright workers automatically increases BrowserStack parallel capacity. The effective concurrency depends on both the test runner and BrowserStack configuration/account limits.

---

# 🔌 BrowserStack Local

The current configuration enables:

```yaml
browserstackLocal: true
```

BrowserStack Local is useful when the application under test is:

- Running on localhost
- Behind a corporate firewall
- On a private network
- In a staging environment that is not publicly accessible

For example:

```text
Playwright Test
      │
      ▼
BrowserStack SDK
      │
      ▼
BrowserStack Cloud
      │
      ▼
BrowserStack Local Tunnel
      │
      ▼
Private / Local Application
```

---

# 🧪 Test Examples

## Local Application Test

`tests/local-app.spec.ts`

The test validates a login flow against the local dummy application:

```text
http://localhost:3004
```

Credentials used by the demo:

```text
Username: admin
Password: admin123
```

Run it with:

```bash
npx playwright test tests/local-app.spec.ts
```

---

## Remote Application Test

`tests/remote-app.spec.ts`

The test validates the SauceDemo login flow:

```text
https://www.saucedemo.com
```

Demo credentials:

```text
Username: standard_user
Password: secret_sauce
```

Run it with:

```bash
npx playwright test tests/remote-app.spec.ts
```

---

# 🧩 Custom Playwright Fixture

The project contains:

```text
fixtures/test.ts
```

The fixture extends the standard Playwright test lifecycle and attempts to retrieve BrowserStack session details after every test.

Conceptually:

```text
Test execution
      │
      ▼
Playwright test
      │
      ▼
BrowserStack SDK
      │
      ▼
BrowserStack session
      │
      ▼
getSessionDetails
      │
      ▼
Playwright testInfo.attach()
      │
      ▼
HTML Report
```

The fixture safely handles local Playwright execution where the BrowserStack SDK is not active.

Therefore:

```bash
npx playwright test
```

does not fail simply because BrowserStack session information is unavailable.

---

# 📊 BrowserStack Reporting

The fixture attaches BrowserStack information to the Playwright report, including:

- Test name
- Status
- Browser
- Browser version
- Operating system
- Build name
- Session ID
- BrowserStack session URL
- Video
- Text logs
- Network/HAR logs
- Playwright logs
- Browser console logs
- Raw BrowserStack session JSON

This provides a useful bridge between:

```text
Playwright HTML Report
        +
BrowserStack Test Reporting
```

---

# 📝 Playwright Configuration

The current configuration includes:

```typescript
use: {
  baseURL: 'https://www.saucedemo.com',
  headless: true,
  screenshot: 'only-on-failure',
  video: 'off',
  trace: 'off',
}
```

### Reporting

```typescript
reporter: [['html', { open: 'never' }]]
```

### Retry

```typescript
retries: 1
```

### Test timeout

```typescript
timeout: 90 * 1000
```

### Local web server

```typescript
webServer: {
  command: "node ./dummy-website/server.js",
  reuseExistingServer: true
}
```

---

# 🔄 CI/CD

GitHub Actions workflows are located under:

```text
.github/workflows/
```

## 1. Playwright CI/CD

Workflow:

```text
playwright-ci-cd.yml
```

It runs on:

- Push to `main`
- Push to `master`
- Push to `develop`
- Pull requests targeting those branches
- Manual workflow execution

### Pipeline

```text
GitHub Event
     │
     ▼
Checkout
     │
     ▼
Setup Node.js
     │
     ▼
npm ci
     │
     ▼
Playwright Tests
     │
     ├───────────────┐
     ▼               ▼
Playwright       BrowserStack
Tests             Tests
     │               │
     └───────┬───────┘
             ▼
       Quality Gate
             │
       ┌─────┴─────┐
       ▼           ▼
    Passed       Failed
```

---

# 🎛️ Manual CI/CD Execution

The workflow supports a manual `target` selection:

```text
playwright
browserstack
both
```

This allows developers to choose which validation they want from GitHub Actions.

Example:

```text
Actions
  ↓
Playwright CI/CD
  ↓
Run workflow
  ↓
Select target
  ↓
Run
```

---

# 🌙 Nightly BrowserStack Regression

Workflow:

```text
.github/workflows/nightly-browserstack.yml
```

The regression is scheduled for weekdays at:

```text
18:30 UTC
00:00 IST
```

It can also be started manually.

The workflow:

1. Checks out the repository
2. Installs Node.js
3. Runs `npm ci`
4. Executes BrowserStack tests
5. Uploads test reports
6. Retains reports for 30 days

---

# 🔑 GitHub Actions Secrets

Configure the following repository secrets:

```text
BROWSERSTACK_USERNAME
BROWSERSTACK_ACCESS_KEY
```

GitHub location:

```text
Repository
  → Settings
  → Secrets and variables
  → Actions
  → New repository secret
```

Never place the actual values directly inside:

```text
browserstack.yml
```

or source code.

---

# 📁 CI/CD Artifacts

The GitHub Actions pipeline uploads:

### Playwright report

```text
playwright-report/
```

### Test results

```text
test-results/
```

BrowserStack workflow artifacts include:

```text
playwright-report/
test-results/
```

The regular CI workflow retains these artifacts for 14 days.

The nightly regression retains them for 30 days.

---

# 🚦 Quality Gate

The CI pipeline contains a dedicated:

```text
CI Quality Gate
```

The quality gate evaluates:

```text
Playwright Tests
BrowserStack Tests
```

If either required test job fails:

```text
Quality Gate → FAILED
```

If both pass:

```text
Quality Gate → PASSED
```

This prevents successful CI completion when automated validation has failed.

---

# 🛠️ Useful npm Commands

| Command | Description |
|---|---|
| `npm test` | Run Playwright tests |
| `npm run test:headed` | Run tests with browser UI |
| `npm run test:debug` | Debug tests |
| `npm run test:report` | Open HTML report |
| `npm run test:browserstack` | Run tests through BrowserStack |
| `npm run test:playwright` | Run Playwright tests |

---

# 🐞 Debugging

## Run one test

```bash
npx playwright test tests/remote-app.spec.ts
```

## Run with a visible browser

```bash
npx playwright test tests/remote-app.spec.ts --headed
```

## Run in debug mode

```bash
npx playwright test tests/remote-app.spec.ts --debug
```

## List discovered tests

```bash
npx playwright test --list
```

## Open the HTML report

```bash
npx playwright show-report
```

---

# ⚠️ Common Issues

## 1. BrowserStack credentials are missing

Error symptoms may include authentication failures.

Verify:

```text
BROWSERSTACK_USERNAME
BROWSERSTACK_ACCESS_KEY
```

are correctly configured.

---

## 2. `npx playwright test` does not show BrowserStack information

This is expected.

The BrowserStack session is created only when the test is executed through the BrowserStack SDK:

```bash
npm run test:browserstack
```

rather than:

```bash
npx playwright test
```

The fixture intentionally ignores BrowserStack executor errors during local Playwright execution.

---

## 3. Local application is inaccessible from BrowserStack

If testing:

```text
localhost
```

or a private environment, ensure:

```yaml
browserstackLocal: true
```

is enabled and the BrowserStack Local tunnel can reach the target application.

---

## 4. CI authentication failure

Check GitHub repository secrets:

```text
BROWSERSTACK_USERNAME
BROWSERSTACK_ACCESS_KEY
```

Do not expose credentials in workflow logs or source code.

---

## 5. BrowserStack parallel limit

Increasing:

```yaml
parallelsPerPlatform
```

may require sufficient BrowserStack parallel capacity.

For example:

```yaml
parallelsPerPlatform: 5
```

does not guarantee five concurrent sessions if the BrowserStack account does not provide that capacity.

---

# 🔒 Security Best Practices

- Never commit BrowserStack credentials.
- Use environment variables locally.
- Use GitHub Actions Secrets in CI.
- Avoid logging access keys.
- Do not hard-code production credentials.
- Keep `.env` or secret files out of source control.
- Review BrowserStack Local configuration before using it against sensitive environments.

---

# 📈 Recommended Enterprise Enhancements

For a larger QA/SDET framework, the following can be added:

- Page Object Model
- API testing
- Test data factories
- Environment-specific configuration
- Tag-based execution
- Smoke/regression suites
- Parallel test sharding
- Allure reporting
- Slack/Teams notifications
- TestRail/Azure DevOps integration
- Docker execution
- Jenkins/GitLab CI support
- Accessibility testing
- Visual regression testing
- Performance testing with k6
- Advanced BrowserStack build naming
- Failure categorization
- Flaky-test tracking
- Test ownership and quality dashboards

---

# 📚 Recommended Execution Strategy

A practical CI strategy is:

```text
Pull Request
    │
    ▼
Fast Playwright Validation
    │
    ▼
Merge
    │
    ▼
BrowserStack Cross-Browser Validation
    │
    ▼
Quality Gate
    │
    ▼
Deployment
    │
    ▼
Nightly BrowserStack Regression
```

This balances feedback speed with broad browser/device coverage.

---

# 📌 Quick Start

### Local Playwright

```bash
npm ci
npx playwright install --with-deps chromium
npm test
npm run test:report
```

### BrowserStack

```bash
export BROWSERSTACK_USERNAME="your_username"
export BROWSERSTACK_ACCESS_KEY="your_access_key"

npm run test:browserstack
```

### CI/CD

Configure:

```text
BROWSERSTACK_USERNAME
BROWSERSTACK_ACCESS_KEY
```

as GitHub Actions secrets, then push to:

```text
main
master
develop
```

or manually run the workflow from GitHub Actions.

---

# 👤 Author

**Vinod Kumar**

Lead SDET / QA Automation Leader

Specialized in:

- Playwright
- Selenium
- Cypress
- TypeScript
- C#
- Test Automation Architecture
- BrowserStack
- CI/CD
- QA Strategy
- Enterprise Test Automation

---

# 📄 License

This project is intended as a demonstration/sample automation framework. Add the appropriate license information before distributing it as an open-source project.
