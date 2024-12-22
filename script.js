import { gifts } from "./gifts.js";
const calendar = document.querySelector(".calendar");

gifts.forEach((gift, index) => {
  const day = document.createElement("div");
  day.classList.add("day");
  day.dataset.index = index + 1;
  day.innerHTML = `${index + 1} <div class="content">${gift}</div>`;

  day.addEventListener("click", () => {
    if (!day.classList.contains("opened")) {
      day.classList.add("opened");
    }
  });

  calendar.appendChild(day);
});
