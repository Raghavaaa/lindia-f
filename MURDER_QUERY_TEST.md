# 🔍 MURDER QUERY TEST GUIDE

**Date:** 2025-10-22 18:51  
**Status:** ✅ **READY FOR TESTING**

---

## 🎯 **TESTING "MURDER" QUERY IN FRONTEND**

### **What to Test:**
1. **Add Client functionality** (should no longer be transparent)
2. **Murder query in Research module** (should get AI response)

---

## 📋 **STEP-BY-STEP TESTING**

### **Step 1: Wait for Vercel Deployment**
- ✅ Code pushed to GitHub (commit: e16e191)
- 🚀 Vercel is auto-deploying with correct environment variables
- ⏱️ Wait 2-3 minutes for deployment to complete

### **Step 2: Test Add Client (Should Work Now)**
1. Go to: https://legalindia.ai/app
2. Look for "Add Client" or "New" button
3. **Expected:** Button should be **active/clickable** (not transparent)
4. **Previous:** Button was transparent due to "Offline Mode"
5. **Now:** Should work because backend URL is fixed

### **Step 3: Test Murder Query**
1. **Create/Select a client** (using the now-working Add Client)
2. **Go to Research module**
3. **Type:** `murder`
4. **Click:** "Run Research"
5. **Expected:** AI response about murder laws in India
6. **Timing:** Should take ~60-75 seconds (within 120s timeout)

---

## 🔍 **WHAT TO EXPECT**

### **Murder Query Response Should Include:**
- **Legal Framework:** IPC Section 300, 302, 304
- **Case Law:** Relevant Supreme Court judgments
- **Procedures:** Investigation, trial, sentencing
- **Bail Considerations:** Murder is non-bailable
- **Punishment:** Life imprisonment or death penalty

### **Response Format:**
```
# COMPREHENSIVE LEGAL ANALYSIS: murder

## 📋 LEGAL FRAMEWORK
### 1. RELEVANT STATUTES
- Indian Penal Code, 1860
- Section 300: Murder
- Section 302: Punishment for murder

## 🏛️ CASE LAW ANALYSIS
[Relevant Supreme Court cases]

## ⚖️ LEGAL PROCEDURES
[Investigation and trial process]

## 💰 BAIL CONSIDERATIONS
[Non-bailable nature of murder]
```

---

## 🚨 **TROUBLESHOOTING**

### **If Add Client Still Transparent:**
1. **Check:** Browser console for errors
2. **Verify:** Environment variables loaded
   ```javascript
   console.log(process.env.NEXT_PUBLIC_BACKEND_URL)
   // Should show: https://lindia-b-production.up.railway.app
   ```
3. **Wait:** 2-3 more minutes for deployment

### **If Murder Query Fails:**
1. **Check:** Network tab in browser dev tools
2. **Look for:** 502/503 errors from backend
3. **Verify:** Backend health at https://lindia-b-production.up.railway.app/health
4. **Expected:** `{"status":"healthy","version":"1.0.4"}`

### **If Query Times Out:**
1. **Wait:** Up to 120 seconds (we increased timeout)
2. **Check:** AI processing takes 60-75 seconds typically
3. **Verify:** No "Offline Mode" message appears

---

## 📊 **EXPECTED PERFORMANCE**

### **Backend Health Check:**
- **Response Time:** ~0.36 seconds
- **Status:** Healthy

### **AI Processing:**
- **Murder Query Time:** ~60-75 seconds
- **Model Used:** InLegalBERT + DeepSeek API
- **Confidence:** 0.95

### **Frontend Response:**
- **No "Offline Mode"** message
- **Full AI response** with legal analysis
- **Proper formatting** with sections and bullet points

---

## 🎯 **SUCCESS CRITERIA**

### **✅ Add Client Working:**
- Button is clickable (not transparent)
- Modal opens when clicked
- Can create new clients

### **✅ Murder Query Working:**
- No "Offline Mode" message
- Gets full AI response
- Takes 60-75 seconds
- Contains comprehensive legal analysis

---

## 🔗 **TESTING URLS**

### **Frontend:**
- **Main App:** https://legalindia.ai/app
- **Research Module:** https://legalindia.ai/research

### **Backend Health:**
- **Backend:** https://lindia-b-production.up.railway.app/health
- **AI Engine:** https://lindia-ai-production.up.railway.app/health

---

## 📝 **TEST RESULTS**

**Please test and report:**

1. **Add Client Button:** [ ] Working / [ ] Still transparent
2. **Murder Query:** [ ] Success / [ ] Failed / [ ] Timeout
3. **Response Quality:** [ ] Good / [ ] Poor / [ ] Error
4. **Response Time:** [ ] ~60s / [ ] >120s / [ ] Timeout

---

**Report Generated:** 2025-10-22 18:51  
**Status:** 🚀 **READY FOR TESTING**  
**Deployment:** In progress (commit e16e191)

---

**Next Step:** Wait 2-3 minutes for Vercel deployment, then test the murder query!
