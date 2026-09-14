import { test, expect } from "../fixtures/test";

test('successful login', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://www.saucedemo.com');

  await page
    .locator('[data-test="username"]')
    .fill('standard_user');

  await page
    .locator('[data-test="password"]')
    .fill('secret_sauce');

  await page
    .locator('[data-test="login-button"]')
    .click();

  await expect(page).toHaveURL(/inventory/);

  await expect(
    page.locator('[data-test="title"]'),
  ).toHaveText('Products');
  await context.close();
});