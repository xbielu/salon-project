if (!window.API) window.API = "http://localhost:3000";


function showTab(id) {
    document.querySelectorAll(".tab").forEach(t => t.style.display = "none");
    document.getElementById(id).style.display = "block";
}

function logout() {
    window.location.href = "login.html";
}

async function loadHairdressersAdmin() {
    const res = await fetch(`${API}/hairdressers`);
    const list = await res.json();

    const box = document.getElementById("hairdressersList");
    const sel1 = document.getElementById("sch-hairdresser");

    box.innerHTML = "";
    sel1.innerHTML = "";

    list.forEach(h => {
        sel1.innerHTML += `<option value="${h.id}">${h.first_name} ${h.last_name}</option>`;

        box.innerHTML += `
            <div class="card">
                <img src="${h.photo_url || 'https://via.placeholder.com/200'}">
                <h3>${h.first_name} ${h.last_name}</h3>
                <p>${h.description || "Brak opisu"}</p>
                <button onclick="deleteHairdresser(${h.id})" class="warn">Usuń</button>
            </div>
        `;
    });
}

async function addHairdresser() {
    const data = {
        first_name: document.getElementById("hd-first").value,
        last_name: document.getElementById("hd-last").value,
        email: document.getElementById("hd-email").value,
        password: document.getElementById("hd-pass").value,
        photo_url: document.getElementById("hd-photo").value,
        description: document.getElementById("hd-desc").value
    };

    await fetch(`${API}/hairdressers`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });

    alert("Dodano fryzjera!");
    loadHairdressersAdmin();
}

async function deleteHairdresser(id) {
    if (!confirm("Usunąć fryzjera?")) return;

    await fetch(`${API}/hairdressers/${id}`, { method: "DELETE" });

    loadHairdressersAdmin();
}


let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

function prevMonth(){
    currentMonth--;
    if(currentMonth < 0){ currentMonth = 11; currentYear--; }
    loadCalendar();
}

function nextMonth(){
    currentMonth++;
    if(currentMonth > 11){ currentMonth = 0; currentYear++; }
    loadCalendar();
}

function goToday(){
    currentYear = new Date().getFullYear();
    currentMonth = new Date().getMonth();
    loadCalendar();
}

async function loadCalendar(){
    const monthTitle = document.getElementById("monthTitle");
    const grid = document.getElementById("calendarGrid");
    grid.innerHTML = "";

    const monthName = [
        "Styczeń","Luty","Marzec","Kwiecień","Maj","Czerwiec",
        "Lipiec","Sierpień","Wrzesień","Październik","Listopad","Grudzień"
    ];

    monthTitle.textContent = `${monthName[currentMonth]} ${currentYear}`;

    const firstDay = new Date(currentYear, currentMonth, 1).getDay() || 7;
    const daysInMonth = new Date(currentYear, currentMonth+1, 0).getDate();

    for(let i=1; i<firstDay; i++){
        grid.innerHTML += `<div class="empty"></div>`;
    }

    for(let d=1; d<=daysInMonth; d++){
        const dateStr = `${currentYear}-${String(currentMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

        grid.innerHTML += `
            <div class="day" onclick="selectDate('${dateStr}')">
                ${d}
            </div>
        `;
    }
}

async function selectDate(date){
    document.getElementById("selectedDateTitle").textContent = `Dzień: ${date}`;
    document.getElementById("sch-date").value = date;

    const res = await fetch(`${API}/schedules/byDate?date=${date}`);
    const list = await res.json();

    const box = document.getElementById("dayInfo");
    box.innerHTML = "";

    list.forEach(s => {
        box.innerHTML += `
            <div class="card" onclick="editSchedule(${s.schedule_id}, '${s.hairdresser_id}', '${s.start_time}', '${s.end_time}')">
                <b>${s.first_name} ${s.last_name}</b>
                <p>${s.start_time.slice(0,5)} - ${s.end_time.slice(0,5)}</p>
            </div>
        `;
    });
}

function editSchedule(id, hairdresser, start, end){
    document.getElementById("sch-id").value = id;
    document.getElementById("sch-hairdresser").value = hairdresser;
    document.getElementById("sch-start").value = start.slice(0,5);
    document.getElementById("sch-end").value = end.slice(0,5);
}

async function saveSchedule(){
    const data = {
        hairdresser_id: document.getElementById("sch-hairdresser").value,
        work_date: document.getElementById("sch-date").value,
        start_time: document.getElementById("sch-start").value,
        end_time: document.getElementById("sch-end").value
    };

    await fetch(`${API}/schedules/add`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(data)
    });

    alert("Zapisano grafik!");
    selectDate(data.work_date);
}

async function deleteSchedule(){
    const id = document.getElementById("sch-id").value;
    if(!id) return alert("Nie wybrano grafiku!");

    await fetch(`${API}/schedules/${id}`, {method:"DELETE"});
    alert("Usunięto grafik!");
}


async function loadAppointments(){
    const date = document.getElementById("ap-date-filter").value;
    if(!date) return;

    const res = await fetch(`${API}/appointments/day/${date}`);
    const list = await res.json();

    const box = document.getElementById("appointmentsList");
    box.innerHTML = "";

    list.forEach(a => {
        box.innerHTML += `
            <div class="card">
                <b>${a.client_first} ${a.client_last}</b>
                <p>${a.service}</p>
                <p>${a.appointment_time.slice(0,5)}</p>
                <button onclick="deleteAppointment(${a.appointment_id})" class="warn">Usuń</button>
            </div>
        `;
    });
}

async function deleteAppointment(id){
    await fetch(`${API}/appointments/${id}`, { method:"DELETE" });
    loadAppointments();
}


document.addEventListener("DOMContentLoaded", () => {
    loadHairdressersAdmin();
    loadCalendar();
});
