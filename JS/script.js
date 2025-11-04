// const listaFuncionarios = [ {
//     nome: "Sergio Henrique Zanucci",
//     matricula: 235382,
//     funcao: "Vigilante",
//     posto: "Ceraq Araraquara",
//     empresa: "Suporte segurança",
// },
// {
//     nome: "José Carlos Milanez",
//     matricula: 235372,
//     funcao: "Vigilante",
//     posto: "Ceraq Araraquara",
//     empresa: "Suporte segurança",  
// },
// {
//     nome: "Daniel Hipólito",
//     matricula: 236472,
//     funcao: "Vigilante",
//     posto: "Ceraq Araraquara",
//     empresa: "Suporte segurança",
// },
// {
//     nome: "Luiz Carlos Carato",
//     matricula: 236492,
//     funcao: "Vigilante",
//     posto: "Ceraq Araraquara",
//     empresa: "Suporte segurança",
// },
// {
//     nome: "Romildo Silveiro Silva",
//     matricula: 236482,
//     funcao: "Vigilante",
//     posto: "Ceraq Araraquara",
//     empresa: "Suporte segurança",
// },
// {
//     nome: "Moises Francisco de Souza",
//     matricula: 236552,
//     funcao: "Vigilante",
//     posto: "Ceraq Araraquara",
//     empresa: "Suporte segurança",
// },
// {
//     nome: "Elis Alberto de Almeida",
//     matricula: 238552,
//     funcao: "Vigilante",
//     posto: "Ceraq Araraquara",
//     empresa: "Suporte segurança",
// }
// ];

// function confirmaFuncionario() {
//     const reFuncionario = parseInt(document.querySelector("#reFuncionario").value.trim());
  
//     const funcionarioEncontrado = listaFuncionarios.filter(
//       (funcionario) => funcionario.matricula === reFuncionario
//     );
  
//     if (funcionarioEncontrado.length > 0) {
//         window.location.href = "ocorrencia.html";
//         alert("Funcionário encontrado na lista!");
//     } else {
//         alert("Funcionário não encontrado na lista. Por favor, digite nome e uma matrícula válida.");
//         return;
//     }
// }

// Poderia me explicar qual a diferença do meu codigo JS para seu o que tem melhoria e outras coisas
// Diferenças e Melhorias:
// Evitar o Comportamento Padrão do Formulário:

// Seu código não prevenia o comportamento padrão do formulário, o que poderia causar um reload da página.

// Meu código usa e.preventDefault() para evitar isso e garantir que a lógica de validação seja executada antes de qualquer ação.

// Uso de find em vez de filter:

// Seu código usa filter, que retorna um array de todos os elementos que correspondem ao critério, o que é mais do que precisamos.

// Meu código usa find, que retorna o primeiro elemento que corresponde ao critério ou undefined se nenhum elemento corresponder, o que é mais eficiente para nossa necessidade.

// Listener do Formulário:

// Seu código chama confirmaFuncionario diretamente no onclick do botão, o que pode causar problemas se o formulário for submetido de outras formas.

// Meu código adiciona um listener ao formulário para o evento submit, garantindo que a função seja chamada corretamente sempre que o formulário for submetido.

const listaFuncionarios = [
    { nome: "Sergio Henrique Zanucci", matricula: 235382, funcao: "Vigilante", posto: "Ceraq Araraquara", empresa: "Suporte segurança" },
    { nome: "José Carlos Milanez", matricula: 235372, funcao: "Vigilante", posto: "Ceraq Araraquara", empresa: "Suporte segurança" },
    { nome: "Daniel Hipólito", matricula: 236472, funcao: "Vigilante", posto: "Ceraq Araraquara", empresa: "Suporte segurança" },
    { nome: "Luiz Carlos Carato", matricula: 236492, funcao: "Vigilante", posto: "Ceraq Araraquara", empresa: "Suporte segurança" },
    { nome: "Romildo Silveiro Silva", matricula: 236482, funcao: "Vigilante", posto: "Ceraq Araraquara", empresa: "Suporte segurança" },
    { nome: "Moises Francisco de Souza", matricula: 236552, funcao: "Vigilante", posto: "Ceraq Araraquara", empresa: "Suporte segurança" },
    { nome: "Elis Alberto de Almeida", matricula: 238552, funcao: "Vigilante", posto: "Ceraq Araraquara", empresa: "Suporte segurança" }
];

function confirmaFuncionario(e) {
    e.preventDefault(); // Previne a ação padrão do formulário

    const reFuncionario = parseInt(document.querySelector("#reFuncionario").value.trim());
    const funcionarioEncontrado = listaFuncionarios.find(funcionario => funcionario.matricula === reFuncionario);
    const mensagem = document.querySelector("#mensagem");

    if (funcionarioEncontrado) {
        mensagem.textContent = "Funcionário encontrado na lista!";
        mensagem.style.color = "green"
        mensagem.style.fontWeight = "bold"

         // Mostra a mensagem por 1.5s antes do redirecionamento
        setTimeout(() => {
            window.location.href = "ocorrencia.html";
        }, 1500);

    } else {
        mensagem.textContent = "Funcionário não encontrado. Por favor, verifique a matrícula.";
        mensagem.style.color = "red";
        mensagem.style.fontWeight = "bold";

          // Faz a mensagem sumir depois de alguns segundos
        setTimeout(() => {
            mensagem.textContent = "";
        }, 4000);
    }

}


document.querySelector("form").addEventListener("submit", confirmaFuncionario);
