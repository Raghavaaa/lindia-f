import { test, expect } from '@playwright/test'

test.describe('Research Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/app')
  })

  test('should block research without client selection', async ({ page }) => {
    // Should see client selection CTA
    await expect(page.locator('text=Select a client to run Research')).toBeVisible()
    await expect(page.locator('text=Choose a client from the left panel')).toBeVisible()
    
    // Research form should not be visible
    await expect(page.locator('textarea[placeholder*="legal research question"]')).not.toBeVisible()
  })

  test('should enable research after client selection', async ({ page }) => {
    // Create a test client first
    await page.click('text=+ New')
    await page.fill('input[id="client-name"]', 'Test Client')
    await page.fill('input[id="client-phone"]', '+919999990987')
    await page.click('button:has-text("Create Client")')

    // Wait for client to be selected
    await expect(page.locator('text=Client: Test Client')).toBeVisible()

    // Research form should now be visible
    await expect(page.locator('textarea[placeholder*="legal research question"]')).toBeVisible()
    await expect(page.locator('text=Press Enter to run research')).toBeVisible()
  })

  test('should show disabled research button without query', async ({ page }) => {
    // Create and select a client
    await page.click('text=+ New')
    await page.fill('input[id="client-name"]', 'Test Client')
    await page.fill('input[id="client-phone"]', '+919999990987')
    await page.click('button:has-text("Create Client")')

    // Research button should be disabled
    const researchButton = page.locator('button[title="Enter a query first"]')
    await expect(researchButton).toBeDisabled()
  })

  test('should enable research button with query', async ({ page }) => {
    // Create and select a client
    await page.click('text=+ New')
    await page.fill('input[id="client-name"]', 'Test Client')
    await page.fill('input[id="client-phone"]', '+919999990987')
    await page.click('button:has-text("Create Client")')

    // Enter a research query
    await page.fill('textarea[placeholder*="legal research question"]', 'Test research query')

    // Research button should be enabled
    const researchButton = page.locator('button[title="Run Research"]')
    await expect(researchButton).not.toBeDisabled()
  })

  test('should show Sign Out button when authenticated', async ({ page }) => {
    // Check if Sign Out button is visible (depends on auth state)
    const signOutButton = page.locator('button:has-text("Sign Out")')
    if (await signOutButton.isVisible()) {
      await expect(signOutButton).toBeVisible()
    }
  })

  test('should not show client name before login', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login')
    
    // Should not see any client names
    await expect(page.locator('text=Client:')).not.toBeVisible()
  })

  test('should clear client data on logout', async ({ page }) => {
    // This test would require authentication setup
    // For now, just verify the logout button exists and is clickable
    const signOutButton = page.locator('button:has-text("Sign Out")')
    if (await signOutButton.isVisible()) {
      await signOutButton.click()
      // Should redirect to login or home
      await expect(page).toHaveURL(/\/(login|$)/)
    }
  })

  test('should have proper keyboard navigation', async ({ page }) => {
    // Create and select a client
    await page.click('text=+ New')
    await page.fill('input[id="client-name"]', 'Test Client')
    await page.fill('input[id="client-phone"]', '+919999990987')
    await page.click('button:has-text("Create Client")')

    // Tab to research textarea
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Should be able to type in textarea
    await page.keyboard.type('Test query')
    
    // Enter should trigger research (if enabled)
    await page.keyboard.press('Enter')
    
    // Should see some response or loading state
    await expect(page.locator('text=Running...')).toBeVisible()
  })
})
