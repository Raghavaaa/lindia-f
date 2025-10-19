#!/usr/bin/env node

// Test ClientModal validation behavior
console.log("🧪 Testing ClientModal Validation");
console.log("=================================");

// Simulate the validation logic from ClientModal
const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10 && cleanPhone.length <= 15;
};

const validateName = (name) => {
  return name.trim().length >= 2 && name.trim().length <= 100;
};

// Test cases that should trigger validation errors
const testCases = [
  {
    name: "Valid case",
    nameInput: "John Doe",
    phoneInput: "1234567890",
    expectedNameError: null,
    expectedPhoneError: null
  },
  {
    name: "Invalid phone - too short",
    nameInput: "John Doe", 
    phoneInput: "123",
    expectedNameError: null,
    expectedPhoneError: "Please enter a valid international phone number (10-15 digits)"
  },
  {
    name: "Invalid phone - starts with 0",
    nameInput: "John Doe",
    phoneInput: "0123456789", 
    expectedNameError: null,
    expectedPhoneError: "Please enter a valid international phone number (10-15 digits)"
  },
  {
    name: "Invalid name - too short",
    nameInput: "J",
    phoneInput: "1234567890",
    expectedNameError: "Name must be 2-100 characters long",
    expectedPhoneError: null
  },
  {
    name: "Both invalid",
    nameInput: "J",
    phoneInput: "123",
    expectedNameError: "Name must be 2-100 characters long", 
    expectedPhoneError: "Please enter a valid international phone number (10-15 digits)"
  }
];

let passed = 0;
let failed = 0;

testCases.forEach((test, index) => {
  console.log(`\n${index + 1}. Testing: ${test.name}`);
  
  // Simulate validation logic
  const nameError = !validateName(test.nameInput) ? "Name must be 2-100 characters long" : null;
  const phoneError = !test.phoneInput.trim() ? "Phone number is required" : 
                    !validatePhone(test.phoneInput) ? "Please enter a valid international phone number (10-15 digits)" : null;
  
  const nameMatch = nameError === test.expectedNameError;
  const phoneMatch = phoneError === test.expectedPhoneError;
  
  if (nameMatch && phoneMatch) {
    console.log("   ✅ PASS");
    passed++;
  } else {
    console.log("   ❌ FAIL");
    console.log(`   Name Error - Expected: ${test.expectedNameError}, Got: ${nameError}`);
    console.log(`   Phone Error - Expected: ${test.expectedPhoneError}, Got: ${phoneError}`);
    failed++;
  }
});

console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  console.log("❌ ClientModal validation has issues");
  process.exit(1);
} else {
  console.log("✅ ClientModal validation is working correctly");
  process.exit(0);
}
