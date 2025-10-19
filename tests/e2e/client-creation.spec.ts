import { test, expect } from '@playwright/test'

test.describe('Client Creation Flow', () => {
  test('should create a new client with valid phone number', async ({ page }) => {
    await page.goto('/app')
    
    // Click the + New button in the clients panel
    await page.click('text=+ New')
    
    // Wait for the modal to appear
    await expect(page.locator('text=Create New Client')).toBeVisible()
    
    // Fill in client name
    await page.fill('input[placeholder*="Client name"]', 'Test Client')
    
    // Fill in phone number with proper format
    await page.fill('input[type="tel"]', '+919999990987')
    
    // Click create button
    await page.click('button:has-text("Create Client")')
    
    // Verify client appears in the list
    await expect(page.locator('text=Test Client')).toBeVisible()
    
    // Verify phone number is formatted correctly
    await expect(page.locator('text=+91 99999 90987')).toBeVisible()
  })

  test('should show validation error for invalid phone number', async ({ page }) => {
    await page.goto('/app')
    
    // Click the + New button
    await page.click('text=+ New')
    
    // Fill in client name
    await page.fill('input[placeholder*="Client name"]', 'Test Client')
    
    // Fill in invalid phone number
    await page.fill('input[type="tel"]', '123')
    
    // Click create button
    await page.click('button:has-text("Create Client")')
    
    // Verify validation error appears
    await expect(page.locator('text=Invalid phone number format')).toBeVisible()
  })

  test('should have proper accessibility attributes', async ({ page }) => {
    await page.goto('/app')
    
    // Click the + New button
    await page.click('text=+ New')
    
    // Check for proper ARIA labels
    const nameInput = page.locator('input[placeholder*="Client name"]')
    await expect(nameInput).toHaveAttribute('aria-label', 'Client name')
    
    const phoneInput = page.locator('input[type="tel"]')
    await expect(phoneInput).toHaveAttribute('aria-label', 'Phone number')
    await expect(phoneInput).toHaveAttribute('inputmode', 'tel')
  })
})
