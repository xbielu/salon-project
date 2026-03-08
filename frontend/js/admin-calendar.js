if (!window.API) window.API = "http://localhost:3000";

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let selectedHairdresserId = null;

async function loadHairdressers() {
  const res = await fetch(`${API}/hairdressers`);
  const list = await res.json();

  const sel = document.getElementById("sch-hairdresser");
  sel.innerHTML = "";

  list.forEach(h => {
    sel.innerHTML += `<option value="${h.id}">${h.first_name} ${h.last_name}</option>`;
  });
}

async function drawCalendar() {
  const grid = document.getElementById("calendarGrid");
  const title = document.getElementById("monthTitle");
  grid.innerHTML = "";

  const months = [
    "Styczeń","Luty","Marzec","Kwiecień","Maj","Czerwiec",
    "Lipiec","Sierpień","Wrzesień","Październik","Listopad","Grudzień"
  ];

  title.textContent = `${months[currentMonth]} ${currentYear}`;

  const firstDay = new Date(currentYear, currentMonth, 1).getDay() || 7;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const res = await fetch(`${API}/schedules/month/${currentYear}/${currentMonth + 1}`);
  const data = await res.json();
const marked = new Set(
  data
    .map(d => d.work_date || d.date)
    .filter(Boolean)
    .map(d => d.split("T")[0])
);


  for (let i = 1; i < firstDay; i++) {
    grid.innerHTML += `<div class="empty"></div>`;
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

    const div = document.createElement("div");
    div.className = "day";
    div.textContent = d;

    if (marked.has(dateStr)) div.classList.add("has-schedule");

    div.onclick = () => selectDate(dateStr);
    grid.appendChild(div);
  }
}

async function selectDate(date) {
  const hairdresserSelect = document.getElementById("sch-hairdresser");

  document.getElementById("selectedDateTitle").textContent = `Dzień: ${date}`;
  document.getElementById("sch-date").value = date;
  document.getElementById("sch-id").value = "";

  if (selectedHairdresserId) {
    hairdresserSelect.value = selectedHairdresserId;
  }

  const res = await fetch(`${API}/schedules/byDate?date=${date}`);
  const list = await res.json();

  const box = document.getElementById("dayInfo");
  box.innerHTML = "";

  if (list.length === 0) {
    box.innerHTML = "<p>Brak grafiku.</p>";
    return;
  }

  list.forEach(s => {
    const div = document.createElement("div");
    div.className = "schedule-item";
    div.innerHTML = `
      <b>${s.first_name} ${s.last_name}</b><br>
      ${s.start_time.slice(0,5)} – ${s.end_time.slice(0,5)}
    `;

    div.onclick = () => {
      document.getElementById("sch-id").value = s.schedule_id;
      document.getElementById("sch-hairdresser").value = s.hairdresser_id;
      document.getElementById("sch-start").value = s.start_time.slice(0,5);
      document.getElementById("sch-end").value = s.end_time.slice(0,5);
    };

    box.appendChild(div);
  });
}

async function saveSchedule() {
  const data = {
    schedule_id: document.getElementById("sch-id").value || null,
    hairdresser_id: document.getElementById("sch-hairdresser").value,
    work_date: document.getElementById("sch-date").value,
    start_time: document.getElementById("sch-start").value,
    end_time: document.getElementById("sch-end").value
  };

  if (!data.work_date) {
    alert("Wybierz dzień");
    return;
  }

  if (!isDateInRange(data.work_date, 6)) {
    alert("Grafik można dodać maksymalnie 6 miesięcy do przodu");
    return;
  }

  const res = await fetch(`${API}/schedules/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await res.json();

  if (!res.ok || !result.success) {
    alert(result.message || "Błąd zapisu grafiku");
    return;
  }

  alert("Grafik zapisany");
  await drawCalendar();
  await selectDate(data.work_date);
}

async function deleteSchedule() {
  const id = document.getElementById("sch-id").value;
  if (!id) return alert("Nie wybrano grafiku");

  await fetch(`${API}/schedules/${id}`, { method: "DELETE" });
  alert("Grafik usunięty");
  selectDate(document.getElementById("sch-date").value);
}

function prevMonth() {
  currentMonth--;
  if (currentMonth < 0) { currentMonth = 11; currentYear--; }
  drawCalendar();
}

function nextMonth() {
  currentMonth++;
  if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  drawCalendar();
}

function goToday() {
  const d = new Date();
  currentYear = d.getFullYear();
  currentMonth = d.getMonth();
  drawCalendar();
  selectDate(d.toISOString().split("T")[0]);
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadHairdressers();
  await drawCalendar();
  goToday();

  const hairdresserSelect = document.getElementById("sch-hairdresser");
  hairdresserSelect.addEventListener("change", e => {
    selectedHairdresserId = e.target.value;
    console.log("Selected hairdresser:", selectedHairdresserId);
  });
});
