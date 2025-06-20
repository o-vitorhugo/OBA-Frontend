const form = document.getElementById("form-doacao");

let doacoes = JSON.parse(localStorage.getItem("doacoes")) || [];
let editandoIndex = null;

function salvarLocalStorage() {
    localStorage.setItem("doacoes", JSON.stringify(doacoes));
}

function limparFormulario() {
    form.reset();
    editandoIndex = null;
    form.querySelector("button[type='submit']").textContent = "Cadastrar";
}

const container = document.getElementById("cards-doacoes");

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

document.getElementById('confirmar-remocao').addEventListener('click', () => {
    if (indiceParaRemover !== null) {
        doacoes.splice(indiceParaRemover, 1);
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

    const novaDoacao = {
        nome: document.getElementById("nome").value.trim(),
        tipo: document.getElementById("tipo").value.trim(),
        descricao: document.getElementById("descricao").value.trim(),
        data: document.getElementById("data").value,
    };

    if (editandoIndex !== null) {
        doacoes[editandoIndex] = novaDoacao;
    } else {
        doacoes.unshift(novaDoacao);
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