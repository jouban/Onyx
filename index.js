// water intake called by index.html outside content_loaded
let waterIntake = 0;

function addWater(amount) {
    waterIntake += amount;
    // divide by 1000 to convert ml to liters
    // toFixed(2) always shows 2 decimal places e.g. 1.25L
    document.getElementById('water-val').textContent = (waterIntake / 1000).toFixed(2);
}

// load the index.html page
document.addEventListener('DOMContentLoaded', function() {

    // Random number helper function
    // min and max ranges for the number to be between
    function randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // Consistency
    // set id="consistency-val" with a random number between 1 and 30
    const consistencyEl = document.getElementById('consistency-val');
    if (consistencyEl) {
        consistencyEl.textContent = randomBetween(1, 30);
    }

    // Calories
    // toLocaleString() adds commas
    const caloriesEl = document.getElementById('calories-val');
    if (caloriesEl) {
        caloriesEl.textContent = randomBetween(1800, 3500).toLocaleString();
    }

    // Sleep
    // dividing by 10 / toFixed(1) ensures there is always 1 decimal place
    const sleepEl = document.getElementById('sleep-val');
    if (sleepEl) {
        sleepEl.textContent = (randomBetween(50, 90) / 10).toFixed(1);
    }

    // Gross Volume
    const volumeEl = document.getElementById('gross-val');
    if (volumeEl) {
        volumeEl.textContent = randomBetween(10000, 50000).toLocaleString();
    }
   
    // Pulse streak | same val as consistency
    const streakEl = document.getElementById('streak-val');
    if (streakEl && consistencyEl) {
        streakEl.textContent = consistencyEl.textContent;
    }
    // Theme toggle
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
                // update chart colors for light mode
                intensityChart.options.scales.x.ticks.color = '#111114';
                intensityChart.options.scales.x.grid.color = 'rgba(0,0,0,0.08)';
                intensityChart.data.datasets[0].backgroundColor = 'rgba(140,113,255,0.1)';
                intensityChart.update();
            } else {
                document.body.classList.remove('light');
                document.body.classList.add('dark');
                localStorage.setItem('theme', 'dark');
                // update chart colors for dark mode
                intensityChart.options.scales.x.ticks.color = '#555566';
                intensityChart.options.scales.x.grid.color = 'rgba(255,255,255,0.05)';
                intensityChart.data.datasets[0].backgroundColor = 'rgba(255,255,255,0.08)';
                intensityChart.update();
            }
        });
    } // Close for the themeToggle if {} block

    // chart random val generator
    function randomChartData(){
        return Array.from({length:9}, () => randomBetween(20, 100));
    }

    const ctx = document.getElementById('intensityChart').getContext('2d');

    const intensityChart = new Chart(ctx, {
        type: 'line',
        data: {
            // days of the week
            labels: ['Tue','Sun','Fri','Wed','Mon','Sat','Thu','Tue','Sun'],
            datasets: [{
                data: randomChartData(),
                borderColor: '#8c71ff',
                borderWidth: 2,
                pointRadius: 0,
                fill: true,
                backgroundColor: 'rgba(255,255,255,0.08)',
                tension: 0.4,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#555566',
                        font: {
                            size: 12.5,
                            family: 'system-ui',
                            style: 'normal'
                        }
                    },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                },
                y: {
                    display: false
                }
            }
        }
    });
}); // Close for the DOMContentLoaded event listener