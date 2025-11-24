// Habits Management

const habits = {
    state: {
        habits: [],
        completions: {},
        currentMonth: new Date().getMonth(),
        currentYear: new Date().getFullYear(),
        currentWeek: 1
    },

    emojis: ['💪','📚','🏃','💧','🧘','✍️','🎯','💤','🥗','💊','🚫','📱','🧠','🎨','💰','🌅','🚿','📝','🎵','🌿'],
    selectedEmoji: '💪',

    loadData() {
        const userData = storage.getUserData(auth.currentUser);
        if(userData) {
            this.state.habits = userData.habits || [];
            this.state.completions = userData.completions || {};
        }

        // Add default habits if none exist
        if(this.state.habits.length === 0) {
            this.state.habits = [
                {id:1, name:'Morning Run', emoji:'🏃'},
                {id:2, name:'Read 30min', emoji:'📚'},
                {id:3, name:'Drink Water', emoji:'💧'}
            ];
            this.saveData();
        }

        // Set current week
        const today = new Date();
        this.state.currentWeek = utils.getWeekOfMonth(today);

        this.generateEmojiGrid();
    },

    saveData() {
        const userData = storage.getUserData(auth.currentUser);
        userData.habits = this.state.habits;
        userData.completions = this.state.completions;
        storage.saveUserData(auth.currentUser, userData);
    },

    calculateStreak(habitId) {
        let streak = 0;
        let date = new Date();
        while(true) {
            const key = `${habitId}-${utils.dateKey(date)}`;
            if(this.state.completions[key]) {
                streak++;
                date.setDate(date.getDate() - 1);
            } else break;
        }
        return streak;
    },

    getMonthlyRate() {
        if(this.state.habits.length === 0) return 0;
        const now = new Date();
        const days = now.getMonth() === this.state.currentMonth && now.getFullYear() === this.state.currentYear
            ? now.getDate()
            : utils.daysInMonth(this.state.currentYear, this.state.currentMonth);
        
        let total = 0, completed = 0;
        this.state.habits.forEach(h => {
            for(let d = 1; d <= days; d++) {
                const dateKey = `${this.state.currentYear}-${String(this.state.currentMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
                total++;
                if(this.state.completions[`${h.id}-${dateKey}`]) completed++;
            }
        });
        return total > 0 ? Math.round((completed/total)*100) : 0;
    },

    getTodayRate() {
        if(this.state.habits.length === 0) return 0;
        const today = utils.dateKey(new Date());
        let completed = 0;
        this.state.habits.forEach(h => {
            if(this.state.completions[`${h.id}-${today}`]) completed++;
        });
        return Math.round((completed/this.state.habits.length)*100);
    },

    getWeekDays() {
        const { currentYear, currentMonth, currentWeek } = this.state;
        const range = utils.getWeekRange(currentYear, currentMonth, currentWeek);
        const days = [];

        for(let d = range.start; d <= range.end; d++) {
            const date = new Date(currentYear, currentMonth, d);
            days.push({
                date: date,
                key: utils.dateKey(date),
                name: utils.dayName(date.getDay()),
                num: d,
                isToday: utils.isToday(currentYear, currentMonth, d),
                isFuture: utils.isFuture(currentYear, currentMonth, d)
            });
        }

        return days;
    },

    changeMonth(delta) {
        this.state.currentMonth += delta;
        if(this.state.currentMonth > 11) {
            this.state.currentMonth = 0;
            this.state.currentYear++;
        } else if(this.state.currentMonth < 0) {
            this.state.currentMonth = 11;
            this.state.currentYear--;
        }
        this.state.currentWeek = 1;
        this.renderAll();
    },

    changeWeek(delta) {
        const totalWeeks = utils.getTotalWeeks(this.state.currentYear, this.state.currentMonth);
        this.state.currentWeek += delta;
        
        if(this.state.currentWeek > totalWeeks) {
            this.state.currentWeek = 1;
            this.changeMonth(1);
        } else if(this.state.currentWeek < 1) {
            this.changeMonth(-1);
            this.state.currentWeek = utils.getTotalWeeks(this.state.currentYear, this.state.currentMonth);
        } else {
            this.renderAll();
        }
    },

    renderAll() {
        this.renderStats();
        this.renderHabits();
        this.renderNavigation();
    },

    renderNavigation() {
        document.getElementById('monthName').textContent = 
            `${utils.monthName(this.state.currentMonth)} ${this.state.currentYear}`;
        
        const totalWeeks = utils.getTotalWeeks(this.state.currentYear, this.state.currentMonth);
        const range = utils.getWeekRange(this.state.currentYear, this.state.currentMonth, this.state.currentWeek);
        document.getElementById('weekInfo').textContent = 
            `Week ${this.state.currentWeek}/${totalWeeks} (${range.start}-${range.end})`;
    },

    renderStats() {
        document.getElementById('statTotal').textContent = this.state.habits.length;
        
        const today = utils.dateKey(new Date());
        let completedToday = 0;
        this.state.habits.forEach(h => {
            if(this.state.completions[`${h.id}-${today}`]) completedToday++;
        });
        document.getElementById('statToday').textContent = completedToday;
        
        const bestStreak = Math.max(...this.state.habits.map(h => this.calculateStreak(h.id)), 0);
        document.getElementById('statStreak').textContent = bestStreak;
        
        document.getElementById('statMonth').textContent = this.getMonthlyRate() + '%';
    },

    renderHabits() {
        const container = document.getElementById('habits');
        const weekDays = this.getWeekDays();
        
        if(this.state.habits.length === 0) {
            container.innerHTML = '<div class="empty"><div class="empty-icon">📋</div><p>No habits yet!</p></div>';
            return;
        }

        let html = '';
        this.state.habits.forEach(h => {
            const streak = this.calculateStreak(h.id);
            
            // Calculate progress for current week
            let completed = 0;
            weekDays.forEach(day => {
                if(this.state.completions[`${h.id}-${day.key}`]) completed++;
            });
            const progress = weekDays.length > 0 ? Math.round((completed/weekDays.length)*100) : 0;

            html += `
                <div class="habit">
                    <div class="habit-top">
                        <div class="habit-icon">${h.emoji}</div>
                        <div class="habit-info">
                            <div class="habit-name">${h.name}</div>
                            <div class="habit-streak ${streak > 0 ? 'active' : ''}">🔥 ${streak} days</div>
                        </div>
                        <button class="del-btn" onclick="habits.deleteHabit(${h.id})">🗑️</button>
                    </div>
                    <div class="progress-wrap">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width:${progress}%"></div>
                        </div>
                        <div class="progress-text">${progress}%</div>
                    </div>
                    <div class="week">
                        ${weekDays.map(day => {
                            const key = `${h.id}-${day.key}`;
                            const checked = this.state.completions[key];
                            return `
                                <div class="day">
                                    <div class="day-label ${day.isToday ? 'today' : ''}">${day.name}</div>
                                    <button class="check ${checked ? 'checked' : ''} ${day.isFuture ? 'future' : ''}"
                                            onclick="habits.toggleCheck(${h.id}, '${day.key}')"></button>
                                    <div class="day-num">${day.num}</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        });

        html += '<button class="add-btn" onclick="modals.openAdd()"><span style="font-size:1.5rem;">+</span> Add Habit</button>';
        container.innerHTML = html;
    },

    toggleCheck(habitId, dateKey) {
        const key = `${habitId}-${dateKey}`;
        this.state.completions[key] = !this.state.completions[key];
        this.saveData();
        this.renderAll();
    },

    generateEmojiGrid() {
        const grid = document.getElementById('emojiGrid');
        if(!grid) return;
        grid.innerHTML = this.emojis.map(e => `
            <button type="button" class="emoji ${e === this.selectedEmoji ? 'selected' : ''}" 
                    onclick="habits.selectEmoji('${e}')">${e}</button>
        `).join('');
    },

    selectEmoji(emoji) {
        this.selectedEmoji = emoji;
        document.querySelectorAll('.emoji').forEach(btn => {
            btn.classList.toggle('selected', btn.textContent === emoji);
        });
    },

    save(e) {
        e.preventDefault();
        const name = document.getElementById('habitName').value.trim();
        if(!name) return;

        this.state.habits.push({
            id: Date.now(),
            name: name,
            emoji: this.selectedEmoji
        });

        this.saveData();
        modals.close('addModal');
        this.renderAll();
    },

    deleteHabit(id) {
        if(!confirm('Delete this habit?')) return;
        
        this.state.habits = this.state.habits.filter(h => h.id !== id);
        Object.keys(this.state.completions).forEach(k => {
            if(k.startsWith(`${id}-`)) delete this.state.completions[k];
        });
        this.saveData();
        this.renderAll();
    }
};
