document.addEventListener("DOMContentLoaded", () => {
    const senhaInput = document.getElementById("senha");
    const hideCheckbox = document.getElementById("hideButton");

    hideCheckbox.addEventListener("change", () => {
        if (hideCheckbox.checked) {
            senhaInput.type = "text";
        } else {
            senhaInput.type = "password";
        }
    });
});
