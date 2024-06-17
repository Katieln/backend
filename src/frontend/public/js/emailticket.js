// En tu archivo mail.js
document.addEventListener("DOMContentLoaded", function () {
    const sendTicketEmailBtn = document.getElementById("sendTicketEmailBtn");

    sendTicketEmailBtn.addEventListener("click", function (event) {
        event.preventDefault();
        
        const emailUser = document.getElementById("emailUser").value; // Aquí tomamos el valor del email del ticket
        window.location.href = `/api/mail/sendTicket?emailUser=${encodeURIComponent(emailUser)}`;
    });
});