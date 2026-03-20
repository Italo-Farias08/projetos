
const input = document.getElementById("data");
const lista = document.getElementById("horarios");

const horariosPadrao = [
  "09:00", "10:00", "11:00",
  "13:00", "14:00", "15:00"
];

input.addEventListener("change", () => {
  lista.innerHTML = "";

  horariosPadrao.forEach(hora => {
    const li = document.createElement("li");
    li.textContent = hora;
    lista.appendChild(li);
  });
});
