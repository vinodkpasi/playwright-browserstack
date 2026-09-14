import { test as base, expect, type Page, type TestInfo } from "@playwright/test";

type BrowserStackSessionDetails = {
  name?: string;
  duration?: number | null;
  os?: string;
  os_version?: string;
  browser_version?: string;
  browser?: string;
  device?: string | null;
  status?: string;
  reason?: string | null;
  hashed_id?: string;
  build_name?: string;
  project_name?: string;
  build_hashed_id?: string;
  logs?: string;
  har_logs_url?: string;
  playwright_logs_url?: string;
  video_url?: string;
  browser_console_logs_url?: string;
};

async function getBrowserStackSessionDetails(
  page: Page,
): Promise<BrowserStackSessionDetails | null> {
  try {
    const response = await page.evaluate(
      () => {},
      `browserstack_executor: ${JSON.stringify({
        action: "getSessionDetails",
      })}`,
    );

    // BrowserStack SDK is not active when running:
    // npx playwright test
    if (typeof response !== "string" || !response.trim()) {
      return null;
    }

    try {
      return JSON.parse(response) as BrowserStackSessionDetails;
    } catch {
      return null;
    }
  } catch {
    // Ignore BrowserStack executor errors during local Playwright execution.
    return null;
  }
}

async function attachBrowserStackReport(
  page: Page,
  testInfo: TestInfo,
): Promise<void> {
  const details = await getBrowserStackSessionDetails(page);

  if (!details) {
    return;
  }

  const dashboardUrl =
    details.build_hashed_id && details.hashed_id
      ? `https://automate.browserstack.com/builds/${details.build_hashed_id}/sessions/${details.hashed_id}`
      : undefined;

  const escapeHtml = (value: unknown): string =>
    String(value ?? "N/A")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const link = (label: string, url?: string): string =>
    url
      ? `<li><a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a></li>`
      : "";

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>BrowserStack Session</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 16px; line-height: 1.5; }
    table { border-collapse: collapse; }
    td { padding: 4px 12px 4px 0; vertical-align: top; }
    code { word-break: break-all; }
  </style>
</head>
<body>
  <h2>BrowserStack Session</h2>
  <table>
    <tr><td><strong>Test</strong></td><td>${escapeHtml(details.name)}</td></tr>
    <tr><td><strong>Status</strong></td><td>${escapeHtml(details.status)}</td></tr>
    <tr><td><strong>Browser</strong></td><td>${escapeHtml(details.browser)}</td></tr>
    <tr><td><strong>Browser Version</strong></td><td>${escapeHtml(details.browser_version)}</td></tr>
    <tr><td><strong>OS</strong></td><td>${escapeHtml(details.os)} ${escapeHtml(details.os_version)}</td></tr>
    <tr><td><strong>Build</strong></td><td>${escapeHtml(details.build_name)}</td></tr>
    <tr><td><strong>Session ID</strong></td><td><code>${escapeHtml(details.hashed_id)}</code></td></tr>
  </table>

  <h3>BrowserStack Artifacts</h3>
  <ul>
    ${link("Open BrowserStack Session", dashboardUrl)}
    ${link("Video", details.video_url)}
    ${link("Text Logs", details.logs)}
    ${link("Network Logs (HAR)", details.har_logs_url)}
    ${link("Playwright Logs", details.playwright_logs_url)}
    ${link("Browser Console Logs", details.browser_console_logs_url)}
  </ul>
</body>
</html>`;

  await testInfo.attach("BrowserStack Session", {
    body: Buffer.from(html, "utf-8"),
    contentType: "text/html",
  });

  // Also keep the raw response available in the Playwright report for debugging.
  await testInfo.attach("BrowserStack Session Details", {
    body: Buffer.from(JSON.stringify(details, null, 2), "utf-8"),
    contentType: "application/json",
  });
}

export const test = base;

test.afterEach(async ({ page }, testInfo) => {
  await attachBrowserStackReport(page, testInfo);
});

export { expect };
