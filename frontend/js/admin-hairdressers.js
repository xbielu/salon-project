if (!window.API) window.API = "http://localhost:3000";


function logout() {
    window.location.href = "login.html";
}


async function loadHairdressers() {
    const res = await fetch(`${API}/hairdressers`);
    const list = await res.json();

    const box = document.getElementById("hairdressersList");
    box.innerHTML = "";

    list.forEach(h => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="${h.photo_url || 'https://via.placeholder.com/300'}">
            <h3>${h.first_name} ${h.last_name}</h3>
            <p>${h.description || "Brak opisu"}</p>
            <button class="small-btn" onclick="editHairdresser(${h.id})">Edytuj</button>
            <button class="small-btn warn" onclick="deleteHairdresser(${h.id})">Usuń</button>
        `;

        box.appendChild(card);
    });
}


async function editHairdresser(id) {
    const res = await fetch(`${API}/hairdressers`);
    const list = await res.json();
    const h = list.find(x => x.id == id);

    document.getElementById("hd-id").value = h.id;
    document.getElementById("hd-first").value = h.first_name;
    document.getElementById("hd-last").value = h.last_name;
    document.getElementById("hd-email").value = h.email;
    document.getElementById("hd-pass").value = "";
    document.getElementById("hd-photo").value = h.photo_url;
    document.getElementById("hd-desc").value = h.description;
}


async function saveHairdresser() {
    const id = document.getElementById("hd-id").value;

    const data = {
        first_name: document.getElementById("hd-first").value,
        last_name: document.getElementById("hd-last").value,
        email: document.getElementById("hd-email").value,
        password: document.getElementById("hd-pass").value || null,
        photo_url: document.getElementById("hd-photo").value,
        description: document.getElementById("hd-desc").value
    };
if (data.first_name.length > 30 || data.last_name.length > 40) {
  alert("Imię lub nazwisko za długie");
  return;
}

if (data.password && data.password.length > 60) {
  alert("Hasło max 60 znaków");
  return;
}

if (data.description && data.description.length > 500) {
  alert("Opis max 500 znaków");
  return;
}

    if (!id) {
      
        await fetch(`${API}/hairdressers`, {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(data)
        });
        alert("Dodano fryzjera!");
    } else {
        
        await fetch(`${API}/hairdressers/${id}`, {
            method: "PUT",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(data)
        });
        alert("Zaktualizowano fryzjera!");
    }

    clearForm();
    loadHairdressers();
}


async function deleteHairdresser(id) {
    if (!id) {
        id = document.getElementById("hd-id").value;
        if (!id) return alert("Nie wybrano fryzjera.");
    }

    if (!confirm("Usunąć fryzjera?")) return;

    await fetch(`${API}/hairdressers/${id}`, { method: "DELETE" });

    clearForm();
    loadHairdressers();
}


function clearForm() {
    document.getElementById("hd-id").value = "";
    document.getElementById("hd-first").value = "";
    document.getElementById("hd-last").value = "";
    document.getElementById("hd-email").value = "";
    document.getElementById("hd-pass").value = "";
    document.getElementById("hd-photo").value = "";
    document.getElementById("hd-desc").value = "";
}


document.addEventListener("DOMContentLoaded", loadHairdressers);
if (!window.API) window.API = "http://localhost:3000";

async function loadHairdressers() {
    const res = await fetch(`${API}/hairdressers`);
    const list = await res.json();

    const box = document.getElementById("hairdressersList");
    box.innerHTML = "";

    list.forEach(h => {
        box.innerHTML += `
            <div class="card">
                <img src="${h.photo_url || 'https://via.placeholder.com/200'}">
                <h3>${h.first_name} ${h.last_name}</h3>
                <p>${h.description || 'Brak opisu'}</p>
                <button class="warn" onclick="deleteHairdresser(${h.id})">Usuń</button>
            </div>
        `;
    });
}

async function deleteHairdresser(id) {
    await fetch(`${API}/hairdressers/${id}`, { method: "DELETE" });
    loadHairdressers();
}

document.addEventListener("DOMContentLoaded", loadHairdressers);
