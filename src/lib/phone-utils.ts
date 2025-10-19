import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js'
import type { CountryCode } from 'libphonenumber-js'

export interface PhoneValidationResult {
  isValid: boolean
  formatted: string
  e164: string
  error?: string
}

export function validateAndFormatPhone(phone: string, countryCode: CountryCode = 'IN'): PhoneValidationResult {
  try {
    // Remove all non-digit characters except +
    const cleanPhone = phone.replace(/[^\d+]/g, '')
    
    if (!cleanPhone) {
      return {
        isValid: false,
        formatted: '',
        e164: '',
        error: 'Phone number is required'
      }
    }

    // Parse the phone number
    const phoneNumber = parsePhoneNumber(cleanPhone, countryCode)
    
    if (!phoneNumber || !isValidPhoneNumber(phoneNumber.number)) {
      return {
        isValid: false,
        formatted: '',
        e164: '',
        error: 'Invalid phone number format'
      }
    }

    return {
      isValid: true,
      formatted: phoneNumber.formatNational(),
      e164: phoneNumber.format('E.164'),
      error: undefined
    }
  } catch {
    return {
      isValid: false,
      formatted: '',
      e164: '',
      error: 'Invalid phone number format'
    }
  }
}

export function normalizePhoneInput(value: string): string {
  // Remove all non-digit characters except +
  return value.replace(/[^\d+]/g, '')
}

export function formatPhoneDisplay(phone: string, countryCode: CountryCode = 'IN'): string {
  try {
    const phoneNumber = parsePhoneNumber(phone, countryCode)
    return phoneNumber ? phoneNumber.formatNational() : phone
  } catch {
    return phone
  }
}
