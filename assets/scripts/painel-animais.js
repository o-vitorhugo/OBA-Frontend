const API_BASE = "https://oba-dogs-api.onrender.com/api/dogs";
const token = localStorage.getItem("token");

const form = document.getElementById("form-animal");
const modal = document.getElementById("modal-cadastro");
const botaoAbrirModal = document.getElementById("botao-abrir-modal");
const botaoFecharModal = document.getElementById("fechar-modal");
const container = document.getElementById("cards-animais");

let animais = [];
let editandoIndex = null;

// Redireciona se não estiver logado
if (!token) {
    alert("Você precisa fazer login.");
    window.location.href = "./login.html";
}

function limparFormulario() {
    form.reset();
    editandoIndex = null;
    form.querySelector("button[type='submit']").textContent = "Cadastrar";
}

async function carregarAnimais() {
    try {
        const response = await fetch(API_BASE, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });
        if (!response.ok) throw new Error("Erro ao buscar animais");
        const data = await response.json();
        animais = data;
        atualizarTabela();
    } catch (error) {
        console.error(error);
        container.innerHTML = `<p>Erro ao carregar animais.</p>`;
    }
}

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
                <img src="${animal.imagem || ''}" alt="${animal.nome}" onerror="this.src='./assets/images/placeholder.png'" />
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

async function salvarAnimalApi(animal, id = null) {
    let url = API_BASE;
    let method = "POST";

    if (id !== null) {
        url = API_BASE + "/" + id;
        method = "PUT";
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(animal)
        });

        if (!response.ok) throw new Error("Erro ao salvar animal");

        return await response.json();
    } catch (error) {
        console.error(error);
        alert("Erro ao salvar animal");
    }
}

async function deletarAnimalApi(id) {
    try {
        const response = await fetch(API_BASE + "/" + id, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!response.ok) throw new Error("Erro ao deletar animal");
    } catch (error) {
        console.error(error);
        alert("Erro ao deletar animal");
    }
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

document.getElementById('confirmar-remocao').addEventListener('click', async () => {
    if (indiceParaRemover !== null) {
        const id = animais[indiceParaRemover].id;
        await deletarAnimalApi(id);
        animais.splice(indiceParaRemover, 1);
        atualizarTabela();
        indiceParaRemover = null;
        document.getElementById('modal-confirmacao').classList.add('hidden');
    }
});

document.getElementById('cancelar-remocao').addEventListener('click', () => {
    indiceParaRemover = null;
    document.getElementById('modal-confirmacao').classList.add('hidden');
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const novoAnimal = {
        nome: document.getElementById("nome").value.trim(),
        especie: document.getElementById("especie").value.trim(),
        idade: Number(document.getElementById("idade").value.trim()),
        sexo: document.getElementById("sexo").value,
        porte: document.getElementById("porte").value,
        imagem: document.getElementById("imagem").value.trim()
    };

    let salvo;

    if (editandoIndex !== null) {
        const id = animais[editandoIndex].id;
        salvo = await salvarAnimalApi(novoAnimal, id);
        if (salvo) animais[editandoIndex] = salvo;
    } else {
        salvo = await salvarAnimalApi(novoAnimal);
        if (salvo) animais.unshift(salvo);
    }

    atualizarTabela();
    limparFormulario();
    modal.classList.add("hidden");
});

botaoAbrirModal.addEventListener("click", () => {
    modal.classList.remove("hidden");
});

botaoFecharModal.addEventListener("click", () => {
    modal.classList.add("hidden");
    limparFormulario();
});

carregarAnimais();