# 🚀 Quick Start Guide

## Files Overview

You now have a **multi-file** habit tracker that's easy to debug and modify:

```
📁 Your Files:
├── 📄 index.html       → Main page structure
├── 🎨 styles.css       → All visual styling
├── 🔧 utils.js         → Helper functions
├── 💾 storage.js       → Data management
├── 🌙 theme.js         → Light/Dark mode
├── 👤 auth.js          → Login system
├── ✅ habits.js        → Habit tracking + WEEK NAVIGATION
├── 📊 stats.js         → Charts & statistics (NEW!)
├── 🪟 modals.js        → Pop-up windows
├── ⚙️ settings.js      → User settings
└── ▶️ app.js           → Starts everything
```

## ✨ What's New

### 1. Week Navigation ✅
- **Navigate by week** within each month
- Shows: "Week 2/5 (8-14)" with date range
- Use ◀ ▶ arrows under the month selector
- Auto-advances to next month when you reach the last week

### 2. Statistics with Charts 📊
Click the 📊 Stats button to see:
- **Progress Ring** - Today's completion percentage
- **Weekly Bar Chart** - Last 7 days performance
- **Monthly Line Chart** - Full month trend with gradient
- **Top Streaks** - Your best performing habits

### 3. Multi-File Structure 🗂️
- **Easy to debug** - Each feature in its own file
- **Easy to modify** - Find and edit what you need
- **Well organized** - Clear separation of concerns

## 🎯 How to Use

### Open the App
Simply open `index.html` in your browser - that's it!

### Navigate Weeks
1. Look for the **Week** navigation (right side on desktop, below month on mobile)
2. Click ◀ to go to previous week
3. Click ▶ to go to next week
4. Week info shows which days you're viewing

### View Statistics
**Mobile:** Tap 📊 in bottom navigation
**Desktop:** App shows stats automatically

### Debug a Feature
Find the file responsible:
- Login issues? → `auth.js`
- Habits not saving? → `habits.js`
- Week navigation broken? → `habits.js` (search for `changeWeek`)
- Charts not working? → `stats.js`
- Styling issues? → `styles.css`

## 🔍 Key Functions

### Week Navigation (habits.js)
```javascript
changeWeek(delta)      // Navigate weeks
getWeekDays()          // Get current week's days
getWeekRange()         // Calculate week start/end
```

### Statistics (stats.js)
```javascript
renderProgressRing()   // Today's circular progress
renderWeeklyChart()    // 7-day bar chart
renderMonthlyChart()   // Monthly line graph
renderTopStreaks()     // Best habits list
```

## 📱 Responsive Design

**Mobile (< 768px)**
- Bottom navigation
- Week nav below month
- Stats in modal

**Desktop (≥ 768px)**
- Top navigation
- Week nav beside month
- Stats always visible

## 🎨 Customization

### Change Colors
Edit `styles.css`:
```css
:root[data-theme="dark"] {
    --accent: #6366f1;  ← Change this
}
```

### Add Emojis
Edit `habits.js`:
```javascript
emojis: ['💪','📚', '🎸'] ← Add yours
```

### Change Max Users
Edit `storage.js`:
```javascript
MAX_USERS: 10  ← Change this
```

## 🐛 Debugging Tips

### Check Console
Press F12 → Console tab to see errors

### Common Issues

**Week navigation not working?**
- Check if `utils.js` loaded (has getWeekOfMonth function)
- Check console for errors

**Charts not displaying?**
- Make sure Canvas API is supported
- Check if `stats.js` loaded properly

**Styles broken?**
- Verify `styles.css` is in same folder as `index.html`
- Check browser console for 404 errors

**Data not saving?**
- Check LocalStorage isn't full
- Try clearing cache and reloading

## 📦 Deployment

### Test Locally
Just open `index.html` - no server needed!

### Deploy to GitHub Pages
1. Create repo on GitHub
2. Upload all 11 files
3. Enable GitHub Pages
4. Done! ✨

## 🎉 Features Checklist

✅ Multi-user authentication (10 users max)
✅ Light & Dark theme
✅ Week navigation within months
✅ Month navigation
✅ Habit tracking with checkboxes
✅ Progress bars
✅ Streak counting
✅ Statistics modal with 3 charts
✅ Progress ring
✅ Export/Import data
✅ Fully responsive (mobile/tablet/desktop)
✅ No horizontal scrolling
✅ Touch-friendly
✅ Clean multi-file structure

## 💡 Pro Tips

1. **Export regularly** - Backup your data!
2. **Use week navigation** - Easier than scrolling through full month
3. **Check stats** - See your progress trends
4. **Switch themes** - Better for different times of day
5. **Delete old users** - Keep it clean

## 🆘 Need Help?

1. Check `README.md` for full documentation
2. Look at the file responsible for the feature
3. Check browser console for errors
4. Search for the function name in files

---

**All files are now in /mnt/user-data/outputs/**

Just download them and open `index.html` in your browser! 🚀
