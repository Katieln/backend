document.addEventListener("DOMContentLoaded", function () {
    const sendEmailLink = document.getElementById("sendEmailLink");
    const emailUser = document.getElementById("emailUser").value;

    sendEmailLink.addEventListener("click", function (event) {
        event.preventDefault(); // Evita la acción predeterminada del enlace

        const emailUser = document.getElementById("emailUser").value;
        // Redirige al usuario a la ruta "/send" con el emailUser como parámetro
        window.location.href = `/api/mail/send?emailUser=${encodeURIComponent(emailUser)}`;
    });
});
