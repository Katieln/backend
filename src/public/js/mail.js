document.addEventListener("DOMContentLoaded", function () {
    const sendEmailLink = document.getElementById("sendEmailLink");
    const emailUser = document.getElementById("emailUser").value;

    sendEmailLink.addEventListener("click", function (event) {
        event.preventDefault(); 

        const emailUser = document.getElementById("emailUser").value;
      
        window.location.href = `/api/mail/send?emailUser=${encodeURIComponent(emailUser)}`;
    });
});
