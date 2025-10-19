import { validateAndFormatPhone, normalizePhoneInput, formatPhoneDisplay } from '@/lib/phone-utils'

describe('Phone Utils', () => {
  describe('validateAndFormatPhone', () => {
    it('should validate and format Indian phone numbers', () => {
      const result = validateAndFormatPhone('9999990987', 'IN')
      expect(result.isValid).toBe(true)
      expect(result.e164).toBe('+919999990987')
      expect(result.formatted).toContain('99999 90987')
    })

    it('should validate international phone numbers', () => {
      const result = validateAndFormatPhone('+12345678901', 'US')
      expect(result.isValid).toBe(true)
      expect(result.e164).toBe('+12345678901')
    })

    it('should reject invalid phone numbers', () => {
      const result = validateAndFormatPhone('123', 'IN')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Invalid phone number format')
    })

    it('should handle empty input', () => {
      const result = validateAndFormatPhone('', 'IN')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Phone number is required')
    })

    it('should handle phone numbers with formatting', () => {
      const result = validateAndFormatPhone('+91 99999 90987', 'IN')
      expect(result.isValid).toBe(true)
      expect(result.e164).toBe('+919999990987')
    })
  })

  describe('normalizePhoneInput', () => {
    it('should remove non-digit characters except +', () => {
      expect(normalizePhoneInput('+91 99999-90987')).toBe('+919999990987')
      expect(normalizePhoneInput('(999) 999-0987')).toBe('9999990987')
      expect(normalizePhoneInput('999.999.0987')).toBe('9999990987')
    })

    it('should preserve + at the beginning', () => {
      expect(normalizePhoneInput('+91 99999 90987')).toBe('+919999990987')
    })
  })

  describe('formatPhoneDisplay', () => {
    it('should format phone numbers for display', () => {
      const formatted = formatPhoneDisplay('+919999990987', 'IN')
      expect(formatted).toContain('99999 90987')
    })

    it('should return original if formatting fails', () => {
      const formatted = formatPhoneDisplay('invalid', 'IN')
      expect(formatted).toBe('invalid')
    })
  })
})
