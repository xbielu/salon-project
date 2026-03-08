window.API = window.location.origin;

function validateFullName(name) {
  if (!name) return false;
  if (name.length > 80) return false;
  return /^[A-Za-zÀ-ž\s-]+$/.test(name);
}

function validateEmail(email) {
  if (!email || email.length > 100) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return /^\d{9}$/.test(phone);
}

function isDateInRange(dateStr, maxMonthsAhead) {
  const selected = new Date(dateStr);
  const now = new Date();
  const max = new Date();
  max.setMonth(max.getMonth() + maxMonthsAhead);

  return selected >= now && selected <= max;
}
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
