# Habit Flow — Daily Habit Tracker 📊

A beautiful, interactive habit tracking dashboard with multi-user authentication, visualizations, and analytics. Track your daily habits, build streaks, and visualize your progress.

![Habit Flow Preview](preview.png)

## ✨ Features

### 🔐 Multi-User Authentication
- **User Registration** — Sign up with username and password (up to 10 users)
- **Secure Login** — Each user has their own private habit data
- **Password Management** — Change your password anytime
- **User Management** — View all registered users in settings
- **Account Deletion** — Delete your own account or remove other users

### 📊 Habit Tracking
- **📋 Daily Habit Tracking** — Check off habits for each day of the month
- **📊 Visual Progress Ring** — See your daily completion rate at a glance
- **📈 Weekly Bar Chart** — Track your weekly performance trends
- **🔥 Streak Tracking** — Build and maintain habit streaks
- **📅 Month Navigation** — Browse through past months to see historical data
- **💾 Local Storage** — Your data is saved automatically in your browser
- **📥 Export/Import** — Backup and restore your data as JSON files
- **🎨 Beautiful Dark UI** — Modern, eye-friendly design with smooth animations
- **📱 Responsive Design** — Works on desktop, tablet, and mobile

## 🚀 Quick Start

### Option 1: Open Directly
Simply open `index.html` in your browser. That's it!

### Option 2: Host on GitHub Pages (Recommended)

1. **Create a GitHub repository**
   - Go to [github.com/new](https://github.com/new)
   - Name it `habit-tracker` (or any name you prefer)
   - Make it public
   - Click "Create repository"

2. **Upload the files**
   - Click "uploading an existing file"
   - Drag and drop `index.html` into the upload area
   - Click "Commit changes"

3. **Enable GitHub Pages**
   - Go to your repository's **Settings**
   - Scroll down to **Pages** (in the left sidebar)
   - Under "Source", select **Deploy from a branch**
   - Under "Branch", select **main** and **/ (root)**
   - Click **Save**

4. **Access your app**
   - Wait 1-2 minutes for deployment
   - Your app will be live at: `https://YOUR-USERNAME.github.io/habit-tracker`

## 🎮 Usage

### Getting Started
1. **Sign Up** — Create an account with a username (3+ characters) and password (4+ characters)
2. **Login** — Enter your credentials to access your personal dashboard
3. **Start Tracking** — Add habits and check them off daily!

### User Limits
- Maximum **10 users** can register on a single instance
- Each user has completely separate habit data
- Users can view all registered users in Settings

### Adding Habits
- Click the **"+ Add Habit"** button
- Enter a habit name
- Choose an emoji icon
- Click **Save Habit**

### Tracking Habits
- Click on any checkbox to mark a habit as complete
- Completed habits show a green checkmark
- Future dates are automatically disabled

### Navigation
- Use the **◀ ▶** buttons to navigate between months
- View your progress across different time periods

### Keyboard Shortcuts
- `Ctrl/Cmd + N` — Add new habit
- `Esc` — Close modal

### Data Management
- **Export** — Download your data as a JSON backup file
- **Import** — Restore data from a previously exported file

## 🎨 Customization

The app uses CSS custom properties for easy theming. Edit the `:root` section in the HTML file to customize colors:

```css
:root {
    --bg-primary: #0a0a0f;
    --bg-secondary: #12121a;
    --accent-primary: #6366f1;
    --accent-success: #10b981;
    /* ... more variables */
}
```

## 📱 Screenshots

### Desktop View
- Full calendar grid with all days visible
- Side panel with progress ring and charts
- Hover effects and animations

### Mobile View
- Responsive layout that stacks vertically
- Touch-friendly checkboxes
- Scrollable habit table

## 🔧 Technical Details

- **Pure HTML/CSS/JS** — No build tools or frameworks required
- **LocalStorage** — Data persists in browser storage
- **No Dependencies** — Single file, no external libraries (except Google Fonts)
- **Modern CSS** — Uses CSS Grid, Flexbox, Custom Properties, and animations

## 📄 License

MIT License — feel free to use, modify, and share!

---

Made with ❤️ for better habits
