// Modals Management

const modals = {
    openAdd() {
        document.getElementById('habitName').value = '';
        habits.selectedEmoji = '💪';
        habits.generateEmojiGrid();
        document.getElementById('addModal').classList.add('active');
    },

    openStats() {
        stats.render();
        document.getElementById('statsModal').classList.add('active');
    },

    openSettings() {
        const users = storage.getUsers();
        document.getElementById('settingsUserCount').textContent = Object.keys(users).length;
        
        const list = document.getElementById('userList');
        list.innerHTML = Object.keys(users).map(u => {
            const isCurrent = u === auth.currentUser;
            return `
                <div class="user-item">
                    <div class="user-info">
                        <div class="avatar">${u.charAt(0).toUpperCase()}</div>
                        <span>${u}${isCurrent ? ' (You)' : ''}</span>
                    </div>
                    ${!isCurrent ? `<button class="del-btn" onclick="settings.deleteUser('${u}')">🗑️</button>` : ''}
                </div>
            `;
        }).join('');

        document.getElementById('settingsModal').classList.add('active');
    },

    close(id) {
        document.getElementById(id).classList.remove('active');
    }
};
