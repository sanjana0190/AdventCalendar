import { gifts } from "./gifts.js";
const houseBody = document.getElementById("house-body");

gifts.forEach((gift) => {
  const window = document.createElement("div");
  window.className = "window";
  window.textContent = gift.title;
  const description = document.createElement("div");
  description.className = "window-description";
  description.textContent = gift.description;

  window.appendChild(description);
  window.addEventListener("click", () => {
    window.classList.toggle("opened");
  });
  houseBody.appendChild(window);
});
