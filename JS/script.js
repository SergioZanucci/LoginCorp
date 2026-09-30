const mensagem = document.querySelector("#mensagem");
const campoRe = document.querySelector("#reFuncionario");
const modalNaoEncontrado = document.querySelector("#modalNaoEncontrado");
const btnFecharModalLogin = document.querySelector("#btnFecharModalLogin");

// Funções para controle do modal personalizado
function abrirModalLogin() {
    if (!modalNaoEncontrado) return;
    if (mensagem) mensagem.textContent = "";
    modalNaoEncontrado.classList.add("ativo");
    modalNaoEncontrado.setAttribute("aria-hidden", "false");
}

function fecharModalLogin() {
    if (!modalNaoEncontrado) return;
    modalNaoEncontrado.classList.remove("ativo");
    modalNaoEncontrado.setAttribute("aria-hidden", "true");
    if (campoRe) {
        campoRe.focus();
        campoRe.select();
    }
}

if (btnFecharModalLogin) {
    btnFecharModalLogin.addEventListener("click", fecharModalLogin);
}

if (modalNaoEncontrado) {
    modalNaoEncontrado.addEventListener("click", (evento) => {
        if (evento.target === modalNaoEncontrado) {
            fecharModalLogin();
        }
    });
}

function confirmaFuncionario(evento) {
    evento.preventDefault();

    const reFuncionario = campoRe
        ? campoRe.value.trim()
        : document.querySelector("#reFuncionario").value.trim();

    // Busca os funcionários cadastrados
    const funcionarios =
        JSON.parse(localStorage.getItem("funcionarios")) || [];

    // Procura o funcionário pelo RE
    const funcionarioEncontrado = funcionarios.find(
        funcionario => funcionario.matricula === reFuncionario
    );

    if (funcionarioEncontrado) {

        // mensagem.textContent = "Funcionário encontrado na lista!";
        sessionStorage.setItem("funcionarioLogado", JSON.stringify(funcionarioEncontrado));
        if (mensagem) {
            mensagem.style.color = "green";
            mensagem.style.fontWeight = "bold";
        }

        console.log("Funcionário encontrado:", funcionarioEncontrado);

        setTimeout(() => {
            window.location.href = "ocorrencia.html";
        }, 1500);

    } else {

        // Abre o modal personalizado informando que o funcionário não foi encontrado
        abrirModalLogin();
    }
}

document
    .querySelector("form")
    .addEventListener("submit", confirmaFuncionario);