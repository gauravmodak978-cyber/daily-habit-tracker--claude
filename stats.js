// Statistics Module with Advanced Charts and Filtering

const stats = {
    currentFilter: {
        habitId: 'all',
        chartType: 'all'
    },

    // Initialize statistics modal
    render() {
        this.populateHabitFilter();
        this.applyFilters();
    },

    // Populate habit filter dropdown
    populateHabitFilter() {
        const select = document.getElementById('habitFilter');
        if(!select) return;

        let options = '<option value="all">All Habits</option>';
        habits.state.habits.forEach(h => {
            options += `<option value="${h.id}">${h.emoji} ${h.name}</option>`;
        });
        select.innerHTML = options;
    },

    // Apply filters and show selected charts
    applyFilters() {
        this.currentFilter.habitId = document.getElementById('habitFilter')?.value || 'all';
        this.currentFilter.chartType = document.getElementById('chartType')?.value || 'all';

        // Hide all sections
        document.querySelectorAll('.stats-section').forEach(section => {
            section.classList.add('hidden');
        });

        // Show selected sections
        const chartType = this.currentFilter.chartType;
        
        if(chartType === 'all') {
            this.renderProgressRing();
            this.renderWeeklyChart();
            this.renderMonthlyChart();
            this.renderHeatmap();
            this.renderComparison();
            this.renderStreaksChart();
            this.renderTopStreaks();
            document.querySelectorAll('.stats-section').forEach(section => {
                section.classList.remove('hidden');
            });
        } else {
            switch(chartType) {
                case 'progress':
                    document.getElementById('progressSection').classList.remove('hidden');
                    this.renderProgressRing();
                    break;
                case 'weekly':
                    document.getElementById('weeklySection').classList.remove('hidden');
                    this.renderWeeklyChart();
                    break;
                case 'monthly':
                    document.getElementById('monthlySection').classList.remove('hidden');
                    this.renderMonthlyChart();
                    break;
                case 'heatmap':
                    document.getElementById('heatmapSection').classList.remove('hidden');
                    this.renderHeatmap();
                    break;
                case 'comparison':
                    document.getElementById('comparisonSection').classList.remove('hidden');
                    this.renderComparison();
                    break;
                case 'streaks':
                    document.getElementById('streaksChartSection').classList.remove('hidden');
                    this.renderStreaksChart();
                    document.getElementById('topStreaksSection').classList.remove('hidden');
                    this.renderTopStreaks();
                    break;
            }
        }
    },

    // Get filtered habits
    getFilteredHabits() {
        if(this.currentFilter.habitId === 'all') {
            return habits.state.habits;
        }
        return habits.state.habits.filter(h => h.id == this.currentFilter.habitId);
    },

    // Progress Ring
    renderProgressRing() {
        const filteredHabits = this.getFilteredHabits();
        if(filteredHabits.length === 0) return;

        const today = utils.dateKey(new Date());
        let completed = 0;
        
        filteredHabits.forEach(h => {
            if(habits.state.completions[`${h.id}-${today}`]) completed++;
        });

        const rate = Math.round((completed / filteredHabits.length) * 100);
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

        ctx.clearRect(0, 0, width, height);

        const data = this.getWeeklyData();
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        const barWidth = chartWidth / data.length;
        const maxValue = 100;

        const styles = getComputedStyle(document.documentElement);
        const accent = styles.getPropertyValue('--accent').trim();
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

        // Draw bars
        data.forEach((item, index) => {
            const x = padding + index * barWidth + barWidth * 0.2;
            const barHeight = (item.rate / maxValue) * chartHeight;
            const y = height - padding - barHeight;
            const barActualWidth = barWidth * 0.6;

            ctx.fillStyle = item.isToday ? accent : accent + '80';
            ctx.fillRect(x, y, barActualWidth, barHeight);

            ctx.fillStyle = item.isToday ? accent : textMuted;
            ctx.font = '12px -apple-system, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(item.day, x + barActualWidth / 2, height - padding + 20);

            if(item.rate > 0) {
                ctx.fillStyle = textMuted;
                ctx.font = '10px -apple-system, sans-serif';
                ctx.fillText(item.rate + '%', x + barActualWidth / 2, y - 5);
            }
        });

        // Y-axis labels
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

        ctx.clearRect(0, 0, width, height);

        const data = this.getMonthlyData();
        
        if(data.length === 0) {
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim();
            ctx.font = '14px -apple-system, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('No data for this month yet', width / 2, height / 2);
            return;
        }

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
            if(index === 0) ctx.moveTo(point.x, point.y);
            else ctx.lineTo(point.x, point.y);
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

        // Y-axis labels
        ctx.fillStyle = textMuted;
        ctx.font = '11px -apple-system, sans-serif';
        ctx.textAlign = 'right';
        for(let i = 0; i <= 4; i++) {
            const value = 100 - (i * 25);
            const y = padding + (chartHeight / 4) * i;
            ctx.fillText(value + '%', padding - 10, y + 4);
        }

        // X-axis labels
        ctx.textAlign = 'center';
        points.forEach((point, index) => {
            if(index % 5 === 0 || index === points.length - 1) {
                ctx.fillText(point.day, point.x, height - padding + 20);
            }
        });
    },

    // Heatmap Calendar
    renderHeatmap() {
        const canvas = document.getElementById('heatmapChart');
        if(!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);

        const { currentYear, currentMonth } = habits.state;
        const daysInMonth = utils.daysInMonth(currentYear, currentMonth);
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        
        const cellSize = 45;
        const padding = 40;
        const cols = 7;
        const rows = Math.ceil((daysInMonth + firstDay) / 7);

        const styles = getComputedStyle(document.documentElement);
        const success = styles.getPropertyValue('--success').trim();
        const textMuted = styles.getPropertyValue('--text-muted').trim();
        const border = styles.getPropertyValue('--border').trim();
        const bgTertiary = styles.getPropertyValue('--bg-tertiary').trim();

        // Draw day labels
        ctx.fillStyle = textMuted;
        ctx.font = '11px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        dayNames.forEach((day, index) => {
            ctx.fillText(day, padding + index * cellSize + cellSize / 2, 25);
        });

        // Draw calendar cells
        const filteredHabits = this.getFilteredHabits();
        
        for(let day = 1; day <= daysInMonth; day++) {
            const pos = day + firstDay - 1;
            const row = Math.floor(pos / 7);
            const col = pos % 7;
            
            const x = padding + col * cellSize;
            const y = 35 + row * cellSize;

            // Calculate completion rate for this day
            const dateKey = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
            let completed = 0;
            
            filteredHabits.forEach(h => {
                if(habits.state.completions[`${h.id}-${dateKey}`]) completed++;
            });

            const rate = filteredHabits.length > 0 ? completed / filteredHabits.length : 0;

            // Color based on completion rate
            let color;
            if(rate === 0) {
                color = bgTertiary;
            } else if(rate < 0.33) {
                color = success + '30';
            } else if(rate < 0.66) {
                color = success + '60';
            } else {
                color = success;
            }

            // Draw cell
            ctx.fillStyle = color;
            ctx.fillRect(x + 2, y + 2, cellSize - 4, cellSize - 4);
            ctx.strokeStyle = border;
            ctx.strokeRect(x + 2, y + 2, cellSize - 4, cellSize - 4);

            // Draw day number
            ctx.fillStyle = rate > 0.66 ? '#ffffff' : textMuted;
            ctx.font = '13px -apple-system, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(day, x + cellSize / 2, y + cellSize / 2);
        }

        // Draw legend
        ctx.fillStyle = textMuted;
        ctx.font = '11px -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Less', padding, height - 10);
        
        const legendX = padding + 35;
        const legendColors = [bgTertiary, success + '30', success + '60', success];
        legendColors.forEach((color, index) => {
            ctx.fillStyle = color;
            ctx.fillRect(legendX + index * 18, height - 20, 14, 14);
            ctx.strokeStyle = border;
            ctx.strokeRect(legendX + index * 18, height - 20, 14, 14);
        });
        
        ctx.fillStyle = textMuted;
        ctx.textAlign = 'left';
        ctx.fillText('More', legendX + legendColors.length * 18 + 5, height - 10);
    },

    // Habits Comparison Chart (Horizontal Bar Chart)
    renderComparison() {
        const canvas = document.getElementById('comparisonChart');
        if(!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);

        const filteredHabits = this.getFilteredHabits();
        if(filteredHabits.length === 0) return;

        // Calculate completion rates for each habit
        const today = new Date();
        const daysToCheck = 30; // Last 30 days
        
        const habitData = filteredHabits.map(h => {
            let completed = 0;
            for(let i = 0; i < daysToCheck; i++) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dateKey = utils.dateKey(date);
                if(habits.state.completions[`${h.id}-${dateKey}`]) completed++;
            }
            return {
                name: h.name,
                emoji: h.emoji,
                rate: Math.round((completed / daysToCheck) * 100)
            };
        }).sort((a, b) => b.rate - a.rate);

        const padding = { top: 20, right: 60, bottom: 40, left: 120 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;
        const barHeight = Math.min(30, chartHeight / habitData.length - 5);

        const styles = getComputedStyle(document.documentElement);
        const accent = styles.getPropertyValue('--accent').trim();
        const success = styles.getPropertyValue('--success').trim();
        const textMuted = styles.getPropertyValue('--text-muted').trim();

        habitData.forEach((item, index) => {
            const y = padding.top + index * (barHeight + 5);
            const barWidth = (item.rate / 100) * chartWidth;

            // Draw bar
            const gradient = ctx.createLinearGradient(padding.left, 0, padding.left + chartWidth, 0);
            gradient.addColorStop(0, accent);
            gradient.addColorStop(1, success);
            ctx.fillStyle = gradient;
            ctx.fillRect(padding.left, y, barWidth, barHeight);

            // Draw habit name
            ctx.fillStyle = textMuted;
            ctx.font = '12px -apple-system, sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(`${item.emoji} ${item.name}`, padding.left - 10, y + barHeight / 2 + 4);

            // Draw percentage
            ctx.fillStyle = textMuted;
            ctx.textAlign = 'left';
            ctx.fillText(item.rate + '%', padding.left + barWidth + 5, y + barHeight / 2 + 4);
        });

        // Title
        ctx.fillStyle = textMuted;
        ctx.font = '11px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Last 30 Days Completion Rate', width / 2, height - 10);
    },

    // Streaks Over Time Chart
    renderStreaksChart() {
        const canvas = document.getElementById('streaksChart');
        if(!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);

        const filteredHabits = this.getFilteredHabits();
        if(filteredHabits.length === 0) return;

        // Get streak data for last 30 days
        const streakData = this.getStreakHistoryData();
        if(streakData.length === 0) return;

        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        const maxStreak = Math.max(...streakData.map(d => d.maxStreak), 1);

        const styles = getComputedStyle(document.documentElement);
        const warning = styles.getPropertyValue('--warning').trim();
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
        const points = streakData.map((item, index) => {
            const x = padding + (index / (streakData.length - 1)) * chartWidth;
            const y = height - padding - (item.maxStreak / maxStreak) * chartHeight;
            return { x, y, ...item };
        });

        // Draw area
        ctx.beginPath();
        points.forEach((point, index) => {
            if(index === 0) ctx.moveTo(point.x, point.y);
            else ctx.lineTo(point.x, point.y);
        });
        ctx.lineTo(points[points.length - 1].x, height - padding);
        ctx.lineTo(padding, height - padding);
        ctx.closePath();
        
        const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
        gradient.addColorStop(0, warning + '40');
        gradient.addColorStop(1, warning + '10');
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw line
        ctx.strokeStyle = warning;
        ctx.lineWidth = 2;
        ctx.beginPath();
        points.forEach((point, index) => {
            if(index === 0) ctx.moveTo(point.x, point.y);
            else ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();

        // Draw points
        points.forEach(point => {
            ctx.fillStyle = warning;
            ctx.beginPath();
            ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
            ctx.fill();
        });

        // Y-axis labels
        ctx.fillStyle = textMuted;
        ctx.font = '11px -apple-system, sans-serif';
        ctx.textAlign = 'right';
        for(let i = 0; i <= 4; i++) {
            const value = Math.round(maxStreak - (i * maxStreak / 4));
            const y = padding + (chartHeight / 4) * i;
            ctx.fillText(value, padding - 10, y + 4);
        }

        // X-axis labels
        ctx.textAlign = 'center';
        const showEvery = Math.ceil(points.length / 6);
        points.forEach((point, index) => {
            if(index % showEvery === 0) {
                ctx.fillText(point.day, point.x, height - padding + 20);
            }
        });
    },

    // Get streak history data
    getStreakHistoryData() {
        const data = [];
        const today = new Date();
        const filteredHabits = this.getFilteredHabits();
        
        for(let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            let maxStreak = 0;
            filteredHabits.forEach(h => {
                const streak = this.calculateStreakAtDate(h.id, date);
                maxStreak = Math.max(maxStreak, streak);
            });
            
            data.push({
                day: date.getDate(),
                maxStreak: maxStreak
            });
        }
        return data;
    },

    // Calculate streak at specific date
    calculateStreakAtDate(habitId, endDate) {
        let streak = 0;
        let checkDate = new Date(endDate);
        
        while(checkDate >= new Date('2024-01-01')) {
            const key = `${habitId}-${utils.dateKey(checkDate)}`;
            if(habits.state.completions[key]) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else break;
        }
        return streak;
    },

    // Get weekly data (last 7 days)
    getWeeklyData() {
        const data = [];
        const today = new Date();
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const filteredHabits = this.getFilteredHabits();
        
        for(let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateKey = utils.dateKey(date);
            
            let completed = 0;
            filteredHabits.forEach(h => {
                if(habits.state.completions[`${h.id}-${dateKey}`]) completed++;
            });
            
            const rate = filteredHabits.length > 0 
                ? Math.round((completed / filteredHabits.length) * 100) 
                : 0;
            
            data.push({
                day: dayNames[date.getDay()],
                rate: rate,
                isToday: i === 0
            });
        }
        return data;
    },

    // Get monthly data
    getMonthlyData() {
        const data = [];
        const { currentYear, currentMonth } = habits.state;
        const today = new Date();
        const daysInMonth = utils.daysInMonth(currentYear, currentMonth);
        const filteredHabits = this.getFilteredHabits();
        
        const maxDay = (today.getMonth() === currentMonth && today.getFullYear() === currentYear)
            ? today.getDate()
            : daysInMonth;

        for(let d = 1; d <= maxDay; d++) {
            const dateKey = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            
            let completed = 0;
            filteredHabits.forEach(h => {
                if(habits.state.completions[`${h.id}-${dateKey}`]) completed++;
            });
            
            const rate = filteredHabits.length > 0 
                ? Math.round((completed / filteredHabits.length) * 100) 
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

        const filteredHabits = this.getFilteredHabits();
        const streaks = filteredHabits
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
