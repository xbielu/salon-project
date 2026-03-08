
const API = window.API || "http://localhost:3000";

const dateInput = document.getElementById("app-date");
const box = document.getElementById("appointmentsList");


async function loadAppointments() {
  const date = dateInput.value;
  if (!date) {
    box.innerHTML = "<p>Wybierz datę.</p>";
    return;
  }

  try {
    const res = await fetch(`${API}/appointments/date/${date}?t=${Date.now()}`);
    if (!res.ok) throw new Error("Appointments fetch failed");

    const list = await res.json();
    box.innerHTML = "";

    if (!Array.isArray(list) || list.length === 0) {
      box.innerHTML = "<p>Brak rezerwacji.</p>";
      return;
    }

    list.forEach(a => {
      box.innerHTML += `
        <div class="appointment-item">
          <b>${a.client_first} ${a.client_last}</b><br>
          Usługa: ${a.service}<br>
          Fryzjer: ${a.hairdresser_first} ${a.hairdresser_last}<br>
          Godzina: ${a.appointment_time.slice(0,5)}<br><br>
          <button class="warn" onclick="deleteAppointment(${a.appointment_id})">
            Usuń
          </button>
        </div>
      `;
    });
  } catch (err) {
    console.error(err);
    box.innerHTML = "<p>Błąd połączenia z serwerem.</p>";
  }
}


async function deleteAppointment(id) {
  if (!confirm("Usunąć rezerwację?")) return;
  await fetch(`${API}/appointments/${id}`, { method: "DELETE" });
  loadAppointments();
}


async function loadAdminFormData() {
  try {
    const [hRes, sRes] = await Promise.all([
      fetch(`${API}/hairdressers`),
      fetch(`${API}/services`)
    ]);

    if (!hRes.ok) throw new Error("Hairdressers fetch failed");
    if (!sRes.ok) throw new Error("Services fetch failed");

    const hairdressers = await hRes.json();
    const services = await sRes.json();

    const hSel = document.getElementById("adm-hairdresser");
    const sSel = document.getElementById("adm-service");

    hSel.innerHTML = "<option value=''>-- wybierz fryzjera --</option>";
    sSel.innerHTML = "<option value=''>-- wybierz usługę --</option>";

    hairdressers.forEach(h => {
      hSel.innerHTML += `<option value="${h.id}">${h.first_name} ${h.last_name}</option>`;
    });

    services.forEach(s => {
      sSel.innerHTML += `<option value="${s.service_id}">${s.service_name_pl}</option>`;
    });
  } catch (err) {
    console.error("ADMIN FORM LOAD ERROR:", err);
    alert("Błąd ładowania danych formularza (fryzjerzy/usługi)");
  }
}


async function loadAdminTimes() {
  const hairdresser = document.getElementById("adm-hairdresser").value;
  const date = document.getElementById("adm-date").value;
  const timeSel = document.getElementById("adm-time");

  if (!hairdresser || !date) return;

  try {
    const res = await fetch(`${API}/appointments/times/${hairdresser}/${date}`);
    if (!res.ok) throw new Error("Times fetch failed");

    const times = await res.json();
    timeSel.innerHTML = "";

    if (!times.length) {
      timeSel.innerHTML = "<option>Brak wolnych godzin</option>";
      return;
    }

    times.forEach(t => {
      timeSel.innerHTML += `<option value="${t}">${t}</option>`;
    });
  } catch (err) {
    console.error(err);
    timeSel.innerHTML = "<option>Błąd ładowania godzin</option>";
  }
}


async function addAppointment() {
  const name = document.getElementById("adm-name").value.trim();
  const email = document.getElementById("adm-email").value.trim();
  const phone = document.getElementById("adm-phone").value.trim();
  const hairdresser = document.getElementById("adm-hairdresser").value;
  const service = document.getElementById("adm-service").value;
  const date = document.getElementById("adm-date").value;
  const time = document.getElementById("adm-time").value;

  if (!name) {
    alert("Name is required");
    return;
  }

  if (name.length > 80) {
    alert("Name must not exceed 80 characters");
    return;
  }

  if (!email) {
    alert("Email is required");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert("Enter a valid email address");
    return;
  }

  if (!phone) {
    alert("Phone number is required");
    return;
  }

  if (!/^\d{9}$/.test(phone)) {
    alert("Enter a valid phone number (9 digits)");
    return;
  }

  if (!date) {
    alert("Please select a date");
    return;
  }

  if (!isDateInRange(date, 6)) {
    alert("You can book only up to 6 months ahead and not in the past");
    return;
  }

  if (!time) {
    alert("Please select a time");
    return;
  }

  const data = {
    client_name: name,
    client_email: email,
    client_phone: phone,
    hairdresser_id: hairdresser,
    service_id: service,
    appointment_date: date,
    appointment_time: time
  };

  const res = await fetch(`${API}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    alert("Error while saving appointment");
    return;
  }

  alert("Appointment successfully booked");
  loadAppointments();
  loadAdminTimes();
}



document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("adm-hairdresser").addEventListener("change", loadAdminTimes);
  document.getElementById("adm-date").addEventListener("change", loadAdminTimes);
  loadAdminFormData();
});
