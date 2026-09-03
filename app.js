const characters = [
    {
        name: "Doctor Doom",
        stats: [98, 85, 95, 100, 92]
    },
    {
        name: "Thor",
        stats: [95, 90, 98, 75, 88]
    },
    {
        name: "Iron Man",
        stats: [88, 85, 85, 98, 90]
    },
    {
        name: "Hulk",
        stats: [96, 75, 100, 60, 70]
    },
    {
        name: "Capitán América",
        stats: [70, 78, 82, 85, 95]
    },
    {
        name: "Doctor Strange",
        stats: [92, 80, 85, 96, 95]
    },
    {
        name: "Mr. Fantastico",
        stats: [75, 80, 88, 99, 90]
    },
    {
        name: "Cyclope",
        stats: [85, 82, 78, 85, 92]
    },
    {
        name: "Profesor X",
        stats: [90, 60, 65, 100, 98]
    },
    {
        name: "Magneto",
        stats: [94, 82, 85, 95, 90]
    },
    {
        name: "Loki",
        stats: [88, 85, 80, 96, 94]
    }
];

const select1 = document.getElementById('fighter1-select');
const select2 = document.getElementById('fighter2-select');
const resultSection = document.getElementById('result-section');
const score1Text = document.getElementById('score1-text');
const score2Text = document.getElementById('score2-text');
const winnerText = document.getElementById('winner-text');

function populateSelects() {
    for (let key in characters) {
        let opt1 = document.createElement('option');
        opt1.value = key;
        opt1.textContent = characters[key].name;
        select1.appendChild(opt1);

        let opt2 = document.createElement('option');
        opt2.value = key;
        opt2.textContent = characters[key].name;
        select2.appendChild(opt2);
    }
}

const ctx = document.getElementById('radarChart').getContext('2d');
const radarChart = new Chart(ctx, {
    type: 'radar',
    data: {
        labels: ['PODER', 'VELOCIDAD', 'RESISTENCIA', 'INTELIGENCIA', 'HABILIDADES'],
        datasets: [
            {
                label: 'Personaje 1',
                data: [0, 0, 0, 0, 0],
                backgroundColor: 'rgba(184, 78, 255, 0.2)',
                borderColor: '#b84eff',
                borderWidth: 2,
            },
            {
                label: 'Personaje 2',
                data: [0, 0, 0, 0, 0],
                backgroundColor: 'rgba(0, 240, 255, 0.1)',
                borderColor: '#00f0ff',
                borderWidth: 2,
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            r: {
                angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                pointLabels: { color: '#757a8b', font: { family: 'Rajdhani', size: 11 } },
                ticks: { display: false, max: 100 }
            }
        },
        plugins: { legend: { display: false } }
    }
});

function updateComparison() {
    const char1 = characters[select1.value];
    const char2 = characters[select2.value];

    let data1 = [0, 0, 0, 0, 0];
    let data2 = [0, 0, 0, 0, 0];

    if (char1) {
        // [PODER, VELOCIDAD, RESISTENCIA, INTELIGENCIA, HABILIDADES]
        data1 = char1.stats;
    }
    if (char2) {
        data2 = char2.stats;
    }

    radarChart.data.datasets[0].data = data1;
    radarChart.data.datasets[1].data = data2;
    radarChart.update();

    if (char1 && char2) {
        if (select1.value === select2.value) {
            resultSection.classList.add('hidden');
            return;
        }

        // Cálculo ponderado usando los índices del array de stats:
        // [0]: Poder, [1]: Velocidad, [2]: Resistencia, [3]: Inteligencia, [4]: Habilidades
        const score1 = (char1.stats[0] * 0.3) + (char1.stats[2] * 0.2) + (char1.stats[1] * 0.15) + (char1.stats[3] * 0.15) + (char1.stats[4] * 0.2);
        const score2 = (char2.stats[0] * 0.3) + (char2.stats[2] * 0.2) + (char2.stats[1] * 0.15) + (char2.stats[3] * 0.15) + (char2.stats[4] * 0.2);

        const total = score1 + score2;
        const percent1 = Math.round((score1 / total) * 100);
        const percent2 = 100 - percent1;

        score1Text.textContent = percent1 + "%";
        score2Text.textContent = percent2 + "%";

        if (score1 > score2) {
            winnerText.textContent = `VICTORIA: ${char1.name.toUpperCase()}`;
        } else {
            winnerText.textContent = `VICTORIA: ${char2.name.toUpperCase()}`;
        }

        resultSection.classList.remove('hidden');
    } else {
        resultSection.classList.add('hidden');
    }
}

select1.addEventListener('change', updateComparison);
select2.addEventListener('change', updateComparison);

populateSelects();