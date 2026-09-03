// Base de datos local de personajes para VS Code
const characters = {
    thor: { name: "Thor", power: 95, speed: 85, resistance: 98, intelligence: 80, skills: 90 },
    strange: { name: "Doctor Strange", power: 90, speed: 75, resistance: 75, intelligence: 98, skills: 95 },
    doom: { name: "Doctor Doom", power: 96, speed: 80, resistance: 90, intelligence: 100, skills: 92 },
    wolverine: { name: "Wolverine", power: 85, speed: 80, resistance: 99, intelligence: 70, skills: 88 }
};

const select1 = document.getElementById('fighter1-select');
const select2 = document.getElementById('fighter2-select');
const resultSection = document.getElementById('result-section');
const score1Text = document.getElementById('score1-text');
const score2Text = document.getElementById('score2-text');
const winnerText = document.getElementById('winner-text');

// Llenar los selectores automáticamente
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

// Configuración inicial del Gráfico de Radar con Chart.js
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

// Actualizar datos al cambiar de selección
function updateComparison() {
    const char1 = characters[select1.value];
    const char2 = characters[select2.value];

    let data1 = [0, 0, 0, 0, 0];
    let data2 = [0, 0, 0, 0, 0];

    if (char1) {
        data1 = [char1.power, char1.speed, char1.resistance, char1.intelligence, char1.skills];
    }
    if (char2) {
        data2 = [char2.power, char2.speed, char2.resistance, char2.intelligence, char2.skills];
    }

    radarChart.data.datasets[0].data = data1;
    radarChart.data.datasets[1].data = data2;
    radarChart.update();

    // Calcular ganador si ambos están seleccionados
    if (char1 && char2) {
        if (select1.value === select2.value) {
            resultSection.classList.add('hidden');
            return;
        }

        const score1 = (char1.power * 0.3) + (char1.resistance * 0.2) + (char1.speed * 0.15) + (char1.intelligence * 0.15) + (char1.skills * 0.2);
        const score2 = (char2.power * 0.3) + (char2.resistance * 0.2) + (char2.speed * 0.15) + (char2.intelligence * 0.15) + (char2.skills * 0.2);

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

// Inicializar selectores al cargar la página
populateSelects();