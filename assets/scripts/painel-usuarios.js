const API_USERS = "https://oba-dogs-api.onrender.com/api/users";
const token = localStorage.getItem("token");

const form = document.getElementById("form-usuario");
const modal = document.getElementById("modal-cadastro");
const botaoAbrirModal = document.getElementById("botao-abrir-modal");
const botaoFecharModal = document.getElementById("fechar-modal");
const container = document.getElementById("cards-usuarios");
const campoBusca = document.getElementById("busca-usuario");

let editandoUsername = null;

// Redireciona se não estiver logado
if (!token) {
    alert("Você precisa fazer login.");
    window.location.href = "./login.html";
}

async function carregarUsuarios() {
    try {
        const response = await fetch(API_USERS, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!response.ok) throw new Error("Erro ao buscar usuários");

        const users = await response.json();

        container.innerHTML = ``;

        users.forEach(user => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <div class="card-info">
                    <h3>${user.username}</h3>
                    <p>Permissão: ${user.role}</p>
                </div>
                <div class="card-acoes">
                    <button onclick="editarUsuario('${user.username}')">
                        <img src="./assets/images/pencil.svg">
                    </button>
                    <button onclick="removerUsuario('${user.username}')">
                        <img src="./assets/images/trash.svg">
                    </button>
                </div>
            `;
            container.appendChild(card);
        });

    } catch (err) {
        console.error(err);
        container.innerHTML = "<p>Erro ao carregar usuários.</p>";
    }
}

function editarUsuario(username) {
    fetch(`${API_USERS}/${encodeURIComponent(username)}`, {
        headers: { "Authorization": "Bearer " + token }
    })
        .then(res => res.json())
        .then(user => {
            document.getElementById("username").value = user.username;
            document.getElementById("password").value = ""; // Deixe em branco
            document.getElementById("role").value = user.role;

            editandoUsername = user.username;
            form.querySelector("button[type='submit']").textContent = "Salvar Alterações";
            modal.classList.remove("hidden");
        })
        .catch(() => alert("Erro ao carregar dados do usuário"));
}

function removerUsuario(username) {
    if (!confirm(`Deseja realmente remover o usuário ${username}?`)) return;

    fetch(`${API_USERS}/${encodeURIComponent(username)}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    })
        .then(res => {
            if (!res.ok) throw new Error("Erro");
            carregarUsuarios();
        })
        .catch(() => alert("Erro ao remover usuário."));
}


form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const novoUsuario = {
        username: document.getElementById("username").value.trim(),
        password: document.getElementById("password").value,
        role: document.getElementById("role").value
    };

    let url;
    let method;

    if (editandoUsername) {
        // Edição de usuário
        url = `${API_USERS}/${encodeURIComponent(editandoUsername)}`;
        method = "PUT";
    } else {
        // Criação de novo usuário
        url = API_USERS;
        method = "POST";
    }

    try {
        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(novoUsuario)
        });

        if (!response.ok) {
            throw new Error();
        }

        // Sucesso
        form.reset();
        modal.classList.add("hidden");
        editandoUsername = null;
        form.querySelector("button[type='submit']").textContent = "Cadastrar";
        carregarUsuarios();
    } catch (error) {
        if (editandoUsername) {
            alert("Erro ao atualizar usuário.");
        } else {
            alert("Erro ao cadastrar usuário.");
        }
    }
});


botaoAbrirModal.addEventListener("click", () => modal.classList.remove("hidden"));
botaoFecharModal.addEventListener("click", () => {
    modal.classList.add("hidden");
    form.reset(); // limpa os campos
    editandoUsername = null; // cancela edição
    form.querySelector("button[type='submit']").textContent = "Cadastrar";
});

carregarUsuarios();

// Função para buscar usuário por nome
campoBusca.addEventListener("input", () => {
    const valor = campoBusca.value.trim().toLowerCase();

    if (valor === "") {
        carregarUsuarios();
        return;
    }

    // Filtrar localmente os usuários já carregados
    const cardsFiltrados = doUsuariosFiltrados(valor);
    exibirUsuarios(cardsFiltrados);
});

// Reaproveita os dados da última chamada (cache local)
let usuariosCarregados = [];

async function carregarUsuarios() {
    try {
        const response = await fetch(API_USERS, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!response.ok) throw new Error("Erro ao buscar usuários");

        usuariosCarregados = await response.json();
        exibirUsuarios(usuariosCarregados);

    } catch (err) {
        console.error(err);
        container.innerHTML = "<p>Erro ao carregar usuários.</p>";
    }
}

function doUsuariosFiltrados(filtro) {
    return usuariosCarregados.filter(user =>
        user.username.toLowerCase().includes(filtro)
    );
}

function exibirUsuarios(lista) {
    container.innerHTML = "";

    if (lista.length === 0) {
        container.innerHTML = "<p>Nenhum usuário encontrado.</p>";
        return;
    }

    lista.forEach(user => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <div class="card-info">
                <h3>${user.username}</h3>
                <p>Permissão: ${user.role}</p>
            </div>
            <div class="card-acoes">
                <button onclick="editarUsuario('${user.username}')">
                    <img src="./assets/images/pencil.svg">
                </button>
                <button onclick="removerUsuario('${user.username}')">
                    <img src="./assets/images/trash.svg">
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}