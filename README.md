# Habit Flow - Daily Habit Tracker

A beautiful, responsive habit tracking application with multi-user support, week navigation, and detailed statistics.

## 📁 Project Structure

```
habit-tracker/
├── index.html          # Main HTML structure
├── styles.css          # All CSS styles
├── utils.js            # Utility functions (date, hash, etc.)
├── storage.js          # LocalStorage management
├── theme.js            # Light/Dark theme toggle
├── auth.js             # User authentication & session
├── habits.js           # Habit tracking & management
├── stats.js            # Statistics & charts rendering
├── modals.js           # Modal windows management
├── settings.js         # User settings & data import/export
└── app.js              # Main app initialization
```

## ✨ Features

### Authentication
- **Multi-user support** (up to 10 users)
- **Secure password hashing**
- **Session persistence**
- **User management**

### Habit Tracking
- **Week navigation** - Navigate through weeks within a month
- **Month navigation** - Switch between months
- **7-day week view** - Track habits day by day
- **Progress bars** - Visual feedback for each habit
- **Streak counting** - Track your longest streaks
- **20 emoji icons** - Customize your habits

### Statistics (NEW!)
- **Today's Progress Ring** - Circular progress indicator
- **Weekly Bar Chart** - See your last 7 days performance
- **Monthly Line Chart** - Track your entire month trend
- **Top Streaks Leaderboard** - Your best performing habits

### Design
- **Light & Dark mode** - Toggle with 🌙/☀️ button
- **Fully responsive** - Works on phones, tablets, and desktops
- **No horizontal scrolling** - Fits all screen sizes perfectly
- **Touch-friendly** - Large buttons for mobile use

## 🚀 How to Use

### Getting Started
1. Open `index.html` in your browser
2. Create an account (or login if you have one)
3. Add your first habit
4. Start tracking!

### Week Navigation
- Use the **Week** arrows (◀ ▶) to navigate between weeks in the current month
- Week info shows: "Week 2/5 (8-14)" (week number and date range)
- Use the **Month** arrows to change months

### View Statistics
- **Mobile**: Tap the 📊 Stats button in bottom navigation
- **Desktop**: Click the 📊 Stats icon in navigation
- View detailed charts and progress rings

### Debugging

Each file is responsible for specific functionality:

**Having issues with authentication?** → Check `auth.js`

**Habits not saving?** → Check `habits.js` and `storage.js`

**Charts not displaying?** → Check `stats.js`

**Theme not working?** → Check `theme.js`

**Styles broken?** → Check `styles.css`

## 🎨 Customization

### Adding More Emojis
Edit the `emojis` array in `habits.js`:
```javascript
emojis: ['💪','📚','🏃', '🎸', '🎮', ...] // Add your emojis here
```

### Changing Colors
Edit CSS variables in `styles.css`:
```css
:root[data-theme="dark"] {
    --accent: #6366f1;  /* Change primary color */
    --success: #10b981; /* Change success color */
    ...
}
```

### Modifying User Limit
Change `MAX_USERS` in `storage.js`:
```javascript
MAX_USERS: 20  // Change from 10 to any number
```

## 📊 Statistics Explained

### Weekly Chart
- Shows last 7 days of habit completion
- Bar height = completion percentage
- Today's bar is highlighted

### Monthly Chart
- Shows daily completion rate for entire month
- Line graph with gradient fill
- Points show each day's performance

### Progress Ring
- Shows today's completion percentage
- Green ring fills based on completed habits
- Updates in real-time as you check habits

## 💾 Data Management

### Export
1. Open Settings (⚙️)
2. Click "Export"
3. Save JSON file to your computer

### Import
1. Open Settings (⚙️)
2. Click "Import"
3. Select your JSON backup file
4. Confirm to restore data

## 🔧 Technical Details

- **No dependencies** - Pure HTML, CSS, and JavaScript
- **LocalStorage** - All data stored in browser
- **Canvas API** - Used for rendering charts
- **Responsive Grid** - Auto-adjusts to screen size
- **Single-page app** - No page reloads needed

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (bottom navigation, stacked layout)
- **Tablet/Desktop**: ≥ 768px (top navigation, side-by-side layout)

## 🐛 Common Issues

**Charts not showing?**
- Make sure the stats modal is fully loaded
- Check browser console for errors

**Week navigation jumps to next month?**
- This is expected - if you go past the last week, it moves to next month

**Can't see full app on MacBook?**
- The app auto-adjusts to screen width
- Try refreshing the page

**Data disappeared?**
- Check if you're logged into the correct user
- Export your data regularly as backup

## 🚀 Deployment

### GitHub Pages
1. Create a new repository
2. Upload all files
3. Go to Settings → Pages
4. Select "Deploy from branch"
5. Choose "main" branch and "/" (root)
6. Your app will be live at: `https://username.github.io/repo-name`

### Local Development
Simply open `index.html` in any modern browser. No build process needed!

## 📝 License

Free to use and modify for personal projects.

## 🎯 Roadmap

- [ ] Calendar month view
- [ ] Habit categories
- [ ] Custom themes
- [ ] Data sync across devices
- [ ] Habit reminders
- [ ] More chart types

---

**Made with ❤️ for building better habits**
