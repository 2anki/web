import { test, expect } from '@playwright/test';

test('homepage has correct title and hero text', async ({ page }) => {
  await page.goto('/');

  // Check title
  await expect(page).toHaveTitle(/2anki/);

  // Check hero text
  const heroText = page.getByText('Create Anki flashcards fast');
  await expect(heroText).toBeVisible();
});
