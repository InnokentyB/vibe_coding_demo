import { test, expect } from '@playwright/test';

test.describe('Equipment Request Flow', () => {
    test('should allow a user to submit a new equipment request and see it in the list', async ({ page }) => {
        // Navigate to the main page
        await page.goto('/');

        // Check header
        await expect(page.locator('h1')).toHaveText('EquipReq');

        // Fill the form
        await page.fill('input[name="title"]', 'Test E2E MacBook Pro M3');
        await page.fill('textarea[name="description"]', 'Needed for automated testing and CI/CD pipelines.');
        await page.fill('input[name="price"]', '2500');
        await page.selectOption('select[name="urgency"]', 'high');

        // Submit the form
        await page.click('button[type="submit"]');

        // Verify the submission appears in the Request List
        const newRequestTitle = page.locator('h3.req-title', { hasText: 'Test E2E MacBook Pro M3' }).first();
        await expect(newRequestTitle).toBeVisible({ timeout: 10000 });

        const newRequestPrice = page.locator('.req-price', { hasText: '$2,500.00' }).first();
        await expect(newRequestPrice).toBeVisible();

        const newRequestUrgency = page.locator('.badge-high', { hasText: 'high Urgency' }).first();
        await expect(newRequestUrgency).toBeVisible();
    });
});
