import { test, expect } from "../fixtures/test";

test('Login with valid credentials', async ({ page }) => {
    // Open local website
    await page.goto('http://localhost:3004');

    // Enter username
    await page.locator('#username').fill('admin');

    // Enter password
    await page.locator('#password').fill('admin123');

    // Click Login
    await page.locator('button[type="submit"]').click();

    // Verify successful login
    await expect(page.locator('#message'))
        .toHaveText('Login successful!');
});