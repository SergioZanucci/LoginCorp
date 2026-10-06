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
    const campoPosto = document.querySelector("#namePosto");
    if (campoPosto && funcionarioLogado.posto) {
        campoPosto.value = funcionarioLogado.posto;
    }

    const campoNome = document.querySelector("#nameFuncionario");
    if (campoNome && funcionarioLogado.nome) {
        campoNome.value = funcionarioLogado.nome;
    }

    const campoRe = document.querySelector("#reFuncionario");
    if (campoRe && funcionarioLogado.matricula) {
        campoRe.value = String(funcionarioLogado.matricula);
    }

    const campoEmpresa = document.querySelector("#nomeEmpresaVig");
    if (campoEmpresa && funcionarioLogado.empresa) {
        campoEmpresa.value = funcionarioLogado.empresa;
    }

    const campoFuncao = document.querySelector("#nomeFuncao");
    if (campoFuncao && funcionarioLogado.funcao) {
        campoFuncao.value = funcionarioLogado.funcao;
    }

    const campoTurnoPlantonista = document.querySelector("#turnoPlantonista");
    if (campoTurnoPlantonista && funcionarioLogado.turno) {
        campoTurnoPlantonista.value = funcionarioLogado.turno.toLowerCase();
    }

    // Sincroniza também a seleção do Bloco 1 com o turno do funcionário logado
    if (funcionarioLogado.turno) {
        const radioTurno = document.querySelector(`input[name="turno"][value="${funcionarioLogado.turno.toLowerCase()}"]`);
        if (radioTurno) {
            radioTurno.checked = true;
        }
    }
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

const reFuncionario = document.querySelector("#reFuncionario");
if (reFuncionario) {
    reFuncionario.addEventListener("click", () => {
        console.log(reFuncionario.value);
    });
}

// ====================================================================
// Gerenciamento de Vigilantes da Equipe de Plantão (Bloco 2)
// ====================================================================

// Função didática para criar o HTML de um novo vigilante da equipe de plantão
function criarTemplatePlantonista(numero) {
    return `
    <div class="campo campo--bloco">
        <div class="cabecalho__plantonista">
            <h4><span class="fa fa-user-friends"></span> Vigilante ${numero} — Integrante do Plantão</h4>
            <button type="button" class="btn__remover-plantonista" title="Remover este integrante">-</button>
        </div>
        <div class="grid__campos">
            <div class="item__campo">
                <label for="namePosto_${numero}">Posto de Serviço</label>
                <input type="text" id="namePosto_${numero}" name="namePosto" class="campo__posto-plantonista" placeholder="Posto de serviço" autocomplete="off">
            </div>

            <div class="item__campo">
                <label for="date__entrada_${numero}">Entrada Data e Hora</label>
                <input type="datetime-local" id="date__entrada_${numero}" name="date" class="campo__entrada-plantonista">
            </div>

            <div class="item__campo">
                <label for="date__saida_${numero}">Saída Data e Hora</label>
                <input type="datetime-local" id="date__saida_${numero}" name="dataHoraSaida" class="campo__saida-plantonista">
            </div>

            <div class="item__campo">
                <label for="turnoPlantonista_${numero}">Turno</label>
                <select id="turnoPlantonista_${numero}" name="turnoPlantonista" class="campo__turno-plantonista">
                    <option value="">Selecione...</option>
                    <option value="diurno">Diurno</option>
                    <option value="noturno">Noturno</option>
                </select>
            </div>

            <div class="item__campo">
                <label for="nameFuncionario_${numero}">Nome</label>
                <input type="text" id="nameFuncionario_${numero}" name="nameFuncionario" class="campo__nome-plantonista" placeholder="Nome completo" autocomplete="off">
            </div>

            <div class="item__campo">
                <label for="reFuncionario_${numero}">Matrícula (RE)</label>
                <input type="text" id="reFuncionario_${numero}" name="reFuncionario" class="campo__re-plantonista" placeholder="RE (ex: 004171)" maxlength="6" autocomplete="off">
            </div>

            <div class="item__campo">
                <label for="nomeEmpresaVig_${numero}">Empresa</label>
                <input type="text" id="nomeEmpresaVig_${numero}" name="nomeEmpresa" class="campo__empresa-plantonista" placeholder="Empresa" autocomplete="off">
            </div>

            <div class="item__campo">
                <label for="nomeFuncao_${numero}">Função</label>
                <input type="text" id="nomeFuncao_${numero}" name="nomeFuncao" class="campo__funcao-plantonista" placeholder="Função / Cargo" autocomplete="off">
            </div>
        </div>
    </div>`;
}

// Atualiza a numeração sequencial dos vigilantes adicionados à equipe
function atualizarNumeracaoPlantonistas() {
    const formulario = document.querySelector(".dados__funcionario");
    if (!formulario) return;
    const todosCampos = formulario.querySelectorAll(".campo");
    todosCampos.forEach((campo, index) => {
        const titulo = campo.querySelector(".cabecalho__plantonista h4");
        if (titulo) {
            if (index === 0) {
                titulo.innerHTML = `<span class="fa fa-user-shield"></span> Vigilante 1 — Integrante do Plantão (Autor)`;
            } else {
                titulo.innerHTML = `<span class="fa fa-user-friends"></span> Vigilante ${index + 1} — Integrante do Plantão`;
            }
        }
    });
}

function addCampo() {
    const formulario = document.querySelector(".dados__funcionario");
    if (!formulario) return;

    const totalCampos = formulario.querySelectorAll(".campo").length;
    const novoNumero = totalCampos + 1;

    // Replica os dados comuns do plantão (posto, entrada, saída e turno) se preenchidos no autor
    const postoAutor = document.querySelector("#namePosto")?.value || "";
    const entradaAutor = document.querySelector("#date__entrada")?.value || "";
    const saidaAutor = document.querySelector("#date__saida")?.value || "";
    const turnoAutor = document.querySelector("#turnoPlantonista")?.value || "";

    const novoCardHTML = criarTemplatePlantonista(novoNumero);
    formulario.insertAdjacentHTML("beforeend", novoCardHTML);

    const novoCard = formulario.lastElementChild;
    if (postoAutor) {
        const inputPosto = novoCard.querySelector(".campo__posto-plantonista");
        if (inputPosto) inputPosto.value = postoAutor;
    }
    if (entradaAutor) {
        const inputEntrada = novoCard.querySelector(".campo__entrada-plantonista");
        if (inputEntrada) inputEntrada.value = entradaAutor;
    }
    if (saidaAutor) {
        const inputSaida = novoCard.querySelector(".campo__saida-plantonista");
        if (inputSaida) inputSaida.value = saidaAutor;
    }
    if (turnoAutor) {
        const selectTurno = novoCard.querySelector(".campo__turno-plantonista");
        if (selectTurno) selectTurno.value = turnoAutor;
    }
}

const formularioPlantonistas = document.querySelector(".dados__funcionario");
if (formularioPlantonistas) {
    formularioPlantonistas.onclick = function (event) {
        const botaoRemover = event.target.closest('.btn__remover-plantonista') || (event.target.id === 'removeFuncionario' ? event.target : null);
        const botaoAdicionar = event.target.closest('#addFuncionario');

        if (botaoRemover) {
            const campo = botaoRemover.closest('.campo');
            const todosCampos = formularioPlantonistas.querySelectorAll('.campo');
            // O primeiro vigilante (todosCampos[0]) é obrigatório e nunca pode ser removido
            if (campo && campo !== todosCampos[0]) {
                campo.remove(); // Remove apenas os vigilantes adicionais
                atualizarNumeracaoPlantonistas();
            }
        } else if (botaoAdicionar) {
            addCampo(); // Adiciona um novo vigilante
        }
    };
}

// ========================================================
// Confirmação Segura de Envio do Relatório por RE (#encerrar)
// ========================================================
const btnEncerrar = document.querySelector("#encerrar");
const modalConfirmarEnvio = document.querySelector("#modalConfirmarEnvio");
const btnCancelarConfirmacao = document.querySelector("#btnCancelarConfirmacao");
const btnConfirmarEnvioFinal = document.querySelector("#btnConfirmarEnvioFinal");
const inputConfirmarRe = document.querySelector("#inputConfirmarRe");
const erroConfirmarRe = document.querySelector("#erroConfirmarRe");
const confirmacaoNomeAutor = document.querySelector("#confirmacaoNomeAutor");
const confirmacaoReAutor = document.querySelector("#confirmacaoReAutor");

let elementoGatilhoConfirmacao = null;
let enviandoRelatorio = false;

function abrirModalConfirmacao() {
    if (!modalConfirmarEnvio) return;

    enviandoRelatorio = false;
    if (btnConfirmarEnvioFinal) {
        btnConfirmarEnvioFinal.disabled = false;
    }

    elementoGatilhoConfirmacao = document.activeElement || btnEncerrar;

    // Obtém os dados do vigilante logado a partir de sessionStorage
    const autorAtual = JSON.parse(sessionStorage.getItem("funcionarioLogado"));
    if (!autorAtual) {
        window.location.href = "index.html";
        return;
    }

    if (confirmacaoNomeAutor) {
        confirmacaoNomeAutor.textContent = autorAtual.nome || "--";
    }
    if (confirmacaoReAutor) {
        // Exibe o RE exatamente como texto preservando zeros à esquerda
        confirmacaoReAutor.textContent = String(autorAtual.matricula || "--");
    }

    if (inputConfirmarRe) {
        inputConfirmarRe.value = "";
    }
    if (erroConfirmarRe) {
        erroConfirmarRe.style.display = "none";
        erroConfirmarRe.textContent = "";
    }

    modalConfirmarEnvio.classList.add("ativo");
    modalConfirmarEnvio.setAttribute("aria-hidden", "false");

    if (inputConfirmarRe) {
        setTimeout(() => inputConfirmarRe.focus(), 100);
    }
}

function fecharModalConfirmacao(retornarFoco = true) {
    if (!modalConfirmarEnvio) return;

    // 1. Verifica se document.activeElement pertence ao modal que está sendo fechado
    if (document.activeElement && modalConfirmarEnvio.contains(document.activeElement)) {
        // 2. Se pertencer, retira o foco desse elemento com .blur()
        document.activeElement.blur();
    }

    // 3. Somente depois aplica aria-hidden="true" e o mecanismo existente de ocultação
    modalConfirmarEnvio.classList.remove("ativo");
    modalConfirmarEnvio.setAttribute("aria-hidden", "true");

    if (inputConfirmarRe) inputConfirmarRe.value = "";
    if (erroConfirmarRe) erroConfirmarRe.style.display = "none";

    // 4. Depois que o modal estiver fechado, o foco pode retornar ao elemento que abriu o modal, quando apropriado
    if (retornarFoco && elementoGatilhoConfirmacao && typeof elementoGatilhoConfirmacao.focus === "function") {
        elementoGatilhoConfirmacao.focus();
    }
}

// Variável em memória para armazenar o último relatório montado nesta etapa (sem persistência)
let relatorioEmMemoria = null;

/**
 * Coleta os dados de equipes externas e prestadores de serviços de #containerEquipes.
 * Retorna um array vazio se nenhuma equipe externa tiver sido preenchida.
 * @returns {Array<Object>}
 */
function coletarEquipesExternas() {
    const container = document.querySelector("#containerEquipes");
    if (!container) return [];

    const blocosEquipe = container.querySelectorAll(".bloco__equipe");
    const equipes = [];

    blocosEquipe.forEach(bloco => {
        const empresa = bloco.querySelector('input[name="empresa"]')?.value.trim() || "";
        const veiculo = bloco.querySelector('input[name="veiculo"]')?.value.trim() || "";
        const cor = bloco.querySelector('input[name="cor"]')?.value.trim() || "";
        const placa = bloco.querySelector('input[name="placa"]')?.value.trim() || "";
        const registroAlteracao = bloco.querySelector('textarea[name="registroAlteracaoEquipe"]')?.value.trim() || "";

        const itensMembros = bloco.querySelectorAll(".item__funcionario");
        const membros = [];

        itensMembros.forEach(item => {
            const nome = item.querySelector('input[name="nomeFuncionarioPrestador"]')?.value.trim() || "";
            const tipoDocumento = item.querySelector('select[name="tipoDocumento"]')?.value || "";
            const numeroDocumento = item.querySelector('input[name="numeroDocumento"]')?.value.trim() || "";
            const entrada = item.querySelector('input[name="entradaPrestador"]')?.value || "";
            const saida = item.querySelector('input[name="saidaPrestador"]')?.value || "";

            const temDadosMembro = Boolean(nome || numeroDocumento || entrada || saida);
            if (temDadosMembro) {
                membros.push({
                    nome,
                    tipoDocumento,
                    numeroDocumento,
                    entrada,
                    saida
                });
            }
        });

        const temDadosEquipe = Boolean(empresa || veiculo || cor || placa || registroAlteracao || membros.length > 0);
        if (temDadosEquipe) {
            equipes.push({
                empresa,
                veiculo,
                cor,
                placa,
                registroAlteracao,
                membros
            });
        }
    });

    return equipes;
}

/**
 * Coleta todos os integrantes da equipe de plantão percorrendo os cards do formulário.
 * O primeiro card (autor) recebe isAutor: true e dados de autorLogado; os demais recebem isAutor: false.
 * @param {Object} autorLogado - Dados do funcionário logado obtidos de sessionStorage
 * @returns {Array<Object>}
 */
function coletarEquipePlantao(autorLogado) {
    const cardsVigilantes = document.querySelectorAll(".dados__funcionario .campo--bloco");
    const equipe = [];

    cardsVigilantes.forEach((card, index) => {
        const isAutor = (index === 0);

        const posto = card.querySelector(".campo__posto-plantonista")?.value.trim() || (isAutor ? (autorLogado.posto || "") : "");
        const horarioEntrada = card.querySelector(".campo__entrada-plantonista")?.value || "";
        const horarioSaida = card.querySelector(".campo__saida-plantonista")?.value || "";
        const turno = card.querySelector(".campo__turno-plantonista")?.value || "";

        const nome = isAutor
            ? (autorLogado.nome || "")
            : (card.querySelector(".campo__nome-plantonista")?.value.trim() || "");

        const matricula = isAutor
            ? (autorLogado.matricula != null ? String(autorLogado.matricula) : "")
            : (card.querySelector(".campo__re-plantonista")?.value.trim() || "");

        const funcao = isAutor
            ? (autorLogado.funcao || "")
            : (card.querySelector(".campo__funcao-plantonista")?.value.trim() || "");

        const empresa = isAutor
            ? (autorLogado.empresa || "")
            : (card.querySelector(".campo__empresa-plantonista")?.value.trim() || "");

        equipe.push({
            nome,
            matricula,
            funcao,
            empresa,
            posto,
            horarioEntrada,
            horarioSaida,
            turno,
            isAutor
        });
    });

    return equipe;
}

/**
 * Monta em memória o objeto completo do relatório a partir dos dados do formulário e da sessão.
 * @returns {Object}
 */
function montarObjetoRelatorio() {
    const autorLogado = JSON.parse(sessionStorage.getItem("funcionarioLogado")) || {};

    const entradaServico = document.querySelector("#date__entrada")?.value || "";
    const dataServico = entradaServico.includes("T") ? entradaServico.split("T")[0] : entradaServico;

    const radioTurnoSelecionado = document.querySelector('input[name="turno"]:checked');
    const turnoServico = radioTurnoSelecionado
        ? radioTurnoSelecionado.value
        : (document.querySelector("#turnoPlantonista")?.value || "");

    const relatorio = {
        id: "REL-" + Date.now(),

        dataHoraCriacao: new Date().toISOString(),

        dataServico: dataServico,

        servico: {
            turno: turnoServico,
            posto: document.querySelector("#namePosto")?.value.trim() || autorLogado.posto || "",
            horarioEntrada: document.querySelector("#date__entrada")?.value || "",
            horarioSaida: document.querySelector("#date__saida")?.value || ""
        },

        autor: {
            nome: autorLogado.nome || "",
            matricula: autorLogado.matricula != null ? String(autorLogado.matricula) : "",
            funcao: autorLogado.funcao || "",
            empresa: autorLogado.empresa || ""
        },

        equipePlantao: coletarEquipePlantao(autorLogado),

        registroAlteracaoPlantao: document.querySelector("#registroAlteracaoPlantao")?.value.trim() || "",

        equipesExternas: coletarEquipesExternas(),

        registroGeralTurno: document.querySelector("#areatexto")?.value.trim() || "",

        ocorrencia: {
            tipo: document.querySelector("#tipoOcorrencia")?.value || "",
            dataHora: document.querySelector("#dataHora")?.value || "",
            local: document.querySelector("#localOcorrencia")?.value.trim() || "",
            descricaoDetalhada: document.querySelector("#descricaoDetalhada")?.value.trim() || ""
        }
    };

    return relatorio;
}

function validarConfirmacaoRe() {
    const autorAtual = JSON.parse(sessionStorage.getItem("funcionarioLogado"));
    if (!autorAtual || !inputConfirmarRe) return;

    // Tratar ambos estritamente como texto (String), sem converter para número, preservando zeros à esquerda
    const reDigitado = String(inputConfirmarRe.value.trim());
    const reCadastrado = String(autorAtual.matricula).trim();

    if (!reDigitado) {
        if (erroConfirmarRe) {
            erroConfirmarRe.textContent = "Digite seu RE para confirmar.";
            erroConfirmarRe.style.display = "block";
        }
        inputConfirmarRe.focus();
        return;
    }

    if (reDigitado !== reCadastrado) {
        if (erroConfirmarRe) {
            erroConfirmarRe.textContent = "RE incorreto. Digite exatamente o seu RE.";
            erroConfirmarRe.style.display = "block";
        }
        inputConfirmarRe.focus();
        inputConfirmarRe.select();
        return;
    }

    // RE confere perfeitamente
    if (erroConfirmarRe) erroConfirmarRe.style.display = "none";
    console.log("RE validado com sucesso para o autor:", autorAtual.nome, "RE:", reCadastrado);

    // Proteção contra duplo clique: verifica se já está em processamento
    if (enviandoRelatorio) {
        return;
    }
    enviandoRelatorio = true;
    if (btnConfirmarEnvioFinal) {
        btnConfirmarEnvioFinal.disabled = true;
    }

    fecharModalConfirmacao();

    // Montagem do objeto completo do relatório
    const relatorio = montarObjetoRelatorio();
    relatorioEmMemoria = relatorio;
    console.log("Relatório montado:", relatorio);

    try {
        // Persistência permanente no localStorage
        const relatorios = JSON.parse(localStorage.getItem("relatorios")) || [];
        relatorios.push(relatorio);
        localStorage.setItem("relatorios", JSON.stringify(relatorios));
        console.log("Relatório salvo no localStorage com sucesso. Total de relatórios:", relatorios.length);

        // Feedback visual do salvamento do relatório
        abrirModalAviso(
            "Relatório Salvo com Sucesso",
            `Vigilante ${autorAtual.nome} (RE: ${reCadastrado}), seu relatório foi registrado e salvo com sucesso!`
        );
    } catch (erro) {
        console.error("Erro ao salvar relatório no localStorage:", erro);
        // Em caso de erro: não mostra sucesso e informa via modal de aviso existente
        // O relatório permanece preservado em relatorioEmMemoria
        abrirModalAviso(
            "Erro ao Salvar Relatório",
            "Não foi possível gravar o relatório no armazenamento local do navegador. Verifique as permissões de armazenamento e tente novamente."
        );
    } finally {
        enviandoRelatorio = false;
        if (btnConfirmarEnvioFinal) {
            btnConfirmarEnvioFinal.disabled = false;
        }
    }
}

// ========================================================
// Validação dos Campos Obrigatórios do Plantão e Vigilantes
// ========================================================

/**
 * Valida os campos obrigatórios do plantão e dos vigilantes.
 * Blocos opcionais (Equipes/Prestadores, Registros e Alterações, Detalhes da Ocorrência) NÃO são validados como obrigatórios.
 * @returns {{ valido: boolean, campo?: HTMLElement, nomeCampo?: string, identificacao?: string }}
 */
function validarCamposObrigatorios() {
    // 1. Turno de Serviço Geral (Bloco 1)
    const radioTurno = document.querySelector('input[name="turno"]:checked');
    if (!radioTurno) {
        const primeiroRadio = document.querySelector('#diurno') || document.querySelector('input[name="turno"]');
        return {
            valido: false,
            campo: primeiroRadio,
            nomeCampo: "Turno",
            identificacao: "Turno de Serviço (Bloco 1)"
        };
    }

    // 2. Vigilantes da Equipe de Plantão (Card 1 Autor e Vigilantes Adicionais)
    const cardsVigilantes = document.querySelectorAll(".dados__funcionario .campo--bloco");

    for (let index = 0; index < cardsVigilantes.length; index++) {
        const card = cardsVigilantes[index];
        const isAutor = (index === 0);
        const rotuloVigilante = isAutor ? "Vigilante 1 — Integrante do Plantão (Autor)" : `Vigilante ${index + 1} — Integrante do Plantão`;

        // Lista ordenada dos campos obrigatórios em cada card
        const campos = [
            {
                seletor: ".campo__posto-plantonista",
                nome: "Posto de Serviço"
            },
            {
                seletor: ".campo__entrada-plantonista",
                nome: "Entrada Data e Hora"
            },
            {
                seletor: ".campo__saida-plantonista",
                nome: "Saída Data e Hora"
            },
            {
                seletor: ".campo__turno-plantonista",
                nome: "Turno"
            },
            {
                seletor: ".campo__nome-plantonista",
                nome: "Nome"
            },
            {
                seletor: ".campo__re-plantonista",
                nome: "Matrícula (RE)"
            },
            {
                seletor: ".campo__empresa-plantonista",
                nome: "Empresa"
            },
            {
                seletor: ".campo__funcao-plantonista",
                nome: "Função"
            }
        ];

        for (const item of campos) {
            const elemento = card.querySelector(item.seletor);
            if (!elemento || !elemento.value || !elemento.value.trim()) {
                return {
                    valido: false,
                    campo: elemento,
                    nomeCampo: item.nome,
                    identificacao: rotuloVigilante
                };
            }
        }
    }

    return { valido: true };
}

if (btnEncerrar) {
    btnEncerrar.addEventListener("click", (evento) => {
        evento.preventDefault();

        // Validação prévia dos campos obrigatórios antes de abrir o modal de confirmação
        const validacao = validarCamposObrigatorios();
        if (!validacao.valido) {
            abrirModalAviso(
                "Campos Obrigatórios Pendentes",
                `O campo "${validacao.nomeCampo}" em "${validacao.identificacao}" é obrigatório e precisa ser preenchido antes de confirmar o envio do relatório.`,
                validacao.campo
            );
            return;
        }

        abrirModalConfirmacao();
    });
}

if (btnCancelarConfirmacao) {
    btnCancelarConfirmacao.addEventListener("click", fecharModalConfirmacao);
}

if (btnConfirmarEnvioFinal) {
    btnConfirmarEnvioFinal.addEventListener("click", validarConfirmacaoRe);
}

if (inputConfirmarRe) {
    inputConfirmarRe.addEventListener("keydown", (evento) => {
        if (evento.key === "Enter") {
            evento.preventDefault();
            validarConfirmacaoRe();
        } else if (evento.key === "Escape") {
            fecharModalConfirmacao();
        }
    });
}

if (modalConfirmarEnvio) {
    modalConfirmarEnvio.addEventListener("click", (evento) => {
        if (evento.target === modalConfirmarEnvio) {
            fecharModalConfirmacao();
        }
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
        <div class="textarea__ocorrencia" style="margin-top: 15px;">
            <label>Registro / Alteração da Equipe</label>
            <textarea name="registroAlteracaoEquipe" placeholder="Digite registros, serviços executados ou alterações desta equipe..."></textarea>
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

let elementoGatilhoAviso = null;

/**
 * Exibe o modal de aviso reutilizável com título e mensagem personalizados.
 * @param {string} [titulo] - Título da mensagem
 * @param {string} [mensagem] - Texto descritivo
 * @param {HTMLElement} [elementoParaFoco] - Elemento opcional que deve receber foco após o fechamento do modal
 */
function abrirModalAviso(titulo, mensagem, elementoParaFoco = null) {
    if (!modalAviso) return;

    elementoGatilhoAviso = elementoParaFoco || document.activeElement;

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

    if (btnFecharModal) {
        setTimeout(() => btnFecharModal.focus(), 100);
    }
}

/**
 * Fecha o modal de aviso com remoção de foco prévia para evitar avisos de acessibilidade.
 */
function fecharModalAviso() {
    if (!modalAviso) return;

    // 1. Verifica se document.activeElement pertence ao modal que está sendo fechado
    if (document.activeElement && modalAviso.contains(document.activeElement)) {
        // 2. Se pertencer, retira o foco desse elemento com .blur()
        document.activeElement.blur();
    }

    // 3. Somente depois aplica aria-hidden="true" e o mecanismo existente de ocultação
    modalAviso.classList.remove("ativo");
    modalAviso.setAttribute("aria-hidden", "true");

    // 4. Depois que o modal estiver fechado, o foco pode retornar ao elemento gatilho ou ao primeiro campo pendente
    if (elementoGatilhoAviso && typeof elementoGatilhoAviso.focus === "function") {
        elementoGatilhoAviso.focus();
        if (typeof elementoGatilhoAviso.scrollIntoView === "function") {
            elementoGatilhoAviso.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }
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

