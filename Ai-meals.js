document.addEventListener('DOMContentLoaded', function() {
// THEME TOGGLE CODE (ADD THIS INSIDE)
const themeToggle = document.getElementById('theme-toggle');

if (themeToggle) {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'light') {
        themeToggle.checked = true;
        document.body.classList.add('light');
        document.body.classList.remove('dark');
    } else {
        themeToggle.checked = false;
        document.body.classList.add('dark');
        document.body.classList.remove('light');
    }

    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.remove('dark');
            document.body.classList.add('light');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light');
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    });
}
});
