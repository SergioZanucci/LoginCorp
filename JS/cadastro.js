// ====================================================================
// Proteção de Acesso à Página (Apenas Administrador Autenticado)
// ====================================================================
const funcionarioLogado = JSON.parse(sessionStorage.getItem("funcionarioLogado"));

if (!funcionarioLogado) {
    alert("Acesso restrito. Faça login para continuar.");
    window.location.href = "index.html";
} else if (funcionarioLogado.perfil !== "administrador") {
    alert("Acesso negado. A página de funcionários é restrita a administradores.");
    window.location.href = "ocorrencia.html";
}

const form = document.querySelector("#formCadastro");

const campoNome = document.querySelector("#nomeFuncionario");
const campoReFuncionario = document.querySelector("#reFuncionario");
const campoFuncao = document.querySelector("#funcao");
const campoPostoServico = document.querySelector("#postoServico");
const campoEmpresa = document.querySelector("#empresa");
const campoTurno = document.querySelector("#turno");
const campoPerfil = document.querySelector("#perfil");

const listaFuncionarios = document.querySelector("#listaFuncionarios");

// Busca os funcionários já salvos
let funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || [];

form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nome = campoNome.value.trim();
    const matricula = campoReFuncionario.value.trim();
    const funcao = campoFuncao.value.trim();
    const posto = campoPostoServico.value.trim();
    const empresa = campoEmpresa.value.trim();
    const turno = campoTurno.value.trim();
    const perfil = (campoPerfil ? campoPerfil.value.trim() : "") || "funcionario";

    // Verifica se todos os campos foram preenchidos
    if (!nome || !matricula || !funcao || !posto || !empresa || !turno || !perfil) {
        alert("Preencha todos os campos.");
        return;
    }

    // Verifica o RE
    if (matricula.length !== 6 || !/^\d+$/.test(matricula)) {
        alert("O RE deve conter exatamente 6 números.");
        return;
    }

    // Verifica se o RE já está cadastrado
    const funcionarioExistente = funcionarios.find(
        funcionario => funcionario.matricula === matricula);

    if (funcionarioExistente) {
        alert("Já existe um funcionário cadastrado com este RE.");
        return;
    }

    // Cria o funcionário com o perfil selecionado
    const funcionario = {
        nome: nome,
        matricula: matricula,
        funcao: funcao,
        posto: posto,
        empresa: empresa,
        turno: turno,
        perfil: perfil
    };

    // Adiciona à lista
    funcionarios.push(funcionario);

    // Salva no localStorage
    localStorage.setItem("funcionarios", JSON.stringify(funcionarios));

    console.log("Funcionário cadastrado:", funcionario);
    console.log("Funcionários salvos:", funcionarios);

    // Atualiza a tela
    mostrarFuncionarios();

    // Limpa o formulário e redefine o perfil padrão como 'funcionario'
    form.reset();
    if (campoPerfil) {
        campoPerfil.value = "funcionario";
    }
});

function mostrarFuncionarios() {

    listaFuncionarios.innerHTML = "";

    funcionarios.forEach((funcionario) => {

        const div = document.createElement("div");
        const perfilFormatado = funcionario.perfil === "administrador" ? "Administrador" : "Funcionário";

        div.innerHTML = `
            <p><strong>Nome:</strong> ${funcionario.nome}</p>
            <p><strong>RE:</strong> ${funcionario.matricula}</p>
            <p><strong>Função:</strong> ${funcionario.funcao}</p>
            <p><strong>Posto:</strong> ${funcionario.posto}</p>
            <p><strong>Empresa:</strong> ${funcionario.empresa}</p>
            <p><strong>Turno:</strong> ${funcionario.turno}</p>
            <p><strong>Perfil:</strong> ${perfilFormatado}</p>
            <button type="button" class="btn__excluir" data-matricula="${funcionario.matricula}" title="Excluir funcionário">
                <span class="fa fa-trash-alt"></span> Excluir
            </button>
            <hr>
        `;

        listaFuncionarios.appendChild(div);
    });
}

// ====================================================================
// Modal de Confirmação de Exclusão de Funcionário
// ====================================================================
const modalConfirmarExclusao = document.querySelector("#modalConfirmarExclusao");
const modalNomeFuncionario = document.querySelector("#modalNomeFuncionario");
const modalReFuncionario = document.querySelector("#modalReFuncionario");
const btnCancelarExclusao = document.querySelector("#btnCancelarExclusao");
const btnConfirmarExclusao = document.querySelector("#btnConfirmarExclusao");

let matriculaParaExcluir = null;

function abrirModalExclusao(funcionario) {
    if (!modalConfirmarExclusao) return;
    matriculaParaExcluir = funcionario.matricula;
    if (modalNomeFuncionario) modalNomeFuncionario.textContent = funcionario.nome;
    if (modalReFuncionario) modalReFuncionario.textContent = funcionario.matricula;
    modalConfirmarExclusao.classList.add("ativo");
    modalConfirmarExclusao.setAttribute("aria-hidden", "false");
}

function fecharModalExclusao() {
    if (!modalConfirmarExclusao) return;
    matriculaParaExcluir = null;
    modalConfirmarExclusao.classList.remove("ativo");
    modalConfirmarExclusao.setAttribute("aria-hidden", "true");
}

if (btnCancelarExclusao) {
    btnCancelarExclusao.addEventListener("click", fecharModalExclusao);
}

if (modalConfirmarExclusao) {
    modalConfirmarExclusao.addEventListener("click", (evento) => {
        if (evento.target === modalConfirmarExclusao) {
            fecharModalExclusao();
        }
    });
}

if (btnConfirmarExclusao) {
    btnConfirmarExclusao.addEventListener("click", () => {
        if (!matriculaParaExcluir) return;

        // Remove somente o funcionário com a matrícula correspondente
        funcionarios = funcionarios.filter(f => f.matricula !== matriculaParaExcluir);

        // Atualiza a chave no localStorage
        localStorage.setItem("funcionarios", JSON.stringify(funcionarios));

        // Atualiza a tela imediatamente
        mostrarFuncionarios();

        // Fecha o modal
        fecharModalExclusao();
    });
}

// Evento de exclusão de funcionário por delegação de eventos
listaFuncionarios.addEventListener("click", (evento) => {
    const botaoExcluir = evento.target.closest(".btn__excluir");
    if (!botaoExcluir) return;

    const matricula = botaoExcluir.dataset.matricula;
    const funcionario = funcionarios.find(f => f.matricula === matricula);
    if (!funcionario) return;

    abrirModalExclusao(funcionario);
});


// Mostra os funcionários salvos ao abrir a página
mostrarFuncionarios();

// ====================================================================
// Logout / Sair do Sistema
// ====================================================================
const linkMenuSair = document.querySelector("#linkMenuSair");
if (linkMenuSair) {
    linkMenuSair.addEventListener("click", (evento) => {
        evento.preventDefault();
        sessionStorage.removeItem("funcionarioLogado");
        window.location.href = "index.html";
    });
}

// ========================================================
// Menu Hambúrguer Responsivo (Mobile)
// ========================================================
function inicializarMenuBurguer() {
    const btnMenuBurguer = document.querySelector("#btnMenuBurguer");
    const menuLinks = document.querySelector(".menu__links");

    if (!btnMenuBurguer || !menuLinks) return;

    const icone = btnMenuBurguer.querySelector(".fa");

    function alternarMenu() {
        const estaAberto = menuLinks.classList.toggle("menu__links--aberto");
        btnMenuBurguer.setAttribute("aria-expanded", String(estaAberto));
        btnMenuBurguer.setAttribute(
            "aria-label",
            estaAberto ? "Fechar menu de navegação" : "Abrir menu de navegação"
        );
        if (icone) {
            if (estaAberto) {
                icone.classList.remove("fa-bars");
                icone.classList.add("fa-times");
            } else {
                icone.classList.remove("fa-times");
                icone.classList.add("fa-bars");
            }
        }
    }

    function fecharMenu() {
        if (menuLinks.classList.contains("menu__links--aberto")) {
            menuLinks.classList.remove("menu__links--aberto");
            btnMenuBurguer.setAttribute("aria-expanded", "false");
            btnMenuBurguer.setAttribute("aria-label", "Abrir menu de navegação");
            if (icone) {
                icone.classList.remove("fa-times");
                icone.classList.add("fa-bars");
            }
        }
    }

    btnMenuBurguer.addEventListener("click", alternarMenu);

    menuLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", fecharMenu);
    });
}

inicializarMenuBurguer();