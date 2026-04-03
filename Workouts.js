// Workout history array
// stores all logged workouts
let workoutHistory = [];

// Chart data arrays
// stores volume for each day
let chartLabels = [];
let chartData = [];

// ── Limit chart to last 15 items to prevent overflow ──
const MAX_CHART_ITEMS = 15;

function trimChartData() {
    if (chartLabels.length > MAX_CHART_ITEMS) {
        chartLabels = chartLabels.slice(-MAX_CHART_ITEMS);
        chartData = chartData.slice(-MAX_CHART_ITEMS);
    }
}

// Log workout function
function logWorkout() {
    // get values from inputs
    const name = document.getElementById('exercise-name').value.trim();
    const sets = parseInt(document.getElementById('exercise-sets').value) || 0;
    const reps = parseInt(document.getElementById('exercise-reps').value) || 0;
    const weight = parseInt(document.getElementById('exercise-weight').value) || 0;
    const duration = parseInt(document.getElementById('exercise-duration').value) || 0;
    const calories = parseInt(document.getElementById('exercise-calories').value) || 0;

    // make sure exercise name is filled
    if (!name) {
        alert('Please enter an exercise name');
        return;
    }

    // calculate volume — sets x reps x weight
    const volume = sets * reps * weight;

    // create workout object
    const workout = {
        name,
        sets: sets,
        reps: reps,
        weight: weight,
        duration: duration,
        calories: calories,
        volume: volume,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };

    // add to history array (limit to 50 items to prevent history overflow)
    workoutHistory.unshift(workout);
    if (workoutHistory.length > 50) {
        workoutHistory.pop();
    }

    // update chart
    chartLabels.push(workout.time);
    chartData.push(volume);
    trimChartData();

    if (workoutChart) {
        workoutChart.data.labels = [...chartLabels];
        workoutChart.data.datasets[0].data = [...chartData];
        workoutChart.update();
    }

    // update history list
    renderHistory();

    // clear inputs
    document.getElementById('exercise-name').value = '';
    document.getElementById('exercise-sets').value = '';
    document.getElementById('exercise-reps').value = '';
    document.getElementById('exercise-weight').value = '';
    document.getElementById('exercise-duration').value = '';
    document.getElementById('exercise-calories').value = '';

    // re-run lucide icons for the new items
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Render history list
function renderHistory() {
    const list = document.getElementById('history-list');

    if (!list) return;

    if (workoutHistory.length === 0) {
        list.innerHTML = '<span class="history-empty">No workouts logged yet.</span>';
        return;
    }

    // loop through history and build HTML (limit to last 20 shown)
    const recentWorkouts = workoutHistory.slice(0, 20);
    list.innerHTML = recentWorkouts.map(w => `
        <div class="history-item">
            <span class="history-item-name">${escapeHtml(w.name)}</span>
            <span class="history-item-details">
                ${w.sets} sets × ${w.reps} reps × ${w.weight}kg
                ${w.duration ? '· ' + w.duration + ' min' : ''}
                ${w.calories ? '· ' + w.calories + ' kcal' : ''}
                · ${w.time}
            </span>
        </div>
    `).join('');
}

// Helper function to prevent XSS
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Clear history
function clearHistory() {
    workoutHistory = [];
    chartLabels = [];
    chartData = [];
    if (workoutChart) {
        workoutChart.data.labels = [];
        workoutChart.data.datasets[0].data = [];
        workoutChart.update();
    }
    renderHistory();
}

// Chart setup
let workoutChart = null;

function initChart() {
    const canvas = document.getElementById('workoutChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    workoutChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartLabels,
            datasets: [{
                data: chartData,
                borderColor: '#8c71ff',
                borderWidth: 2,
                pointRadius: 3,
                pointBackgroundColor: '#8c71ff',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 1,
                fill: true,
                backgroundColor: 'rgba(140,113,255,0.1)',
                tension: 0.4,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: true }
            },
            scales: {
                x: {
                    ticks: { color: '#555566', font: { size: 11 }, maxRotation: 45, minRotation: 45 },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                },
                y: {
                    ticks: { color: '#555566', font: { size: 11 } },
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    title: { display: true, text: 'Volume (kg)', color: '#888899', font: { size: 10 } }
                }
            }
        }
    });
}

// Theme toggle handler
function handleThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

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
            if (workoutChart) {
                workoutChart.options.scales.x.ticks.color = '#111114';
                workoutChart.options.scales.y.ticks.color = '#111114';
                workoutChart.options.scales.x.grid.color = 'rgba(0,0,0,0.08)';
                workoutChart.options.scales.y.grid.color = 'rgba(0,0,0,0.08)';
                workoutChart.data.datasets[0].backgroundColor = 'rgba(140,113,255,0.1)';
                workoutChart.update();
            }
        } else {
            document.body.classList.remove('light');
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            if (workoutChart) {
                workoutChart.options.scales.x.ticks.color = '#555566';
                workoutChart.options.scales.y.ticks.color = '#555566';
                workoutChart.options.scales.x.grid.color = 'rgba(255,255,255,0.05)';
                workoutChart.options.scales.y.grid.color = 'rgba(255,255,255,0.05)';
                workoutChart.data.datasets[0].backgroundColor = 'rgba(255,255,255,0.08)';
                workoutChart.update();
            }
        }
    });
}

// Page load
document.addEventListener('DOMContentLoaded', function() {
    initChart();
    handleThemeToggle();
    renderHistory();
});