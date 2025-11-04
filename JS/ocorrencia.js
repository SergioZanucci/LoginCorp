const checkBoxDiurno = document.querySelector("#diurno");
    checkBoxDiurno.addEventListener("click",  () => {
    console.log(checkBoxDiurno.value);
    });

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
document.querySelector(".dados__funcionario").onclick = addCampo;

document.querySelector(".dados__funcionario").onclick = function(event) {
    if (event.target.id === 'removeFuncionario') {
        const campo = event.target.closest('.campo'); // Encontra o campo mais próximo
        if (campo) {
            campo.remove(); // Remove o campo
        }
    } else if (event.target.id === 'addFuncionario') {
        addCampo(); // Chama a função para adicionar um campo
    }
};

let nomeLogin = document.querySelector("#encerrar");
    nomeLogin.addEventListener("click", () => {
    console.log("Ola");
});






