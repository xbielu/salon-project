const API = "http://localhost:3000";

let weekChart = null;
let monthChart = null;
let hairdresserChart = null;


async function loadStats() {
  const fromInput = document.getElementById("from");
  const toInput = document.getElementById("to");

  const from = fromInput.value;
  const to = toInput.value;

  if (!from || !to) return;

  if (from > to) {
    alert("Data początkowa nie może być późniejsza niż końcowa");
    return;
  }

  try {
    const res = await fetch(
      `${API}/stats/range?from=${from}&to=${to}&t=${Date.now()}`
    );

    if (!res.ok) {
      throw new Error("Błąd odpowiedzi backendu");
    }

    const data = await res.json();

    drawWeeks(data.weeks || []);
    drawMonths(data.months || []);
    drawHairdressers(data.hairdressers || []);

  } catch (err) {
    console.error(err);
    alert("Błąd ładowania statystyk");
  }
}


function drawWeeks(rows) {
  const canvas = document.getElementById("weekChart");
  if (!canvas) return;

  if (weekChart) weekChart.destroy();

  weekChart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: rows.map(r => {
  const year = r.week.toString().slice(0, 4);
  const week = r.week.toString().slice(4);
  return `Tydz. ${week} / ${year}`;
}),

      datasets: [{
        label: "Liczba wizyt",
        data: rows.map(r => r.visits),
        backgroundColor: "#ff3b7d"
      }]
    },
   options: {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0
      }
    }
  }
}

  });
}


function drawMonths(rows) {
  const canvas = document.getElementById("monthChart");
  if (!canvas) return;

  if (monthChart) monthChart.destroy();

  monthChart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: rows.map(r => r.month),
      datasets: [{
        label: "Liczba wizyt",
        data: rows.map(r => r.visits),
        backgroundColor: "#36a2eb"
      }]
    },
   options: {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0
      }
    }
  }
}

  });
}


function drawHairdressers(rows) {
  const canvas = document.getElementById("hairdresserChart");
  if (!canvas) return;

  if (hairdresserChart) hairdresserChart.destroy();

  hairdresserChart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: rows.map(r => r.hairdresser),
      datasets: [{
        label: "Liczba klientów",
        data: rows.map(r => r.visits),
        backgroundColor: "#4bc0c0"
      }]
    },
    options: {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0
      }
    }
  }
}

  });
}


document.addEventListener("DOMContentLoaded", () => {
  const today = new Date().toISOString().split("T")[0];

  const fromInput = document.getElementById("from");
  const toInput = document.getElementById("to");

  fromInput.value = today;
  toInput.value = today;

  fromInput.addEventListener("change", loadStats);
  toInput.addEventListener("change", loadStats);

  loadStats();
});
