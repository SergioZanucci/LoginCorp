// ========================================================
// Proteção de Acesso à Página (Requer Funcionário Autenticado)
// ========================================================
const funcionarioLogado = JSON.parse(
    sessionStorage.getItem("funcionarioLogado")
);

if (!funcionarioLogado) {
    window.location.href = "index.html";
}

const checkBoxDiurno = document.querySelector("#diurno");
checkBoxDiurno.addEventListener("click", () => {
    console.log(checkBoxDiurno.value);
});

if (funcionarioLogado) {

    document.querySelector("#namePosto").value =
        funcionarioLogado.posto;

    document.querySelector("#nameFuncionario").value =
        funcionarioLogado.nome;

    // document.querySelector("#reFuncionario").value =
    //     funcionarioLogado.matricula;

    document.querySelector("#nomeEmpresaVig").value =
        funcionarioLogado.empresa;

    document.querySelector("#nomeFuncao").value =
        funcionarioLogado.funcao;
}

const checkBoxNoturno = document.querySelector("#noturno");
checkBoxNoturno.addEventListener("click", () => {
    console.log(checkBoxNoturno.value);
});

const nomePosto = document.querySelector("#namePosto");
nomePosto.addEventListener("click", () => {
    console.log(nomePosto.value);
});

const dataEntrada = document.querySelector("#date__entrada");
dataEntrada.addEventListener("click", () => {
    console.log(dataEntrada.value);
});

const dataSaida = document.querySelector("#date__saida");
dataSaida.addEventListener("click", () => {
    console.log(dataSaida.value);
});

const nomeFuncionario = document.querySelector("#nameFuncionario");
nomeFuncionario.addEventListener("click", () => {
    console.log(nomeFuncionario.value);
});


function addCampo() {
    const formulario = document.querySelector(".dados__funcionario");
    formulario.insertAdjacentHTML("beforeend", `
    <div class="campo">
        <label for="namePosto">Posto de Serviço</label>
        <input type="text" id="namePosto"  name="namePosto" required>
    
        <label for="date">Entrada Data e Hora</label>
        <input type="datetime-local" id="date" name="date" required>
    
        <label for="turnoServico">Saida Data e Hora</label>
        <input type="datetime-local" id="turnoServico" name="turnoServico" required>
    
        <label for="nameFuncionario">Nome</label>
        <input type="text" id="nameFuncionario" name="nameFuncionario" required autocomplete="off">
    
        <label for="nomeEmpresaVig">Empresa</label>
        <input type="text" id="nomeEmpresaVig" name="nomeEmpresa" required>
    
        <label for="nomeFuncao">Função</label>
        <input type="text" id="nomeFuncao" name="nomeFuncao" required>
    
        <div class="btn__add__remove__campo">
            <button type="button" id="addFuncionario">+</button>
            <button type="button" id="removeFuncionario">-</button>
        </div><br>
    </div>`);
}
const formularioPlantonistas = document.querySelector(".dados__funcionario");
if (formularioPlantonistas) {
    formularioPlantonistas.onclick = function (event) {
        if (event.target.id === 'removeFuncionario') {
            const campo = event.target.closest('.campo');
            const todosCampos = formularioPlantonistas.querySelectorAll('.campo');
            // O primeiro vigilante (todosCampos[0]) é obrigatório e nunca pode ser removido
            if (campo && campo !== todosCampos[0]) {
                campo.remove(); // Remove apenas os vigilantes adicionais
            }
        } else if (event.target.id === 'addFuncionario') {
            addCampo(); // Adiciona um novo vigilante
        }
    };
}

let nomeLogin = document.querySelector("#encerrar");
if (nomeLogin) {
    nomeLogin.addEventListener("click", () => {
        console.log("Ola");
    });
}

// ====================================================================
// Gerenciamento Dinâmico de Equipes e Prestadores de Serviços
// ====================================================================

const containerEquipes = document.querySelector("#containerEquipes");
const btnAdicionarEquipe = document.querySelector("#btnAdicionarEquipe");

// Função didática para criar o HTML de um novo funcionário da equipe
function criarTemplateFuncionario(numero) {
    return `
    <div class="item__funcionario">
        <div class="cabecalho__funcionario">
            <h5>Funcionário ${numero}</h5>
            <button type="button" class="btn__remover-funcionario" title="Remover funcionário">-</button>
        </div>
        <div class="grid__funcionario">
            <div class="campo">
                <label>Nome</label>
                <input type="text" name="nomeFuncionarioPrestador" placeholder="Nome completo" autocomplete="off">
            </div>
            <div class="campo">
                <label>Tipo de documento</label>
                <select name="tipoDocumento">
                    <option value="RG">RG</option>
                    <option value="CPF">CPF</option>
                    <option value="ID">ID</option>
                </select>
            </div>
            <div class="campo">
                <label>Documento</label>
                <input type="text" name="numeroDocumento" placeholder="Número do documento" autocomplete="off">
            </div>
            <div class="campo">
                <label>Entrada</label>
                <input type="datetime-local" name="entradaPrestador">
            </div>
            <div class="campo">
                <label>Saída</label>
                <input type="datetime-local" name="saidaPrestador">
            </div>
        </div>
    </div>`;
}

// Função didática para criar o HTML de um novo bloco de equipe
function criarTemplateEquipe(numeroEquipe) {
    return `
    <div class="bloco__equipe">
        <div class="cabecalho__equipe">
            <h3>Equipe ${numeroEquipe}</h3>
            <button type="button" class="btn__remover-equipe" title="Remover esta equipe">Remover equipe</button>
        </div>
        <div class="dados__equipe">
            <div class="campo">
                <label>Empresa</label>
                <input type="text" name="empresa" placeholder="Nome da empresa" autocomplete="off">
            </div>
            <div class="campo">
                <label>Veículo</label>
                <input type="text" name="veiculo" placeholder="Modelo do veículo" autocomplete="off">
            </div>
            <div class="campo">
                <label>Cor</label>
                <input type="text" name="cor" placeholder="Cor do veículo" autocomplete="off">
            </div>
            <div class="campo">
                <label>Placa</label>
                <input type="text" name="placa" placeholder="Placa do veículo" autocomplete="off">
            </div>
        </div>
        <div class="container__membros">
            <h4>Integrantes da Equipe</h4>
            <div class="lista__membros">
                ${criarTemplateFuncionario(1)}
            </div>
            <button type="button" class="btn__adicionar-funcionario">+ Adicionar funcionário</button>
        </div>
    </div>`;
}

// Atualiza a numeração sequencial dos funcionários em uma equipe específica
function atualizarNumeracaoFuncionarios(blocoEquipe) {
    const listaFuncionarios = blocoEquipe.querySelectorAll(".item__funcionario");
    listaFuncionarios.forEach((item, index) => {
        const titulo = item.querySelector("h5");
        if (titulo) {
            titulo.textContent = `Funcionário ${index + 1}`;
        }
    });
}

// Atualiza a numeração sequencial das equipes caso alguma seja removida
function atualizarNumeracaoEquipes() {
    const listaEquipes = containerEquipes.querySelectorAll(".bloco__equipe");
    listaEquipes.forEach((equipe, index) => {
        const titulo = equipe.querySelector(".cabecalho__equipe h3");
        if (titulo) {
            titulo.textContent = `Equipe ${index + 1}`;
        }
    });
}

// Evento: Adicionar nova empresa/equipe independente
if (btnAdicionarEquipe) {
    btnAdicionarEquipe.addEventListener("click", () => {
        const totalEquipes = containerEquipes.querySelectorAll(".bloco__equipe").length;
        const novaEquipeHTML = criarTemplateEquipe(totalEquipes + 1);
        containerEquipes.insertAdjacentHTML("beforeend", novaEquipeHTML);
    });
}

// Delegação de eventos no container de equipes: gerencia adições e remoções dinâmicas
if (containerEquipes) {
    containerEquipes.addEventListener("click", (evento) => {
        const alvo = evento.target;

        // 1. Adicionar funcionário dentro da equipe clicada
        if (alvo.classList.contains("btn__adicionar-funcionario")) {
            const blocoEquipe = alvo.closest(".bloco__equipe");
            const listaMembros = blocoEquipe.querySelector(".lista__membros");
            const totalFuncionarios = listaMembros.querySelectorAll(".item__funcionario").length;

            const novoFuncionarioHTML = criarTemplateFuncionario(totalFuncionarios + 1);
            listaMembros.insertAdjacentHTML("beforeend", novoFuncionarioHTML);
        }

        // 2. Remover funcionário da equipe
        if (alvo.classList.contains("btn__remover-funcionario")) {
            const itemFuncionario = alvo.closest(".item__funcionario");
            const blocoEquipe = alvo.closest(".bloco__equipe");
            const listaMembros = blocoEquipe.querySelector(".lista__membros");
            const totalFuncionarios = listaMembros.querySelectorAll(".item__funcionario").length;

            if (totalFuncionarios <= 1) {
                alert("Cada equipe deve possuir pelo menos um funcionário registrado.");
                return;
            }

            itemFuncionario.remove();
            atualizarNumeracaoFuncionarios(blocoEquipe);
        }

        // 3. Remover a equipe inteira
        if (alvo.classList.contains("btn__remover-equipe")) {
            const blocoEquipe = alvo.closest(".bloco__equipe");
            const totalEquipes = containerEquipes.querySelectorAll(".bloco__equipe").length;

            if (totalEquipes <= 1) {
                alert("O registro deve conter ao menos um bloco de equipe.");
                return;
            }

            blocoEquipe.remove();
            atualizarNumeracaoEquipes();
        }
    });
}

// ========================================================
// Controle de Acesso ao Menu "Funcionários" e Modal Reutilizável
// ========================================================
const linkMenuFuncionarios = document.querySelector("#linkMenuFuncionarios") || document.querySelector('a[href="cadastros.html"]');
const modalAviso = document.querySelector("#modalAviso");
const btnFecharModal = document.querySelector("#btnFecharModal");

/**
 * Exibe o modal de aviso reutilizável com título e mensagem personalizados.
 * @param {string} [titulo] - Título da mensagem
 * @param {string} [mensagem] - Texto descritivo
 */
function abrirModalAviso(titulo, mensagem) {
    if (!modalAviso) return;

    if (titulo) {
        const elementoTitulo = modalAviso.querySelector(".modal__titulo");
        if (elementoTitulo) elementoTitulo.textContent = titulo;
    }
    if (mensagem) {
        const elementoMensagem = modalAviso.querySelector(".modal__mensagem");
        if (elementoMensagem) elementoMensagem.textContent = mensagem;
    }

    modalAviso.classList.add("ativo");
    modalAviso.setAttribute("aria-hidden", "false");
}

/**
 * Fecha o modal de aviso.
 */
function fecharModalAviso() {
    if (!modalAviso) return;
    modalAviso.classList.remove("ativo");
    modalAviso.setAttribute("aria-hidden", "true");
}

if (btnFecharModal) {
    btnFecharModal.addEventListener("click", fecharModalAviso);
}

if (modalAviso) {
    modalAviso.addEventListener("click", (evento) => {
        if (evento.target === modalAviso) {
            fecharModalAviso();
        }
    });
}

// Intercepta o clique no item "Funcionários" se o perfil não for administrador
if (linkMenuFuncionarios) {
    linkMenuFuncionarios.addEventListener("click", (evento) => {
        // Se o usuário logado for administrador, navega normalmente para cadastros.html
        if (funcionarioLogado && funcionarioLogado.perfil === "administrador") {
            return;
        }

        // Se for funcionário comum ou cadastro legado sem perfil, intercepta o clique
        evento.preventDefault();
        abrirModalAviso("Acesso negado", "Você não tem permissão para acessar esta área.");
    });
}

// ========================================================
// Logout / Sair do Sistema
// ========================================================
const linkMenuSair = document.querySelector("#linkMenuSair");
if (linkMenuSair) {
    linkMenuSair.addEventListener("click", (evento) => {
        evento.preventDefault();
        sessionStorage.removeItem("funcionarioLogado");
        window.location.href = "index.html";
    });
}

