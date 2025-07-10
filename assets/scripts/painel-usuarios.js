const API_USERS = "https://oba-dogs-api.onrender.com/api/users";
const token = localStorage.getItem("token");

const form = document.getElementById("form-usuario");
const modal = document.getElementById("modal-cadastro");
const botaoAbrirModal = document.getElementById("botao-abrir-modal");
const botaoFecharModal = document.getElementById("fechar-modal");
const container = document.getElementById("cards-usuarios");
const campoBusca = document.getElementById("busca-usuario");

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
            `;
            container.appendChild(card);
        });

    } catch (err) {
        container.innerHTML = "<p>Erro ao carregar usuários.</p>";
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const novoUsuario = {
        username: document.getElementById("username").value.trim(),
        password: document.getElementById("password").value,
        role: document.getElementById("role").value
    };

    try {
        const response = await fetch(API_USERS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(novoUsuario)
        });

        if (!response.ok) {
            if (response.status === 403) {
                throw new Error("Você não tem permissão para cadastrar usuários.");
            }
            throw new Error("Erro ao cadastrar usuário");
        }

        await carregarUsuarios();
        form.reset();
        modal.classList.add("hidden");

    } catch (error) {
        alert("Erro ao cadastrar usuário.");
    }
});

botaoAbrirModal.addEventListener("click", () => modal.classList.remove("hidden"));
botaoFecharModal.addEventListener("click", () => modal.classList.add("hidden"));

carregarUsuarios();

// Função para buscar usuário por nome
campoBusca.addEventListener("input", async () => {
    const valor = campoBusca.value.trim();

    if (valor === "") {
        carregarUsuarios();
        return;
    }

    try {
        const response = await fetch(`${API_USERS}/${encodeURIComponent(valor)}`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                container.innerHTML = "<p>Nenhum usuário encontrado com esse e-mail.</p>";
                return;
            }
            throw new Error("Erro ao buscar usuário.");
        }

        const user = await response.json();

        container.innerHTML = `
            <div class="card">
                <div class="card-info">
                    <h3>${user.username}</h3>
                    <p>Permissão: ${user.role}</p>
                </div>
            </div>
        `;
    } catch (error) {
        container.innerHTML = "<p>Erro ao buscar usuário.</p>";
    }
});