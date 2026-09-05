const characters = [
    { name: "Doctor Doom", stats: [98, 85, 95, 100, 92], image: "https://live.staticflickr.com/2938/14584938129_cf3647218b_o.jpg" },
    { name: "Thor", stats: [95, 90, 98, 75, 88], image: "https://i.pinimg.com/736x/40/74/71/40747151783756ff94b39e018048d30e.jpg" },
    { name: "Iron Man", stats: [88, 85, 85, 98, 90], image: "https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=500&auto=format&fit=crop&q=60" },

    {
        name: "Hulk",
        stats: [96, 75, 100, 60, 70],
        image: "https://fotografias-2.larazon.es/assets/videojuegos/2022/11/image-2.1668691576.jpg?height=720&width=1200"
    },
    {
        name: "Capitán América",
        stats: [70, 78, 82, 85, 95],
        image: "https://upload.wikimedia.org/wikipedia/commons/e/eb/Captain_America_%2811641552226%29.jpg"
    },
    {
        name: "Doctor Strange",
        stats: [92, 80, 85, 96, 95],
        image: "https://hdqwalls.com/download/doctor-strange-wallpaper-1920x1080.jpg"
    },
    {
        name: "Mr. Fantastico",
        stats: [75, 80, 88, 99, 90],
        image: "https://upload.wikimedia.org/wikipedia/commons/0/09/Mr_Fantastic_1.jpg"
    },
    {
        name: "Cyclope",
        stats: [85, 82, 78, 85, 92],
        image: "https://live.staticflickr.com/8151/7560668046_429a087537_o.jpg"
    },
    {
        name: "Profesor X",
        stats: [90, 60, 65, 100, 98],
        image: "https://www.edmovieguide.com/images/news/2017/02/patrick-stewart.jpg"
    },
    {
        name: "Magneto",
        stats: [94, 82, 85, 95, 90],
        image: "https://i.kym-cdn.com/photos/images/newsfeed/001/006/204/cf9.jpg"
    },
    {
        name: "Loki",
        stats: [88, 85, 80, 96, 94],
        image: "https://i.kym-cdn.com/photos/images/newsfeed/001/006/204/cf9.jpg"
    }
];

const select1 = document.getElementById('fighter1-select');
const select2 = document.getElementById('fighter2-select');
const select3 = document.getElementById('fighter3-select');
const select4 = document.getElementById('fighter4-select');

const resultSection = document.getElementById('result-section');
const score1Text = document.getElementById('score1-text');
const score2Text = document.getElementById('score2-text');
const winnerText = document.getElementById('winner-text');

// Elementos para la simulación de batalla
const btnComenzar = document.querySelector('.btn-cta');
const battleSimSection = document.getElementById('battle-simulation');
const simStatusText = document.getElementById('sim-status-text');

// Elementos de la galería de personajes
const charactersSection = document.getElementById('characters-section');
const charactersGrid = document.getElementById('characters-grid');

function renderCharactersGallery() {
    if (!charactersGrid) return;
    charactersGrid.innerHTML = '';
    
    characters.forEach(char => {
        const card = document.createElement('div');
        card.className = 'character-card';
        card.innerHTML = `
            <div class="char-img-container">
                <img src="${char.image}" alt="${char.name}" onerror="this.src='https://via.placeholder.com/150?text=Doomsday'">
            </div>
            <div class="char-info">
                <h3>${char.name}</h3>
                <p>Poder: ${char.stats[0]} | Velocidad: ${char.stats[1]}</p>
                <p>Resistencia: ${char.stats[2]} | Inteligencia: ${char.stats[3]}</p>
            </div>
        `;
        charactersGrid.appendChild(card);
    });
}

function populateSelects() {
    const selects = [select1, select2, select3, select4];
    selects.forEach(select => {
        if (!select) return;
        select.innerHTML = '<option value="">Seleccionar</option>';
        for (let key in characters) {
            let opt = document.createElement('option');
            opt.value = key;
            opt.textContent = characters[key].name;
            select.appendChild(opt);
        }
    });
}

const canvasElement = document.getElementById('radarChart');
let radarChart = null;

if (canvasElement) {
    const ctx = canvasElement.getContext('2d');
    radarChart = new Chart(ctx, {
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
                    data: characters[0].stats,
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
}

function updateComparison() {
    if (!select1 || !select2 || !select3 || !select4 || !radarChart) return;

    const hero1 = characters[select1.value];
    const hero2 = characters[select2.value];
    const hero3 = characters[select3.value];
    const hero4 = characters[select4.value];

    const selectedHeroes = [hero1, hero2, hero3, hero4].filter(h => h !== undefined);

    if (selectedHeroes.length > 0) {
        let avgStats = [0, 0, 0, 0, 0];
        selectedHeroes.forEach(hero => {
            for (let i = 0; i < 5; i++) {
                avgStats[i] += hero.stats[i];
            }
        });
        avgStats = avgStats.map(sum => Math.round(sum / selectedHeroes.length));

        radarChart.data.datasets[0].data = avgStats;
        radarChart.update();

        if (selectedHeroes.length === 4) {
            const doom = characters[0];

            const scoreTeam = (avgStats[0] * 0.3) + (avgStats[2] * 0.2) + (avgStats[1] * 0.15) + (avgStats[3] * 0.15) + (avgStats[4] * 0.2);
            const scoreDoom = (doom.stats[0] * 0.3) + (doom.stats[2] * 0.2) + (doom.stats[1] * 0.15) + (doom.stats[3] * 0.15) + (doom.stats[4] * 0.2);

            const total = scoreTeam + scoreDoom;
            const percentTeam = Math.round((scoreTeam / total) * 100);
            const percentDoom = 100 - percentTeam;

            if (score1Text) score1Text.textContent = percentTeam + "%";
            if (score2Text) score2Text.textContent = percentDoom + "%";

            if (winnerText) {
                if (scoreTeam > scoreDoom) {
                    winnerText.textContent = `VICTORIA: ¡EL EQUIPO VENCE A DOOM!`;
                } else {
                    winnerText.textContent = `VICTORIA: DOMINIO DE DOOM`;
                }
            }
        }
    } else {
        radarChart.data.datasets[0].data = [0, 0, 0, 0, 0];
        radarChart.update();
        if (resultSection) resultSection.classList.add('hidden');
    }
}

if (select1) select1.addEventListener('change', updateComparison);
if (select2) select2.addEventListener('change', updateComparison);
if (select3) select3.addEventListener('change', updateComparison);
if (select4) select4.addEventListener('change', updateComparison);

// Lógica del botón de simulación de batalla
if (btnComenzar) {
    btnComenzar.addEventListener('click', () => {
        const hero1 = characters[select1.value];
        const hero2 = characters[select2.value];
        const hero3 = characters[select3.value];
        const hero4 = characters[select4.value];

        const selectedHeroes = [hero1, hero2, hero3, hero4].filter(h => h !== undefined);

        if (selectedHeroes.length < 4) {
            alert("¡Por favor, selecciona los 4 héroes del equipo antes de comenzar la batalla!");
            return;
        }

        if (resultSection) resultSection.classList.add('hidden');
        if (battleSimSection) {
            battleSimSection.classList.remove('hidden');
        }

        const steps = [
            "⚡ El equipo despliega sus tácticas defensivas...",
            "🔥 ¡Doctor Doom desata su poder cósmico y magia oscura!",
            "⚔️ Choque brutal de estadísticas en el multiverso...",
            "🏆 Calculando el veredicto final..."
        ];

        let currentStep = 0;
        const interval = setInterval(() => {
            if (currentStep < steps.length) {
                if (simStatusText) simStatusText.textContent = steps[currentStep];
                currentStep++;
            } else {
                clearInterval(interval);
                if (battleSimSection) battleSimSection.classList.add('hidden');
                if (resultSection) resultSection.classList.remove('hidden');
            }
        }, 800);
    });
}

// --- NAVEGACIÓN ENTRE VISTAS (MENÚ LATERAL) ---
const navInicio = document.getElementById('nav-inicio');
const navPersonajes = document.getElementById('nav-personajes');
const inicioSection = document.getElementById('inicio-section');

if (navInicio && navPersonajes) {
    navInicio.addEventListener('click', (e) => {
        e.preventDefault();
        if (inicioSection) inicioSection.classList.remove('hidden');
        if (charactersSection) charactersSection.classList.add('hidden');
        navInicio.classList.add('active');
        navPersonajes.classList.remove('active');
    });

    navPersonajes.addEventListener('click', (e) => {
        e.preventDefault();
        if (inicioSection) inicioSection.classList.add('hidden');
        if (charactersSection) charactersSection.classList.remove('hidden');
        navPersonajes.classList.add('active');
        navInicio.classList.remove('active');
        renderCharactersGallery(); 
    });
}

// Inicialización de selectores al cargar
populateSelects();
