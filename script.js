const diasDiv = document.getElementById("dias");
const horariosDiv = document.getElementById("horarios");
const botao = document.querySelector(".btn-confirmar");

let dataSelecionada = null;
let horarioSelecionado = null;

// horários
const horarios = [];
for (let i = 8; i <= 21; i++) {
  horarios.push(`${i.toString().padStart(2, "0")}:00`);
}

const nomesDias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const hoje = new Date();

// 🔥 NOTIFICAÇÃO BONITA
function mostrarMensagem(texto, cor = "#c59d5f") {
  const msg = document.createElement("div");
  msg.innerText = texto;

  msg.style.position = "fixed";
  msg.style.bottom = "20px";
  msg.style.left = "50%";
  msg.style.transform = "translateX(-50%)";
  msg.style.background = cor;
  msg.style.color = "#000";
  msg.style.padding = "12px 20px";
  msg.style.borderRadius = "10px";
  msg.style.fontWeight = "bold";
  msg.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
  msg.style.zIndex = "9999";
  msg.style.opacity = "0";
  msg.style.transition = "0.5s";

  document.body.appendChild(msg);

  setTimeout(() => msg.style.opacity = "1", 10);
  setTimeout(() => {
    msg.style.opacity = "0";
    setTimeout(() => msg.remove(), 500);
  }, 2500);
}

// GERAR DIAS
function gerarProximosDias(qtd = 10) {
  diasDiv.innerHTML = "";

  for (let i = 0; i < qtd; i++) {
    const data = new Date();
    data.setDate(hoje.getDate() + i);

    const diaSemana = data.getDay();
    if (diaSemana === 0) continue;

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

// 🔥 SELECIONAR DIA (BUSCA DO BACK)
function selecionarDia(elemento, data) {
  document.querySelectorAll(".dia").forEach(d => d.classList.remove("selecionado"));
  elemento.classList.add("selecionado");

  dataSelecionada = data;
  horarioSelecionado = null;

  const dataFormatada = dataSelecionada.toISOString().split("T")[0];

  horariosDiv.innerHTML = "<h3>Carregando horários...</h3>";

  fetch(`http://localhost:3000/agendamentos/${dataFormatada}`)
    .then(res => res.json())
    .then(ocupados => {

     const horariosOcupados = ocupados.map(h => {
  const [hora, minuto] = h.horario.split(":");
  return `${hora.padStart(2, "0")}:${minuto}`;
});

      renderizarHorarios(horariosOcupados);
    })
    .catch(() => {
      renderizarHorarios([]);
    });
}

// 🔥 RENDERIZAR HORÁRIOS (CORRIGIDO)

function renderizarHorarios(horariosOcupados) {
  horariosDiv.innerHTML = "<h3>Horários disponíveis:</h3>";

  horarios.forEach(h => {

    const btn = document.createElement("div");
    btn.classList.add("horario");
    btn.innerText = h;

    if (horariosOcupados.includes(h)) {
      btn.innerText += " ❌ OCUPADO";
      btn.style.opacity = "0.4";
      btn.style.pointerEvents = "none";
    } else {
      btn.onclick = () => selecionarHorario(btn);
    }

    horariosDiv.appendChild(btn);
  });
}

// 🔥 SELECIONAR HORÁRIO (100% seguro)
function selecionarHorario(elemento) {
  document.querySelectorAll(".horario").forEach(h => {
    h.classList.remove("selecionado");
  });

  elemento.classList.add("selecionado");

  horarioSelecionado = elemento.innerText.replace(" ❌", "").trim();

  console.log("Selecionado:", horarioSelecionado);
}

// 🔥 CONFIRMAR AGENDAMENTO
botao.addEventListener("click", () => {
  if (!dataSelecionada || !horarioSelecionado) {
    mostrarMensagem("⚠️ Selecione um dia e horário!", "#ff4d4d");
    return;
  }

  const dataFormatada = dataSelecionada.toISOString().split("T")[0];

  const horarioFinal = horarioSelecionado; // 🔥 salva antes

  fetch("http://localhost:3000/agendar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      data: dataFormatada,
      horario: horarioFinal
    })
  })
  .then(res => res.json())
  .then(res => {

    if (res.erro) {
      mostrarMensagem("❌ " + res.erro, "#ff4d4d");
      return;
    }

    mostrarMensagem("✅ Agendado com sucesso! 💈");

    // 🔒 bloqueia na hora
    const selecionado = document.querySelector(".horario.selecionado");
    if (selecionado) {
      selecionado.style.background = "#444";
      selecionado.style.opacity = "0.5";
      selecionado.style.cursor = "not-allowed";
      selecionado.innerText += " ❌";
      selecionado.onclick = null;
      selecionado.classList.remove("selecionado");
    }

    // 🔄 atualiza horários
    selecionarDia(
      document.querySelector(".dia.selecionado"),
      dataSelecionada
    );

    // 📲 WhatsApp
    const numero = "5581991204180";

    const mensagem = `🧾 *AGENDAMENTO CONFIRMADO*

📅 Data: ${dataFormatada}
⏰ Horário: ${horarioFinal}

💈 Obrigado pela preferência!`;

    const url = `https://api.whatsapp.com/send?phone=${numero}&text=${encodeURIComponent(mensagem)}`;

    setTimeout(() => {
      window.location.href = url;
    }, 1500);
  })
  .catch(() => {
    mostrarMensagem("❌ Erro ao conectar!", "#ff4d4d");
  });
});

// iniciar
gerarProximosDias();