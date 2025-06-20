const container = document.getElementById("cards-animais");
const filtroEspecie = document.getElementById("filtro-especie");
const filtroPorte = document.getElementById("filtro-porte");
const filtroSexo = document.getElementById("filtro-sexo");

let listaAnimais = [];

// Função para renderizar cards filtrados
function renderizarAnimais(animais) {
    container.innerHTML = ``;

    if (!animais.length) {
        container.innerHTML = `<p>Nenhum animal encontrado com os filtros selecionados.</p>`;
        return;
    }

    animais.forEach(animal => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="${animal.imagem}" alt="${animal.nome}" onerror="this.src='./assets/images/placeholder.png'" />
            <h3>${animal.nome}</h3>
            <p>Espécie: ${animal.especie}</p>
            <p>Idade: ${animal.idade}</p>
            <p>Sexo: ${animal.sexo}</p>
            <p>Porte: ${animal.porte}</p>
            <a href="mailto:oba.floripa@gmail.com?subject=Interesse em adoção: ${animal.nome}" class="button-adotar">Quero Adotar</a>
        `;

        container.appendChild(card);
    });
}

// Função para aplicar os filtros
function aplicarFiltros() {
    const especie = filtroEspecie.value;
    const porte = filtroPorte.value;
    const sexo = filtroSexo.value;

    const filtrados = listaAnimais.filter(animal => {
        return (
            (especie === "" || animal.especie === especie) &&
            (porte === "" || animal.porte === porte) &&
            (sexo === "" || animal.sexo === sexo)
        );
    });

    renderizarAnimais(filtrados);
}

// Carregar os dados do localStorage
const dadosSalvos = localStorage.getItem("animais");

if (dadosSalvos) {
    try {
        listaAnimais = JSON.parse(dadosSalvos).slice().reverse(); // mais recentes no topo
        renderizarAnimais(listaAnimais);
    } catch (error) {
        container.innerHTML = `<p>Não foi possível carregar os animais no momento.</p>`;
        console.error("Erro ao buscar animais:", error);
    }
} else {
    container.innerHTML = `<p>Nenhum animal disponível no momento.</p>`;
}

// Eventos para filtros
filtroEspecie.addEventListener("change", aplicarFiltros);
filtroPorte.addEventListener("change", aplicarFiltros);
filtroSexo.addEventListener("change", aplicarFiltros);

// Limpar filtros
const botaoLimpar = document.getElementById("limpar-filtros");

botaoLimpar.addEventListener("click", () => {
    filtroEspecie.value = "";
    filtroPorte.value = "";
    filtroSexo.value = "";

    renderizarAnimais(listaAnimais);
});