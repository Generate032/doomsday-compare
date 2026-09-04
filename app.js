const characters = [
    { name: "Doctor Doom", stats: [98, 85, 95, 100, 92] },
    { name: "Thor", stats: [95, 90, 98, 75, 88] },
    { name: "Iron Man", stats: [88, 85, 85, 98, 90] },
    { name: "Hulk", stats: [96, 75, 100, 60, 70] },
    { name: "Capitán América", stats: [70, 78, 82, 85, 95] },
    { name: "Doctor Strange", stats: [92, 80, 85, 96, 95] },
    { name: "Mr. Fantastico", stats: [75, 80, 88, 99, 90] },
    { name: "Cyclope", stats: [85, 82, 78, 85, 92] },
    { name: "Profesor X", stats: [90, 60, 65, 100, 98] },
    { name: "Magneto", stats: [94, 82, 85, 95, 90] },
    { name: "Loki", stats: [88, 85, 80, 96, 94] }
];

const select1 = document.getElementById('fighter1-select');
const select2 = document.getElementById('fighter2-select');
const select3 = document.getElementById('fighter3-select');
const select4 = document.getElementById('fighter4-select');

const resultSection = document.getElementById('result-section');
const score1Text = document.getElementById('score1-text');
const score2Text = document.getElementById('score2-text');
const winnerText = document.getElementById('winner-text');

function populateSelects() {
    const selects = [select1, select2, select3, select4];
    selects.forEach(select => {
        for (let key in characters) {
            let opt = document.createElement('option');
            opt.value = key;
            opt.textContent = characters[key].name;
            select.appendChild(opt);
        }
    });
}

const ctx = document.getElementById('radarChart').getContext('2d');
const radarChart = new Chart(ctx, {
    type: 'radar',
    data: {
        labels: ['PODER', 'VELOCIDAD', 'RESISTENCIA', 'INTELIGENCIA', 'HABILIDADES'],
        datasets: [
            {
                label: 'Equipo Héroes (Promedio)',
                data: [0, 0, 0, 0, 0],
                backgroundColor: 'rgba(0, 240, 255, 0.2)',
                borderColor: '#00f0ff',
                borderWidth: 2,
            },
            {
                label: 'Doctor Doom',
                data: characters[0].stats, // Doctor Doom por defecto como rival
                backgroundColor: 'rgba(184, 78, 255, 0.1)',
                borderColor: '#b84eff',
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
    const hero1 = characters[select1.value];
    const hero2 = characters[select2.value];
    const hero3 = characters[select3.value];
    const hero4 = characters[select4.value];

    const selectedHeroes = [hero1, hero2, hero3, hero4].filter(h => h !== undefined);

    if (selectedHeroes.length > 0) {
        // Calcular el promedio de las estadísticas de los héroes seleccionados
        let avgStats = [0, 0, 0, 0, 0];
        selectedHeroes.forEach(hero => {
            for (let i = 0; i < 5; i++) {
                avgStats[i] += hero.stats[i];
            }
        });
        avgStats = avgStats.map(sum => Math.round(sum / selectedHeroes.length));

        radarChart.data.datasets[0].data = avgStats;
        radarChart.update();

        // Si se eligieron los 4, calcular probabilidades contra Doctor Doom (índice 0)
        if (selectedHeroes.length === 4) {
            const doom = characters[0]; // Doctor Doom

            const scoreTeam = (avgStats[0] * 0.3) + (avgStats[2] * 0.2) + (avgStats[1] * 0.15) + (avgStats[3] * 0.15) + (avgStats[4] * 0.2);
            const scoreDoom = (doom.stats[0] * 0.3) + (doom.stats[2] * 0.2) + (doom.stats[1] * 0.15) + (doom.stats[3] * 0.15) + (doom.stats[4] * 0.2);

            const total = scoreTeam + scoreDoom;
            const percentTeam = Math.round((scoreTeam / total) * 100);
            const percentDoom = 100 - percentTeam;

            score1Text.textContent = percentTeam + "%";
            score2Text.textContent = percentDoom + "%";

            if (scoreTeam > scoreDoom) {
                winnerText.textContent = `VICTORIA: ¡EL EQUIPO VENCE A DOOM!`;
            } else {
                winnerText.textContent = `VICTORIA: DOMINIO DE DOOM`;
            }

            resultSection.classList.remove('hidden');
        } else {
            resultSection.classList.add('hidden');
        }
    } else {
        radarChart.data.datasets[0].data = [0, 0, 0, 0, 0];
        radarChart.update();
        resultSection.classList.add('hidden');
    }
}

select1.addEventListener('change', updateComparison);
select2.addEventListener('change', updateComparison);
select3.addEventListener('change', updateComparison);
select4.addEventListener('change', updateComparison);

populateSelects();