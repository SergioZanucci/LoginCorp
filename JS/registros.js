// ========================================================
// Proteção de Acesso à Página (Requer Funcionário Autenticado)
// ========================================================
const funcionarioLogado = JSON.parse(
    sessionStorage.getItem("funcionarioLogado")
);

if (!funcionarioLogado) {
    window.location.href = "index.html";
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

// ========================================================
// Funções Auxiliares de Formatação e Valores Vazios (—)
// ========================================================

/**
 * Retorna o valor original ou o travessão "—" se estiver vazio/nulo.
 * @param {*} valor
 * @returns {string}
 */
function valorOuTraco(valor) {
    if (valor === undefined || valor === null) return "—";
    const str = String(valor).trim();
    return str !== "" ? str : "—";
}

/**
 * Formata data no padrão brasileiro DD/MM/AAAA ou retorna "—".
 * @param {string} dataStr
 * @returns {string}
 */
function formatarData(dataStr) {
    if (!dataStr) return "—";
    const str = String(dataStr).trim();
    if (!str) return "—";
    const partes = str.split("-");
    if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return str;
}

/**
 * Formata data e hora no padrão DD/MM/AAAA às HH:MM ou retorna "—".
 * @param {string} dataHoraStr
 * @returns {string}
 */
function formatarDataHora(dataHoraStr) {
    if (!dataHoraStr) return "—";
    const str = String(dataHoraStr).trim();
    if (!str) return "—";
    if (str.includes("T")) {
        const [data, horaCompleta] = str.split("T");
        const hora = horaCompleta.slice(0, 5);
        return `${formatarData(data)} às ${hora}`;
    }
    return formatarData(str);
}

/**
 * Formata turno com inicial maiúscula ou "—".
 * @param {string} turno
 * @returns {string}
 */
function formatarTurno(turno) {
    if (!turno) return "—";
    const str = String(turno).trim();
    if (!str) return "—";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Formata tipo e número do documento de prestadores.
 * @param {string} tipo
 * @param {string} numero
 * @returns {string}
 */
function formatarDocumento(tipo, numero) {
    const t = valorOuTraco(tipo);
    const n = valorOuTraco(numero);
    if (t === "—" && n === "—") return "—";
    if (t !== "—" && n !== "—") return `${t} ${n}`;
    if (t !== "—") return t;
    return n;
}

// ========================================================
// Construtores Seguros de Elementos DOM (Classes Semânticas sem Estilos Inline)
// ========================================================

function criarElemento(tag, classe = "") {
    const el = document.createElement(tag);
    if (classe) el.className = classe;
    return el;
}

function criarCampoInfo(rotulo, valor, classeAdicional = "") {
    const p = document.createElement("p");
    p.className = "relatorio-campo" + (classeAdicional ? ` ${classeAdicional}` : "");

    const strong = document.createElement("strong");
    strong.className = "relatorio-campo__rotulo";
    strong.textContent = rotulo + ": ";

    const span = document.createElement("span");
    span.className = "relatorio-campo__valor";
    span.textContent = valorOuTraco(valor);

    p.appendChild(strong);
    p.appendChild(span);
    return p;
}

function criarTituloSecao(texto, iconeClasse = "", classe = "relatorio-secao__titulo") {
    const h4 = document.createElement("h4");
    h4.className = classe;

    if (iconeClasse) {
        const spanIcone = document.createElement("span");
        spanIcone.className = iconeClasse;
        h4.appendChild(spanIcone);
    }

    const spanTexto = document.createElement("span");
    spanTexto.textContent = texto;
    h4.appendChild(spanTexto);

    return h4;
}

// ========================================================
// Renderização dos Relatórios
// ========================================================

function renderizarRelatorios() {
    const containerLista = document.querySelector("#listaRelatorios");
    const estadoVazio = document.querySelector(".estado__vazio");

    if (!containerLista) return;

    // Leitura estritamente segura e não destrutiva do localStorage
    let relatorios = [];
    try {
        relatorios = JSON.parse(localStorage.getItem("relatorios")) || [];
    } catch (e) {
        console.error("Erro ao ler relatórios do localStorage:", e);
        relatorios = [];
    }

    // Se não houver relatórios, exibe o bloco de estado vazio
    if (!Array.isArray(relatorios) || relatorios.length === 0) {
        if (estadoVazio) estadoVazio.style.display = "flex";
        containerLista.style.display = "none";
        containerLista.replaceChildren();
        return;
    }

    // Se houver relatórios, oculta o estado vazio e renderiza a listagem
    if (estadoVazio) estadoVazio.style.display = "none";
    containerLista.style.display = "block";
    containerLista.replaceChildren();

    // Itera sobre todos os relatórios sem modificar o array original
    relatorios.forEach((relatorio, indexRelatorio) => {
        const card = criarCardRelatorio(relatorio, indexRelatorio);
        containerLista.appendChild(card);
    });
}

/**
 * Constrói o card completo de um relatório via DOM seguro e classes semânticas
 * @param {Object} relatorio
 * @param {number} indexRelatorio
 * @returns {HTMLElement}
 */
function criarCardRelatorio(relatorio, indexRelatorio) {
    const autor = relatorio.autor || {};
    const servico = relatorio.servico || {};
    const ocorrencia = relatorio.ocorrencia || {};
    const equipe = Array.isArray(relatorio.equipePlantao) ? relatorio.equipePlantao : [];
    const equipesExternas = Array.isArray(relatorio.equipesExternas) ? relatorio.equipesExternas : [];

    const card = criarElemento("article", "relatorio-card card__relatorio-detalhado");

    // ========================================================
    // 1. Cabeçalho do Relatório (Identificação, Posto, Turno, Datas)
    // ========================================================
    const cabecalho = criarElemento("header", "relatorio-card__header");

    const colIdentificacao = criarElemento("div", "relatorio-card__col-id");
    const badgeId = criarElemento("span", "relatorio-card__protocolo");
    badgeId.textContent = valorOuTraco(relatorio.id);

    const tituloPosto = criarElemento("h3", "relatorio-card__posto");
    tituloPosto.textContent = `Posto: ${valorOuTraco(servico.posto)}`;

    colIdentificacao.appendChild(badgeId);
    colIdentificacao.appendChild(tituloPosto);

    const colDatasTurno = criarElemento("div", "relatorio-card__col-datas");
    const badgeTurnoData = criarElemento("span", "relatorio-card__meta");
    badgeTurnoData.textContent = `Turno ${formatarTurno(servico.turno)} • ${formatarData(relatorio.dataServico)}`;

    const dataCriacaoEl = criarElemento("div", "relatorio-card__criacao");
    dataCriacaoEl.textContent = `Criação: ${formatarDataHora(relatorio.dataHoraCriacao)}`;

    colDatasTurno.appendChild(badgeTurnoData);
    colDatasTurno.appendChild(dataCriacaoEl);

    cabecalho.appendChild(colIdentificacao);
    cabecalho.appendChild(colDatasTurno);
    card.appendChild(cabecalho);

    // ========================================================
    // 2. Dados Gerais do Serviço e do Autor
    // ========================================================
    const gridGeral = criarElemento("div", "relatorio-grid-duplo");

    // Bloco do Autor
    const blocoAutor = criarElemento("div", "relatorio-painel");
    const tituloAutor = criarTituloSecao("Vigilante Responsável (Autor)", "fa fa-user-shield", "relatorio-painel__titulo");
    blocoAutor.appendChild(tituloAutor);
    blocoAutor.appendChild(criarCampoInfo("Nome", autor.nome));
    blocoAutor.appendChild(criarCampoInfo("RE / Matrícula", autor.matricula));
    blocoAutor.appendChild(criarCampoInfo("Função", autor.funcao));
    blocoAutor.appendChild(criarCampoInfo("Empresa", autor.empresa));

    // Bloco do Serviço
    const blocoServico = criarElemento("div", "relatorio-painel");
    const tituloServico = criarTituloSecao("Dados do Serviço do Plantão", "fa fa-clock", "relatorio-painel__titulo");
    blocoServico.appendChild(tituloServico);
    blocoServico.appendChild(criarCampoInfo("Posto de Serviço", servico.posto));
    blocoServico.appendChild(criarCampoInfo("Turno", formatarTurno(servico.turno)));
    blocoServico.appendChild(criarCampoInfo("Horário de Entrada", formatarDataHora(servico.horarioEntrada)));
    blocoServico.appendChild(criarCampoInfo("Horário de Saída", formatarDataHora(servico.horarioSaida)));

    gridGeral.appendChild(blocoAutor);
    gridGeral.appendChild(blocoServico);
    card.appendChild(gridGeral);

    // ========================================================
    // 3. Equipe do Plantão (Todos os Vigilantes)
    // ========================================================
    const secaoEquipe = criarElemento("div", "relatorio-secao");

    const tituloEquipe = criarTituloSecao(
        `Equipe de Plantão (Plantão: ${equipe.length} integrante(s))`,
        "fa fa-users"
    );
    secaoEquipe.appendChild(tituloEquipe);

    if (equipe.length === 0) {
        const pSemEquipe = criarElemento("p", "relatorio-vazio");
        pSemEquipe.textContent = "—";
        secaoEquipe.appendChild(pSemEquipe);
    } else {
        const gridVigilantes = criarElemento("div", "relatorio-grid-vigilantes");

        equipe.forEach((vigilante, vIndex) => {
            const classeCardVig = vigilante.isAutor
                ? "relatorio-card-vigilante relatorio-card-vigilante--autor"
                : "relatorio-card-vigilante";
            const cardVigilante = criarElemento("div", classeCardVig);

            const headerVig = criarElemento("div", "relatorio-card-vigilante__header");
            const h5Vig = criarElemento("h5", "relatorio-card-vigilante__titulo");
            h5Vig.textContent = `Vigilante ${vIndex + 1}`;
            headerVig.appendChild(h5Vig);

            if (vigilante.isAutor) {
                const badgeAutor = criarElemento("span", "relatorio-badge-autor");
                badgeAutor.textContent = "Autor do Relatório";
                headerVig.appendChild(badgeAutor);
            }
            cardVigilante.appendChild(headerVig);

            cardVigilante.appendChild(criarCampoInfo("Nome", vigilante.nome));
            cardVigilante.appendChild(criarCampoInfo("Matrícula (RE)", vigilante.matricula));
            cardVigilante.appendChild(criarCampoInfo("Função", vigilante.funcao));
            cardVigilante.appendChild(criarCampoInfo("Empresa", vigilante.empresa));
            cardVigilante.appendChild(criarCampoInfo("Posto de Serviço", vigilante.posto));
            cardVigilante.appendChild(criarCampoInfo("Entrada", formatarDataHora(vigilante.horarioEntrada)));
            cardVigilante.appendChild(criarCampoInfo("Saída", formatarDataHora(vigilante.horarioSaida)));
            cardVigilante.appendChild(criarCampoInfo("Turno", formatarTurno(vigilante.turno)));

            gridVigilantes.appendChild(cardVigilante);
        });

        secaoEquipe.appendChild(gridVigilantes);
    }

    // Registro / Alteração do Plantão (exibido uma única vez após a lista de vigilantes)
    const containerRegPlantao = criarElemento("div", "relatorio-registro-plantao");

    const pRotuloPlantao = criarElemento("h5", "relatorio-registro-plantao__titulo");
    const iconePlantao = criarElemento("span", "fa fa-clipboard-check");
    const spanTextoPlantao = document.createElement("span");
    spanTextoPlantao.textContent = "Registro / Alteração do Plantão:";
    pRotuloPlantao.appendChild(iconePlantao);
    pRotuloPlantao.appendChild(spanTextoPlantao);
    containerRegPlantao.appendChild(pRotuloPlantao);

    const pTextoPlantao = criarElemento("p", "relatorio-registro-plantao__texto");
    pTextoPlantao.textContent = valorOuTraco(relatorio.registroAlteracaoPlantao || "—");
    containerRegPlantao.appendChild(pTextoPlantao);

    secaoEquipe.appendChild(containerRegPlantao);
    card.appendChild(secaoEquipe);

    // ========================================================
    // 4. Equipes Externas e Prestadores de Serviço
    // ========================================================
    const secaoExternas = criarElemento("div", "relatorio-secao");

    const tituloExternas = criarTituloSecao(
        `Equipes Externas e Prestadores (Externas: ${equipesExternas.length} equipe(s))`,
        "fa fa-truck-loading"
    );
    secaoExternas.appendChild(tituloExternas);

    if (equipesExternas.length === 0) {
        const pSemExternas = criarElemento("p", "relatorio-vazio");
        pSemExternas.textContent = "—";
        secaoExternas.appendChild(pSemExternas);
    } else {
        equipesExternas.forEach((eq, eqIndex) => {
            const cardEq = criarElemento("div", "relatorio-card-empresa");

            const headerEq = criarElemento("div", "relatorio-card-empresa__header");
            const h5Eq = criarElemento("h5", "relatorio-card-empresa__titulo");
            h5Eq.textContent = `Equipe Externa ${eqIndex + 1}`;
            headerEq.appendChild(h5Eq);

            const badgeVeiculo = criarElemento("div", "relatorio-badge-veiculo");
            const iconeVeiculo = criarElemento("span", "fa fa-truck");
            const spanTextoVeiculo = document.createElement("span");
            spanTextoVeiculo.textContent = `${valorOuTraco(eq.veiculo || eq.modelo)} • Placa: ${valorOuTraco(eq.placa)}`;
            badgeVeiculo.appendChild(iconeVeiculo);
            badgeVeiculo.appendChild(spanTextoVeiculo);
            headerEq.appendChild(badgeVeiculo);
            cardEq.appendChild(headerEq);

            // Propriedades reais da equipe
            const dadosEq = criarElemento("div", "relatorio-card-empresa__dados");
            dadosEq.appendChild(criarCampoInfo("Empresa", eq.empresa));
            dadosEq.appendChild(criarCampoInfo("Modelo / Veículo", eq.veiculo || eq.modelo));
            dadosEq.appendChild(criarCampoInfo("Cor", eq.cor));
            dadosEq.appendChild(criarCampoInfo("Placa", eq.placa));
            cardEq.appendChild(dadosEq);

            // Funcionários / Prestadores vinculados à equipe
            const membros = Array.isArray(eq.membros) ? eq.membros : [];
            const containerMembros = criarElemento("div", "relatorio-card-empresa__membros");

            const h6Membros = criarElemento("h6", "relatorio-card-empresa__membros-titulo");
            h6Membros.textContent = `Integrantes da Equipe (${membros.length}):`;
            containerMembros.appendChild(h6Membros);

            if (membros.length === 0) {
                const pSemMembros = criarElemento("p", "relatorio-vazio");
                pSemMembros.textContent = "—";
                containerMembros.appendChild(pSemMembros);
            } else {
                const gridMembros = criarElemento("div", "relatorio-grid-membros");

                membros.forEach((membro, mIndex) => {
                    const cardMembro = criarElemento("div", "relatorio-card-membro");

                    const pRotuloMembro = criarElemento("span", "relatorio-card-membro__titulo");
                    pRotuloMembro.textContent = `Prestador ${mIndex + 1}`;
                    cardMembro.appendChild(pRotuloMembro);

                    cardMembro.appendChild(criarCampoInfo("Nome", membro.nome));
                    cardMembro.appendChild(criarCampoInfo("Documento", formatarDocumento(membro.tipoDocumento, membro.numeroDocumento)));
                    cardMembro.appendChild(criarCampoInfo("Entrada", formatarDataHora(membro.entrada)));
                    cardMembro.appendChild(criarCampoInfo("Saída", formatarDataHora(membro.saida)));

                    gridMembros.appendChild(cardMembro);
                });

                containerMembros.appendChild(gridMembros);
            }

            cardEq.appendChild(containerMembros);

            // Registro / Alteração da Equipe (específico desta equipe externa)
            const containerRegEquipe = criarElemento("div", "relatorio-registro-equipe");
            const pRotuloEquipe = criarElemento("h6", "relatorio-registro-equipe__titulo");
            const iconeRegEq = criarElemento("span", "fa fa-comment-alt");
            const spanTextoRegEq = document.createElement("span");
            spanTextoRegEq.textContent = "Registro / Alteração da Equipe:";
            pRotuloEquipe.appendChild(iconeRegEq);
            pRotuloEquipe.appendChild(spanTextoRegEq);
            containerRegEquipe.appendChild(pRotuloEquipe);

            const pTextoEquipe = criarElemento("p", "relatorio-registro-equipe__texto");
            pTextoEquipe.textContent = valorOuTraco(eq.registroAlteracao || "—");
            containerRegEquipe.appendChild(pTextoEquipe);

            cardEq.appendChild(containerRegEquipe);

            secaoExternas.appendChild(cardEq);
        });
    }
    card.appendChild(secaoExternas);

    // ========================================================
    // 5. Registro Geral do Turno
    // ========================================================
    const secaoAlteracoes = criarElemento("div", "relatorio-secao relatorio-registro-geral");

    const tituloAlteracoes = criarTituloSecao("Registro Geral do Turno", "fa fa-clipboard-list", "relatorio-secao__titulo");
    secaoAlteracoes.appendChild(tituloAlteracoes);

    const textoAlteracoes = criarElemento("p", "relatorio-registro-geral__texto");
    textoAlteracoes.textContent = valorOuTraco(
        relatorio.registroGeralTurno || relatorio.registrosAlteracoes || "—"
    );
    secaoAlteracoes.appendChild(textoAlteracoes);
    card.appendChild(secaoAlteracoes);

    // ========================================================
    // 6. Detalhes da Ocorrência
    // ========================================================
    const temIncidente = Boolean(
        (ocorrencia.tipo && ocorrencia.tipo.trim() !== "" && ocorrencia.tipo.trim() !== "—") ||
        (ocorrencia.descricaoDetalhada && ocorrencia.descricaoDetalhada.trim() !== "" && ocorrencia.descricaoDetalhada.trim() !== "—")
    );

    const classeOcorrencia = temIncidente
        ? "relatorio-secao relatorio-ocorrencia relatorio-ocorrencia--com-incidente"
        : "relatorio-secao relatorio-ocorrencia";

    const secaoOcorrencia = criarElemento("div", classeOcorrencia);

    const tituloOcorrencia = criarTituloSecao("Detalhes da Ocorrência", "fa fa-exclamation-triangle", "relatorio-secao__titulo");
    secaoOcorrencia.appendChild(tituloOcorrencia);

    const gridOcorrencia = criarElemento("div", "relatorio-ocorrencia__grid");
    gridOcorrencia.appendChild(criarCampoInfo("Tipo de Ocorrência", ocorrencia.tipo));
    gridOcorrencia.appendChild(criarCampoInfo("Data e Hora da Ocorrência", formatarDataHora(ocorrencia.dataHora)));
    gridOcorrencia.appendChild(criarCampoInfo("Local da Ocorrência", ocorrencia.local));
    secaoOcorrencia.appendChild(gridOcorrencia);

    const blocoDescricao = criarElemento("div", "relatorio-ocorrencia__descricao-bloco");
    const pDescricaoRotulo = criarElemento("p", "relatorio-ocorrencia__descricao-rotulo");
    pDescricaoRotulo.textContent = "Descrição Detalhada:";
    blocoDescricao.appendChild(pDescricaoRotulo);

    const pDescricaoTexto = criarElemento("p", "relatorio-ocorrencia__descricao");
    pDescricaoTexto.textContent = valorOuTraco(ocorrencia.descricaoDetalhada);
    blocoDescricao.appendChild(pDescricaoTexto);

    secaoOcorrencia.appendChild(blocoDescricao);
    card.appendChild(secaoOcorrencia);

    return card;
}

// Inicializa a renderização quando o documento estiver pronto
document.addEventListener("DOMContentLoaded", renderizarRelatorios);
