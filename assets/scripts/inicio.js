document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("cards-animais");
    const API_URL = "https://oba-dogs-api.onrender.com/api/dogs";

    // Mostrar mensagem de carregamento
    container.innerHTML = `<p>Carregando animais...</p>`;

    // Carregar os dados do backend
    fetch(API_URL)
        .then(response => {
            if (!response.ok) throw new Error("Erro ao buscar animais");
            return response.json();
        })
        .then(animais => {
            container.innerHTML = ``; // limpa o "Carregando..."

            if (!animais.length) {
                container.innerHTML = `<p>Nenhum animal disponível no momento.</p>`;
                return;
            }

            const maisRecentes = animais.slice(-3).reverse(); // últimos 3 animais cadastrados

            maisRecentes.forEach(animal => {
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
        })
        .catch(error => {
            container.innerHTML = `<p>Não foi possível carregar os animais no momento.</p>`;
            console.error("Erro ao buscar animais:", error);
        });
});