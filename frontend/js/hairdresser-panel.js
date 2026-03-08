if (!window.API) window.API = window.location.origin;
async function loadSchedule() {
  const id = localStorage.getItem("hairdresser_id");
  if (!id) {
    alert("Brak dostępu");
    location.href = "login.html";
    return;
  }

  const res = await fetch(`${API}/schedules/hairdresser/${id}`);
  const list = await res.json();

  const box = document.getElementById("scheduleBox");
  box.innerHTML = "";

  if (!list.length) {
    box.innerHTML = "<p>Brak grafiku.</p>";
    return;
  }

  list.forEach(s => {
    box.innerHTML += `
      <div class="schedule-item">
        <b>${s.work_date}</b><br>
        ${s.start_time.slice(0,5)} - ${s.end_time.slice(0,5)}
      </div>
    `;
  });
}

document.addEventListener("DOMContentLoaded", loadSchedule);
