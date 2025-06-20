document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("cards-animais");

    // Mostrar mensagem de carregamento
    container.innerHTML = `<p>Carregando animais...</p>`;

    // Tentar carregar os dados do localStorage
    const dadosSalvos = localStorage.getItem("animais");

    if (dadosSalvos) {
        try {
            const animais = JSON.parse(dadosSalvos);
            container.innerHTML = ``; // limpa o "Carregando..."

            if (!animais.length) {
                container.innerHTML = `<p>Nenhum animal disponível no momento.</p>`;
                return;
            }

            const maisRecentes = animais.slice(-3).reverse(); // Últimos 3 animais

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
        } catch (error) {
            container.innerHTML = `<p>Não foi possível carregar os animais no momento.</p>`;
            console.error("Erro ao buscar animais:", error);
        }
    } else {
        container.innerHTML = `<p>Nenhum animal disponível no momento.</p>`;
    }
});