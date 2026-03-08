const API = "http://localhost:3000";


document.addEventListener("DOMContentLoaded", () => {

 window.hairdresser = document.getElementById("hairdresser");
  window.service = document.getElementById("service");
  window.date = document.getElementById("date");
  window.time = document.getElementById("time");

  loadHairdressers();
  loadServices();
 async function loadHairdressers() {
  const res = await fetch(`${API}/hairdressers`);
  const list = await res.json();

  hairdresser.innerHTML = `
    <option value="">
      ${translations[window.currentLang].selectHairdresser}
    </option>
  `;

  list.forEach(h => {
    hairdresser.innerHTML += `
      <option value="${h.id}">
        ${h.first_name} ${h.last_name}
      </option>
    `;
  });
}

 async function loadServices() {
  const res = await fetch(`${API}/services`);
  const list = await res.json();

  service.innerHTML = `
    <option value="">
      ${translations[window.currentLang].selectService}
    </option>
  `;

  list.forEach(s => {
    const name =
      window.currentLang === "en"
        ? s.service_name_en
        : s.service_name_pl;

    service.innerHTML += `
      <option value="${s.service_id}">
        ${name} (${s.price} zł)
      </option>
    `;
  });
}


  async function loadTimes() {
    if (!hairdresser.value || !date.value) return;

    time.innerHTML = "<option>Ładowanie...</option>";

    const res = await fetch(
      `${API}/appointments/times/${hairdresser.value}/${date.value}`
    );

    const list = await res.json();
    time.innerHTML = "";

    if (!list.length) {
      time.innerHTML = "<option>Brak godzin</option>";
      return;
    }

    list.forEach(t => {
      time.innerHTML += `<option value="${t}">${t}</option>`;
    });
  }

  hairdresser.addEventListener("change", loadTimes);
  date.addEventListener("change", loadTimes);

document.getElementById("bookingForm").addEventListener("submit", async e => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const hairdresser = document.getElementById("hairdresser").value;
  const service = document.getElementById("service").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;


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

  loadTimes();
});


  loadHairdressers();
  loadServices();
});
const dateInput = document.getElementById("date");
const maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() + 1);
dateInput.max = maxDate.toISOString().split("T")[0];
