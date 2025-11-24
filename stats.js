// Statistics Module

const stats = {
    // Render statistics modal
    render() {
        this.renderProgressRing();
        this.renderWeeklyChart();
        this.renderMonthlyChart();
        this.renderTopStreaks();
    },

    // Progress Ring
    renderProgressRing() {
        const rate = habits.getTodayRate();
        document.getElementById('ringPercent').textContent = rate + '%';
        
        const ring = document.getElementById('progressRing');
        const circumference = 2 * Math.PI * 70;
        const offset = circumference - (rate / 100) * circumference;
        
        ring.style.strokeDasharray = circumference;
        ring.style.strokeDashoffset = offset;
    },

    // Weekly Bar Chart
    renderWeeklyChart() {
        const canvas = document.getElementById('weeklyChart');
        if(!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Get weekly data (last 7 days)
        const data = this.getWeeklyData();
        
        // Chart settings
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        const barWidth = chartWidth / data.length;
        const maxValue = 100;

        // Get colors from CSS
        const styles = getComputedStyle(document.documentElement);
        const accent = styles.getPropertyValue('--accent').trim();
        const textMuted = styles.getPropertyValue('--text-muted').trim();
        const border = styles.getPropertyValue('--border').trim();

        // Draw grid lines
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        for(let i = 0; i <= 4; i++) {
            const y = padding + (chartHeight / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }

        // Draw bars
        data.forEach((item, index) => {
            const x = padding + index * barWidth + barWidth * 0.2;
            const barHeight = (item.rate / maxValue) * chartHeight;
            const y = height - padding - barHeight;
            const barActualWidth = barWidth * 0.6;

            // Draw bar
            ctx.fillStyle = item.isToday ? accent : accent + '80';
            ctx.fillRect(x, y, barActualWidth, barHeight);

            // Draw day label
            ctx.fillStyle = item.isToday ? accent : textMuted;
            ctx.font = '12px -apple-system, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(item.day, x + barActualWidth / 2, height - padding + 20);

            // Draw value
            if(item.rate > 0) {
                ctx.fillStyle = textMuted;
                ctx.font = '10px -apple-system, sans-serif';
                ctx.fillText(item.rate + '%', x + barActualWidth / 2, y - 5);
            }
        });

        // Draw y-axis labels
        ctx.fillStyle = textMuted;
        ctx.font = '11px -apple-system, sans-serif';
        ctx.textAlign = 'right';
        for(let i = 0; i <= 4; i++) {
            const value = 100 - (i * 25);
            const y = padding + (chartHeight / 4) * i;
            ctx.fillText(value + '%', padding - 10, y + 4);
        }
    },

    // Monthly Line Chart
    renderMonthlyChart() {
        const canvas = document.getElementById('monthlyChart');
        if(!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Get monthly data
        const data = this.getMonthlyData();
        
        if(data.length === 0) {
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim();
            ctx.font = '14px -apple-system, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('No data for this month yet', width / 2, height / 2);
            return;
        }

        // Chart settings
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        const maxValue = 100;

        const styles = getComputedStyle(document.documentElement);
        const accent = styles.getPropertyValue('--accent').trim();
        const success = styles.getPropertyValue('--success').trim();
        const textMuted = styles.getPropertyValue('--text-muted').trim();
        const border = styles.getPropertyValue('--border').trim();

        // Draw grid
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        for(let i = 0; i <= 4; i++) {
            const y = padding + (chartHeight / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }

        // Calculate points
        const points = data.map((item, index) => {
            const x = padding + (index / (data.length - 1)) * chartWidth;
            const y = height - padding - (item.rate / maxValue) * chartHeight;
            return { x, y, ...item };
        });

        // Draw line
        ctx.strokeStyle = accent;
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        points.forEach((point, index) => {
            if(index === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        });
        ctx.stroke();

        // Draw gradient fill
        ctx.lineTo(points[points.length - 1].x, height - padding);
        ctx.lineTo(padding, height - padding);
        ctx.closePath();
        
        const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
        gradient.addColorStop(0, accent + '40');
        gradient.addColorStop(1, accent + '00');
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw points
        points.forEach(point => {
            ctx.fillStyle = point.isToday ? success : accent;
            ctx.beginPath();
            ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw y-axis labels
        ctx.fillStyle = textMuted;
        ctx.font = '11px -apple-system, sans-serif';
        ctx.textAlign = 'right';
        for(let i = 0; i <= 4; i++) {
            const value = 100 - (i * 25);
            const y = padding + (chartHeight / 4) * i;
            ctx.fillText(value + '%', padding - 10, y + 4);
        }

        // Draw x-axis labels (show every 5 days)
        ctx.textAlign = 'center';
        points.forEach((point, index) => {
            if(index % 5 === 0 || index === points.length - 1) {
                ctx.fillText(point.day, point.x, height - padding + 20);
            }
        });
    },

    // Get weekly data (last 7 days)
    getWeeklyData() {
        const data = [];
        const today = new Date();
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        for(let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateKey = utils.dateKey(date);
            
            let completed = 0;
            habits.state.habits.forEach(h => {
                if(habits.state.completions[`${h.id}-${dateKey}`]) completed++;
            });
            
            const rate = habits.state.habits.length > 0 
                ? Math.round((completed / habits.state.habits.length) * 100) 
                : 0;
            
            data.push({
                day: dayNames[date.getDay()],
                rate: rate,
                isToday: i === 0
            });
        }
        return data;
    },

    // Get monthly data (all days in current month)
    getMonthlyData() {
        const data = [];
        const { currentYear, currentMonth } = habits.state;
        const today = new Date();
        const daysInMonth = utils.daysInMonth(currentYear, currentMonth);
        
        // Only show data up to today if viewing current month
        const maxDay = (today.getMonth() === currentMonth && today.getFullYear() === currentYear)
            ? today.getDate()
            : daysInMonth;

        for(let d = 1; d <= maxDay; d++) {
            const dateKey = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            
            let completed = 0;
            habits.state.habits.forEach(h => {
                if(habits.state.completions[`${h.id}-${dateKey}`]) completed++;
            });
            
            const rate = habits.state.habits.length > 0 
                ? Math.round((completed / habits.state.habits.length) * 100) 
                : 0;
            
            data.push({
                day: d,
                rate: rate,
                isToday: utils.isToday(currentYear, currentMonth, d)
            });
        }
        return data;
    },

    // Render top streaks
    renderTopStreaks() {
        const container = document.getElementById('topStreaks');
        if(!container) return;

        const streaks = habits.state.habits
            .map(h => ({
                ...h,
                streak: habits.calculateStreak(h.id)
            }))
            .filter(h => h.streak > 0)
            .sort((a, b) => b.streak - a.streak)
            .slice(0, 5);

        if(streaks.length === 0) {
            container.innerHTML = '<div class="empty" style="padding:2rem 1rem;"><p>Complete habits to build streaks!</p></div>';
            return;
        }

        container.innerHTML = streaks.map(item => `
            <div class="streak-item">
                <span class="streak-emoji">${item.emoji}</span>
                <div class="streak-info">
                    <div class="streak-name">${item.name}</div>
                    <div class="streak-days">Current streak</div>
                </div>
                <div class="streak-badge">🔥 ${item.streak}</div>
            </div>
        `).join('');
    }
};
