import { gifts } from "./gifts.js";
const houseBody = document.getElementById("house-body");

const modal = document.createElement("div");
modal.className = "modal";

const modalContent = document.createElement("div");
modalContent.className = "modal-content";

const modalClose = document.createElement("button");
modalClose.className = "modal-close";
modalClose.textContent = "x";

modalContent.appendChild(modalClose);
modal.appendChild(modalContent);
document.body.appendChild(modal);

const openModal = (gift) => {
  modalContent.innerHTML = `
    <h2 class="modal-title">${gift.title}</h2>
    ${gift.gifUrl ? `<img src="${gift.gifUrl}" alt="${gift.title}" class="modal-gif">` : ""}
    <p class="modal-description">${gift.description}</p>
  `;
  modalContent.appendChild(modalClose);
  modal.style.display = "flex";
};

modalClose.addEventListener("click", () => {
  modal.style.display = "none";
});

gifts.forEach((gift) => {
  const window = document.createElement("div");
  window.className = "window";
  window.textContent = gift.title;

  window.addEventListener("click", () => {
    openModal(gift);
    window.classList.toggle("opened");
  });
  houseBody.appendChild(window);
});
