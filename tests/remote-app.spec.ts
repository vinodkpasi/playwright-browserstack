import { test, expect } from "../fixtures/test";

test('successful login', async ({ page }) => {
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

  await page.getByRole("button", { name: "Add to cart" }).first().click();

  await page.locator("#shopping_cart_container").click();
  await page.getByRole("button", { name: "Checkout" }).click();

  await expect(
    page.getByText('Checkout: Your Information'),
  ).toBeVisible();
  await page.getByRole("textbox", { name: "First Name" }).fill("Vinod");
  await page.getByRole("textbox", { name: "Last Name" }).fill("Kumar");
  await page.getByRole("textbox", { name: "Zip/Postal Code" }).fill("263152");

  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("button", { name: "Finish" }).click();

  await expect(
    page.getByText('Thank you for your order!'),
  ).toBeVisible();
});