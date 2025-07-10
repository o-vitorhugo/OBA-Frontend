document.addEventListener("DOMContentLoaded", () => {
    const senhaInput = document.getElementById("senha");
    const hideCheckbox = document.getElementById("hideButton");
    const loginForm = document.getElementById("form-login");

    hideCheckbox.addEventListener("change", () => {
        if (hideCheckbox.checked) {
            senhaInput.type = "text";
        } else {
            senhaInput.type = "password";
        }
    });

    loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    console.log("Tentando login com:", email, senha);

    try {
        const response = await fetch("https://oba-dogs-api.onrender.com/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: email,
                password: senha
            })
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
            alert("Login inválido!");
            return;
        }

        const data = await response.json();
        console.log("Dados recebidos:", data);

        localStorage.setItem("token", data.token);

        // Redirecionar para o painel
        window.location.href = "./painel-animais.html";
    } catch (err) {
        console.error("Erro ao fazer login:", err);
        alert("Erro ao tentar fazer login. Tente novamente mais tarde.");
    }
});

});