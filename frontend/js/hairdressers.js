if (!window.API) window.API = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", loadHairdressers);

async function loadHairdressers() {
  const container = document.getElementById("hairdresserCards");
  if (!container) return;

  container.innerHTML = "";

  try {
    const res = await fetch(`${API}/hairdressers`);
    const data = await res.json();

    data.forEach(h => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${h.photo_url || "https://via.placeholder.com/300x220?text=Brak+zdjęcia"}">
        <h3>${h.first_name} ${h.last_name}</h3>
        <p>${h.description || ""}</p>
      `;

      container.appendChild(card);
    });

  } catch (err) {
    console.error("Hairdressers load error:", err);
  }
}
