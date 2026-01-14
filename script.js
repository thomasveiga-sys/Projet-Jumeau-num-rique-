// ---------------------------------------------------------------------------
// FONCTION POUR RÉCUPÉRER LES DONNÉES RÉELLES DEPUIS TA BASE DE DONNÉES
// ---------------------------------------------------------------------------
// ⚠️ Remplace "getData.php" par ton script backend qui retourne:
//
// { labels:["0h","1h",...], tempIn:[...], tempOut:[...] }
//
// Sinon, utilise un fichier JSON, ou une API.
// ---------------------------------------------------------------------------

async function loadRealData() {
    try {
        const response = await fetch("data.json");
        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Erreur de chargement data.json :", error);
    }
}




// ---------------------------------------------------------------------------
// COURBE PREDICTION IA (FAUSSES VALEURS TEMPORAIRES)
// ---------------------------------------------------------------------------

function generatePrediction(realOutValues) {
    let prediction = [];

    for (let temp of realOutValues) {
        // IA fictive : augmente légèrement + bruit
        prediction.push(temp + (Math.random() * 2 - 1));
    }

    return prediction;
}


// ---------------------------------------------------------------------------
// CRÉATION DU GRAPHIQUE
// ---------------------------------------------------------------------------

let tempChart;

async function createChart() {

    const data24h = await loadRealData();
    const prediction = generatePrediction(data24h.tempOut);

    const ctx = document.getElementById('tempChart').getContext('2d');

    tempChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data24h.labels,
            datasets: [
                {
                    label: "Température Entrée Ventilateur (°C)",
                    data: data24h.tempIn,
                    borderColor: "blue",
                    fill: false,
                    tension: 0.2
                },
                {
                    label: "Température Sortie Résistance (°C)",
                    data: data24h.tempOut,
                    borderColor: "red",
                    fill: false,
                    tension: 0.2
                },
                {
                    label: "Prédiction IA (°C)",
                    data: prediction,
                    borderColor: "green",
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.2
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: false }
            }
        }
    });
}

createChart();


// ---------------------------------------------------------------------------
// MISE À JOUR EN DIRECT DES 2 VALEURS TEXTUELLES (tempIn / tempOut)
// ---------------------------------------------------------------------------

async function updateLiveValues() {

const response = await fetch("live.json");

    const live = await response.json();

    document.getElementById("tempIn").textContent = live.tempIn.toFixed(2);
    document.getElementById("tempOut").textContent = live.tempOut.toFixed(2);

    // Mise à jour dans le graphe
    let hour = new Date().getHours() + "h";

    tempChart.data.labels.push(hour);
    tempChart.data.datasets[0].data.push(live.tempIn);
    tempChart.data.datasets[1].data.push(live.tempOut);

    // On recalcule la prédiction IA
    tempChart.data.datasets[2].data = generatePrediction(tempChart.data.datasets[1].data);

    // On garde max 24 points
    if (tempChart.data.labels.length > 24) {
        tempChart.data.labels.shift();
        tempChart.data.datasets.forEach(d => d.data.shift());
    }

    tempChart.update();
}

setInterval(updateLiveValues, 5000); // toutes les 5 secondes



// ---------------------------------------------------------------------------
// BOUTONS POUR MONTER / BAISSER LA TEMPERATURE DE LA RESISTANCE
// ---------------------------------------------------------------------------

function increaseResistance() {
    alert("Résistance augmentée (simulation)");
}

function decreaseResistance() {
    alert("Résistance diminuée (simulation)");
}
