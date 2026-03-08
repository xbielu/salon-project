window.currentLang = "pl";

window.translations = {
  pl: {
    menuAbout: "O nas",
    menuPrice: "Cennik",
    menuBook: "Rezerwacja",
    menuHairdressers: "Fryzjerzy",

    aboutTitle: "O nas",
    aboutText: "Trendy Hair to nowoczesny salon fryzjerski zlokalizowany w centrum miasta. Oferujemy szeroki zakres usług fryzjerskich dla kobiet i mężczyzn, wykonywanych przez doświadczonych stylistów. Stawiamy na indywidualne podejście do każdego klienta, wysoką jakość usług oraz komfortową i przyjazną atmosferę. Naszym celem jest, aby każdy klient wychodził z salonu zadowolony i pewny siebie.",

    selectHairdresser: "-- wybierz fryzjera --",
    selectService: "-- wybierz usługę --",

    bookingTitle: "Rezerwacja",
    labelName: "Imię i nazwisko",
    labelEmail: "Email",
    labelPhone: "Telefon",
    labelHairdresser: "Fryzjer",
    labelService: "Usługa",
    labelDate: "Data",
    labelTime: "Godzina",
    buttonBook: "Zarezerwuj"
  },

  en: {
    selectHairdresser: "-- select hairdresser --",
    selectService: "-- select service --",

    menuAbout: "About",
    menuPrice: "Price list",
    menuBook: "Booking",
    menuHairdressers: "Hairdressers",

    aboutTitle: "About us",
    aboutText: "Trendy Hair is a modern hair salon located in the city center. We offer a wide range of hairdressing services for both women and men, provided by experienced stylists. We focus on high-quality service, individual consultation, and a comfortable, welcoming atmosphere. Our goal is to ensure that every client leaves the salon feeling confident and satisfied.",

    bookingTitle: "Booking",
    labelName: "Full name",
    labelEmail: "Email",
    labelPhone: "Phone",
    labelHairdresser: "Hairdresser",
    labelService: "Service",
    labelDate: "Date",
    labelTime: "Time",
    buttonBook: "Book now"
  }
};

function toggleLang() {
  window.currentLang = (window.currentLang === "pl") ? "en" : "pl";
  applyTranslations();
  loadServices();
  loadHairdressers();
}


function applyTranslations() {
  document.querySelectorAll("[data-lang]").forEach(el => {
    const key = el.dataset.lang;
    el.textContent = translations[window.currentLang][key];
  });
}
