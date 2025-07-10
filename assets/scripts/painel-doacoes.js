const API_DOACOES = "https://oba-dogs-api.onrender.com/api/doacoes";
const token = localStorage.getItem("token");

const form = document.getElementById("form-doacao");
const modal = document.getElementById("modal-cadastro");
const botaoAbrirModal = document.getElementById("botao-abrir-modal");
const botaoFecharModal = document.getElementById("fechar-modal");
const container = document.getElementById("cards-doacoes");

let doacoes = [];
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

async function carregarDoacoes() {
    try {
        const response = await fetch(API_DOACOES, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });
        if (!response.ok) throw new Error("Erro ao carregar doações");

        doacoes = await response.json();
        atualizarTabela();
    } catch (error) {
        console.error(error);
        container.innerHTML = `<p>Erro ao carregar doações.</p>`;
    }
}

function atualizarTabela() {
    container.innerHTML = ``;

    if (doacoes.length === 0) {
        container.innerHTML = `<p>Nenhuma doação cadastrada.</p>`;
        return;
    }

    doacoes.forEach((doacao, index) => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <div class="card-info">
                <h3>${doacao.nome}</h3>
                <p>Tipo: ${doacao.tipo}</p>
                <p>Descrição: ${doacao.descricao}</p>
                <p>Data: ${doacao.data}</p>
            </div>
            <div class="card-acoes">
                <button onclick="editarDoacao(${index})">
                    <img src="./assets/images/pencil.svg">
                </button>
                <button onclick="removerDoacao(${index})">
                    <img src="./assets/images/trash.svg">
                </button>
            </div>
        `;

        container.appendChild(card);
    });
}

function editarDoacao(index) {
    const doacao = doacoes[index];
    document.getElementById("nome").value = doacao.nome;
    document.getElementById("tipo").value = doacao.tipo;
    document.getElementById("descricao").value = doacao.descricao;
    document.getElementById("data").value = doacao.data;

    editandoIndex = index;
    form.querySelector("button[type='submit']").textContent = "Salvar Alterações";

    modal.classList.remove("hidden");
}

let indiceParaRemover = null;

function removerDoacao(index) {
    indiceParaRemover = index;
    document.getElementById('modal-confirmacao').classList.remove('hidden');
}

document.getElementById('confirmar-remocao').addEventListener('click', async () => {
    if (indiceParaRemover !== null) {
        const id = doacoes[indiceParaRemover].id;
        try {
            const response = await fetch(`${API_DOACOES}/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + token
                }
            });
            if (!response.ok) throw new Error("Erro ao deletar doação");

            doacoes.splice(indiceParaRemover, 1);
            atualizarTabela();
            indiceParaRemover = null;
            document.getElementById('modal-confirmacao').classList.add('hidden');
        } catch (error) {
            alert("Erro ao deletar doação");
        }
    }
});

document.getElementById('cancelar-remocao').addEventListener('click', () => {
    indiceParaRemover = null;
    document.getElementById('modal-confirmacao').classList.add('hidden');
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const novaDoacao = {
        nome: document.getElementById("nome").value.trim(),
        tipo: document.getElementById("tipo").value.trim(),
        descricao: document.getElementById("descricao").value.trim(),
        data: document.getElementById("data").value,
    };

    try {
        let salvo;
        if (editandoIndex !== null) {
            const id = doacoes[editandoIndex].id;
            const response = await fetch(`${API_DOACOES}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify(novaDoacao)
            });
            if (!response.ok) throw new Error("Erro ao atualizar doação");

            salvo = await response.json();
            doacoes[editandoIndex] = salvo;
        } else {
            const response = await fetch(API_DOACOES, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify(novaDoacao)
            });
            if (!response.ok) throw new Error("Erro ao cadastrar doação");

            salvo = await response.json();
            doacoes.unshift(salvo);
        }

        atualizarTabela();
        limparFormulario();
        modal.classList.add("hidden");
    } catch (error) {
        console.error(error);
        alert("Erro ao salvar doação.");
    }
});

botaoAbrirModal.addEventListener("click", () => {
    modal.classList.remove("hidden");
});

botaoFecharModal.addEventListener("click", () => {
    modal.classList.add("hidden");
    limparFormulario();
});

carregarDoacoes();