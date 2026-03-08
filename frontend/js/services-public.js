if (!window.API) window.API = "http://localhost:3000";

async function loadServicesPublic() {
    const res = await fetch(`${API}/services`);
    const list = await res.json();

    const box = document.getElementById("servicesList");
    box.innerHTML = "";

    list.forEach(s => {
        const div = document.createElement("div");
        div.classList.add("appointment-item");

        const name = (window.currentLang === "en")
            ? s.service_name_en
            : s.service_name_pl;

        div.innerHTML = `
            <b>${name}</b><br>
            <span>${s.price} zł</span>
        `;

        box.appendChild(div);
    });
}

document.addEventListener("DOMContentLoaded", loadServicesPublic);
