let slideIndex = 0;

function showSlides() {
  const slides = document.querySelectorAll(".slides img");
  if (!slides.length) return;

  slides.forEach((img, i) => {
    img.style.opacity = i === slideIndex ? "1" : "0";
  });

  slideIndex = (slideIndex + 1) % slides.length;
  setTimeout(showSlides, 4000);
}

document.addEventListener("DOMContentLoaded", showSlides);
