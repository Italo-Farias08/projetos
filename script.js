const diasDiv = document.getElementById("dias");
const horariosDiv = document.getElementById("horarios");

let dataSelecionada = null;
let horarioSelecionado = null;

// horários de 08:00 até 21:00
const horarios = [];
for (let i = 8; i <= 21; i++) {
  horarios.push(`${i.toString().padStart(2, "0")}:00`);
}

const nomesDias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const hoje = new Date();

// GERAR DIAS
function gerarProximosDias(qtd = 10) {
  diasDiv.innerHTML = "";

  for (let i = 0; i < qtd; i++) {
    const data = new Date();
    data.setDate(hoje.getDate() + i);

    const diaSemana = data.getDay();
    if (diaSemana === 0) continue; // bloqueia domingo

    const div = document.createElement("div");
    div.classList.add("dia");

    div.innerHTML = `
      <small>${nomesDias[diaSemana]}</small>
      <strong>${data.getDate()}</strong>
    `;

    div.onclick = () => selecionarDia(div, data);

    diasDiv.appendChild(div);
  }
}

// SELECIONAR DIA
function selecionarDia(elemento, data) {
  document.querySelectorAll(".dia").forEach(d => d.classList.remove("selecionado"));
  elemento.classList.add("selecionado");

  dataSelecionada = data;
  horarioSelecionado = null;

  horariosDiv.innerHTML = "<h3>Horários disponíveis:</h3>";

  horarios.forEach(h => {
    const btn = document.createElement("div");
    btn.classList.add("horario");
    btn.innerText = h;

    btn.onclick = () => selecionarHorario(btn, h);

    horariosDiv.appendChild(btn);
  });
}

// SELECIONAR HORÁRIO
function selecionarHorario(elemento, horario) {
  document.querySelectorAll(".horario").forEach(h => {
    h.classList.remove("selecionado");
  });

  elemento.classList.add("selecionado");
  horarioSelecionado = horario;
}

// SCROLL COM MOUSE (PC)
diasDiv.addEventListener("wheel", (e) => {
  e.preventDefault();
  diasDiv.scrollLeft += e.deltaY;
});

// BOTÃO CONFIRMAR
const botao = document.querySelector(".btn-confirmar");

botao.addEventListener("click", () => {
  if (!dataSelecionada || !horarioSelecionado) {
    alert("Selecione um dia e horário!");
    return;
  }

  alert(`Agendamento confirmado:\n${dataSelecionada.toLocaleDateString()} às ${horarioSelecionado}`);
});

// INICIAR
gerarProximosDias();