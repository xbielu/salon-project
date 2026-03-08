if (!window.API) window.API = window.location.origin;
async function loadServices() {
    const res = await fetch(`${API}/services`);
    const list = await res.json();

    const box = document.getElementById("servicesList");
    box.innerHTML = "";

    list.forEach(s => {
        const div = document.createElement("div");
        div.classList.add("appointment-item");

        div.innerHTML = `
            <b>${s.service_name_pl}</b> (${s.service_name_en})<br>
            Cena: ${s.price} zł
        `;

        div.onclick = () => {
            document.getElementById("srv-id").value = s.service_id;
            document.getElementById("srv-pl").value = s.service_name_pl;
            document.getElementById("srv-en").value = s.service_name_en;
            document.getElementById("srv-price").value = s.price;
        };

        box.appendChild(div);
    });
}

async function saveService() {
    const id = document.getElementById("srv-id").value;
    const data = {
        service_name_pl: document.getElementById("srv-pl").value,
        service_name_en: document.getElementById("srv-en").value,
        price: document.getElementById("srv-price").value
    };
const price = Number(data.price);

if (price < 1 || price > 3000) {
  alert("Cena musi być 1–3000 zł");
  return;
}

if (data.service_name_pl.length > 60 || data.service_name_en.length > 60) {
  alert("Nazwa usługi max 60 znaków");
  return;
}

    if (!id) {
        await fetch(`${API}/services`, {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(data)
        });
    } else {
        await fetch(`${API}/services/${id}`, {
            method: "PUT",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(data)
        });
    }

    loadServices();
    clearServiceForm();
}

async function deleteService() {
    const id = document.getElementById("srv-id").value;
    if (!id) return alert("Nie wybrano usługi");

    await fetch(`${API}/services/${id}`, { method: "DELETE" });

    loadServices();
    clearServiceForm();
}

function clearServiceForm() {
    document.getElementById("srv-id").value = "";
    document.getElementById("srv-pl").value = "";
    document.getElementById("srv-en").value = "";
    document.getElementById("srv-price").value = "";
}

document.addEventListener("DOMContentLoaded", loadServices);
