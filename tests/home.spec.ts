import { test, expect } from '@playwright/test';

test('homepage has correct title and hero text', async ({ page }) => {
  await page.goto('/');

  // Check title
  await expect(page).toHaveTitle(/2anki/);

  // Check hero section is present
  const heroSection = page.locator('.hero');
  await expect(heroSection).toBeVisible();
  
  // Check that the hero section contains the key text elements
  await expect(heroSection).toContainText('Create');
  await expect(heroSection).toContainText('Anki flashcards');
  await expect(heroSection).toContainText('fast');
});
