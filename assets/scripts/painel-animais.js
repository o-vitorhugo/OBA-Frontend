const form = document.getElementById("form-animal");

let animais = JSON.parse(localStorage.getItem("animais")) || [];
let editandoIndex = null;

function salvarLocalStorage() {
    localStorage.setItem("animais", JSON.stringify(animais));
}

function limparFormulario() {
    form.reset();
    editandoIndex = null;
    form.querySelector("button[type='submit']").textContent = "Cadastrar";
}

const container = document.getElementById("cards-animais");

function atualizarTabela() {
    container.innerHTML = ``;

    if (animais.length === 0) {
        container.innerHTML = `<p>Nenhum animal cadastrado.</p>`;
        return;
    }

    animais.forEach((animal, index) => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <div class="card-info">
                <img src="${animal.imagem}" alt="${animal.nome}" onerror="this.src='./assets/images/placeholder.png'" />
                <h3>${animal.nome}</h3>
            </div>
            <div class="card-acoes">
                <button onclick="editarAnimal(${index})">
                    <img src="./assets/images/pencil.svg">
                </button>
                <button onclick="removerAnimal(${index})">
                    <img src="./assets/images/trash.svg">
                </button>
            </div>
        `;

        container.appendChild(card);
    });
}

function editarAnimal(index) {
    const animal = animais[index];
    document.getElementById("nome").value = animal.nome;
    document.getElementById("especie").value = animal.especie;
    document.getElementById("idade").value = animal.idade;
    document.getElementById("sexo").value = animal.sexo;
    document.getElementById("porte").value = animal.porte;
    document.getElementById("imagem").value = animal.imagem;

    editandoIndex = index;
    form.querySelector("button[type='submit']").textContent = "Salvar Alterações";

    modal.classList.remove("hidden");
}

let indiceParaRemover = null;

function removerAnimal(index) {
    indiceParaRemover = index;
    document.getElementById('modal-confirmacao').classList.remove('hidden');
}

document.getElementById('confirmar-remocao').addEventListener('click', () => {
    if (indiceParaRemover !== null) {
        animais.splice(indiceParaRemover, 1);
        salvarLocalStorage();
        atualizarTabela();
        indiceParaRemover = null;
        document.getElementById('modal-confirmacao').classList.add('hidden');
    }
});

document.getElementById('cancelar-remocao').addEventListener('click', () => {
    indiceParaRemover = null;
    document.getElementById('modal-confirmacao').classList.add('hidden');
});

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const novoAnimal = {
        nome: document.getElementById("nome").value.trim(),
        especie: document.getElementById("especie").value.trim(),
        idade: document.getElementById("idade").value.trim(),
        sexo: document.getElementById("sexo").value,
        porte: document.getElementById("porte").value,
        imagem: document.getElementById("imagem").value.trim() || "./assets/images/placeholder.png"
    };

    if (editandoIndex !== null) {
        animais[editandoIndex] = novoAnimal;
    } else {
        animais.unshift(novoAnimal);
    }

    salvarLocalStorage();
    atualizarTabela();
    limparFormulario();

    modal.classList.add("hidden");
});

atualizarTabela();

const botaoAbrirModal = document.getElementById("botao-abrir-modal");
const botaoFecharModal = document.getElementById("fechar-modal");
const modal = document.getElementById("modal-cadastro");

botaoAbrirModal.addEventListener("click", () => {
    modal.classList.remove("hidden");
});

botaoFecharModal.addEventListener("click", () => {
    modal.classList.add("hidden");
    limparFormulario();
});