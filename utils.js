// Utility Functions

const utils = {
    // Hash function for passwords
    hash(str) {
        let h = 0;
        for(let i = 0; i < str.length; i++) {
            h = ((h << 5) - h) + str.charCodeAt(i);
            h = h & h;
        }
        return h.toString(16);
    },

    // Date formatting
    dateKey(date) {
        return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
    },

    // Check if date is today
    isToday(year, month, day) {
        const now = new Date();
        return now.getFullYear() === year && now.getMonth() === month && now.getDate() === day;
    },

    // Check if date is in future
    isFuture(year, month, day) {
        const date = new Date(year, month, day);
        const now = new Date();
        now.setHours(0,0,0,0);
        return date > now;
    },

    // Get month name
    monthName(month, short = false) {
        const names = short 
            ? ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
            : ['January','February','March','April','May','June','July','August','September','October','November','December'];
        return names[month];
    },

    // Get day name
    dayName(day, short = true) {
        const names = short 
            ? ['Su','Mo','Tu','We','Th','Fr','Sa']
            : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        return names[day];
    },

    // Get days in month
    daysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    },

    // Get week number in month
    getWeekOfMonth(date) {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const dayOfMonth = date.getDate();
        const firstDayOfWeek = firstDay.getDay();
        return Math.ceil((dayOfMonth + firstDayOfWeek) / 7);
    },

    // Get start and end of week in month
    getWeekRange(year, month, weekNum) {
        const firstDay = new Date(year, month, 1);
        const firstDayOfWeek = firstDay.getDay();
        
        // Calculate start day of the week
        const startDay = (weekNum - 1) * 7 - firstDayOfWeek + 1;
        const endDay = startDay + 6;
        
        const lastDay = this.daysInMonth(year, month);
        
        return {
            start: Math.max(1, startDay),
            end: Math.min(endDay, lastDay)
        };
    },

    // Get total weeks in month
    getTotalWeeks(year, month) {
        const lastDay = new Date(year, month, this.daysInMonth(year, month));
        return this.getWeekOfMonth(lastDay);
    }
};
