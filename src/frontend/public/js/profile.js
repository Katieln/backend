document.addEventListener('DOMContentLoaded', () => {
    fetchProfileAndCart();
});

async function fetchProfileAndCart() {
    try {
        const response = await fetch('/api/user/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        displayProfile(data.profile);
        displayEditProfileForm(data.profile);

    } catch (error) {
        console.error('Error fetching profile and cart data:', error);
        displayMessage('Error al obtener los datos del usuario.', 'error');
    }
}

function displayProfile(profile) {
    const profileContainer = document.getElementById('profileinfo');
    profileContainer.innerHTML = `
        <h1>Perfil de Usuario</h1>
        <p><strong>ID:</strong> ${profile.id}</p>
        <p><strong>Nombre de Usuario:</strong> ${profile.username}</p>
        <p><strong>Email:</strong> ${profile.email}</p>
        <p><strong>Método de Registro:</strong> ${profile.method}</p>
        <p><strong>Dirección:</strong> ${profile.address}</p>
        <p><strong>Rol:</strong> ${profile.role}</p>
    `;
}

function displayEditProfileForm(profile) {
    const profileEditContainer = document.getElementById('profiledit');
    profileEditContainer.innerHTML = `
        <form id="editProfileForm" class="editProfileFrom">
         <h2>Editar Perfil</h2>
            <div>
                <label for="username">Nombre de Usuario:</label>
                <input type="text" id="username" name="username" value="${profile.username}">
            </div>
            <div>
                <label for="address">Dirección:</label>
                <input type="text" id="address" name="address" value="${profile.address}">
            </div>
            <div>
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" value="${profile.email}">
            </div>
            <button class="btn btn-primary btneditProfile" type="submit">Guardar Cambios</button>
        </form>
        <div id="editMessage"></div>
    `;

    document.getElementById('editProfileForm').addEventListener('submit', handleEditProfile);
}

async function handleEditProfile(event) {
    event.preventDefault();

    const updatedProfile = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value
    };

    try {
        const response = await fetch('/api/user/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProfile)
        });

        const result = await response.json();

        if (response.ok) {
            displayMessage('Perfil actualizado exitosamente', 'success');
            fetchProfileAndCart(); // Refresh the profile data
        } else {
            displayMessage(result.msg || 'Error al actualizar el perfil', 'error');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        displayMessage('Error al actualizar el perfil', 'error');
    }
}

function displayMessage(message, type) {
    const messageContainer = document.getElementById('editMessage');
    messageContainer.innerHTML = `<div class="${type}">${message}</div>`;
    setTimeout(() => {
        messageContainer.innerHTML = '';
    }, 3000);
}
