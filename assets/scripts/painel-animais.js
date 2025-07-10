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
    document.getElementById("imagem-preview").style.display = "none";
    document.getElementById("imagem-preview").src = "";
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
                <img src="https://oba-dogs-api.onrender.com/api/dogs/${animal.id}/imagem?t=${Date.now()}" alt="${animal.nome}" onerror="this.src='./assets/images/placeholder.png'">
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
    if (!animal.nome || !animal.especie || !animal.idade || !animal.sexo || !animal.porte) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }

    let url = API_BASE;
    let method = "POST";

    if (id !== null) {
        url = API_BASE + "/" + id;
        method = "PUT";
    }

    try {
        console.log("JSON enviado:", JSON.stringify(animal));

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(animal)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Erro detalhado:", errorData);
            throw new Error(`Erro ${response.status}: ${errorData.message || "Erro ao salvar animal"}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        alert(error.message);
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
    document.getElementById("raca").value = animal.raca;
    document.getElementById("idade").value = animal.idade;
    document.getElementById("sexo").value = animal.sexo;
    document.getElementById("porte").value = animal.porte;
    document.getElementById("imagem-preview").src = animal.imagem || "";
    document.getElementById("imagem-preview").src = `https://oba-dogs-api.onrender.com/api/dogs/${animal.id}/imagem?t=${Date.now()}`;

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

async function uploadImagem(id, file) {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch(`${API_BASE}/${id}/imagem`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + token
            },
            body: formData
        });

        if (!response.ok) throw new Error("Erro ao enviar imagem");
    } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        alert("Erro ao fazer upload da imagem.");
        return null;
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const novoAnimal = {
        nome: document.getElementById("nome").value.trim(),
        especie: document.getElementById("especie").value.trim(),
        raca: document.getElementById("raca").value.trim(),
        idade: Number(document.getElementById("idade").value.trim()),
        sexo: document.getElementById("sexo").value,
        porte: document.getElementById("porte").value,
    };

    const file = document.getElementById("imagem").files[0];
    let salvo;

    console.log("Enviando:", novoAnimal);

    if (editandoIndex !== null) {
        const id = animais[editandoIndex].id;
        salvo = await salvarAnimalApi(novoAnimal, id);
        if (salvo && file) {
            await uploadImagem(id, file);
            salvo = await buscarAnimalPorId(id);
        }
        if (salvo) animais[editandoIndex] = salvo;
    } else {
        salvo = await salvarAnimalApi(novoAnimal);
        if (salvo && file) {
            await uploadImagem(salvo.id, file);
            await new Promise(res => setTimeout(res, 1000)); // espera 1 segundo
            salvo = await buscarAnimalPorId(salvo.id);
        }
        if (salvo) animais.unshift(salvo);
    }

    await carregarAnimais();
    limparFormulario();
    modal.classList.add("hidden");
});

async function buscarAnimalPorId(id) {
    try {
        const res = await fetch(`${API_BASE}/${id}`, {
            headers: { "Authorization": "Bearer " + token }
        });
        if (!res.ok) throw new Error("Erro ao buscar animal atualizado");
        return await res.json();
    } catch (e) {
        console.error(e);
        return null;
    }
}

document.getElementById("imagem").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            const preview = document.getElementById("imagem-preview");
            preview.src = reader.result;
            preview.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});

botaoAbrirModal.addEventListener("click", () => {
    modal.classList.remove("hidden");
});

botaoFecharModal.addEventListener("click", () => {
    modal.classList.add("hidden");
    limparFormulario();
});

carregarAnimais();