const form = document.querySelector("form");
const campoNome = document.querySelector("input[name='name']");
const campoReFuncionario = document.querySelector("#reFuncionario");
const campoFuncao = document.querySelector("#funcao");
const campoPostoServico = document.querySelector("#postoServico");
const campoEmpresa = document.querySelector("#empresa");
const btnCadastrar = document.querySelector("button");
const mensagemFinal = document.querySelector(".mensagem");

let validaForm = true;

// Evento que escuta o formulario e preventDefault para paralizar o submit
form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    validaForm = true; // Reseta a validação a cada envio
    validaCampoNome();
    validaReFuncionario();
    validaFuncao();
    validaCampoPostoServico();
    validaCampoEmpresa();

    if (validaForm) {
        mensagemFinal.style.display = "block"; // Mostra mensagem de sucesso
        console.log("Cadastro realizado com sucesso!");
        form.remove();
        mensagemFinal.style.display = "block";
    }
});

const validaCampoNome = () => {
    if (!campoNome.value) {
        campoNome.classList.add("invalid");
        campoNome.nextElementSibling.style.display = "block"; // Exibe mensagem de erro
        validaForm = false;  
    } else {
        campoNome.classList.remove("invalid");
        campoNome.nextElementSibling.style.display = "none"; // Oculta mensagem de erro
    }
   
    console.log(campoNome.value);
};

campoNome.addEventListener("input", () => {
    campoNome.classList.remove("invalid");
    campoNome.nextElementSibling.style.display = "none";
})

const validaReFuncionario = () => {
    const reValue = campoReFuncionario.value.trim();
    if (reValue.length !== 6 || !/^\d+$/.test(reValue)) {
        campoReFuncionario.classList.add("invalid");
        campoReFuncionario.nextElementSibling.style.display = "block"; 
        validaForm = false;  
    } else {
        campoReFuncionario.classList.remove("invalid");
        campoReFuncionario.nextElementSibling.style.display = "none"; 
    }
   
    console.log(campoReFuncionario.value);
};

campoReFuncionario.addEventListener("input", () => {
    campoReFuncionario.classList.remove("invalid");
    campoReFuncionario.nextElementSibling.style.display = "none"; 
});

const validaFuncao = () => {
    if (!campoFuncao.value) {
        campoFuncao.classList.add("invalid");
        campoFuncao.nextElementSibling.style.display = "block";
        validaForm = false;  
    } else {
        campoFuncao.classList.remove("invalid");
        campoFuncao.nextElementSibling.style.display = "none"; 
    }
   
    console.log(campoFuncao.value);
};

campoFuncao.addEventListener("input", () => {
    campoFuncao.classList.remove("invalid");
    campoFuncao.nextElementSibling.style.display = "none";  
});

const validaCampoPostoServico = () => {
    if (!campoPostoServico.value) {
        campoPostoServico.classList.add("invalid");
        campoPostoServico.nextElementSibling.style.display = "block";
        validaForm = false;  
    } else {
        campoPostoServico.classList.remove("invalid");
        campoPostoServico.nextElementSibling.style.display = "none"; 
    }
   
    console.log(campoPostoServico.value);
};

campoPostoServico.addEventListener("input", () => {
    campoPostoServico.classList.remove("invalid");
    campoPostoServico.nextElementSibling.style.display = "none";
});

const validaCampoEmpresa = () => {
    if (!campoEmpresa.value) {
        campoEmpresa.classList.add("invalid");
        campoEmpresa.nextElementSibling.style.display = "block"; 
        validaForm = false;  
    } else {
        campoEmpresa.classList.remove("invalid");
        campoEmpresa.nextElementSibling.style.display = "none"; 
    }
   
    console.log(campoEmpresa.value);
};

campoEmpresa.addEventListener("input", () => {
    campoEmpresa.classList.remove("invalid");
    campoEmpresa.nextElementSibling.style.display = "none"; 
});

// btnCadastrar("click", (evento) => {
//     evento.preventDefault();
//     console.log(btnCadastrar.value);
// });
