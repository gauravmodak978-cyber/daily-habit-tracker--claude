// Main App Initialization

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    theme.init();
    auth.checkSession();
});
