#!/usr/bin/env node

// Test phone validation logic
const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10 && cleanPhone.length <= 15;
};

const testCases = [
  { input: "1234567890", expected: true, description: "10 digits" },
  { input: "+1234567890", expected: true, description: "10 digits with +" },
  { input: "123-456-7890", expected: true, description: "10 digits with dashes" },
  { input: "(123) 456-7890", expected: true, description: "10 digits with parentheses" },
  { input: "123", expected: false, description: "Too short" },
  { input: "123456789012345678", expected: false, description: "Too long" },
  { input: "0123456789", expected: false, description: "Starts with 0" },
  { input: "abc1234567", expected: false, description: "Contains letters" },
  { input: "", expected: false, description: "Empty string" },
  { input: "123-abc-7890", expected: false, description: "Mixed letters and numbers" }
];

console.log("🧪 Testing Phone Validation Logic");
console.log("==================================");

let passed = 0;
let failed = 0;

testCases.forEach((test, index) => {
  const result = validatePhone(test.input);
  const status = result === test.expected ? "✅ PASS" : "❌ FAIL";
  
  if (result === test.expected) {
    passed++;
  } else {
    failed++;
  }
  
  console.log(`${index + 1}. ${status} - ${test.description}`);
  console.log(`   Input: "${test.input}"`);
  console.log(`   Expected: ${test.expected}, Got: ${result}`);
  console.log("");
});

console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  console.log("❌ Phone validation has issues that need fixing");
  process.exit(1);
} else {
  console.log("✅ Phone validation logic is working correctly");
  process.exit(0);
}
