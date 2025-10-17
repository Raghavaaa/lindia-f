# 🍎 MAC - How to Open Developer Tools

## 🎯 QUICK METHOD:

### **Use Keyboard Shortcut:**
Press: **Cmd + Option + I** (or **Cmd + Alt + I**)

This opens Developer Tools with Console/Network tabs.

---

## 📋 ALTERNATIVE METHODS:

### Method 1: Right-Click Menu
1. Right-click anywhere on the page
2. Click **"Inspect"** or **"Inspect Element"**
3. Developer Tools will open

### Method 2: Chrome Menu
1. Click **Chrome** in menu bar (top left)
2. Click **View** → **Developer** → **Developer Tools**

### Method 3: Enable Developer Menu First
1. Safari: **Safari** → **Preferences** → **Advanced**
2. Check **"Show Develop menu in menu bar"**
3. Then: **Develop** → **Show Web Inspector**

---

## 🔍 AFTER OPENING DEVELOPER TOOLS:

### To See Network Tab:
1. Developer Tools should open (bottom or side of window)
2. At the top of Developer Tools, you'll see tabs:
   - **Elements** | **Console** | **Sources** | **Network** | ...
3. Click **"Network"** tab
4. Make sure recording is on (red circle icon)

### To See Console Tab:
1. Click **"Console"** tab at the top
2. You'll see any messages, errors, or logs

---

## 🧪 FULL TEST STEPS FOR MAC:

### Step 1: Open Developer Tools
**Press: Cmd + Option + I**

### Step 2: Click "Network" Tab
At the top of Developer Tools window

### Step 3: Hard Refresh Browser
**Press: Cmd + Shift + R**

### Step 4: Create Test Client
- Name: "Deployment Test Client"
- Email: "deployment@test.com"
- Phone: "7777777777"
- Click "Create"

### Step 5: Look at Network Tab
**What to look for:**
- Request to `api.legalindia.ai/clients/`
- Method: POST
- Status: 201 (green) or 200

**How to check:**
1. Find the request in the list (should appear when you click Create)
2. Click on it
3. Look at "Headers" section on the right
4. Scroll down to "Request Headers"
5. Look for `X-API-Key: legalindia_secure_api_key_2025`

---

## 🎯 SIMPLIFIED VERSION:

If Developer Tools is too complex, just tell me:

**After creating "Deployment Test Client", did the client:**
1. Appear in your client list immediately? (Yes/No)
2. Still there after you refresh the page? (Yes/No)

**If YES to both:** I'll check database and we'll know if it worked! 🎉

---

## 📱 EVEN SIMPLER:

Just create "Deployment Test Client" and tell me you did.

**Then I'll check the database for you!**

No need to use Developer Tools if it's confusing. Just:
1. Create the client
2. Tell me "done"
3. I'll verify it's in PostgreSQL database

That's it! 🚀

