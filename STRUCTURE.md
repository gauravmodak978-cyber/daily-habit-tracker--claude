# 📂 File Structure & Responsibilities

## Visual Overview

```
Habit Flow Application
│
├── 🌐 FRONTEND (User Interface)
│   ├── index.html ─────────── Page structure & layout
│   └── styles.css ─────────── Visual design & responsiveness
│
├── 🔧 CORE UTILITIES
│   ├── utils.js ───────────── Date helpers, hashing, week calculations
│   ├── storage.js ─────────── LocalStorage read/write operations
│   └── theme.js ───────────── Light/Dark mode toggle
│
├── 👤 USER MANAGEMENT
│   └── auth.js ────────────── Login, signup, sessions, logout
│
├── ✅ HABIT FEATURES
│   ├── habits.js ──────────── Main habit logic + WEEK NAVIGATION
│   ├── stats.js ───────────── Charts, graphs, analytics
│   └── modals.js ──────────── Pop-up windows (add, stats, settings)
│
├── ⚙️ SETTINGS
│   └── settings.js ────────── Password, export, import, delete account
│
└── ▶️ INITIALIZATION
    └── app.js ─────────────── Starts the application
```

## File Dependency Chain

```
1. index.html loads →
2. styles.css (styling) →
3. utils.js (must load first - has helper functions) →
4. storage.js (needs utils) →
5. auth.js (needs storage + utils) →
6. theme.js (standalone) →
7. habits.js (needs storage + utils + auth) →
8. stats.js (needs habits + utils) →
9. settings.js (needs storage + habits) →
10. modals.js (needs habits + stats + settings) →
11. app.js (initializes everything)
```

## Detailed Breakdown

### 📄 index.html (11KB)
**What it does:** HTML structure
- Page layout
- Forms (login, signup)
- Habit list container
- Modals (add, settings, stats)
- Navigation bars

**Calls functions from:** All JS files

---

### 🎨 styles.css (13KB)
**What it does:** All visual styling
- Dark/Light theme variables
- Responsive layouts
- Animations
- Mobile/Desktop views
- Chart styling

**Independent:** No JavaScript dependencies

---

### 🔧 utils.js (2.6KB)
**What it does:** Helper functions
```javascript
- hash(str)              // Password hashing
- dateKey(date)          // Format: YYYY-MM-DD
- isToday()              // Check if date is today
- isFuture()             // Check if date is future
- monthName()            // Get month name
- dayName()              // Get day name
- getWeekOfMonth()       // Calculate week number
- getWeekRange()         // Get week start/end days
- getTotalWeeks()        // Weeks in month
```

**Used by:** Everyone (must load first!)

---

### 💾 storage.js (1.3KB)
**What it does:** LocalStorage operations
```javascript
- getUsers()             // Fetch all users
- saveUsers()            // Save all users
- getCurrentUser()       // Get logged in user
- getUserData()          // Get user's habits/data
- saveUserData()         // Save user's data
- deleteUser()           // Remove user
```

**Dependencies:** None
**Used by:** auth.js, habits.js, settings.js

---

### 🌙 theme.js (725B)
**What it does:** Theme switching
```javascript
- init()                 // Load saved theme
- toggle()               // Switch dark/light
- updateIcon()           // Change 🌙/☀️ icon
```

**Dependencies:** None
**Used by:** app.js

---

### 👤 auth.js (4.2KB)
**What it does:** User authentication
```javascript
- switchTab()            // Toggle login/signup
- togglePass()           // Show/hide password
- handleSignup()         // Create account
- handleLogin()          // Verify & login
- logout()               // Clear session
- showApp()              // Show main app
- checkSession()         // Auto-login on load
```

**Dependencies:** utils.js, storage.js
**Used by:** index.html, app.js

---

### ✅ habits.js (9.9KB) ⭐ MAIN FILE
**What it does:** Core habit tracking + WEEK NAVIGATION
```javascript
STATE:
- habits[]               // List of all habits
- completions{}          // Checked days
- currentMonth           // Selected month
- currentYear            // Selected year
- currentWeek            // Selected week ← NEW!

FUNCTIONS:
- loadData()             // Load user's habits
- saveData()             // Save to LocalStorage
- calculateStreak()      // Count consecutive days
- getMonthlyRate()       // Month completion %
- getTodayRate()         // Today completion %
- getWeekDays()          // Get current week's days ← NEW!
- changeMonth()          // Navigate months
- changeWeek()           // Navigate weeks ← NEW!
- renderAll()            // Update everything
- toggleCheck()          // Mark day complete
- save()                 // Add new habit
- deleteHabit()          // Remove habit
```

**Dependencies:** utils.js, storage.js, auth.js
**Used by:** index.html, stats.js, settings.js

---

### 📊 stats.js (10KB) ⭐ STATISTICS
**What it does:** Charts and visualizations
```javascript
RENDERS:
- renderProgressRing()   // Circular % indicator
- renderWeeklyChart()    // Bar chart (7 days)
- renderMonthlyChart()   // Line graph (full month)
- renderTopStreaks()     // Best habits list

DATA:
- getWeeklyData()        // Last 7 days stats
- getMonthlyData()       // All month days stats
```

**Dependencies:** habits.js, utils.js
**Uses:** Canvas API for drawing charts
**Used by:** modals.js

---

### 🪟 modals.js (1.4KB)
**What it does:** Pop-up windows
```javascript
- openAdd()              // Show add habit modal
- openStats()            // Show statistics modal
- openSettings()         // Show settings modal
- close()                // Close any modal
```

**Dependencies:** habits.js, stats.js, settings.js
**Used by:** index.html

---

### ⚙️ settings.js (2.7KB)
**What it does:** User settings
```javascript
- changePassword()       // Update password
- deleteAccount()        // Remove account
- deleteUser()           // Remove other user
- exportData()           // Download JSON
- importData()           // Upload JSON
- handleImport()         // Process import file
```

**Dependencies:** storage.js, habits.js, utils.js
**Used by:** modals.js

---

### ▶️ app.js (165B)
**What it does:** Initialize everything
```javascript
- theme.init()           // Set theme
- auth.checkSession()    // Auto-login
```

**Dependencies:** All files
**Runs:** On page load (DOMContentLoaded)

---

## Debugging Guide

### Problem: Week navigation not working
**Check:** habits.js → `changeWeek()` function
**Depends on:** utils.js → `getWeekRange()`, `getTotalWeeks()`

### Problem: Charts not showing
**Check:** stats.js → `renderWeeklyChart()`, `renderMonthlyChart()`
**Depends on:** habits.js → `state.habits`, `state.completions`

### Problem: Data not saving
**Check:** storage.js → `saveUserData()`
**Called by:** habits.js → `saveData()`

### Problem: Login not working
**Check:** auth.js → `handleLogin()`
**Depends on:** storage.js, utils.js (for hash)

### Problem: Styles broken
**Check:** styles.css loaded properly
**Check:** CSS variables defined in `:root`

---

## Modification Guide

### Add new habit emoji
**File:** habits.js
**Line:** `emojis: ['💪','📚', ...]`
**Action:** Add emoji to array

### Change theme colors
**File:** styles.css
**Section:** `:root[data-theme="dark"]`
**Action:** Modify CSS variables

### Change max users
**File:** storage.js
**Line:** `MAX_USERS: 10`
**Action:** Change number

### Add new chart type
**File:** stats.js
**Action:** Create new `render___Chart()` function
**Pattern:** Copy `renderWeeklyChart()` and modify

### Modify week calculation
**File:** utils.js
**Functions:** `getWeekOfMonth()`, `getWeekRange()`
**Note:** Used by habits.js for week navigation

---

## Load Order (Important!)

```
✅ Correct Order (in index.html):
1. utils.js      ← Has functions everyone needs
2. storage.js    ← Uses utils
3. auth.js       ← Uses utils + storage
4. theme.js      ← Standalone
5. habits.js     ← Uses utils + storage + auth
6. stats.js      ← Uses habits + utils
7. settings.js   ← Uses storage + habits + utils
8. modals.js     ← Uses habits + stats + settings
9. app.js        ← Initializes everything

❌ Wrong Order:
- habits.js before utils.js → Error: utils.dateKey not found
- stats.js before habits.js → Error: habits.state not found
- app.js at the beginning → Nothing initialized yet
```

---

## Data Flow

```
User Action
    ↓
HTML Event (onclick, onsubmit)
    ↓
JavaScript Function
    ↓
Update State (habits.state)
    ↓
Save to LocalStorage (storage.saveUserData)
    ↓
Re-render UI (habits.renderAll)
    ↓
Update Charts if needed (stats.render)
```

Example: Checking a habit
```
1. User clicks checkbox
2. onclick="habits.toggleCheck(id, date)"
3. habits.toggleCheck() updates state.completions
4. habits.saveData() saves to LocalStorage
5. habits.renderAll() updates UI
6. If stats modal open, stats.render() updates charts
```

---

**This structure makes debugging easy:**
- **Feature not working?** → Find its file
- **Error in console?** → Check file name in error
- **Want to add feature?** → Add to appropriate file
- **Modify existing?** → Search function name across files
