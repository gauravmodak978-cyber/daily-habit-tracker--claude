// Settings Module

const settings = {
    changePassword() {
        const newPass = document.getElementById('newPass').value;
        if(newPass.length < 4) {
            alert('Password too short (minimum 4 characters)');
            return;
        }
        
        const userData = storage.getUserData(auth.currentUser);
        userData.passwordHash = utils.hash(newPass);
        storage.saveUserData(auth.currentUser, userData);
        
        document.getElementById('newPass').value = '';
        alert('Password updated successfully!');
    },

    deleteAccount() {
        if(!confirm('Delete your account? All your data will be lost forever.')) return;
        
        storage.deleteUser(auth.currentUser);
        auth.logout();
    },

    deleteUser(username) {
        if(!confirm(`Delete user "${username}"? This cannot be undone.`)) return;
        
        storage.deleteUser(username);
        modals.openSettings();
        auth.updateUserCount();
    },

    exportData() {
        const data = {
            user: auth.currentUser,
            habits: habits.state.habits,
            completions: habits.state.completions,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `habit-flow-${auth.currentUser}-${utils.dateKey(new Date())}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        alert('Data exported successfully!');
    },

    importData() {
        document.getElementById('importFile').click();
    },

    handleImport(event) {
        const file = event.target.files[0];
        if(!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if(!data.habits || !data.completions) {
                    alert('Invalid file format');
                    return;
                }

                if(confirm('Import this data? Your current data will be replaced.')) {
                    habits.state.habits = data.habits;
                    habits.state.completions = data.completions;
                    habits.saveData();
                    habits.renderAll();
                    modals.close('settingsModal');
                    alert('Data imported successfully!');
                }
            } catch(err) {
                alert('Error reading file: ' + err.message);
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    }
};
